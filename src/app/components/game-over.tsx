import React, { useState, useEffect } from "react";
import { CatCell } from "./cat-cell";
import { BlackPaw } from "./paw-icons";
import { SPECIAL_CAT_ICONS, SKIN_QUESTS, type BlockSkin, getSkinDef, getBoardTheme } from "./skins-data";
import { playSad } from "./sound-effects";

// ─── Skin-specific game over data ───
const GAMEOVER_DATA: Record<BlockSkin, {
  title: string;
  subtitle: string;
  sadEmoji: string;
  adBlockEmoji: string[];
  adText: string;
  playAgainText: string;
  lobbyText: string;
}> = {
  cat: {
    title: "게임 오버",
    subtitle: "더 이상 놓을 수 없어요...",
    sadEmoji: "😿",
    adBlockEmoji: ["🐱", "😺", "😸", "😻", "😽"],
    adText: "최고의 고양이 퍼즐 게임!",
    playAgainText: "🔄 다시 하기",
    lobbyText: "🏠 로비로",
  },
  pig: {
    title: "꿀꿀... 끝!",
    subtitle: "돼지가 지쳐서 쓰러졌어요...",
    sadEmoji: "😢",
    adBlockEmoji: ["🐷", "🐽", "🐖", "🐗", "🍖"],
    adText: "최고의 돼지 퍼즐 게임!",
    playAgainText: "🔄 다시 꿀꿀!",
    lobbyText: "🏠 돼지 집으로",
  },
  dog: {
    title: "멍... 끝!",
    subtitle: "강아지가 고개를 떨구었어요...",
    sadEmoji: "🥺",
    adBlockEmoji: ["🐶", "🐕", "🦮", "🐕‍🦺", "🦴"],
    adText: "최고의 강아지 퍼즐 게임!",
    playAgainText: "🔄 다시 멍멍!",
    lobbyText: "🏠 강아지 집으로",
  },
  fox: {
    title: "콘! 끝이야...",
    subtitle: "여우가 꼬리를 내렸어요...",
    sadEmoji: "😔",
    adBlockEmoji: ["🦊", "🍂", "🍁", "🌙", "⭐"],
    adText: "최고의 여우 퍼즐 게임!",
    playAgainText: "🔄 다시 콘콘!",
    lobbyText: "🏠 여우 굴로",
  },
  rabbit: {
    title: "깡총... 끝!",
    subtitle: "토끼가 귀를 축 늘어뜨렸어요...",
    sadEmoji: "😥",
    adBlockEmoji: ["🐰", "🐇", "🥕", "🌸", "🍀"],
    adText: "최고의 토끼 퍼즐 게임!",
    playAgainText: "🔄 다시 깡총!",
    lobbyText: "🏠 토끼 굴로",
  },
  bear: {
    title: "크르르... 끝!",
    subtitle: "곰이 풀썩 주저앉았어요...",
    sadEmoji: "😞",
    adBlockEmoji: ["🐻", "🐻‍❄️", "🍯", "🏔️", "🌲"],
    adText: "최고의 곰 퍼즐 게임!",
    playAgainText: "🔄 다시 으르렁!",
    lobbyText: "🏠 곰 동굴로",
  },
};

interface GameOverProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onGoLobby: () => void;
  questUnlocks?: string[];
  earnedPaw?: number;
  adRemoved?: boolean;
  skin?: BlockSkin;
}

export function GameOver({ score, bestScore, isNewBest, onPlayAgain, onGoLobby, questUnlocks = [], earnedPaw, adRemoved = false, skin = "cat" }: GameOverProps) {
  const [showingAd, setShowingAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const data = GAMEOVER_DATA[skin] || GAMEOVER_DATA.cat;
  const skinDef = getSkinDef(skin);
  const boardTheme = getBoardTheme(skin);

  // Play sad sound on mount
  useEffect(() => {
    playSad(skin);
  }, [skin]);

  // Ad countdown
  useEffect(() => {
    if (!showingAd) return;
    if (adTimer <= 0) return;
    const t = setTimeout(() => setAdTimer(adTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [showingAd, adTimer]);

  const handleWatchAd = () => {
    setShowingAd(true);
    setAdTimer(5);
  };

  const handleAdComplete = () => {
    setShowingAd(false);
    onPlayAgain();
  };

  // Rewarded Ad Overlay
  if (showingAd) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.85)" }}>
        <div className="w-full max-w-[340px] rounded-2xl overflow-hidden"
          style={{ background: "#1a1a2e" }}>
          <div className="p-6 text-center">
            <p className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>광고</p>

            <div className="rounded-xl p-6 mb-4"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              <span className="text-4xl">{skinDef.emoji}</span>
              <p className="text-lg mt-2 text-white">Cat Block Pop</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                {data.adText}
              </p>
              <div className="flex justify-center gap-1 mt-3">
                {[0, 1, 2, 3, 4].map(i => (
                  <CatCell key={i} catType={i as 0|1|2|3|4} size={28} skin={skin} />
                ))}
              </div>
              <p className="text-xs mt-3 text-white">지금 바로 친구에게 추천하세요!</p>
            </div>

            {adTimer > 0 ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ border: "2px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.5)" }}>
                  <span className="text-lg">{adTimer}</span>
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {adTimer}초 후 닫을 수 있습니다
                </p>
              </div>
            ) : (
              <button onClick={handleAdComplete}
                className="w-full py-3 rounded-xl text-white cursor-pointer transition-all active:scale-95"
                style={{ background: boardTheme.buttonGradient }}>
                ✖ 광고 닫고 다시 플레이
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4"
      style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="rounded-3xl p-8 w-full max-w-[320px] text-center"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          border: "2px solid rgba(255,181,194,0.3)",
        }}>
        {/* Sad character */}
        <div className="flex justify-center mb-2">
          <div className="relative">
            <CatCell catType={0} size={56} skin={skin} />
            <span className="absolute -bottom-1 -right-1 text-lg">{data.sadEmoji}</span>
          </div>
        </div>
        <p className="text-sm mb-1">{skinDef.emoji}</p>

        <h2 className="text-2xl mb-1" style={{ color: boardTheme.accent }}>{data.title}</h2>
        <p className="text-xs mb-4" style={{ color: boardTheme.accentLight }}>{data.subtitle}</p>

        {/* Score */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: boardTheme.accentAlpha }}>
          <p className="text-xs mb-1" style={{ color: boardTheme.accentLight }}>점수</p>
          <p className="text-4xl" style={{ color: boardTheme.accent }}>{score.toLocaleString()}</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <BlackPaw size={14} />
            <span className="text-xs" style={{ color: "#555" }}>+{(earnedPaw ?? score).toLocaleString()} 획득</span>
            {earnedPaw !== undefined && earnedPaw !== score && (
              <span className="text-[9px]" style={{ color: boardTheme.accentLight }}>(점수 ×0.8)</span>
            )}
          </div>
        </div>

        {isNewBest && (
          <div className="rounded-xl py-2 px-4 mb-4 inline-block"
            style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "white" }}>
            ✨ 새로운 최고 기록! ✨
          </div>
        )}

        <p className="text-xs mb-4" style={{ color: boardTheme.accentLight }}>
          🏆 최고 기록: {bestScore.toLocaleString()}
        </p>

        {/* Quest unlocks */}
        {questUnlocks.length > 0 && (
          <div className="rounded-xl p-3 mb-4" style={{ background: "rgba(100,200,100,0.1)", border: "1px solid rgba(100,200,100,0.2)" }}>
            <p className="text-xs mb-2" style={{ color: "#4CAF50" }}>🎉 퀘스트 클리어!</p>
            {questUnlocks.map(id => {
              const icon = SPECIAL_CAT_ICONS.find(i => i.id === id);
              const skinQuest = SKIN_QUESTS.find(q => q.id === id);
              const name = icon?.name || skinQuest?.desc || id;
              const stars = icon?.stars || skinQuest?.stars || 1;
              return (
                <div key={id} className="flex items-center justify-center gap-1 py-0.5">
                  <span className="text-[11px]" style={{ color: "#4CAF50" }}>{name}</span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: stars }).map((_, i) => (
                      <span key={i} style={{ fontSize: "10px", color: "#FFB800" }}>⭐</span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {/* Watch Ad & Play Again - hidden if ad removed */}
          {!adRemoved && (
            <button onClick={handleWatchAd}
              className="w-full py-3 rounded-xl text-white transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
              }}>
              <span>📺</span>
              <span>광고 보고 다시하기</span>
            </button>
          )}

          {/* Regular Play Again */}
          <button onClick={onPlayAgain}
            className="w-full py-3 rounded-xl text-white transition-all active:scale-95 cursor-pointer"
            style={{ background: boardTheme.comboBadge, boxShadow: `0 4px 12px ${boardTheme.accentAlpha}` }}>
            {data.playAgainText}
          </button>

          <button onClick={onGoLobby}
            className="w-full py-3 rounded-xl transition-all active:scale-95 cursor-pointer"
            style={{ background: boardTheme.accentAlpha, color: boardTheme.accent, border: `2px solid ${boardTheme.accent}30` }}>
            {data.lobbyText}
          </button>
        </div>
      </div>
    </div>
  );
}