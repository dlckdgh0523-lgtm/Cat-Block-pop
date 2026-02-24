// ─── Inactivity Warning Overlay ───
// 10분 비활동 시 경고 메시지 + 30초 카운트다운

import React from "react";
import { useAuthOptional } from "./auth-context";

export function InactivityWarning() {
  const auth = useAuthOptional();

  if (!auth || !auth.showInactivityWarning) return null;

  const { inactivityCountdown, dismissInactivityWarning } = auth;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-[320px] rounded-3xl overflow-hidden mx-4"
        style={{
          background: "rgba(255,255,255,0.97)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          animation: "inactivityPop 0.3s ease-out",
        }}>

        {/* Header */}
        <div className="px-6 py-4 text-center"
          style={{ background: "linear-gradient(135deg, #FF9F43, #FF6B8A)" }}>
          <div className="text-3xl mb-1">😴</div>
          <p className="text-white text-sm">잠깐, 자고 있었나요?</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-center">
          <p className="text-sm mb-2" style={{ color: "#555" }}>
            행동이 없어서
          </p>
          <p className="text-base mb-4" style={{ color: "#E8739A", fontWeight: 700 }}>
            로그아웃으로 전환됩니다!
          </p>

          {/* Countdown */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-16 h-16">
              {/* Background circle */}
              <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(232,115,154,0.15)" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="#E8739A" strokeWidth="4"
                  strokeDasharray={`${(inactivityCountdown / 30) * 176} 176`}
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                  style={{ transition: "stroke-dasharray 1s linear" }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl" style={{ color: inactivityCountdown <= 10 ? "#FF4444" : "#E8739A", fontWeight: 700 }}>
                  {inactivityCountdown}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] mb-4" style={{ color: "#B8A0B0" }}>
            {inactivityCountdown}초 후 자동으로 로그아웃됩니다
          </p>

          {/* Continue button */}
          <button onClick={dismissInactivityWarning}
            className="w-full py-3 rounded-2xl text-white text-sm cursor-pointer transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #FF6B8A, #E8739A)",
              boxShadow: "0 4px 15px rgba(232,115,154,0.35)",
            }}>
            🐱 계속 플레이하기!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes inactivityPop {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}