import React from "react";
import { CatCell } from "./cat-cell";
import { SpecialCatIcon as SpecialCatIconView } from "./special-cat-icon";
import { BlackPaw, WhitePaw } from "./paw-icons";
import type { ItemInventory } from "./game-logic";
import { type PlayerProgress, type BlockSkin, calculateTotalStars, SPECIAL_CAT_ICONS, getBoardTheme } from "./skins-data";
import type { CatType } from "./game-logic";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  blackPaw: number;
  whitePaw: number;
  items: ItemInventory;
  progress: PlayerProgress;
  onNavigate: (page: "my-cats" | "shop" | "settings" | "collection" | "quests") => void;
}

export function Sidebar({ open, onClose, blackPaw, whitePaw, items, progress, onNavigate }: SidebarProps) {
  const totalStars = calculateTotalStars(progress);
  const equippedCatType = getEquippedCatType(progress);
  const boardTheme = getBoardTheme(progress.equippedSkin);
  const skinDef = SPECIAL_CAT_ICONS; // just for reference

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[60]"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
          onClick={onClose} />
      )}
      <div className="fixed top-0 left-0 h-full z-[70] flex flex-col"
        style={{
          width: 260,
          background: boardTheme.sidebarBg,
          boxShadow: open ? "4px 0 20px rgba(0,0,0,0.1)" : "none",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          fontFamily: "'Nunito', sans-serif",
        }}>
        {/* Profile */}
        <div className="px-5 pt-6 pb-4" style={{ borderBottom: `1px solid ${boardTheme.accent}25` }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.6)", border: `2px solid ${boardTheme.accent}` }}>
              {getEquippedAccessory(progress) ? (
                <SpecialCatIconView catType={equippedCatType} accessory={getEquippedAccessory(progress)!} size={36} />
              ) : (
                <CatCell catType={equippedCatType} size={36} skin={progress.equippedSkin} />
              )}
            </div>
            <div>
              <p className="text-sm" style={{ color: boardTheme.accent }}>{progress.nickname}</p>
              <div className="flex items-center gap-1">
                <span style={{ fontSize: "10px", color: "#FFB800" }}>⭐</span>
                <span className="text-[10px]" style={{ color: boardTheme.accentLight }}>{totalStars}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-1"
              style={{ background: "rgba(255,255,255,0.6)" }}>
              <BlackPaw size={14} />
              <span className="text-[11px]" style={{ color: "#555" }}>{blackPaw.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-1"
              style={{ background: "rgba(255,255,255,0.6)" }}>
              <WhitePaw size={14} />
              <span className="text-[11px]" style={{ color: "#B8A080" }}>{whitePaw.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 py-3 px-3">
          <MenuItem icon="🐱" label="내 고양이" onClick={() => onNavigate("my-cats")} accent={boardTheme.accent} />
          <MenuItem icon="🛒" label="고양이 상점"
            badge={items.churu + items.catnip + items.knead > 0 ? `${items.churu + items.catnip + items.knead}` : undefined}
            onClick={() => onNavigate("shop")} accent={boardTheme.accent} />
          <MenuItem icon="📖" label="도감"
            badge={`⭐${totalStars}`}
            onClick={() => onNavigate("collection")} accent={boardTheme.accent} />
          <MenuItem icon="⚙️" label="설정" onClick={() => onNavigate("settings")} accent={boardTheme.accent} />
          <MenuItem icon="🗺️" label="퀘스트" onClick={() => onNavigate("quests")} accent={boardTheme.accent} />
        </div>

        <div className="px-5 py-4" style={{ borderTop: `1px solid ${boardTheme.accent}20` }}>
          <p className="text-[9px] text-center" style={{ color: boardTheme.hintColor }}>Cat Block Pop v1.1</p>
        </div>
      </div>
    </>
  );
}

function MenuItem({ icon, label, badge, onClick, accent }: { icon: string; label: string; badge?: string; onClick: () => void; accent: string }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all active:scale-95 cursor-pointer"
      style={{ background: "transparent" }}
      onPointerEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(255,255,255,0.5)"; }}
      onPointerLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}>
      <span className="text-lg">{icon}</span>
      <span className="flex-1 text-left text-sm" style={{ color: "#9B7A8A" }}>{label}</span>
      {badge && (
        <span className="px-2 py-0.5 rounded-full text-[10px] text-white"
          style={{ background: accent }}>{badge}</span>
      )}
      <span style={{ color: accent + "60" }}>›</span>
    </button>
  );
}

function getEquippedCatType(progress: PlayerProgress): CatType {
  if (progress.equippedIcon.startsWith("default_")) {
    return parseInt(progress.equippedIcon.split("_")[1]) as CatType;
  }
  const icon = SPECIAL_CAT_ICONS.find(i => i.id === progress.equippedIcon);
  return icon?.baseCatType ?? 0;
}

function getEquippedAccessory(progress: PlayerProgress): string | null {
  if (progress.equippedIcon.startsWith("default_")) return null;
  const icon = SPECIAL_CAT_ICONS.find(i => i.id === progress.equippedIcon);
  return icon?.accessory ?? null;
}