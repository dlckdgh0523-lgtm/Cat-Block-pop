import React, { useState } from "react";
import { BlackPaw, WhitePaw } from "./paw-icons";
import {
  type QuestProgress,
  isDailyQuestComplete, claimDailyQuest,
  isWeeklyQuestComplete, claimWeeklyQuest,
} from "./daily-quests";
import { playPurchase } from "./sound-effects";
import { type BlockSkin, getBoardTheme } from "./skins-data";

interface QuestPageProps {
  questProgress: QuestProgress;
  onUpdateQuests: (qp: QuestProgress) => void;
  onAddCurrency: (black: number, white: number) => void;
  onClose: () => void;
  skin?: BlockSkin;
}

export function QuestPage({ questProgress, onUpdateQuests, onAddCurrency, onClose, skin = "cat" }: QuestPageProps) {
  const [tab, setTab] = useState<"daily" | "weekly">("daily");
  const [claimAnim, setClaimAnim] = useState<number | null>(null);
  const bt = getBoardTheme(skin);

  const handleClaimDaily = (index: number) => {
    const result = claimDailyQuest(questProgress, index);
    if (!result) return;
    playPurchase();
    setClaimAnim(index);
    setTimeout(() => setClaimAnim(null), 600);
    onUpdateQuests(result.qp);
    onAddCurrency(result.black, result.white);
  };

  const handleClaimWeekly = () => {
    const result = claimWeeklyQuest(questProgress);
    if (!result) return;
    playPurchase();
    onUpdateQuests(result.qp);
    onAddCurrency(result.black, result.white);
  };

  const allDailyDone = questProgress.dailyCompleted.every(c => c);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-8"
      style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div className="w-full max-w-[400px] flex items-center gap-3 mb-3 mt-2">
        <button onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.5)", color: bt.accent }}>←</button>
        <h2 className="text-lg flex-1" style={{ color: bt.accent }}>📋 퀘스트</h2>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-[400px] flex gap-2 mb-4">
        <button onClick={() => setTab("daily")}
          className="flex-1 py-2.5 rounded-xl text-xs cursor-pointer transition-all"
          style={{
            background: tab === "daily" ? bt.comboBadge : "rgba(255,255,255,0.5)",
            color: tab === "daily" ? "white" : bt.accent,
          }}>
          ☀️ 일간 퀘스트
        </button>
        <button onClick={() => setTab("weekly")}
          className="flex-1 py-2.5 rounded-xl text-xs cursor-pointer transition-all"
          style={{
            background: tab === "weekly" ? bt.comboBadge : "rgba(255,255,255,0.5)",
            color: tab === "weekly" ? "white" : bt.accent,
          }}>
          📅 주간 퀘스트
        </button>
      </div>

      {/* Daily Quests */}
      {tab === "daily" && (
        <div className="w-full max-w-[400px] space-y-3">
          {/* Daily completion status */}
          <div className="rounded-xl px-4 py-2.5 flex items-center justify-between"
            style={{ background: "rgba(255,255,255,0.5)" }}>
            <span className="text-xs" style={{ color: "#C3A0B1" }}>오늘의 퀘스트</span>
            <span className="text-xs" style={{ color: allDailyDone ? "#4CAF50" : bt.accent }}>
              {questProgress.dailyCompleted.filter(c => c).length}/3 완료
            </span>
          </div>

          {questProgress.dailyQuests.map((quest, i) => {
            const progress = questProgress.dailyProgress[i];
            const claimed = questProgress.dailyCompleted[i];
            const ready = isDailyQuestComplete(questProgress, i);
            const pct = Math.min(100, Math.floor((progress / quest.target) * 100));
            const isClaiming = claimAnim === i;

            return (
              <div key={quest.id + "_" + i}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: claimed ? "rgba(200,240,200,0.3)" : "rgba(255,255,255,0.65)",
                  border: ready ? "2px solid #4CAF50" : "1px solid rgba(255,181,194,0.2)",
                  transform: isClaiming ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.2s ease",
                }}>
                <div className="flex items-center gap-3 p-3.5">
                  <span className="text-2xl">{quest.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: claimed ? "#4CAF50" : bt.accent }}>{quest.name}</p>
                    <p className="text-[10px]" style={{ color: "#A0889A" }}>{quest.desc}</p>

                    {/* Progress bar */}
                    <div className="mt-1.5 h-2.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(200,180,190,0.2)" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: claimed
                            ? "linear-gradient(90deg, #81C784, #4CAF50)"
                            : ready
                              ? "linear-gradient(90deg, #FFD700, #FFA500)"
                              : `linear-gradient(90deg, ${bt.buttonGradientLight}, ${bt.accent})`,
                        }} />
                    </div>
                    <p className="text-[9px] mt-0.5" style={{ color: "#C3A0B1" }}>
                      {Math.min(progress, quest.target)}/{quest.target}
                    </p>
                  </div>

                  {/* Rewards / Claim */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {claimed ? (
                      <span className="text-xs" style={{ color: "#4CAF50" }}>✅</span>
                    ) : ready ? (
                      <button onClick={() => handleClaimDaily(i)}
                        className="px-3 py-1.5 rounded-lg text-[10px] text-white cursor-pointer transition-all active:scale-90"
                        style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}>
                        받기!
                      </button>
                    ) : (
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <BlackPaw size={10} />
                          <span className="text-[9px]" style={{ color: "#555" }}>{quest.rewardBlack}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <WhitePaw size={10} />
                          <span className="text-[9px]" style={{ color: "#B8A080" }}>{quest.rewardWhite}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {allDailyDone && (
            <div className="rounded-xl p-3 text-center"
              style={{ background: "rgba(100,200,100,0.1)", border: "1px solid rgba(100,200,100,0.2)" }}>
              <p className="text-xs" style={{ color: "#4CAF50" }}>🎉 오늘의 퀘스트 올클리어!</p>
              <p className="text-[9px] mt-1" style={{ color: "#A0889A" }}>주간 퀘스트 진행도 +1</p>
            </div>
          )}
        </div>
      )}

      {/* Weekly Quest */}
      {tab === "weekly" && (
        <div className="w-full max-w-[400px] space-y-3">
          <div className="rounded-2xl overflow-hidden"
            style={{
              background: questProgress.weeklyCompleted ? "rgba(200,240,200,0.3)" : "rgba(255,255,255,0.65)",
              border: isWeeklyQuestComplete(questProgress) ? "2px solid #4CAF50" : "1px solid rgba(255,181,194,0.2)",
            }}>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{questProgress.weeklyQuest.icon}</span>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: questProgress.weeklyCompleted ? "#4CAF50" : bt.accent }}>
                    {questProgress.weeklyQuest.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "#A0889A" }}>
                    {questProgress.weeklyQuest.desc}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-2">
                <div className="h-3 rounded-full overflow-hidden"
                  style={{ background: "rgba(200,180,190,0.2)" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (questProgress.weeklyProgress / questProgress.weeklyQuest.target) * 100)}%`,
                      background: questProgress.weeklyCompleted
                        ? "linear-gradient(90deg, #81C784, #4CAF50)"
                        : `linear-gradient(90deg, ${bt.buttonGradientLight}, ${bt.accent})`,
                    }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px]" style={{ color: "#C3A0B1" }}>
                    {questProgress.weeklyProgress}/{questProgress.weeklyQuest.target} 일간퀘스트 세트 완료
                  </span>
                  {questProgress.weeklyCompleted && (
                    <span className="text-[10px]" style={{ color: "#4CAF50" }}>✅ 완료</span>
                  )}
                </div>
              </div>

              {/* Rewards */}
              <div className="flex items-center justify-between px-2 py-2 rounded-xl"
                style={{ background: "rgba(255,220,230,0.15)" }}>
                <span className="text-[10px]" style={{ color: "#C3A0B1" }}>보상</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <BlackPaw size={12} />
                    <span className="text-xs" style={{ color: "#555" }}>{questProgress.weeklyQuest.rewardBlack}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WhitePaw size={12} />
                    <span className="text-xs" style={{ color: "#B8A080" }}>{questProgress.weeklyQuest.rewardWhite}</span>
                  </div>
                </div>
              </div>

              {isWeeklyQuestComplete(questProgress) && !questProgress.weeklyCompleted && (
                <button onClick={handleClaimWeekly}
                  className="w-full mt-3 py-2.5 rounded-xl text-sm text-white cursor-pointer transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}>
                  🎉 보상 받기!
                </button>
              )}
            </div>
          </div>

          {/* Weekly progress detail */}
          <div className="rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.5)" }}>
            <p className="text-[10px] mb-2" style={{ color: "#C3A0B1" }}>이번 주 진행 현황</p>
            <div className="flex gap-1">
              {Array.from({ length: questProgress.weeklyQuest.target }).map((_, i) => (
                <div key={i} className="flex-1 h-6 rounded-md flex items-center justify-center text-[10px]"
                  style={{
                    background: i < questProgress.weeklyProgress
                      ? `linear-gradient(135deg, ${bt.buttonGradientLight}, ${bt.accent})`
                      : "rgba(200,180,190,0.15)",
                    color: i < questProgress.weeklyProgress ? "white" : "#D4B8C8",
                  }}>
                  {i < questProgress.weeklyProgress ? "✓" : i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}