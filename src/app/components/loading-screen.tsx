import React, { useState, useEffect } from "react";
import { CatCell } from "./cat-cell";
import type { CatType } from "./game-logic";
import { type BlockSkin, getSkinDef, getBoardTheme } from "./skins-data";
import { LobbyCharacter } from "./lobby-character";

// ─── Skin-specific loading data ───
const LOADING_DATA: Record<BlockSkin, {
  title: string;
  tips: string[];
  loadingPrefix: string;
  emojis: string[];
}> = {
  cat: {
    title: "Cat Block Pop",
    tips: [
      "블록을 드래그하여 보드에 놓으세요",
      "가로/세로 줄을 완성하면 클리어!",
      "연속 클리어 시 콤보 보너스!",
      "고양이마다 다른 소리를 들어보세요 🎵",
      "아이템을 사용하면 위기를 탈출할 수 있어요!",
    ],
    loadingPrefix: "냥냥",
    emojis: ["🐱", "😺", "😸", "🐾"],
  },
  pig: {
    title: "Pig Block Pop",
    tips: [
      "꿀꿀! 블록을 드래그하여 보드에 놓으세요",
      "가로/세로 줄을 완성하면 클리어!",
      "연속 클리어 시 콤보 보너스!",
      "돼지마다 다른 꿀꿀 소리를 들어보세요 🎵",
      "간식 아이템으로 위기를 탈출하세요!",
    ],
    loadingPrefix: "꿀꿀",
    emojis: ["🐷", "🐽", "🐖", "🍖"],
  },
  dog: {
    title: "Dog Block Pop",
    tips: [
      "멍멍! 블록을 드래그하여 보드에 놓으세요",
      "가로/세로 줄을 완성하면 클리어!",
      "연속 클리어 시 콤보 보너스!",
      "강아지마다 다른 짖는 소리를 들어보세요 🎵",
      "간식 아이템으로 위기를 탈출하세요!",
    ],
    loadingPrefix: "멍멍",
    emojis: ["🐶", "🐕", "🦮", "🦴"],
  },
  fox: {
    title: "Fox Block Pop",
    tips: [
      "콘콘! 블록을 드래그하여 보드에 놓으세요",
      "가로/세로 줄을 완성하면 클리어!",
      "연속 클리어 시 콤보 보너스!",
      "여우의 신비로운 소리를 들어보세요 🎵",
      "간식 아이템으로 위기를 탈출하세요!",
    ],
    loadingPrefix: "콘콘",
    emojis: ["🦊", "🍂", "🌙", "⭐"],
  },
  rabbit: {
    title: "Rabbit Block Pop",
    tips: [
      "깡총! 블록을 드래그하여 보드에 놓으세요",
      "가로/세로 줄을 완성하면 클리어!",
      "연속 클리어 시 콤보 보너스!",
      "토끼의 귀여운 소리를 들어보세요 🎵",
      "당근 아이템으로 위기를 탈출하세요!",
    ],
    loadingPrefix: "깡총",
    emojis: ["🐰", "🐇", "🥕", "🌸"],
  },
  bear: {
    title: "Bear Block Pop",
    tips: [
      "으르렁! 블록을 드래그하여 보드에 놓으세요",
      "가로/세로 줄을 완성하면 클리어!",
      "연속 클리어 시 콤보 보너스!",
      "곰의 묵직한 소리를 들어보세요 🎵",
      "꿀 아이템으로 위기를 탈출하세요!",
    ],
    loadingPrefix: "으르렁",
    emojis: ["🐻", "🐻‍❄️", "🍯", "🌲"],
  },
};

// Skin-specific gradient accents
const SKIN_GRADIENTS: Record<BlockSkin, { primary: string; secondary: string; accent: string }> = {
  cat:    { primary: "#FFB5C2", secondary: "#E8739A", accent: "#FFD4DC" },
  pig:    { primary: "#FFB5C2", secondary: "#E8939F", accent: "#FFD4DC" },
  dog:    { primary: "#DEB887", secondary: "#A0765A", accent: "#F0D4A8" },
  fox:    { primary: "#E87830", secondary: "#C86020", accent: "#FF9850" },
  rabbit: { primary: "#F5F0F0", secondary: "#C09878", accent: "#FFD8C0" },
  bear:   { primary: "#8B6914", secondary: "#6B4F0E", accent: "#AB8930" },
};

interface LoadingScreenProps {
  onComplete: () => void;
  skin?: BlockSkin;
}

export function LoadingScreen({ onComplete, skin = "cat" }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [bouncePhase, setBouncePhase] = useState(0);
  const [emojiIdx, setEmojiIdx] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);

  const data = LOADING_DATA[skin] || LOADING_DATA.cat;
  const skinDef = getSkinDef(skin);
  const colors = SKIN_GRADIENTS[skin] || SKIN_GRADIENTS.cat;
  const boardTheme = getBoardTheme(skin);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  // Bounce animation phase
  useEffect(() => {
    const interval = setInterval(() => setBouncePhase(p => (p + 1) % 3), 300);
    return () => clearInterval(interval);
  }, []);

  // Cycle emojis
  useEffect(() => {
    const interval = setInterval(() => setEmojiIdx(i => (i + 1) % data.emojis.length), 800);
    return () => clearInterval(interval);
  }, [data.emojis.length]);

  // Cycle tips
  useEffect(() => {
    const interval = setInterval(() => setTipIdx(i => (i + 1) % data.tips.length), 2500);
    return () => clearInterval(interval);
  }, [data.tips.length]);

  // Pick a representative catType based on skin
  const displayCatType = (Math.floor(progress / 20) % 6) as CatType;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{
        background: boardTheme.appBg,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Floating emojis background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0,1,2,3,4,5].map(i => (
          <span key={i} className="absolute text-2xl"
            style={{
              left: `${15 + i * 14}%`,
              top: `${10 + (i % 3) * 25}%`,
              opacity: 0.15,
              animation: `floatEmoji ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}>
            {data.emojis[i % data.emojis.length]}
          </span>
        ))}
      </div>

      {/* Main character - illustrated style with gentle bounce */}
      <div className="mb-2" style={{
        animation: "loadingBounce 1.5s ease-in-out infinite",
      }}>
        <LobbyCharacter skin={skin} catType={displayCatType} size={120} />
      </div>

      {/* Current emoji */}
      <span className="text-2xl mb-1" style={{ animation: "pulse 1s ease-in-out infinite" }}>
        {data.emojis[emojiIdx]}
      </span>

      {/* Title */}
      <h2 className="text-2xl mt-1 mb-2" style={{ color: colors.secondary, textShadow: `1px 1px 0 ${colors.accent}` }}>
        {data.title}
      </h2>

      {/* Mini character parade */}
      <div className="flex items-end gap-1 mb-3">
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            transform: `translateY(${bouncePhase === (i % 3) ? -6 : 0}px)`,
            transition: "transform 0.3s ease-out",
            opacity: 0.7,
          }}>
            <CatCell catType={i as CatType} size={28} skin={skin} />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[220px] h-3 rounded-full overflow-hidden mb-4"
        style={{ background: "rgba(255,181,194,0.2)" }}>
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          }}
        />
      </div>

      {/* Rotating tip card */}
      <div
        className="rounded-2xl p-4 w-full max-w-[300px]"
        style={{
          background: "rgba(255,255,255,0.6)",
          border: `1px solid ${colors.primary}40`,
          backdropFilter: "blur(10px)",
          minHeight: 80,
        }}
      >
        <p className="text-xs mb-2 text-center" style={{ color: colors.secondary }}>
          {skinDef.emoji} 팁
        </p>
        <p className="text-[11px] text-center" style={{
          color: "#A0889A",
          lineHeight: "1.6",
          animation: "tipFade 2.5s ease-in-out infinite",
        }}>
          {data.tips[tipIdx]}
        </p>
      </div>

      <p className="text-[10px] mt-4" style={{ color: "#D4B8C8" }}>
        {data.loadingPrefix} 로딩 중... {progress}%
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }
        @keyframes floatEmoji {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes loadingBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-8px) scale(1.02, 0.98); }
          60% { transform: translateY(0) scale(0.98, 1.02); }
        }
        @keyframes tipFade {
          0% { opacity: 0.5; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
