import React, { useState } from "react";
import {
  kakaoLogout, isKakaoLoggedIn, getKakaoUser, kakaoSilentLogin,
} from "./kakao-sdk";
import {
  googleLogout, isGoogleLoggedIn, getGoogleUser, googleSilentSignIn,
} from "./google-sdk";
import { type BlockSkin, getBoardTheme } from "./skins-data";

interface SettingsPageProps {
  lobbyBgmOn: boolean;
  gameBgmOn: boolean;
  onToggleLobbyBgm: () => void;
  onToggleGameBgm: () => void;
  onClose: () => void;
  onAccountChange?: () => void;
  skin?: BlockSkin;
}

export function SettingsPage({ lobbyBgmOn, gameBgmOn, onToggleLobbyBgm, onToggleGameBgm, onClose, onAccountChange, skin = "cat" }: SettingsPageProps) {
  const bt = getBoardTheme(skin);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [kakaoConnected, setKakaoConnected] = useState(isKakaoLoggedIn());
  const [googleConnected, setGoogleConnected] = useState(isGoogleLoggedIn());
  const [loggingOut, setLoggingOut] = useState<string | null>(null);
  const [reconnecting, setReconnecting] = useState<string | null>(null);
  const [reconnectError, setReconnectError] = useState<string | null>(null);
  const [kakaoNickname, setKakaoNickname] = useState<string | null>(() => {
    if (isKakaoLoggedIn()) {
      const u = getKakaoUser();
      return u?.nickname ?? null;
    }
    return null;
  });
  const [googleNickname, setGoogleNickname] = useState<string | null>(() => {
    if (isGoogleLoggedIn()) {
      const u = getGoogleUser();
      return u?.displayName ?? null;
    }
    return null;
  });

  const handleKakaoLogout = async () => {
    setLoggingOut("kakao");
    await kakaoLogout();
    setKakaoConnected(false);
    setKakaoNickname(null);
    setLoggingOut(null);
    onAccountChange?.();
  };

  const handleGoogleLogout = async () => {
    setLoggingOut("google");
    await googleLogout();
    setGoogleConnected(false);
    setGoogleNickname(null);
    setLoggingOut(null);
    onAccountChange?.();
  };

  const handleKakaoReconnect = async () => {
    setReconnecting("kakao");
    setReconnectError(null);
    try {
      const result = await kakaoSilentLogin();
      if (result.success) {
        setKakaoConnected(true);
        if (result.user) setKakaoNickname(result.user.nickname);
        onAccountChange?.();
      } else {
        setReconnectError("카카오 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      setReconnectError("카카오 연결 중 오류가 발생했습니다.");
    }
    setReconnecting(null);
  };

  const handleGoogleReconnect = async () => {
    setReconnecting("google");
    setReconnectError(null);
    try {
      const ok = await googleSilentSignIn();
      if (ok) {
        setGoogleConnected(true);
        const u = getGoogleUser();
        if (u) setGoogleNickname(u.displayName);
        onAccountChange?.();
      } else {
        setReconnectError("Google 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      setReconnectError("Google 연결 중 오류가 발생했습니다.");
    }
    setReconnecting(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-8"
      style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div className="w-full max-w-[380px] flex items-center gap-3 mb-6 mt-2">
        <button onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.5)", color: bt.accent }}>
          ←
        </button>
        <h2 className="text-lg" style={{ color: bt.accent }}>⚙️ 설정</h2>
      </div>

      <div className="w-full max-w-[380px] space-y-3">
        {/* Sound settings */}
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,181,194,0.2)" }}>
          <p className="text-sm mb-3" style={{ color: bt.accent }}>🎵 사운드</p>

          <ToggleRow
            label="로비 배경음악"
            desc="로비에서 재생되는 배경음악"
            on={lobbyBgmOn}
            onToggle={onToggleLobbyBgm}
            accent={bt.accent}
          />
          <ToggleRow
            label="게임 배경음악"
            desc="게임 중 재생되는 배경음악"
            on={gameBgmOn}
            onToggle={onToggleGameBgm}
            accent={bt.accent}
          />
        </div>

        {/* Account / Social Login */}
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,181,194,0.2)" }}>
          <p className="text-sm mb-3" style={{ color: bt.accent }}>👤 계정 연동</p>
          <div className="space-y-2">

            {/* Kakao status */}
            <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
              style={{ background: kakaoConnected ? "rgba(254,229,0,0.1)" : "rgba(255,220,230,0.15)" }}>
              <span className="text-lg">💬</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs" style={{ color: "#3C1E1E" }}>카카오</p>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: kakaoConnected ? "#4ADE80" : "#ccc" }} />
                </div>
                <p className="text-[9px]" style={{ color: "#C3A0B1" }}>
                  {kakaoConnected
                    ? `연동됨${kakaoNickname ? ` · ${kakaoNickname}` : ""} · 친구 랭킹 활성`
                    : "연결 안 됨"}
                </p>
              </div>
              {kakaoConnected && (
                <button onClick={handleKakaoLogout} disabled={loggingOut === "kakao"}
                  className="px-2.5 py-1 rounded-lg text-[10px] cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: "rgba(255,220,230,0.3)", color: "#C3A0B1" }}>
                  {loggingOut === "kakao" ? "..." : "로그아웃"}
                </button>
              )}
              {!kakaoConnected && (
                <button onClick={handleKakaoReconnect} disabled={reconnecting === "kakao"}
                  className="px-2.5 py-1 rounded-lg text-[10px] cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: "rgba(255,220,230,0.3)", color: "#C3A0B1" }}>
                  {reconnecting === "kakao" ? "..." : "재연결"}
                </button>
              )}
            </div>

            {/* Google status */}
            <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
              style={{ background: googleConnected ? "rgba(66,133,244,0.06)" : "rgba(255,220,230,0.15)" }}>
              <span className="text-lg">🎮</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs" style={{ color: "#4285F4" }}>Google Play Games</p>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: googleConnected ? "#4ADE80" : "#ccc" }} />
                </div>
                <p className="text-[9px]" style={{ color: "#C3A0B1" }}>
                  {googleConnected
                    ? `연동됨${googleNickname ? ` · ${googleNickname}` : ""} · 친구 랭킹 활성`
                    : "연결 안 됨"}
                </p>
              </div>
              {googleConnected && (
                <button onClick={handleGoogleLogout} disabled={loggingOut === "google"}
                  className="px-2.5 py-1 rounded-lg text-[10px] cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: "rgba(66,133,244,0.08)", color: "#C3A0B1" }}>
                  {loggingOut === "google" ? "..." : "로그아웃"}
                </button>
              )}
              {!googleConnected && (
                <button onClick={handleGoogleReconnect} disabled={reconnecting === "google"}
                  className="px-2.5 py-1 rounded-lg text-[10px] cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: "rgba(66,133,244,0.08)", color: "#C3A0B1" }}>
                  {reconnecting === "google" ? "..." : "재연결"}
                </button>
              )}
            </div>

            <p className="text-[9px] px-1" style={{ color: "#D4B8C8" }}>
              소셜 계정은 자동 연동됩니다. 로그아웃 시 해당 플랫폼 친구 랭킹이 비활성화됩니다.
            </p>
            {reconnectError && (
              <p className="text-[9px] px-1 mt-1" style={{ color: "#E55A5A" }}>
                ⚠️ {reconnectError}
              </p>
            )}
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,181,194,0.2)" }}>
          <p className="text-sm mb-3" style={{ color: bt.accent }}>ℹ️ 정보</p>
          <div className="space-y-2 text-[11px]" style={{ color: "#A0889A" }}>
            <p>Cat Block Pop v1.3</p>
            <p>귀여운 고양이 블록 퍼즐 게임</p>
            <p className="text-[9px]" style={{ color: "#C3A0B1" }}>연령 등급: 전체이용가</p>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,181,194,0.2)" }}>
          <p className="text-sm mb-3" style={{ color: bt.accent }}>📋 법적 고지</p>
          <button onClick={() => setShowPrivacy(!showPrivacy)}
            className="w-full py-2.5 rounded-xl text-xs transition-all active:scale-95 cursor-pointer text-left px-3"
            style={{ background: "rgba(255,220,230,0.15)", color: "#9B7A8A" }}>
            📄 개인정보 처리방침 {showPrivacy ? "▲" : "▼"}
          </button>
          {showPrivacy && (
            <div className="mt-2 p-3 rounded-xl text-[9px] space-y-1.5"
              style={{ background: "rgba(255,250,252,0.5)", color: "#A0889A", maxHeight: 200, overflow: "auto" }}>
              <p className="text-[10px]" style={{ color: "#9B7A8A" }}>Cat Block Pop 개인정보 처리방침</p>
              <p>1. 수집하는 개인정보: 게임 진행 데이터 (점수, 아이템, 퀘스트 진행 상황)</p>
              <p>2. 소셜 로그인 시: 카카오/Google/Apple 프로필 정보 (닉네임, 프로필 사진)</p>
              <p>3. 광고 식별자: Google AdMob을 통한 광고 최적화에 활용</p>
              <p>4. 개인정보 보관: 회원 탈퇴 요청 시 즉시 삭제</p>
              <p>5. 제3자 제공: 카카오 친구 랭킹 서비스를 위해 카카오에 최소 정보 제공</p>
              <p>6. 문의: catblockpop@example.com</p>
            </div>
          )}
          <button
            className="w-full py-2.5 rounded-xl text-xs transition-all active:scale-95 cursor-pointer text-left px-3 mt-2"
            style={{ background: "rgba(255,220,230,0.15)", color: "#9B7A8A" }}
            onClick={() => alert("이용약관은 모바일 앱 출시 시 제공됩니다.")}>
            📜 이용약관
          </button>
        </div>

        {/* Data */}
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,181,194,0.2)" }}>
          <p className="text-sm mb-3" style={{ color: bt.accent }}>💾 데이터</p>
          <div className="space-y-2">
            <button
              className="w-full py-2.5 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
              style={{ background: "rgba(255,220,230,0.15)", color: "#9B7A8A" }}
              onClick={() => {
                if (confirm("정말 모든 데이터를 초기화하시겠습니까?\n점수, 아이템, 퀘스트 진행 상황이 모두 사라집니다.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}>
              🔄 데이터 초기화
            </button>

            {/* Account Deletion (required by App Store / Play Store) */}
            <button
              className="w-full py-2.5 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
              style={{ background: "rgba(255,100,100,0.08)", color: "#E55A5A", border: "1px solid rgba(255,100,100,0.15)" }}
              onClick={() => setShowDeleteConfirm(true)}>
              🗑️ 회원 탈퇴 (계정 삭제)
            </button>
          </div>
        </div>
      </div>

      {/* Account Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-2xl p-6 w-full max-w-[320px]"
            style={{ background: "white", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
            <p className="text-lg text-center mb-2" style={{ color: "#E55A5A" }}>⚠️ 계정 삭제</p>
            <p className="text-xs text-center mb-4" style={{ color: "#A0889A" }}>
              정말로 계정을 삭제하시겠습니까?<br />
              모든 게임 데이터, 점수, 아이템, 퀘스트 진행 상황이<br />
              <strong style={{ color: "#E55A5A" }}>영구적으로 삭제</strong>되며 복구할 수 없습니다.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-xs cursor-pointer transition-all active:scale-95"
                style={{ background: "rgba(200,200,200,0.2)", color: "#888" }}>
                취소
              </button>
              <button onClick={() => {
                localStorage.clear();
                alert("계정이 삭제되었습니다.\n게임이 초기화됩니다.");
                window.location.reload();
              }}
                className="flex-1 py-2.5 rounded-xl text-xs text-white cursor-pointer transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #E55A5A, #CC3333)" }}>
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, desc, on, onToggle, accent = "#E8739A" }: { label: string; desc: string; on: boolean; onToggle: () => void; accent?: string }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,181,194,0.1)" }}>
      <div>
        <p className="text-xs" style={{ color: "#9B7A8A" }}>{label}</p>
        <p className="text-[10px]" style={{ color: "#C3A0B1" }}>{desc}</p>
      </div>
      <button
        onClick={onToggle}
        className="w-12 h-6 rounded-full flex items-center cursor-pointer transition-all"
        style={{
          background: on ? accent : "rgba(200,180,190,0.3)",
          padding: "2px",
        }}
      >
        <div className="w-5 h-5 rounded-full bg-white transition-all"
          style={{
            transform: on ? "translateX(24px)" : "translateX(0)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        />
      </button>
    </div>
  );
}