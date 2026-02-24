import React from "react";
import type { BlockSkin } from "./skins-data";

// Black paw print (free currency)
export function BlackPaw({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="17" rx="5" ry="4" fill="#333" />
      <circle cx="7" cy="10" r="2.5" fill="#333" />
      <circle cx="17" cy="10" r="2.5" fill="#333" />
      <circle cx="10" cy="7" r="2.2" fill="#333" />
      <circle cx="14" cy="7" r="2.2" fill="#333" />
    </svg>
  );
}

// White paw print (premium currency)
export function WhitePaw({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="17" rx="5" ry="4" fill="#F5F0EC" stroke="#D4BC96" strokeWidth="0.8" />
      <circle cx="7" cy="10" r="2.5" fill="#F5F0EC" stroke="#D4BC96" strokeWidth="0.8" />
      <circle cx="17" cy="10" r="2.5" fill="#F5F0EC" stroke="#D4BC96" strokeWidth="0.8" />
      <circle cx="10" cy="7" r="2.2" fill="#F5F0EC" stroke="#D4BC96" strokeWidth="0.8" />
      <circle cx="14" cy="7" r="2.2" fill="#F5F0EC" stroke="#D4BC96" strokeWidth="0.8" />
      <text x="12" y="19" textAnchor="middle" fontSize="5" fill="#D4BC96" fontWeight="bold">$</text>
    </svg>
  );
}

// ─── Skin-aware item icon config ───
const SKIN_ITEM_THEME: Record<BlockSkin, {
  label: string;
  emoji: string;
  primary: string;
  secondary: string;
  accent: string;
  face: string;
  treatName: string;
  grassName: string;
  pawColor1: string;
  pawColor2: string;
}> = {
  cat: {
    label: "고양이", emoji: "🐱",
    primary: "#FF9F43", secondary: "#FFBf76", accent: "#E58A2F", face: "#7A4A1A",
    treatName: "츄르", grassName: "풀",
    pawColor1: "#FFB5C2", pawColor2: "#E8739A",
  },
  pig: {
    label: "돼지", emoji: "🐷",
    primary: "#FFB5C2", secondary: "#FFD4DC", accent: "#E8939F", face: "#8B4560",
    treatName: "간식", grassName: "풀",
    pawColor1: "#FFD4DC", pawColor2: "#FFB5C2",
  },
  dog: {
    label: "강아지", emoji: "🐶",
    primary: "#DEB887", secondary: "#F0D4A8", accent: "#C49A6C", face: "#5C3A1A",
    treatName: "간식", grassName: "풀",
    pawColor1: "#F0D4A8", pawColor2: "#DEB887",
  },
  fox: {
    label: "여우", emoji: "🦊",
    primary: "#E87830", secondary: "#FF9850", accent: "#C86020", face: "#5A2A10",
    treatName: "간식", grassName: "풀",
    pawColor1: "#FF9850", pawColor2: "#E87830",
  },
  rabbit: {
    label: "토끼", emoji: "🐰",
    primary: "#F5F0F0", secondary: "#FFFFFF", accent: "#D8D0D0", face: "#8A5060",
    treatName: "당근", grassName: "풀",
    pawColor1: "#FFD4DC", pawColor2: "#FFB5C2",
  },
  bear: {
    label: "곰", emoji: "🐻",
    primary: "#8B6914", secondary: "#AB8930", accent: "#6B4F0E", face: "#3A2A0A",
    treatName: "꿀", grassName: "풀",
    pawColor1: "#AB8930", pawColor2: "#8B6914",
  },
};

// ─── Churu/Treat item icon (skin-aware) ───
export function ChuruIcon({ size = 32, skin = "cat" as BlockSkin }: { size?: number; skin?: BlockSkin }) {
  const s = size / 32;
  const t = SKIN_ITEM_THEME[skin] || SKIN_ITEM_THEME.cat;

  if (skin === "cat") {
    // Original cat churu
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <rect x={8 * s} y={4 * s} width={16 * s} height={22 * s} rx={3 * s} fill={t.primary} />
        <rect x={10 * s} y={4 * s} width={12 * s} height={22 * s} rx={2 * s} fill={t.secondary} />
        <line x1={10 * s} y1={10 * s} x2={22 * s} y2={10 * s} stroke={t.accent} strokeWidth={0.8 * s} />
        <line x1={10 * s} y1={16 * s} x2={22 * s} y2={16 * s} stroke={t.accent} strokeWidth={0.8 * s} />
        <rect x={12 * s} y={2 * s} width={8 * s} height={4 * s} rx={1.5 * s} fill={t.accent} />
        <path d={`M${14 * s},${26 * s} Q${16 * s},${30 * s} ${18 * s},${26 * s}`} fill="#FFD5A0" />
        <text x={16 * s} y={14 * s} textAnchor="middle" fontSize={5 * s} fill={t.face} fontWeight="bold">츄르</text>
      </svg>
    );
  }

  if (skin === "pig") {
    // Pig treat - apple-shaped snack
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <circle cx={16 * s} cy={16 * s} r={10 * s} fill={t.primary} />
        <circle cx={16 * s} cy={16 * s} r={7 * s} fill={t.secondary} />
        <ellipse cx={14 * s} cy={12 * s} rx={3 * s} ry={2 * s} fill="white" opacity="0.4" />
        <rect x={15 * s} y={4 * s} width={2 * s} height={5 * s} rx={1 * s} fill="#8B5540" />
        <ellipse cx={19 * s} cy={6 * s} rx={2.5 * s} ry={1.5 * s} fill="#81C784" transform={`rotate(25,${19 * s},${6 * s})`} />
        <text x={16 * s} y={19 * s} textAnchor="middle" fontSize={4.5 * s} fill={t.face} fontWeight="bold">간식</text>
      </svg>
    );
  }

  if (skin === "dog") {
    // Dog treat - bone shape
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <rect x={10 * s} y={13 * s} width={12 * s} height={6 * s} rx={2 * s} fill={t.primary} />
        <circle cx={9 * s} cy={13 * s} r={3.5 * s} fill={t.secondary} />
        <circle cx={9 * s} cy={19 * s} r={3.5 * s} fill={t.secondary} />
        <circle cx={23 * s} cy={13 * s} r={3.5 * s} fill={t.secondary} />
        <circle cx={23 * s} cy={19 * s} r={3.5 * s} fill={t.secondary} />
        <ellipse cx={16 * s} cy={16 * s} rx={5 * s} ry={2 * s} fill={t.accent} opacity="0.2" />
        <text x={16 * s} y={18 * s} textAnchor="middle" fontSize={4 * s} fill={t.face} fontWeight="bold">간식</text>
      </svg>
    );
  }

  if (skin === "fox") {
    // Fox treat - berry
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <circle cx={16 * s} cy={17 * s} r={9 * s} fill={t.primary} />
        <circle cx={16 * s} cy={17 * s} r={6 * s} fill={t.secondary} opacity="0.5" />
        <ellipse cx={13 * s} cy={14 * s} rx={2.5 * s} ry={1.5 * s} fill="white" opacity="0.35" />
        {[0, 60, 120, 180, 240, 300].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return <circle key={i} cx={16 * s + Math.cos(rad) * 5 * s} cy={17 * s + Math.sin(rad) * 5 * s} r={2.5 * s} fill={t.accent} opacity="0.5" />;
        })}
        <path d={`M${14 * s},${7 * s} Q${16 * s},${4 * s} ${18 * s},${7 * s}`} fill="#66BB6A" />
        <rect x={15.5 * s} y={5 * s} width={1 * s} height={4 * s} fill="#4CAF50" />
        <text x={16 * s} y={20 * s} textAnchor="middle" fontSize={4 * s} fill="white" fontWeight="bold">간식</text>
      </svg>
    );
  }

  if (skin === "rabbit") {
    // Rabbit treat - carrot
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <polygon points={`${16 * s},${28 * s} ${10 * s},${10 * s} ${22 * s},${10 * s}`} fill="#FF8C42" />
        <polygon points={`${16 * s},${28 * s} ${12 * s},${12 * s} ${20 * s},${12 * s}`} fill="#FFA060" opacity="0.6" />
        <line x1={13 * s} y1={16 * s} x2={19 * s} y2={16 * s} stroke="#E57020" strokeWidth={0.6 * s} opacity="0.5" />
        <line x1={14 * s} y1={20 * s} x2={18 * s} y2={20 * s} stroke="#E57020" strokeWidth={0.6 * s} opacity="0.5" />
        <path d={`M${14 * s},${10 * s} Q${12 * s},${3 * s} ${10 * s},${4 * s}`} stroke="#4CAF50" strokeWidth={2 * s} fill="none" strokeLinecap="round" />
        <path d={`M${16 * s},${10 * s} Q${16 * s},${3 * s} ${16 * s},${3 * s}`} stroke="#66BB6A" strokeWidth={2 * s} fill="none" strokeLinecap="round" />
        <path d={`M${18 * s},${10 * s} Q${20 * s},${3 * s} ${22 * s},${4 * s}`} stroke="#81C784" strokeWidth={2 * s} fill="none" strokeLinecap="round" />
        <text x={16 * s} y={18 * s} textAnchor="middle" fontSize={3.5 * s} fill="white" fontWeight="bold">당근</text>
      </svg>
    );
  }

  if (skin === "bear") {
    // Bear treat - honey pot
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <ellipse cx={16 * s} cy={20 * s} rx={10 * s} ry={9 * s} fill={t.primary} />
        <ellipse cx={16 * s} cy={20 * s} rx={7 * s} ry={6 * s} fill={t.secondary} opacity="0.5" />
        <rect x={11 * s} y={10 * s} width={10 * s} height={5 * s} rx={1 * s} fill={t.accent} />
        <rect x={14 * s} y={7 * s} width={4 * s} height={5 * s} rx={2 * s} fill="#8B6914" />
        <path d={`M${12 * s},${15 * s} Q${16 * s},${18 * s} ${20 * s},${15 * s}`} fill="#FFD700" opacity="0.7" />
        <text x={16 * s} y={23 * s} textAnchor="middle" fontSize={4.5 * s} fill={t.face} fontWeight="bold">꿀</text>
      </svg>
    );
  }

  // Default fallback
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect x={8 * s} y={4 * s} width={16 * s} height={22 * s} rx={3 * s} fill={t.primary} />
      <rect x={10 * s} y={4 * s} width={12 * s} height={22 * s} rx={2 * s} fill={t.secondary} />
      <rect x={12 * s} y={2 * s} width={8 * s} height={4 * s} rx={1.5 * s} fill={t.accent} />
      <text x={16 * s} y={14 * s} textAnchor="middle" fontSize={5 * s} fill={t.face} fontWeight="bold">간식</text>
    </svg>
  );
}

// ─── Catnip/Grass item icon (skin-aware) ───
export function CatnipIcon({ size = 32, skin = "cat" as BlockSkin }: { size?: number; skin?: BlockSkin }) {
  const s = size / 32;
  const t = SKIN_ITEM_THEME[skin] || SKIN_ITEM_THEME.cat;

  // All skins use the same grass icon but tinted by animal color
  const leafMain = skin === "cat" ? "#4CAF50" : skin === "bear" ? "#558B2F" : "#4CAF50";
  const leafLight = skin === "cat" ? "#81C784" : skin === "bear" ? "#7CB342" : "#81C784";
  const leafMid = skin === "cat" ? "#66BB6A" : skin === "bear" ? "#689F38" : "#66BB6A";

  // Add a small animal face peeking from the grass for non-cat skins
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      {/* Stem */}
      <path d={`M${16 * s},${28 * s} Q${14 * s},${20 * s} ${16 * s},${12 * s}`} stroke={leafMain} strokeWidth={2 * s} fill="none" />
      {/* Left leaf */}
      <path d={`M${16 * s},${18 * s} Q${8 * s},${14 * s} ${6 * s},${8 * s} Q${12 * s},${10 * s} ${16 * s},${18 * s}`} fill={leafMid} />
      {/* Right leaf */}
      <path d={`M${16 * s},${14 * s} Q${24 * s},${10 * s} ${26 * s},${4 * s} Q${20 * s},${6 * s} ${16 * s},${14 * s}`} fill={leafLight} />
      {/* Center leaf */}
      <path d={`M${16 * s},${12 * s} Q${13 * s},${4 * s} ${16 * s},${2 * s} Q${19 * s},${4 * s} ${16 * s},${12 * s}`} fill={leafMain} />
      {/* Sparkles */}
      <circle cx={10 * s} cy={6 * s} r={1 * s} fill="#C8E6C9" />
      <circle cx={22 * s} cy={8 * s} r={0.8 * s} fill="#C8E6C9" />
      {/* Animal paw mark at bottom for non-cat */}
      {skin !== "cat" && (
        <g transform={`translate(${10 * s},${22 * s}) scale(${s * 0.35})`}>
          <ellipse cx="12" cy="17" rx="5" ry="4" fill={t.primary} opacity="0.7" />
          <circle cx="7" cy="10" r="2.5" fill={t.primary} opacity="0.7" />
          <circle cx="17" cy="10" r="2.5" fill={t.primary} opacity="0.7" />
          <circle cx="10" cy="7" r="2.2" fill={t.primary} opacity="0.7" />
          <circle cx="14" cy="7" r="2.2" fill={t.primary} opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

// ─── Knead/Paw item icon (skin-aware) ───
export function KneadIcon({ size = 32, skin = "cat" as BlockSkin }: { size?: number; skin?: BlockSkin }) {
  const s = size / 32;
  const t = SKIN_ITEM_THEME[skin] || SKIN_ITEM_THEME.cat;

  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      {/* Left paw */}
      <g transform={`translate(${3 * s}, ${4 * s}) scale(${s * 0.6})`}>
        <ellipse cx="12" cy="17" rx="5" ry="4" fill={t.pawColor1} />
        <circle cx="7" cy="10" r="2.5" fill={t.pawColor1} />
        <circle cx="17" cy="10" r="2.5" fill={t.pawColor1} />
        <circle cx="10" cy="7" r="2.2" fill={t.pawColor1} />
        <circle cx="14" cy="7" r="2.2" fill={t.pawColor1} />
      </g>
      {/* Right paw */}
      <g transform={`translate(${14 * s}, ${12 * s}) scale(${s * 0.6})`}>
        <ellipse cx="12" cy="17" rx="5" ry="4" fill={t.pawColor2} />
        <circle cx="7" cy="10" r="2.5" fill={t.pawColor2} />
        <circle cx="17" cy="10" r="2.5" fill={t.pawColor2} />
        <circle cx="10" cy="7" r="2.2" fill={t.pawColor2} />
        <circle cx="14" cy="7" r="2.2" fill={t.pawColor2} />
      </g>
      {/* Animal emoji watermark for non-cat */}
      {skin !== "cat" && (
        <text x={26 * s} y={8 * s} fontSize={6 * s} textAnchor="middle" opacity="0.6">
          {SKIN_ITEM_THEME[skin].emoji}
        </text>
      )}
    </svg>
  );
}
