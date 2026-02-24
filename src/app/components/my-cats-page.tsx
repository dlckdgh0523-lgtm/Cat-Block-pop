import React, { useState } from "react";
import { CatCell } from "./cat-cell";
import { SpecialCatIcon as SpecialCatIconView } from "./special-cat-icon";
import type { CatType } from "./game-logic";
import {
  SPECIAL_CAT_ICONS, BLOCK_SKINS,
  type PlayerProgress, type BlockSkin, getBoardTheme,
} from "./skins-data";

interface MyCatsPageProps {
  progress: PlayerProgress;
  onUpdateProgress: (p: Partial<PlayerProgress>) => void;
  onClose: () => void;
}

const DEFAULT_CATS: { id: string; type: CatType; name: string }[] = [
  { id: "default_0", type: 0, name: "치즈냥" },
  { id: "default_1", type: 1, name: "회냥" },
  { id: "default_2", type: 2, name: "까만냥" },
  { id: "default_3", type: 3, name: "하얀냥" },
  { id: "default_4", type: 4, name: "삼색냥" },
  { id: "default_5", type: 5, name: "샴냥" },
];

export function MyCatsPage({ progress, onUpdateProgress, onClose }: MyCatsPageProps) {
  const [tab, setTab] = useState<"profile" | "icons" | "skins">("profile");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.nickname);
  const bt = getBoardTheme(progress.equippedSkin);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length > 0 && trimmed.length <= 12) {
      onUpdateProgress({ nickname: trimmed });
    }
    setEditingName(false);
  };

  const handleEquipIcon = (iconId: string) => {
    onUpdateProgress({ equippedIcon: iconId });
  };

  const handleEquipSkin = (skinId: BlockSkin) => {
    if (progress.ownedSkins.includes(skinId)) {
      onUpdateProgress({ equippedSkin: skinId });
    }
  };

  // Get the catType for the equipped icon
  const getEquippedCatType = (): CatType => {
    if (progress.equippedIcon.startsWith("default_")) {
      return parseInt(progress.equippedIcon.split("_")[1]) as CatType;
    }
    const icon = SPECIAL_CAT_ICONS.find(i => i.id === progress.equippedIcon);
    return icon?.baseCatType ?? 0;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-8"
      style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div className="w-full max-w-[400px] flex items-center gap-3 mb-4 mt-2">
        <button onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.5)", color: bt.accent }}>←</button>
        <h2 className="text-lg" style={{ color: bt.accent }}>🐱 내 고양이</h2>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-[400px] flex gap-1.5 mb-4">
        {([["profile", "프로필"], ["icons", "아이콘"], ["skins", "블록 스킨"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as typeof tab)}
            className="flex-1 py-2 rounded-xl text-[11px] cursor-pointer transition-all"
            style={{
              background: tab === key ? bt.comboBadge : "rgba(255,255,255,0.5)",
              color: tab === key ? "white" : bt.accent,
            }}>{label}</button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="w-full max-w-[400px] space-y-3">
          {/* Avatar */}
          <div className="rounded-2xl p-5 flex flex-col items-center"
            style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,181,194,0.2)" }}>
            <div className="mb-3">
              <CatCell catType={getEquippedCatType()} size={80} skin={progress.equippedSkin} />
            </div>

            {/* Nickname */}
            {editingName ? (
              <div className="flex gap-2 items-center w-full max-w-[240px]">
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={12}
                  autoFocus
                  className="flex-1 text-center py-1.5 px-3 rounded-lg text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: `1px solid ${bt.accent}80`,
                    color: bt.accent,
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                />
                <button onClick={handleSaveName}
                  className="px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                  style={{ background: bt.accent }}>확인</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-lg" style={{ color: bt.accent }}>{progress.nickname}</p>
                <button onClick={() => { setNameInput(progress.nickname); setEditingName(true); }}
                  className="text-[10px] px-2 py-0.5 rounded cursor-pointer"
                  style={{ background: bt.accentAlpha, color: bt.accent }}>✏️ 변경</button>
              </div>
            )}

            <p className="text-[10px] mt-1" style={{ color: "#C3A0B1" }}>
              장착 스킨: {BLOCK_SKINS.find(s => s.id === progress.equippedSkin)?.emoji} {BLOCK_SKINS.find(s => s.id === progress.equippedSkin)?.name}
            </p>
          </div>
        </div>
      )}

      {/* Icons Tab */}
      {tab === "icons" && (
        <div className="w-full max-w-[400px]">
          {/* Default cats */}
          <p className="text-xs mb-2" style={{ color: "#C3A0B1" }}>기본 고양이</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {DEFAULT_CATS.map(cat => {
              const equipped = progress.equippedIcon === cat.id;
              return (
                <button key={cat.id} onClick={() => handleEquipIcon(cat.id)}
                  className="rounded-xl p-3 flex flex-col items-center cursor-pointer transition-all active:scale-95"
                  style={{
                    background: equipped ? "rgba(232,115,154,0.15)" : "rgba(255,255,255,0.5)",
                    border: equipped ? `2px solid ${bt.accent}` : "2px solid transparent",
                  }}>
                  <CatCell catType={cat.type} size={36} />
                  <p className="text-[10px] mt-1" style={{ color: equipped ? bt.accent : "#A0889A" }}>{cat.name}</p>
                  {equipped && <p className="text-[8px]" style={{ color: bt.accent }}>장착중</p>}
                </button>
              );
            })}
          </div>

          {/* Special cats */}
          <p className="text-xs mb-2" style={{ color: "#C3A0B1" }}>특수 고양이 (퀘스트 잠금해제)</p>
          <div className="grid grid-cols-2 gap-2">
            {SPECIAL_CAT_ICONS.map(icon => {
              const unlocked = progress.unlockedIcons.includes(icon.id);
              const equipped = progress.equippedIcon === icon.id;
              return (
                <button key={icon.id}
                  onClick={() => unlocked && handleEquipIcon(icon.id)}
                  disabled={!unlocked}
                  className="rounded-xl p-3 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:cursor-not-allowed relative"
                  style={{
                    background: equipped ? "rgba(232,115,154,0.15)" : unlocked ? "rgba(255,255,255,0.5)" : "rgba(200,190,200,0.2)",
                    border: equipped ? `2px solid ${bt.accent}` : "2px solid transparent",
                  }}>
                  {!unlocked && (
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center z-10"
                      style={{ background: "rgba(150,140,150,0.35)" }}>
                      <span style={{ fontSize: "18px", opacity: 0.6 }}>🔒</span>
                    </div>
                  )}
                  <div style={{ opacity: unlocked ? 1 : 0.3, filter: unlocked ? "none" : "grayscale(0.7)" }}>
                    <SpecialCatIconView catType={icon.baseCatType} accessory={icon.accessory} size={30} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[10px] truncate" style={{ color: unlocked ? bt.accent : "#bbb" }}>{icon.name}</p>
                    <p className="text-[8px]" style={{ color: unlocked ? "#A0889A" : "#ccc" }}>
                      {equipped ? "장착중" : unlocked ? "장착 가능" : icon.questDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Block Skins Tab */}
      {tab === "skins" && (
        <div className="w-full max-w-[400px] space-y-2">
          {BLOCK_SKINS.map(skin => {
            const owned = progress.ownedSkins.includes(skin.id);
            const equipped = progress.equippedSkin === skin.id;
            return (
              <button key={skin.id}
                onClick={() => handleEquipSkin(skin.id)}
                disabled={!owned}
                className="w-full rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed"
                style={{
                  background: equipped ? "rgba(232,115,154,0.15)" : owned ? "rgba(255,255,255,0.55)" : "rgba(200,190,200,0.2)",
                  border: equipped ? `2px solid ${bt.accent}` : "2px solid transparent",
                }}>
                <span className="text-2xl">{skin.emoji}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm" style={{ color: owned ? bt.accent : "#999" }}>{skin.name}</p>
                  <p className="text-[9px]" style={{ color: equipped ? bt.accent : owned ? "#A0889A" : "#bbb" }}>
                    {equipped ? "장착중" : owned ? "장착 가능" : `💎 ${skin.price.toLocaleString()}`}
                  </p>
                </div>
                <div className="flex gap-0.5" style={{ opacity: owned ? 1 : 0.3 }}>
                  {[0, 1, 2].map(t => (
                    <CatCell key={t} catType={t as CatType} size={20} skin={skin.id} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}