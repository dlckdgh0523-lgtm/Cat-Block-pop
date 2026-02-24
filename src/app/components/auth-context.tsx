// ─── Auth Context ───
// 앱 전역에서 인증 상태를 관리하는 React Context
// - Supabase onAuthStateChange로 토큰 갱신을 실시간 감지
// - 10분 비활동 시 경고 → 로그아웃
// - Refresh Token 만료 시 로그인 화면으로 강제 이동

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { Session, User, AuthChangeEvent } from "@supabase/supabase-js";
import {
  getSession,
  signIn,
  signUp,
  signOut,
  onAuthStateChange,
  syncScoreToServer,
  getServerProfile,
  forceRefreshToken,
  signInWithKakao,
  signInWithGoogle,
  type SignInResult,
  type SignUpResult,
} from "./auth-service";

// ─── Constants ───
const INACTIVITY_TIMEOUT = 10 * 60 * 1000;  // 10분
const INACTIVITY_WARNING = 30 * 1000;        // 경고 후 30초 뒤 로그아웃

// ─── Context Type ───
interface AuthContextType {
  // State
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  nickname: string;
  tokenExpiresAt: Date | null;
  showInactivityWarning: boolean;
  inactivityCountdown: number;

  // Actions
  login: (email: string, password: string) => Promise<SignInResult>;
  register: (email: string, password: string, nickname: string) => Promise<SignUpResult>;
  logout: () => Promise<boolean>;
  loginWithKakao: () => Promise<SignInResult>;
  loginWithGoogle: () => Promise<SignInResult>;
  syncScore: (score: number, stars: number, nickname: string) => Promise<boolean>;
  fetchProfile: () => Promise<{ score?: number; stars?: number; nickname?: string } | null>;
  refreshToken: () => Promise<boolean>;
  dismissInactivityWarning: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export function useAuthOptional(): AuthContextType | null {
  return useContext(AuthContext);
}

// ─── Provider ───
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inactivity state
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(30);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isAuthenticated = !!session && !!user;
  const tokenExpiresAt = session?.expires_at
    ? new Date(session.expires_at * 1000)
    : null;

  // ─── Inactivity Timer ───
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timers
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setShowInactivityWarning(false);
    setInactivityCountdown(30);

    // Only set timer if authenticated
    if (!session || !user) return;

    // Set 10-minute inactivity timer
    inactivityTimerRef.current = setTimeout(() => {
      console.log("[AuthCtx] 10분 비활동 감지 - 경고 표시");
      setShowInactivityWarning(true);
      setInactivityCountdown(30);

      // 30초 카운트다운 후 자동 로그아웃
      let countdown = 30;
      countdownTimerRef.current = setInterval(() => {
        countdown--;
        setInactivityCountdown(countdown);
        if (countdown <= 0) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          console.log("[AuthCtx] 비활동으로 인한 자동 로그아웃");
          signOut();
        }
      }, 1000);
    }, INACTIVITY_TIMEOUT);
  }, [session, user]);

  // Dismiss warning = user is active again
  const dismissInactivityWarning = useCallback(() => {
    setShowInactivityWarning(false);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Listen for user activity events
  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = ["mousedown", "touchstart", "keydown", "scroll", "mousemove"];

    const handleActivity = () => {
      // Only reset if warning is NOT showing (if warning is showing, user must click button)
      if (!showInactivityWarning) {
        resetInactivityTimer();
      }
    };

    activityEvents.forEach(ev => window.addEventListener(ev, handleActivity, { passive: true }));
    resetInactivityTimer(); // Start initial timer

    return () => {
      activityEvents.forEach(ev => window.removeEventListener(ev, handleActivity));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [isAuthenticated, resetInactivityTimer, showInactivityWarning]);

  // ─── Schedule proactive token refresh ───
  const scheduleRefresh = useCallback((sess: Session | null) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!sess?.expires_at) return;

    const expiresAt = sess.expires_at * 1000;
    const now = Date.now();
    const refreshAt = expiresAt - 5 * 60 * 1000;
    const delay = Math.max(refreshAt - now, 0);

    if (delay > 0) {
      console.log(`[AuthCtx] Token refresh scheduled in ${Math.round(delay / 60000)}min`);
      refreshTimerRef.current = setTimeout(async () => {
        console.log("[AuthCtx] Proactive token refresh triggered");
        const ok = await forceRefreshToken();
        if (!ok) {
          console.error("[AuthCtx] Refresh token expired! Forcing logout.");
          // Refresh token도 만료됨 → 강제 로그아웃
          await signOut();
        }
      }, delay);
    }
  }, []);

  // ─── Initialize: check existing session ───
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { session: existingSession, user: existingUser } = await getSession();
        if (!mounted) return;
        if (existingSession && existingUser) {
          setSession(existingSession);
          setUser(existingUser);
          setNickname(existingUser.user_metadata?.name || "");
          scheduleRefresh(existingSession);
          console.log("[AuthCtx] Existing session restored for:", existingUser.email);
        }
      } catch (err) {
        console.error("[AuthCtx] Init error:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    init();

    // Safety timeout: if init hangs, force isLoading to false after 5s
    const safetyTimeout = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
    };
  }, [scheduleRefresh]);

  // ─── Listen for auth state changes ───
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      const unsub = onAuthStateChange(
        (event: AuthChangeEvent, newSession: Session | null) => {
          console.log("[AuthCtx] Auth state changed:", event);

          switch (event) {
            case "INITIAL_SESSION":
            case "SIGNED_IN":
            case "TOKEN_REFRESHED":
              if (newSession) {
                setSession(newSession);
                setUser(newSession.user);
                setNickname(newSession.user.user_metadata?.name || "");
                scheduleRefresh(newSession);
              }
              // Mark loading done when INITIAL_SESSION arrives
              if (event === "INITIAL_SESSION") {
                setIsLoading(false);
              }
              break;

            case "SIGNED_OUT":
              setSession(null);
              setUser(null);
              setNickname("");
              setShowInactivityWarning(false);
              if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
                refreshTimerRef.current = null;
              }
              if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
              if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
              break;

            case "USER_UPDATED":
              if (newSession) {
                setUser(newSession.user);
                setNickname(newSession.user.user_metadata?.name || "");
              }
              break;
          }
        }
      );
      unsubscribe = unsub;
    } catch (err) {
      console.error("[AuthCtx] onAuthStateChange setup error:", err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [scheduleRefresh]);

  // ─── Actions ───
  const login = useCallback(async (email: string, password: string) => {
    return await signIn(email, password);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    return await signUp(email, password, name);
  }, []);

  const logout = useCallback(async () => {
    return await signOut();
  }, []);

  const loginWithKakao = useCallback(async () => {
    return await signInWithKakao();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    return await signInWithGoogle();
  }, []);

  const syncScore = useCallback(async (score: number, stars: number, name: string) => {
    if (!isAuthenticated) return false;
    return await syncScoreToServer(score, stars, name);
  }, [isAuthenticated]);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return null;
    return await getServerProfile();
  }, [isAuthenticated]);

  const refreshTokenAction = useCallback(async () => {
    return await forceRefreshToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isLoading,
        nickname,
        tokenExpiresAt,
        showInactivityWarning,
        inactivityCountdown,
        login,
        register,
        logout,
        loginWithKakao,
        loginWithGoogle,
        syncScore,
        fetchProfile,
        refreshToken: refreshTokenAction,
        dismissInactivityWarning,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}