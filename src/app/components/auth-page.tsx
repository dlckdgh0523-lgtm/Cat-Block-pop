// ─── Auth Page (Full Screen) ───
// 로그인 필수 - 이 화면을 통과해야 로비에 진입 가능
// 이메일 + 카카오톡 + 구글 회원가입/로그인
// NOTE: Does NOT depend on useAuth - works even if AuthProvider fails

import React, { useState } from "react";
import { signIn, signUp, signInWithKakao, signInWithGoogle } from "./auth-service";

type Mode = "login" | "signup";

export function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [socialLoading, setSocialLoading] = useState<"" | "kakao" | "google">("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (mode === "signup" && !nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const result = await signUp(email, password, nickname);
        if (result.success) {
          setSuccess("가입 완료! 로비로 이동합니다...");
        } else {
          setError(result.error || "회원가입 실패");
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          setSuccess("로그인 성공!");
        } else {
          setError(result.error || "로그인 실패");
        }
      }
    } catch (err) {
      setError(`오류: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKakao = async () => {
    setSocialLoading("kakao");
    setError("");
    try {
      const result = await signInWithKakao();
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(`카카오 로그인 오류: ${err}`);
    } finally {
      setSocialLoading("");
    }
  };

  const handleGoogle = async () => {
    setSocialLoading("google");
    setError("");
    try {
      const result = await signInWithGoogle();
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(`구글 로그인 오류: ${err}`);
    } finally {
      setSocialLoading("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleSubmit();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-auto"
      style={{
        background: "linear-gradient(160deg, #FFF0F5 0%, #FFE4EC 30%, #FFD6E0 60%, #FFCCD5 100%)",
        fontFamily: "'Nunito', sans-serif",
        minHeight: "100dvh",
      }}>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 20 + i * 15,
              height: 20 + i * 15,
              background: `rgba(232,115,154,${0.06 + i * 0.02})`,
              left: `${10 + i * 15}%`,
              top: `${5 + (i % 3) * 30}%`,
              animation: `authFloat${i % 3} ${4 + i}s ease-in-out infinite`,
            }} />
        ))}
      </div>

      {/* Cat logo */}
      <div className="relative z-10 mb-4" style={{ animation: "authBob 3s ease-in-out infinite" }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M20 45 L30 10 L45 35 Z" fill="#FF9F43" stroke="#E58A2F" strokeWidth="2" />
          <path d="M27 35 L33 15 L40 32 Z" fill="#FFBf76" />
          <path d="M80 45 L70 10 L55 35 Z" fill="#FF9F43" stroke="#E58A2F" strokeWidth="2" />
          <path d="M73 35 L67 15 L60 32 Z" fill="#FFBf76" />
          <ellipse cx="50" cy="58" rx="32" ry="28" fill="#FF9F43" stroke="#E58A2F" strokeWidth="2" />
          <ellipse cx="50" cy="60" rx="28" ry="22" fill="#FFBf76" opacity="0.3" />
          <ellipse cx="38" cy="52" rx="5" ry="6" fill="white" />
          <ellipse cx="62" cy="52" rx="5" ry="6" fill="white" />
          <ellipse cx="39" cy="53" rx="3" ry="4" fill="#333" />
          <ellipse cx="63" cy="53" rx="3" ry="4" fill="#333" />
          <circle cx="40" cy="51" r="1.5" fill="white" />
          <circle cx="64" cy="51" r="1.5" fill="white" />
          <ellipse cx="50" cy="62" rx="3" ry="2" fill="#FF6B8A" />
          <path d="M47 65 Q50 68 53 65" fill="none" stroke="#7A4A1A" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="15" y1="55" x2="33" y2="58" stroke="#E58A2F" strokeWidth="1" opacity="0.6" />
          <line x1="15" y1="62" x2="33" y2="62" stroke="#E58A2F" strokeWidth="1" opacity="0.6" />
          <line x1="85" y1="55" x2="67" y2="58" stroke="#E58A2F" strokeWidth="1" opacity="0.6" />
          <line x1="85" y1="62" x2="67" y2="62" stroke="#E58A2F" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      <h1 className="text-2xl mb-1 relative z-10" style={{ color: "#E8739A", textShadow: "0 2px 10px rgba(232,115,154,0.3)" }}>
        Cat Block Pop
      </h1>
      <p className="text-xs mb-5 relative z-10" style={{ color: "#C3A0B1" }}>
        귀여운 고양이 블록 퍼즐 게임
      </p>

      {/* Auth Card */}
      <div className="w-full max-w-[340px] rounded-3xl p-6 relative z-10 mx-4"
        style={{
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 20px 60px rgba(232,115,154,0.15), 0 0 0 1px rgba(232,115,154,0.08)",
          backdropFilter: "blur(20px)",
        }}>

        {/* Tab */}
        <div className="flex rounded-2xl overflow-hidden mb-5"
          style={{ background: "rgba(232,115,154,0.08)" }}>
          <button
            className="flex-1 py-2.5 text-sm cursor-pointer transition-all duration-300"
            style={{
              background: mode === "login"
                ? "linear-gradient(135deg, #FF6B8A, #E8739A)"
                : "transparent",
              color: mode === "login" ? "#fff" : "#E8739A",
              borderRadius: mode === "login" ? "12px" : "0",
            }}
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>
            로그인
          </button>
          <button
            className="flex-1 py-2.5 text-sm cursor-pointer transition-all duration-300"
            style={{
              background: mode === "signup"
                ? "linear-gradient(135deg, #FF6B8A, #E8739A)"
                : "transparent",
              color: mode === "signup" ? "#fff" : "#E8739A",
              borderRadius: mode === "signup" ? "12px" : "0",
            }}
            onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}>
            회원가입
          </button>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-2 mb-4">
          <button onClick={handleKakao} disabled={!!socialLoading}
            className="w-full py-3 rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: "#FEE500", color: "#3C1E1E", fontSize: "14px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#3C1E1E">
              <path d="M12 3C6.5 3 2 6.58 2 11c0 2.84 1.87 5.33 4.67 6.74l-1.2 4.42c-.08.31.27.56.53.38l5.27-3.5c.24.02.48.03.73.03 5.5 0 10-3.58 10-8s-4.5-8-10-8z" />
            </svg>
            {socialLoading === "kakao" ? "연결 중..." : `카카오톡으로 ${mode === "login" ? "로그인" : "가입하기"}`}
          </button>

          <button onClick={handleGoogle} disabled={!!socialLoading}
            className="w-full py-3 rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: "#fff", color: "#444", fontSize: "14px", border: "1.5px solid #E0E0E0" }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {socialLoading === "google" ? "연결 중..." : `Google로 ${mode === "login" ? "로그인" : "가입하기"}`}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "rgba(232,115,154,0.15)" }} />
          <span className="text-[10px]" style={{ color: "#C3A0B1" }}>또는 이메일로</span>
          <div className="flex-1 h-px" style={{ background: "rgba(232,115,154,0.15)" }} />
        </div>

        {/* Email Form */}
        <div className="space-y-3" onKeyDown={handleKeyDown}>
          {mode === "signup" && (
            <div>
              <label className="text-[10px] block mb-1" style={{ color: "#9B7A8A" }}>닉네임</label>
              <input type="text" value={nickname} onChange={e => setNickname(e.target.value)}
                placeholder="게임에서 사용할 이름"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: "rgba(232,115,154,0.04)", border: "1.5px solid rgba(232,115,154,0.15)", color: "#333" }}
                maxLength={20} />
            </div>
          )}

          <div>
            <label className="text-[10px] block mb-1" style={{ color: "#9B7A8A" }}>이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: "rgba(232,115,154,0.04)", border: "1.5px solid rgba(232,115,154,0.15)", color: "#333" }} />
          </div>

          <div>
            <label className="text-[10px] block mb-1" style={{ color: "#9B7A8A" }}>비밀번호</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="6자 이상"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: "rgba(232,115,154,0.04)", border: "1.5px solid rgba(232,115,154,0.15)", color: "#333" }} />
          </div>
        </div>

        {error && (
          <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.2)" }}>
            <p className="text-xs" style={{ color: "#E55555" }}>{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)" }}>
            <p className="text-xs" style={{ color: "#4CAF50" }}>{success}</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full mt-5 py-3 rounded-2xl text-white text-sm cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #FF6B8A, #E8739A)",
            boxShadow: "0 4px 15px rgba(232,115,154,0.35)",
          }}>
          {loading ? "처리 중..." : mode === "login" ? "이메일로 로그인" : "이메일로 가입하기"}
        </button>
      </div>

      <p className="text-[9px] mt-4 text-center relative z-10" style={{ color: "#C3A0B1" }}>
        로그인하면 게임 데이터가 서버에 안전하게 저장됩니다
      </p>

      <style>{`
        @keyframes authBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes authFloat0 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -15px); }
        }
        @keyframes authFloat1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-8px, 12px); }
        }
        @keyframes authFloat2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(12px, 8px); }
        }
      `}</style>
    </div>
  );
}
