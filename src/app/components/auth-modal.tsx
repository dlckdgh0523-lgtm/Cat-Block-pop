// ─── Auth Modal ───
// 로그인/회원가입 모달 UI

import React, { useState } from "react";
import { useAuthOptional } from "./auth-context";
import { signIn, signUp, signOut } from "./auth-service";
import { getBoardTheme, type BlockSkin } from "./skins-data";

interface AuthModalProps {
  onClose: () => void;
  skin: BlockSkin;
}

export function AuthModal({ onClose, skin }: AuthModalProps) {
  const auth = useAuthOptional();
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const user = auth?.user ?? null;
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const theme = getBoardTheme(skin);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
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
          setSuccess("가입 완료! 자동으로 로그인됩니다...");
          setTimeout(onClose, 1500);
        } else {
          setError(result.error || "회원가입 실패");
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          setSuccess("로그인 성공!");
          setTimeout(onClose, 1000);
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

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    setSuccess("로그아웃 되었습니다.");
    setLoading(false);
  };

  // If already authenticated, show profile info
  if (isAuthenticated && user) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}>
        <div className="w-full max-w-[320px] rounded-3xl p-6 text-center"
          style={{ background: "rgba(255,255,255,0.97)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
          onClick={e => e.stopPropagation()}>

          <div className="text-4xl mb-3">
            <span style={{
              display: "inline-flex",
              width: 56, height: 56,
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              background: theme.comboBadge,
              fontSize: 28,
            }}>
              <span role="img" aria-label="user">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </span>
          </div>

          <h3 className="text-lg mb-1" style={{ color: theme.accent }}>
            {user.user_metadata?.name || "Player"}
          </h3>
          <p className="text-xs mb-4" style={{ color: "#9B7A8A" }}>
            {user.email}
          </p>

          <div className="rounded-xl p-3 mb-4" style={{ background: `${theme.accent}10` }}>
            <div className="flex items-center justify-between text-xs" style={{ color: theme.accent }}>
              <span>JWT 상태</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: "#4CAF50" }} />
                활성
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1" style={{ color: "#9B7A8A" }}>
              <span>자동 갱신</span>
              <span>활성화됨</span>
            </div>
          </div>

          {success && (
            <p className="text-xs mb-3" style={{ color: "#4CAF50" }}>{success}</p>
          )}

          <div className="flex gap-2">
            <button onClick={handleLogout} disabled={loading}
              className="flex-1 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 text-sm"
              style={{ background: "rgba(255,100,100,0.1)", color: "#FF6B6B", border: "1px solid rgba(255,100,100,0.3)" }}>
              {loading ? "..." : "로그아웃"}
            </button>
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-white text-sm cursor-pointer transition-all active:scale-95"
              style={{ background: theme.comboBadge }}>
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}>
      <div className="w-full max-w-[320px] rounded-3xl p-6"
        style={{ background: "rgba(255,255,255,0.97)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>

        {/* Tab */}
        <div className="flex rounded-xl overflow-hidden mb-5"
          style={{ background: `${theme.accent}10` }}>
          <button
            className="flex-1 py-2 text-sm cursor-pointer transition-all"
            style={{
              background: mode === "login" ? theme.comboBadge : "transparent",
              color: mode === "login" ? "#fff" : theme.accent,
            }}
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>
            로그인
          </button>
          <button
            className="flex-1 py-2 text-sm cursor-pointer transition-all"
            style={{
              background: mode === "signup" ? theme.comboBadge : "transparent",
              color: mode === "signup" ? "#fff" : theme.accent,
            }}
            onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}>
            회원가입
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="text-[10px] block mb-1" style={{ color: "#9B7A8A" }}>닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="게임에서 사용할 이름"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: `${theme.accent}08`,
                  border: `1.5px solid ${theme.accent}25`,
                  color: "#333",
                }}
                maxLength={20}
              />
            </div>
          )}

          <div>
            <label className="text-[10px] block mb-1" style={{ color: "#9B7A8A" }}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: `${theme.accent}08`,
                border: `1.5px solid ${theme.accent}25`,
                color: "#333",
              }}
            />
          </div>

          <div>
            <label className="text-[10px] block mb-1" style={{ color: "#9B7A8A" }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="6자 이상"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: `${theme.accent}08`,
                border: `1.5px solid ${theme.accent}25`,
                color: "#333",
              }}
            />
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <p className="text-xs mt-3 px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,100,100,0.1)", color: "#FF6B6B" }}>
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs mt-3 px-2 py-1.5 rounded-lg" style={{ background: "rgba(76,175,80,0.1)", color: "#4CAF50" }}>
            {success}
          </p>
        )}

        {/* JWT Info */}
        <div className="mt-4 rounded-lg p-2" style={{ background: `${theme.accent}05` }}>
          <p className="text-[9px] text-center" style={{ color: "#B8A0B0" }}>
            Supabase Auth | JWT 자동 발급 & Refresh Token 자동 갱신
          </p>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading}
          className="w-full mt-4 py-3 rounded-xl text-white text-sm cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          style={{ background: theme.comboBadge }}>
          {loading ? "처리 중..." : mode === "login" ? "로그인" : "가입하기"}
        </button>

        <button onClick={onClose}
          className="w-full mt-2 py-2 rounded-xl text-xs cursor-pointer transition-all"
          style={{ color: "#9B7A8A" }}>
          취소
        </button>
      </div>
    </div>
  );
}