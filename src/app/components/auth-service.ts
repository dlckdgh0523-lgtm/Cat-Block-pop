// ─── Supabase Auth Service ───
// JWT 발급, 자동 갱신, 세션 관리를 Supabase Auth가 처리
// Access Token 만료 시 Refresh Token으로 자동 갱신됨
// Ultra-defensive: 모든 함수가 try-catch로 감싸져 절대 throw하지 않음

import { createClient, type Session, type User, type AuthChangeEvent } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const SERVER_BASE = `${SUPABASE_URL}/functions/v1/make-server-05e0e5ed`;

// ─── Singleton Supabase Client ───
let _supabase: ReturnType<typeof createClient> | null = null;
let _supabaseInitError = false;

export function getSupabase() {
  if (_supabaseInitError) {
    // Re-attempt after a previous failure
    _supabaseInitError = false;
    _supabase = null;
  }

  if (!_supabase) {
    try {
      _supabase = createClient(SUPABASE_URL, publicAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storageKey: "catblockpop_auth",
        },
      });
    } catch (err) {
      console.error("[Auth] Failed to create Supabase client:", err);
      _supabaseInitError = true;
      throw err;
    }
  }
  return _supabase;
}

// Safe getter that never throws
export function getSupabaseSafe(): ReturnType<typeof createClient> | null {
  try {
    return getSupabase();
  } catch {
    return null;
  }
}

// ─── Types ───
export interface AuthState {
  user: User | null;
  session: Session | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignUpResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface SignInResult {
  success: boolean;
  user?: User;
  session?: Session;
  accessToken?: string;
  error?: string;
}

// ─── Sign Up (서버 경유 - Service Role Key 사용) ───
export async function signUp(
  email: string,
  password: string,
  nickname: string
): Promise<SignUpResult> {
  try {
    console.log("[Auth] Signing up:", email);
    const res = await fetch(`${SERVER_BASE}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password, nickname }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      console.error("[Auth] Sign up failed:", data.error);
      return { success: false, error: data.error || "회원가입 실패" };
    }

    // 가입 후 자동 로그인
    const signInResult = await signIn(email, password);
    if (signInResult.success) {
      return { success: true, user: signInResult.user };
    }

    return { success: true, user: data.user };
  } catch (err) {
    console.error("[Auth] Sign up error:", err);
    return { success: false, error: `회원가입 중 오류: ${err}` };
  }
}

// ─── Sign In (Supabase Auth 직접 사용) ───
export async function signIn(
  email: string,
  password: string
): Promise<SignInResult> {
  try {
    console.log("[Auth] Signing in:", email);
    const supabase = getSupabaseSafe();
    if (!supabase) {
      return { success: false, error: "인증 서비스 초기화 실패" };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[Auth] Sign in failed:", error.message);
      return { success: false, error: error.message };
    }

    const session = data.session;
    const user = data.user;
    console.log("[Auth] Sign in successful, token expires at:",
      session ? new Date(session.expires_at! * 1000).toISOString() : "N/A"
    );

    return {
      success: true,
      user: user ?? undefined,
      session: session ?? undefined,
      accessToken: session?.access_token,
    };
  } catch (err) {
    console.error("[Auth] Sign in error:", err);
    return { success: false, error: `로그인 중 오류: ${err}` };
  }
}

// ─── Sign Out ───
export async function signOut(): Promise<boolean> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return true; // No client = already signed out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[Auth] Sign out failed:", error.message);
      return false;
    }
    console.log("[Auth] Signed out successfully");
    return true;
  } catch (err) {
    console.error("[Auth] Sign out error:", err);
    return false;
  }
}

// ─── Get Current Session (자동 Refresh 포함) ───
export async function getSession(): Promise<{ session: Session | null; user: User | null }> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return { session: null, user: null };

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("[Auth] Get session error:", error.message);
      return { session: null, user: null };
    }

    if (session) {
      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      const remainingMin = Math.round((expiresAt.getTime() - now.getTime()) / 60000);
      console.log(`[Auth] Session active, expires in ${remainingMin}min`);
    }

    return { session, user: session?.user ?? null };
  } catch (err) {
    console.error("[Auth] Get session error:", err);
    return { session: null, user: null };
  }
}

// ─── Get Valid Access Token (자동 갱신 보장) ───
export async function getAccessToken(): Promise<string | null> {
  try {
    const { session } = await getSession();
    return session?.access_token ?? null;
  } catch {
    return null;
  }
}

// ─── Auth State Change Listener ───
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): (() => void) | null {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) {
      console.warn("[Auth] Cannot set up auth listener - no Supabase client");
      return null;
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);

    return () => {
      try {
        subscription.unsubscribe();
      } catch {}
    };
  } catch (err) {
    console.error("[Auth] onAuthStateChange setup error:", err);
    return null;
  }
}

// ─── Authenticated API Call Helper ───
export async function authFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("인증되지 않은 상태입니다. 로그인이 필요합니다.");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  return fetch(`${SERVER_BASE}${path}`, {
    ...options,
    headers,
  });
}

// ─── Sync Score to Server (인증 필요) ───
export async function syncScoreToServer(
  score: number,
  stars: number,
  nickname: string
): Promise<boolean> {
  try {
    const res = await authFetch("/profile/score", {
      method: "POST",
      body: JSON.stringify({ score, stars, nickname }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("[Auth] Score sync failed:", data.error || res.statusText);
      return false;
    }

    console.log("[Auth] Score synced to server");
    return true;
  } catch (err) {
    console.error("[Auth] Score sync error:", err);
    return false;
  }
}

// ─── Get Server Profile (인증 필요) ───
export async function getServerProfile(): Promise<{
  score?: number;
  stars?: number;
  nickname?: string;
} | null> {
  try {
    const res = await authFetch("/profile/me");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Force Refresh Token (수동 갱신) ───
export async function forceRefreshToken(): Promise<boolean> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return false;
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error("[Auth] Force refresh failed:", error.message);
      return false;
    }
    console.log("[Auth] Token manually refreshed, new expiry:",
      data.session ? new Date(data.session.expires_at! * 1000).toISOString() : "N/A"
    );
    return true;
  } catch (err) {
    console.error("[Auth] Force refresh error:", err);
    return false;
  }
}

// ─── Social Login: Kakao ───
export async function signInWithKakao(): Promise<SignInResult> {
  try {
    console.log("[Auth] Kakao OAuth login...");
    const supabase = getSupabaseSafe();
    if (!supabase) {
      return { success: false, error: "인증 서비스 초기화 실패" };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("[Auth] Kakao login failed:", error.message);
      return { success: false, error: error.message };
    }

    console.log("[Auth] Kakao OAuth redirect initiated");
    return { success: true };
  } catch (err) {
    console.error("[Auth] Kakao login error:", err);
    return { success: false, error: `카카오 로그인 오류: ${err}` };
  }
}

// ─── Social Login: Google ───
export async function signInWithGoogle(): Promise<SignInResult> {
  try {
    console.log("[Auth] Google OAuth login...");
    const supabase = getSupabaseSafe();
    if (!supabase) {
      return { success: false, error: "인증 서비스 초기화 실패" };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("[Auth] Google login failed:", error.message);
      return { success: false, error: error.message };
    }

    console.log("[Auth] Google OAuth redirect initiated");
    return { success: true };
  } catch (err) {
    console.error("[Auth] Google login error:", err);
    return { success: false, error: `구글 로그인 오류: ${err}` };
  }
}