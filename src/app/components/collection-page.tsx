import React, { useState } from "react";
import { CatCell } from "./cat-cell";
import { SpecialCatIcon as SpecialCatIconView } from "./special-cat-icon";
import {
  SPECIAL_CAT_ICONS, BLOCK_SKINS, SKIN_QUESTS,
  type PlayerProgress, type BlockSkin, calculateTotalStars,
  type SpecialCatIcon, getBoardTheme,
} from "./skins-data";

interface CollectionPageProps {
  progress: PlayerProgress;
  onClose: () => void;
}

const ICONS_PER_PAGE = 9;
const SKINS_PER_PAGE = 9;

export function CollectionPage({ progress, onClose }: CollectionPageProps) {
  const [tab, setTab] = useState<"icons" | "skins">("icons");
  const [iconPage, setIconPage] = useState(0);
  const [skinPage, setSkinPage] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState<SpecialCatIcon | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<string | null>(null);
  const totalStars = calculateTotalStars(progress);
  const bt = getBoardTheme(progress.equippedSkin);

  const totalIconPages = Math.ceil(SPECIAL_CAT_ICONS.length / ICONS_PER_PAGE);
  const totalSkinPages = Math.ceil(BLOCK_SKINS.length / SKINS_PER_PAGE);

  const pagedIcons = SPECIAL_CAT_ICONS.slice(iconPage * ICONS_PER_PAGE, (iconPage + 1) * ICONS_PER_PAGE);
  const pagedSkins = BLOCK_SKINS.slice(skinPage * SKINS_PER_PAGE, (skinPage + 1) * SKINS_PER_PAGE);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-8"
      style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div className="w-full max-w-[400px] flex items-center gap-3 mb-3 mt-2">
        <button onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.5)", color: bt.accent }}>←</button>
        <h2 className="text-lg flex-1" style={{ color: bt.accent }}>📖 도감</h2>
        <div className="flex items-center gap-1 px-3 py-1 rounded-lg"
          style={{ background: "rgba(255,255,255,0.6)" }}>
          <span style={{ color: "#FFB800" }}>⭐</span>
          <span className="text-sm" style={{ color: bt.accent }}>{totalStars}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-[400px] flex gap-2 mb-3">
        <button onClick={() => { setTab("icons"); setSelectedIcon(null); setSelectedSkin(null); }}
          className="flex-1 py-2 rounded-xl text-xs cursor-pointer transition-all"
          style={{
            background: tab === "icons" ? bt.comboBadge : "rgba(255,255,255,0.5)",
            color: tab === "icons" ? "white" : bt.accent,
          }}>
          🐱 캐릭터 ({progress.unlockedIcons.length}/{SPECIAL_CAT_ICONS.length})
        </button>
        <button onClick={() => { setTab("skins"); setSelectedIcon(null); setSelectedSkin(null); }}
          className="flex-1 py-2 rounded-xl text-xs cursor-pointer transition-all"
          style={{
            background: tab === "skins" ? bt.comboBadge : "rgba(255,255,255,0.5)",
            color: tab === "skins" ? "white" : bt.accent,
          }}>
          🎨 블록 스킨 ({progress.ownedSkins.length}/{BLOCK_SKINS.length})
        </button>
      </div>

      {/* ─── Icon Detail Modal ─── */}
      {selectedIcon && (
        <IconDetailModal
          icon={selectedIcon}
          unlocked={progress.unlockedIcons.includes(selectedIcon.id)}
          onClose={() => setSelectedIcon(null)}
          accent={bt.accent}
          gradient={bt.comboBadge}
        />
      )}

      {/* ─── Skin Detail Modal ─── */}
      {selectedSkin && (
        <SkinDetailModal
          skinId={selectedSkin as BlockSkin}
          progress={progress}
          onClose={() => setSelectedSkin(null)}
          accent={bt.accent}
          gradient={bt.comboBadge}
        />
      )}

      {/* Icon Collection (paginated 3x3 grid) */}
      {tab === "icons" && !selectedIcon && (
        <div className="w-full max-w-[400px]">
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {pagedIcons.map(icon => {
              const unlocked = progress.unlockedIcons.includes(icon.id);
              return (
                <button key={icon.id}
                  onClick={() => setSelectedIcon(icon)}
                  className="rounded-xl p-3 relative cursor-pointer transition-all active:scale-95 flex flex-col items-center"
                  style={{
                    background: unlocked ? "rgba(255,255,255,0.65)" : "rgba(255,248,250,0.45)",
                    border: unlocked ? "1px solid rgba(255,181,194,0.3)" : "1px solid rgba(220,210,215,0.25)",
                  }}>
                  {/* Lock icon (subtle, not blocking view) */}
                  {!unlocked && (
                    <div className="absolute top-1.5 right-1.5 z-10">
                      <span style={{ fontSize: "14px", opacity: 0.5 }}>🔒</span>
                    </div>
                  )}
                  <div style={{
                    opacity: unlocked ? 1 : 0.55,
                    filter: unlocked ? "none" : "saturate(0.4)",
                  }}>
                    <SpecialCatIconView catType={icon.baseCatType} accessory={icon.accessory} size={40} />
                  </div>
                  <p className="text-[10px] mt-1.5 truncate w-full text-center"
                    style={{ color: unlocked ? bt.accent : "#B0A0A8" }}>{icon.name}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: icon.stars }).map((_, i) => (
                      <span key={i} style={{ fontSize: "8px", color: unlocked ? "#FFB800" : "#D8D0D0" }}>⭐</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pagination */}
          {totalIconPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setIconPage(p => Math.max(0, p - 1))} disabled={iconPage === 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30"
                style={{ background: "rgba(255,255,255,0.5)", color: bt.accent }}>‹</button>
              <div className="flex gap-1">
                {Array.from({ length: totalIconPages }).map((_, i) => (
                  <button key={i} onClick={() => setIconPage(i)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] cursor-pointer"
                    style={{
                      background: i === iconPage ? bt.comboBadge : "rgba(255,255,255,0.4)",
                      color: i === iconPage ? "white" : "#C3A0B1",
                    }}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setIconPage(p => Math.min(totalIconPages - 1, p + 1))} disabled={iconPage === totalIconPages - 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30"
                style={{ background: "rgba(255,255,255,0.5)", color: bt.accent }}>›</button>
            </div>
          )}
        </div>
      )}

      {/* Skin Collection (paginated) */}
      {tab === "skins" && !selectedSkin && (
        <div className="w-full max-w-[400px]">
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {pagedSkins.map(skin => {
              const owned = progress.ownedSkins.includes(skin.id);
              const quests = SKIN_QUESTS.filter(q => q.skinId === skin.id);
              const completedCount = quests.filter(q => progress.completedSkinQuests.includes(q.id)).length;

              return (
                <button key={skin.id}
                  onClick={() => setSelectedSkin(skin.id)}
                  className="rounded-xl p-3 relative cursor-pointer transition-all active:scale-95 flex flex-col items-center"
                  style={{
                    background: owned ? "rgba(255,255,255,0.65)" : "rgba(255,248,250,0.45)",
                    border: owned ? "1px solid rgba(255,181,194,0.3)" : "1px solid rgba(220,210,215,0.25)",
                  }}>
                  {!owned && skin.price > 0 && (
                    <div className="absolute top-1.5 right-1.5 z-10">
                      <span style={{ fontSize: "14px", opacity: 0.5 }}>🔒</span>
                    </div>
                  )}
                  <span className="text-2xl mb-1" style={{ opacity: owned ? 1 : 0.55 }}>{skin.emoji}</span>
                  <p className="text-[10px] truncate w-full text-center"
                    style={{ color: owned ? bt.accent : "#B0A0A8" }}>{skin.name}</p>
                  {/* Mini block preview */}
                  <div className="flex gap-0.5 mt-1" style={{ opacity: owned ? 1 : 0.4 }}>
                    {[0, 1, 2].map(t => (
                      <CatCell key={t} catType={t as 0 | 1 | 2} size={14} skin={skin.id as BlockSkin} />
                    ))}
                  </div>
                  {quests.length > 0 && (
                    <p className="text-[8px] mt-1" style={{ color: "#C3A0B1" }}>
                      퀘스트 {completedCount}/{quests.length}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Pagination */}
          {totalSkinPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setSkinPage(p => Math.max(0, p - 1))} disabled={skinPage === 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30"
                style={{ background: "rgba(255,255,255,0.5)", color: bt.accent }}>‹</button>
              <div className="flex gap-1">
                {Array.from({ length: totalSkinPages }).map((_, i) => (
                  <button key={i} onClick={() => setSkinPage(i)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] cursor-pointer"
                    style={{
                      background: i === skinPage ? bt.comboBadge : "rgba(255,255,255,0.4)",
                      color: i === skinPage ? "white" : "#C3A0B1",
                    }}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setSkinPage(p => Math.min(totalSkinPages - 1, p + 1))} disabled={skinPage === totalSkinPages - 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30"
                style={{ background: "rgba(255,255,255,0.5)", color: bt.accent }}>›</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Icon Detail Modal ───
function IconDetailModal({ icon, unlocked, onClose, accent, gradient }: { icon: SpecialCatIcon; unlocked: boolean; onClose: () => void; accent: string; gradient: string }) {
  return (
    <div className="w-full max-w-[400px]">
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.75)", border: `1px solid ${accent}30` }}>
        <div className="p-5 flex flex-col items-center">
          <div style={{ opacity: unlocked ? 1 : 0.5, filter: unlocked ? "none" : "saturate(0.3)" }}>
            <SpecialCatIconView catType={icon.baseCatType} accessory={icon.accessory} size={80} />
          </div>
          <h3 className="text-lg mt-3" style={{ color: unlocked ? accent : "#A0889A" }}>{icon.name}</h3>
          <p className="text-xs" style={{ color: "#A0889A" }}>{icon.desc}</p>

          <div className="flex gap-1 mt-2">
            {Array.from({ length: icon.stars }).map((_, i) => (
              <span key={i} style={{ fontSize: "16px", color: unlocked ? "#FFB800" : "#D8D0D0" }}>⭐</span>
            ))}
          </div>

          {/* Quest info */}
          <div className="w-full mt-4 p-3 rounded-xl"
            style={{ background: unlocked ? "rgba(100,200,100,0.08)" : `${accent}10` }}>
            <p className="text-[10px] mb-1" style={{ color: "#C3A0B1" }}>
              {unlocked ? "✅ 획득 완료" : "🎯 획득 조건"}
            </p>
            <p className="text-sm" style={{ color: unlocked ? "#4CAF50" : accent }}>
              {icon.questDesc}
            </p>
          </div>

          {!unlocked && (
            <div className="w-full mt-2 p-2.5 rounded-xl text-center"
              style={{ background: "rgba(200,180,190,0.1)" }}>
              <p className="text-[9px]" style={{ color: "#C3A0B1" }}>
                조건을 달성하면 자동으로 잠금이 해제됩니다
              </p>
            </div>
          )}
        </div>

        <button onClick={onClose}
          className="w-full py-3 text-sm cursor-pointer transition-all active:scale-95"
          style={{ background: `${accent}10`, color: accent, borderTop: `1px solid ${accent}15` }}>
          닫기
        </button>
      </div>
    </div>
  );
}

// ─── Skin Detail Modal ───
function SkinDetailModal({ skinId, progress, onClose, accent, gradient }: { skinId: BlockSkin; progress: PlayerProgress; onClose: () => void; accent: string; gradient: string }) {
  const skin = BLOCK_SKINS.find(s => s.id === skinId);
  if (!skin) return null;
  const owned = progress.ownedSkins.includes(skinId);
  const quests = SKIN_QUESTS.filter(q => q.skinId === skinId);

  return (
    <div className="w-full max-w-[400px]">
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.75)", border: `1px solid ${accent}30` }}>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl" style={{ opacity: owned ? 1 : 0.5 }}>{skin.emoji}</span>
            <div>
              <h3 className="text-lg" style={{ color: owned ? accent : "#A0889A" }}>{skin.name} 블록 스킨</h3>
              {owned && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span key={i} style={{ fontSize: "10px", color: "#FFB800" }}>⭐</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Block preview */}
          <div className="flex justify-center gap-1 mb-3 py-2 rounded-xl"
            style={{ background: "rgba(255,220,230,0.15)", opacity: owned ? 1 : 0.5 }}>
            {[0, 1, 2, 3, 4, 5].map(t => (
              <CatCell key={t} catType={t as 0|1|2|3|4|5} size={32} skin={skinId} />
            ))}
          </div>

          {/* Reactions */}
          <div className="p-3 rounded-xl mb-3" style={{ background: "rgba(255,220,230,0.1)" }}>
            <p className="text-[9px] mb-1" style={{ color: "#C3A0B1" }}>반응 효과</p>
            <p className="text-[10px]" style={{ color: "#A0889A" }}>
              가까이 (2칸 이내): {skin.nearReaction}
            </p>
            <p className="text-[10px]" style={{ color: "#A0889A" }}>
              멀리 (2칸 이상): {skin.farReaction}
            </p>
          </div>

          {/* How to get */}
          {!owned && skin.price > 0 && (
            <div className="p-3 rounded-xl mb-3" style={{ background: "rgba(212,188,150,0.1)" }}>
              <p className="text-[9px] mb-1" style={{ color: "#C3A0B1" }}>획득 방법</p>
              <p className="text-sm" style={{ color: "#B8A080" }}>💎 상점에서 {skin.price.toLocaleString()} 프리미엄 포인트로 구매</p>
            </div>
          )}

          {/* Quests */}
          {quests.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[9px]" style={{ color: "#C3A0B1" }}>스킨 퀘스트</p>
              {quests.map(q => {
                const done = progress.completedSkinQuests.includes(q.id);
                return (
                  <div key={q.id} className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: done ? "rgba(100,200,100,0.08)" : "rgba(255,220,230,0.1)" }}>
                    <span className="text-[10px]">{done ? "✅" : "⬜"}</span>
                    <p className="flex-1 text-[10px]" style={{ color: done ? "#4CAF50" : "#A0889A" }}>{q.desc}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: q.stars }).map((_, i) => (
                        <span key={i} style={{ fontSize: "7px", color: done ? "#FFB800" : "#ddd" }}>⭐</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button onClick={onClose}
          className="w-full py-3 text-sm cursor-pointer transition-all active:scale-95"
          style={{ background: `${accent}10`, color: accent, borderTop: `1px solid ${accent}15` }}>
          닫기
        </button>
      </div>
    </div>
  );
}