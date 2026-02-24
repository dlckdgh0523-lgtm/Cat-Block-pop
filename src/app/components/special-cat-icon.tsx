import React from "react";

// Unique breed-based special cat icons with distinctive visual features
// Each breed has its own body shape, colors, face structure, and accessories

interface BreedDef {
  body: string;       // main body color
  dark: string;       // shadow/ear color
  light: string;      // highlight
  face: string;       // face feature color
  accent?: string;    // special accent color
}

const BREED_COLORS: Record<string, BreedDef> = {
  // Pirates & Adventure
  eyepatch:    { body: "#444", dark: "#2a2a2a", light: "#666", face: "#eee" },             // black cat
  pirate_hat:  { body: "#FF9F43", dark: "#E58A2F", light: "#FFBf76", face: "#7A4A1A" },    // orange
  // Elegant & Mystical
  bandana:     { body: "#E8D5B7", dark: "#D4BC96", light: "#F5EBD9", face: "#5C4A32", accent: "#E8739A" }, // siamese rebel
  crown:       { body: "#F0EDE8", dark: "#D5D0C8", light: "#FAFAF8", face: "#6B5E50", accent: "#FFD700" }, // white persian
  angel:       { body: "#F5F0FF", dark: "#E0D8F0", light: "#FFF", face: "#7A6A8A", accent: "#FFD700" },    // white angora
  rainbow:     { body: "#FFB5C2", dark: "#E8939F", light: "#FFD4DC", face: "#8B4560" },    // magical
  // Cool & Sporty
  sunglasses:  { body: "#A4B0BE", dark: "#8395A7", light: "#C8D1DA", face: "#4A5568" },    // gray british
  headphones:  { body: "#E8D5B7", dark: "#D4BC96", light: "#F5EBD9", face: "#5C4A32" },    // siamese DJ
  ninja:       { body: "#333", dark: "#1a1a1a", light: "#555", face: "#ddd" },              // bombay
  // Cute & Sweet
  churu:       { body: "#FF9F43", dark: "#E58A2F", light: "#FFBf76", face: "#7A4A1A" },    // scottish fold
  ribbon:      { body: "#FFB5C2", dark: "#E8939F", light: "#FFD4DC", face: "#7A3050" },    // pink persian
  flower:      { body: "#E8D5B7", dark: "#D4BC96", light: "#F5EBD9", face: "#5C4A32" },    // ragdoll
  bowtie:      { body: "#F0EDE8", dark: "#D5D0C8", light: "#FAFAF8", face: "#6B5E50" },    // turkish angora
  // Mysterious & Dark
  wizard_hat:  { body: "#555", dark: "#3D3D3D", light: "#777", face: "#EEEEEE" },          // black sphynx
  devil:       { body: "#444", dark: "#2a2a2a", light: "#666", face: "#ddd" },              // black bombay
  // Warm & Cozy
  scarf:       { body: "#B0A8B8", dark: "#908898", light: "#D0C8D8", face: "#4A3A5A" },    // russian blue
  santa_hat:   { body: "#FF9F43", dark: "#E58A2F", light: "#FFBf76", face: "#7A4A1A" },    // maine coon
  chef_hat:    { body: "#FF7B7B", dark: "#E55A5A", light: "#FFA8A8", face: "#7A2A2A" },    // exotic shorthair
  monocle:     { body: "#8898A8", dark: "#6878A0", light: "#A8B8C8", face: "#2A3A50" },    // chartreux
  spacesuit:   { body: "#DEB8A0", dark: "#C09880", light: "#FFD8C0", face: "#5A3020" },    // bengal
};

export function SpecialCatIcon({ catType, accessory, size }: { catType: number; accessory: string; size: number }) {
  const breed = BREED_COLORS[accessory] || BREED_COLORS.churu;
  const s = size / 40;
  const cx = size / 2, cy = size / 2;
  const r = size * 0.22;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {/* Base block */}
      <rect x={1} y={2.5} width={size - 2} height={size - 2} rx={r} fill={breed.dark} opacity="0.45" />
      <rect x={1} y={1} width={size - 2} height={size - 3} rx={r} fill={breed.body}
        stroke={breed.dark} strokeWidth={0.8} strokeOpacity={0.2} />
      <rect x={3} y={2} width={size - 6} height={(size - 4) * 0.35} rx={r - 1} fill={breed.light} opacity="0.7" />
      {/* Breed-specific design */}
      <BreedDesign accessory={accessory} cx={cx} cy={cy} s={s} breed={breed} size={size} />
    </svg>
  );
}

function BreedDesign({ accessory, cx, cy, s, breed, size }: {
  accessory: string; cx: number; cy: number; s: number; breed: BreedDef; size: number;
}) {
  const fc = breed.face;
  const eyeY = cy + 0.5 * s;
  const mouthY = cy + 7 * s;
  const sw = 1.8 * s;

  switch (accessory) {
    // ─── Persian (Crown/Royal) ───
    case "crown":
      return (
        <g>
          {/* Fluffy round face shape */}
          <ellipse cx={cx} cy={cy + 3 * s} rx={14 * s} ry={12 * s} fill={breed.body} opacity="0.3" />
          {/* Small round ears */}
          <circle cx={cx - 9 * s} cy={2 * s} r={4 * s} fill={breed.dark} opacity="0.5" />
          <circle cx={cx + 9 * s} cy={2 * s} r={4 * s} fill={breed.dark} opacity="0.5" />
          {/* Flat persian face - big round eyes */}
          <circle cx={cx - 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx + 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5 * s} cy={eyeY + 0.5 * s} r={2.5 * s} fill="#D4A030" />
          <circle cx={cx + 5 * s} cy={eyeY + 0.5 * s} r={2.5 * s} fill="#D4A030" />
          <circle cx={cx - 4 * s} cy={eyeY - 0.5 * s} r={1 * s} fill="white" />
          <circle cx={cx + 4 * s} cy={eyeY - 0.5 * s} r={1 * s} fill="white" />
          {/* Flat nose */}
          <ellipse cx={cx} cy={mouthY - 2 * s} rx={2 * s} ry={1.2 * s} fill="#FFB5C2" opacity="0.8" />
          <path d={`M${cx - 2 * s},${mouthY} Q${cx},${mouthY + 2 * s} ${cx + 2 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.5} fill="none" strokeLinecap="round" />
          {/* Crown */}
          <polygon points={`${cx - 8 * s},${-1 * s} ${cx - 6 * s},${-7 * s} ${cx - 3 * s},${-3 * s} ${cx},${-9 * s} ${cx + 3 * s},${-3 * s} ${cx + 6 * s},${-7 * s} ${cx + 8 * s},${-1 * s}`}
            fill="#FFD700" stroke="#E5A800" strokeWidth={0.4 * s} />
          <circle cx={cx} cy={-7 * s} r={1 * s} fill="#FF4444" />
          <circle cx={cx - 5 * s} cy={-5 * s} r={0.7 * s} fill="#4488FF" />
          <circle cx={cx + 5 * s} cy={-5 * s} r={0.7 * s} fill="#44CC44" />
          <circle cx={cx - 7 * s} cy={eyeY + 5 * s} r={2 * s} fill="#FFB5C2" opacity="0.3" />
          <circle cx={cx + 7 * s} cy={eyeY + 5 * s} r={2 * s} fill="#FFB5C2" opacity="0.3" />
        </g>
      );

    // ─── Scottish Fold (Churu) ───
    case "churu":
      return (
        <g>
          {/* Folded ears! */}
          <ellipse cx={cx - 8 * s} cy={4 * s} rx={5 * s} ry={3.5 * s} fill={breed.dark} opacity="0.6" />
          <ellipse cx={cx + 8 * s} cy={4 * s} rx={5 * s} ry={3.5 * s} fill={breed.dark} opacity="0.6" />
          {/* Round face */}
          <path d={`M${cx - 5.5 * s - 3 * s},${eyeY + 1 * s} Q${cx - 5.5 * s},${eyeY - 4 * s} ${cx - 5.5 * s + 3 * s},${eyeY + 1 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d={`M${cx + 5.5 * s - 3 * s},${eyeY + 1 * s} Q${cx + 5.5 * s},${eyeY - 4 * s} ${cx + 5.5 * s + 3 * s},${eyeY + 1 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <polygon points={`${cx},${mouthY - 2.5 * s} ${cx - 1.5 * s},${mouthY - 0.5 * s} ${cx + 1.5 * s},${mouthY - 0.5 * s}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 1 * s} Q${cx},${mouthY + 4 * s} ${cx + 3 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" />
          {/* Churu stick */}
          <rect x={cx + 6 * s} y={mouthY - 1 * s} width={10 * s} height={2.5 * s} rx={1.2 * s} fill="#FFC107" />
          <rect x={cx + 6 * s} y={mouthY - 0.5 * s} width={4 * s} height={1.5 * s} rx={0.8 * s} fill="#FF9800" />
          <circle cx={cx - 7 * s} cy={eyeY + 5 * s} r={2 * s} fill="#FF8FAA" opacity="0.3" />
          <circle cx={cx + 5 * s} cy={eyeY + 5 * s} r={2 * s} fill="#FF8FAA" opacity="0.3" />
        </g>
      );

    // ─── Sphynx (Wizard) ───
    case "wizard_hat":
      return (
        <g>
          {/* Big pointy ears (sphynx) */}
          <polygon points={`${cx - 14 * s},${6 * s} ${cx - 8 * s},${-5 * s} ${cx - 2 * s},${6 * s}`} fill={breed.dark} opacity="0.5" />
          <polygon points={`${cx + 2 * s},${6 * s} ${cx + 8 * s},${-5 * s} ${cx + 14 * s},${6 * s}`} fill={breed.dark} opacity="0.5" />
          {/* Inner ears (visible pink) */}
          <polygon points={`${cx - 12 * s},${5.5 * s} ${cx - 8 * s},${-2 * s} ${cx - 4 * s},${5.5 * s}`} fill="#FFB5C2" opacity="0.5" />
          <polygon points={`${cx + 4 * s},${5.5 * s} ${cx + 8 * s},${-2 * s} ${cx + 12 * s},${5.5 * s}`} fill="#FFB5C2" opacity="0.5" />
          {/* Big almond eyes (sphynx) */}
          <ellipse cx={cx - 5.5 * s} cy={eyeY} rx={4 * s} ry={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <ellipse cx={cx + 5.5 * s} cy={eyeY} rx={4 * s} ry={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <ellipse cx={cx - 5.5 * s} cy={eyeY} rx={2 * s} ry={2.5 * s} fill="#8BC34A" />
          <ellipse cx={cx + 5.5 * s} cy={eyeY} rx={2 * s} ry={2.5 * s} fill="#8BC34A" />
          <circle cx={cx - 5 * s} cy={eyeY - 0.5 * s} r={0.8 * s} fill="white" />
          <circle cx={cx + 5 * s} cy={eyeY - 0.5 * s} r={0.8 * s} fill="white" />
          {/* Wrinkle lines on forehead */}
          <path d={`M${cx - 6 * s},${cy - 6 * s} Q${cx},${cy - 8 * s} ${cx + 6 * s},${cy - 6 * s}`} stroke={fc} strokeWidth={0.4 * s} fill="none" opacity="0.3" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 2 * s},${mouthY + 0.5 * s} L${cx},${mouthY + 2 * s} L${cx + 2 * s},${mouthY + 0.5 * s}`} stroke={fc} strokeWidth={sw * 0.5} fill="none" strokeLinecap="round" />
          {/* Wizard hat */}
          <polygon points={`${cx},${-14 * s} ${cx - 10 * s},${2 * s} ${cx + 10 * s},${2 * s}`} fill="#4B0082" opacity="0.85" />
          <ellipse cx={cx} cy={2 * s} rx={11 * s} ry={2.5 * s} fill="#4B0082" opacity="0.7" />
          <circle cx={cx + 2 * s} cy={-5 * s} r={1 * s} fill="#FFD700" />
          <circle cx={cx - 2 * s} cy={-9 * s} r={0.7 * s} fill="#FFD700" />
        </g>
      );

    // ─── British Shorthair (Sunglasses) ───
    case "sunglasses":
      return (
        <g>
          {/* Rounded small ears */}
          <ellipse cx={cx - 10 * s} cy={2 * s} rx={5 * s} ry={4 * s} fill={breed.dark} opacity="0.5" />
          <ellipse cx={cx + 10 * s} cy={2 * s} rx={5 * s} ry={4 * s} fill={breed.dark} opacity="0.5" />
          {/* Chubby cheeks */}
          <ellipse cx={cx} cy={cy + 3 * s} rx={13 * s} ry={10 * s} fill={breed.body} opacity="0.2" />
          {/* Smug mouth */}
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 2 * s},${mouthY} ${cx + 2 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 4 * s},${mouthY + 1 * s} Q${cx},${mouthY + 3.5 * s} ${cx + 4 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" />
          {/* Whiskers */}
          <line x1={cx - 14 * s} y1={mouthY - 2 * s} x2={cx - 6 * s} y2={mouthY} stroke={fc} strokeWidth={sw * 0.4} opacity="0.4" strokeLinecap="round" />
          <line x1={cx + 14 * s} y1={mouthY - 2 * s} x2={cx + 6 * s} y2={mouthY} stroke={fc} strokeWidth={sw * 0.4} opacity="0.4" strokeLinecap="round" />
          {/* Sunglasses */}
          <rect x={cx - 12 * s} y={eyeY - 3 * s} rx={2 * s} width={10 * s} height={6 * s} fill="#111" opacity="0.85" />
          <rect x={cx + 2 * s} y={eyeY - 3 * s} rx={2 * s} width={10 * s} height={6 * s} fill="#111" opacity="0.85" />
          <line x1={cx - 2 * s} y1={eyeY} x2={cx + 2 * s} y2={eyeY} stroke="#333" strokeWidth={1 * s} />
          <line x1={cx - 9 * s} y1={eyeY - 1 * s} x2={cx - 6 * s} y2={eyeY + 1 * s} stroke="white" strokeWidth={0.6 * s} opacity="0.3" />
        </g>
      );

    // ─── Bombay (Ninja/Devil) ───
    case "ninja":
      return (
        <g>
          {/* Sleek ears */}
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-2 * s} ${cx - 2 * s},${5 * s}`} fill={breed.dark} opacity="0.6" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-2 * s} ${cx + 12 * s},${4 * s}`} fill={breed.dark} opacity="0.6" />
          {/* Ninja mask */}
          <rect x={cx - 14 * s} y={eyeY - 4 * s} width={28 * s} height={8 * s} rx={2 * s} fill="#111" opacity="0.8" />
          {/* Glowing eyes through mask */}
          <ellipse cx={cx - 5 * s} cy={eyeY} rx={3 * s} ry={1.5 * s} fill="#44FF88" opacity="0.9" />
          <ellipse cx={cx + 5 * s} cy={eyeY} rx={3 * s} ry={1.5 * s} fill="#44FF88" opacity="0.9" />
          <ellipse cx={cx - 5 * s} cy={eyeY} rx={1 * s} ry={1.5 * s} fill="#111" />
          <ellipse cx={cx + 5 * s} cy={eyeY} rx={1 * s} ry={1.5 * s} fill="#111" />
          {/* Nose showing below */}
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.4" />
        </g>
      );

    case "devil":
      return (
        <g>
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-1 * s} ${cx - 2 * s},${5 * s}`} fill={breed.dark} opacity="0.6" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-1 * s} ${cx + 12 * s},${4 * s}`} fill={breed.dark} opacity="0.6" />
          {/* Intense red eyes */}
          <circle cx={cx - 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx + 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5 * s} cy={eyeY} r={2 * s} fill="#FF3333" />
          <circle cx={cx + 5 * s} cy={eyeY} r={2 * s} fill="#FF3333" />
          <circle cx={cx - 4.5 * s} cy={eyeY - 0.5 * s} r={0.7 * s} fill="white" />
          <circle cx={cx + 4.5 * s} cy={eyeY - 0.5 * s} r={0.7 * s} fill="white" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 4 * s},${mouthY} Q${cx},${mouthY + 3 * s} ${cx + 4 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.5} fill="none" strokeLinecap="round" />
          {/* Devil horns */}
          <polygon points={`${cx - 10 * s},${-1 * s} ${cx - 8 * s},${-11 * s} ${cx - 5 * s},${-1 * s}`} fill="#CC0000" />
          <polygon points={`${cx + 5 * s},${-1 * s} ${cx + 8 * s},${-11 * s} ${cx + 10 * s},${-1 * s}`} fill="#CC0000" />
          {/* Tail */}
          <path d={`M${cx + 14 * s},${cy + 8 * s} Q${cx + 18 * s},${cy + 3 * s} ${cx + 16 * s},${cy - 2 * s}`} stroke="#CC0000" strokeWidth={1.5 * s} fill="none" strokeLinecap="round" />
        </g>
      );

    // ─── Ragdoll (Flower) ───
    case "flower":
      return (
        <g>
          {/* Fluffy pointed ears */}
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-2 * s} ${cx - 2 * s},${5 * s}`} fill={breed.dark} opacity="0.4" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-2 * s} ${cx + 12 * s},${4 * s}`} fill={breed.dark} opacity="0.4" />
          {/* Beautiful blue eyes (ragdoll feature!) */}
          <circle cx={cx - 5.5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx + 5.5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5.5 * s} cy={eyeY + 0.3 * s} r={2.5 * s} fill="#4A90D9" />
          <circle cx={cx + 5.5 * s} cy={eyeY + 0.3 * s} r={2.5 * s} fill="#4A90D9" />
          <circle cx={cx - 5 * s} cy={eyeY - 0.8 * s} r={1 * s} fill="white" />
          <circle cx={cx + 5 * s} cy={eyeY - 0.8 * s} r={1 * s} fill="white" />
          {/* Dark face mask (ragdoll pattern) */}
          <ellipse cx={cx} cy={mouthY - 3 * s} rx={5 * s} ry={3 * s} fill={breed.dark} opacity="0.2" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 1 * s} Q${cx},${mouthY + 3 * s} ${cx + 3 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
          {/* Flower */}
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const px = cx + 11 * s + Math.cos(rad) * 2.5 * s;
            const py = -2 * s + Math.sin(rad) * 2.5 * s;
            return <circle key={i} cx={px} cy={py} r={1.8 * s} fill="#FF69B4" opacity="0.8" />;
          })}
          <circle cx={cx + 11 * s} cy={-2 * s} r={1.2 * s} fill="#FFD700" />
          <circle cx={cx - 7 * s} cy={eyeY + 5 * s} r={2 * s} fill="#FFB5C2" opacity="0.3" />
          <circle cx={cx + 7 * s} cy={eyeY + 5 * s} r={2 * s} fill="#FFB5C2" opacity="0.3" />
        </g>
      );

    // ─── Russian Blue (Scarf) ───
    case "scarf":
      return (
        <g>
          {/* Upright elegant ears */}
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-3 * s} ${cx - 2 * s},${5 * s}`} fill={breed.dark} opacity="0.5" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-3 * s} ${cx + 12 * s},${4 * s}`} fill={breed.dark} opacity="0.5" />
          <polygon points={`${cx - 10 * s},${4 * s} ${cx - 7 * s},${0 * s} ${cx - 4 * s},${4.5 * s}`} fill="#B0A8D8" opacity="0.4" />
          <polygon points={`${cx + 4 * s},${4.5 * s} ${cx + 7 * s},${0 * s} ${cx + 10 * s},${4 * s}`} fill="#B0A8D8" opacity="0.4" />
          {/* Green eyes (russian blue feature) */}
          <circle cx={cx - 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx + 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5 * s} cy={eyeY} r={2 * s} fill="#4CAF50" />
          <circle cx={cx + 5 * s} cy={eyeY} r={2 * s} fill="#4CAF50" />
          <circle cx={cx - 4.5 * s} cy={eyeY - 0.5 * s} r={0.7 * s} fill="white" />
          <circle cx={cx + 4.5 * s} cy={eyeY - 0.5 * s} r={0.7 * s} fill="white" />
          <polygon points={`${cx},${mouthY - 2.5 * s} ${cx - 1.5 * s},${mouthY - 0.5 * s} ${cx + 1.5 * s},${mouthY - 0.5 * s}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 0.5 * s} Q${cx},${mouthY + 3 * s} ${cx + 3 * s},${mouthY + 0.5 * s}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
          {/* Scarf */}
          <path d={`M${cx - 14 * s},${cy + 10 * s} Q${cx},${cy + 13 * s} ${cx + 14 * s},${cy + 10 * s}`} fill="#CC3333" opacity="0.8" />
          <rect x={cx + 5 * s} y={cy + 11 * s} width={3.5 * s} height={7 * s} rx={1 * s} fill="#CC3333" opacity="0.7" />
          <line x1={cx - 10 * s} y1={cy + 11 * s} x2={cx + 10 * s} y2={cy + 11 * s} stroke="#AA2222" strokeWidth={0.4 * s} />
        </g>
      );

    // ─── Maine Coon (Santa) ───
    case "santa_hat":
      return (
        <g>
          {/* Tufted lynx-like ears */}
          <polygon points={`${cx - 13 * s},${4 * s} ${cx - 8 * s},${-3 * s} ${cx - 3 * s},${5 * s}`} fill={breed.dark} opacity="0.6" />
          <polygon points={`${cx + 3 * s},${5 * s} ${cx + 8 * s},${-3 * s} ${cx + 13 * s},${4 * s}`} fill={breed.dark} opacity="0.6" />
          {/* Ear tufts */}
          <line x1={cx - 8 * s} y1={-3 * s} x2={cx - 9 * s} y2={-6 * s} stroke={breed.dark} strokeWidth={1.2 * s} strokeLinecap="round" />
          <line x1={cx + 8 * s} y1={-3 * s} x2={cx + 9 * s} y2={-6 * s} stroke={breed.dark} strokeWidth={1.2 * s} strokeLinecap="round" />
          {/* Mane/ruff */}
          <ellipse cx={cx} cy={cy + 6 * s} rx={15 * s} ry={12 * s} fill={breed.light} opacity="0.3" />
          {/* Face */}
          <path d={`M${cx - 5.5 * s - 3 * s},${eyeY + 1 * s} Q${cx - 5.5 * s},${eyeY - 4 * s} ${cx - 5.5 * s + 3 * s},${eyeY + 1 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d={`M${cx + 5.5 * s - 3 * s},${eyeY + 1 * s} Q${cx + 5.5 * s},${eyeY - 4 * s} ${cx + 5.5 * s + 3 * s},${eyeY + 1 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 4 * s},${mouthY + 1 * s} Q${cx},${mouthY + 4 * s} ${cx + 4 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" />
          {/* Santa hat */}
          <path d={`M${cx - 10 * s},${2 * s} Q${cx},${-14 * s} ${cx + 12 * s},${-8 * s}`} fill="#CC0000" />
          <polygon points={`${cx - 12 * s},${2 * s} ${cx - 10 * s},${-2 * s} ${cx + 12 * s},${-2 * s} ${cx + 14 * s},${2 * s}`} fill="#CC0000" />
          <rect x={cx - 13 * s} y={0} width={27 * s} height={3 * s} rx={1.5 * s} fill="white" opacity="0.9" />
          <circle cx={cx + 12 * s} cy={-8 * s} r={2.5 * s} fill="white" />
          <line x1={cx - 14 * s} y1={mouthY - 3 * s} x2={cx - 7 * s} y2={mouthY - 1 * s} stroke={fc} strokeWidth={sw * 0.4} opacity="0.35" strokeLinecap="round" />
          <line x1={cx + 14 * s} y1={mouthY - 3 * s} x2={cx + 7 * s} y2={mouthY - 1 * s} stroke={fc} strokeWidth={sw * 0.4} opacity="0.35" strokeLinecap="round" />
        </g>
      );

    // ─── Exotic Shorthair (Chef) ───
    case "chef_hat":
      return (
        <g>
          {/* Small round ears */}
          <circle cx={cx - 9 * s} cy={2 * s} r={4 * s} fill={breed.dark} opacity="0.5" />
          <circle cx={cx + 9 * s} cy={2 * s} r={4 * s} fill={breed.dark} opacity="0.5" />
          {/* Flat face, big round eyes */}
          <circle cx={cx - 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx + 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5 * s} cy={eyeY + 0.5 * s} r={2.5 * s} fill="#D4800A" />
          <circle cx={cx + 5 * s} cy={eyeY + 0.5 * s} r={2.5 * s} fill="#D4800A" />
          <circle cx={cx - 4.5 * s} cy={eyeY - 0.5 * s} r={1 * s} fill="white" />
          <circle cx={cx + 4.5 * s} cy={eyeY - 0.5 * s} r={1 * s} fill="white" />
          <ellipse cx={cx} cy={mouthY - 2 * s} rx={2.5 * s} ry={1.5 * s} fill="#FFB5C2" opacity="0.7" />
          <path d={`M${cx - 2 * s},${mouthY} Q${cx},${mouthY + 2 * s} ${cx + 2 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.5} fill="none" strokeLinecap="round" />
          {/* Chef hat */}
          <rect x={cx - 7 * s} y={-1 * s} width={14 * s} height={5 * s} fill="white" stroke="#ddd" strokeWidth={0.3 * s} />
          <ellipse cx={cx - 3 * s} cy={-2 * s} rx={4.5 * s} ry={4.5 * s} fill="white" />
          <ellipse cx={cx + 3 * s} cy={-2 * s} rx={4.5 * s} ry={4.5 * s} fill="white" />
          <ellipse cx={cx} cy={-4 * s} rx={5 * s} ry={5 * s} fill="white" />
        </g>
      );

    // ─── Chartreux (Monocle/Detective) ───
    case "monocle":
      return (
        <g>
          {/* Medium ears */}
          <polygon points={`${cx - 11 * s},${4 * s} ${cx - 7 * s},${-1 * s} ${cx - 3 * s},${5 * s}`} fill={breed.dark} opacity="0.5" />
          <polygon points={`${cx + 3 * s},${5 * s} ${cx + 7 * s},${-1 * s} ${cx + 11 * s},${4 * s}`} fill={breed.dark} opacity="0.5" />
          {/* Copper/amber eyes (chartreux feature) */}
          <circle cx={cx - 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx + 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5 * s} cy={eyeY} r={2 * s} fill="#D4800A" />
          <circle cx={cx + 5 * s} cy={eyeY} r={2 * s} fill="#D4800A" />
          <circle cx={cx - 4.5 * s} cy={eyeY - 0.5 * s} r={0.7 * s} fill="white" />
          <circle cx={cx + 4.5 * s} cy={eyeY - 0.5 * s} r={0.7 * s} fill="white" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 0.5 * s} Q${cx},${mouthY + 3 * s} ${cx + 3 * s},${mouthY + 0.5 * s}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
          {/* Monocle */}
          <circle cx={cx + 5 * s} cy={eyeY} r={5 * s} fill="none" stroke="#B8860B" strokeWidth={1 * s} />
          <line x1={cx + 5 * s} y1={eyeY + 5 * s} x2={cx + 5 * s} y2={cy + 14 * s} stroke="#B8860B" strokeWidth={0.6 * s} />
        </g>
      );

    // ─── Bengal (Spacesuit) ───
    case "spacesuit":
      return (
        <g>
          {/* Rounded ears */}
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-1 * s} ${cx - 2 * s},${5 * s}`} fill={breed.dark} opacity="0.5" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-1 * s} ${cx + 12 * s},${4 * s}`} fill={breed.dark} opacity="0.5" />
          {/* Wild green eyes */}
          <ellipse cx={cx - 5 * s} cy={eyeY} rx={3.5 * s} ry={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <ellipse cx={cx + 5 * s} cy={eyeY} rx={3.5 * s} ry={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <ellipse cx={cx - 5 * s} cy={eyeY} rx={1.5 * s} ry={2.5 * s} fill="#4CAF50" />
          <ellipse cx={cx + 5 * s} cy={eyeY} rx={1.5 * s} ry={2.5 * s} fill="#4CAF50" />
          {/* Bengal spots */}
          <circle cx={cx - 10 * s} cy={cy + 3 * s} r={1.5 * s} fill={breed.dark} opacity="0.25" />
          <circle cx={cx + 8 * s} cy={cy + 5 * s} r={1.2 * s} fill={breed.dark} opacity="0.2" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 0.5 * s} Q${cx},${mouthY + 2.5 * s} ${cx + 3 * s},${mouthY + 0.5 * s}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
          {/* Space helmet */}
          <circle cx={cx} cy={cy - 1 * s} r={14 * s} fill="none" stroke="rgba(200,200,255,0.5)" strokeWidth={1.5 * s} />
          <path d={`M${cx - 7 * s},${cy - 10 * s} Q${cx - 3 * s},${cy - 14 * s} ${cx + 1 * s},${cy - 10 * s}`} stroke="white" strokeWidth={0.7 * s} fill="none" opacity="0.3" />
          <line x1={cx} y1={cy - 15 * s} x2={cx} y2={cy - 19 * s} stroke="#ddd" strokeWidth={0.7 * s} />
          <circle cx={cx} cy={cy - 19 * s} r={1.2 * s} fill="#FF4444" />
        </g>
      );

    // ─── Turkish Angora (Bowtie) ───
    case "bowtie":
      return (
        <g>
          {/* Elegant pointed ears */}
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-2 * s} ${cx - 2 * s},${5 * s}`} fill={breed.dark} opacity="0.4" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-2 * s} ${cx + 12 * s},${4 * s}`} fill={breed.dark} opacity="0.4" />
          {/* Odd-eyed (heterochromia - angora feature!) */}
          <circle cx={cx - 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx + 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5 * s} cy={eyeY + 0.3 * s} r={2 * s} fill="#4A90D9" />
          <circle cx={cx + 5 * s} cy={eyeY + 0.3 * s} r={2 * s} fill="#D4A030" />
          <circle cx={cx - 4.5 * s} cy={eyeY - 0.5 * s} r={0.7 * s} fill="white" />
          <circle cx={cx + 4.5 * s} cy={eyeY - 0.5 * s} r={0.7 * s} fill="white" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 0.5 * s} Q${cx},${mouthY + 3 * s} ${cx + 3 * s},${mouthY + 0.5 * s}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
          {/* Bowtie */}
          <polygon points={`${cx},${cy + 12 * s} ${cx - 6 * s},${cy + 9 * s} ${cx - 6 * s},${cy + 15 * s}`} fill="#E8739A" />
          <polygon points={`${cx},${cy + 12 * s} ${cx + 6 * s},${cy + 9 * s} ${cx + 6 * s},${cy + 15 * s}`} fill="#E8739A" />
          <circle cx={cx} cy={cy + 12 * s} r={1.5 * s} fill="#D06080" />
        </g>
      );

    // ─── Siamese (Rebel/Bandana) ───
    case "bandana":
      return (
        <g>
          {/* Large elegant ears */}
          <polygon points={`${cx - 13 * s},${4 * s} ${cx - 8 * s},${-3 * s} ${cx - 3 * s},${5 * s}`} fill={breed.dark} opacity="0.6" />
          <polygon points={`${cx + 3 * s},${5 * s} ${cx + 8 * s},${-3 * s} ${cx + 13 * s},${4 * s}`} fill={breed.dark} opacity="0.6" />
          {/* Striking blue eyes (siamese!) */}
          <ellipse cx={cx - 5.5 * s} cy={eyeY} rx={3.5 * s} ry={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <ellipse cx={cx + 5.5 * s} cy={eyeY} rx={3.5 * s} ry={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <ellipse cx={cx - 5 * s} cy={eyeY} rx={2 * s} ry={2.5 * s} fill="#2196F3" />
          <ellipse cx={cx + 5 * s} cy={eyeY} rx={2 * s} ry={2.5 * s} fill="#2196F3" />
          <circle cx={cx - 4.5 * s} cy={eyeY - 0.8 * s} r={0.8 * s} fill="white" />
          <circle cx={cx + 4.5 * s} cy={eyeY - 0.8 * s} r={0.8 * s} fill="white" />
          {/* Dark mask on face (siamese pattern) */}
          <ellipse cx={cx} cy={mouthY - 1 * s} rx={6 * s} ry={4 * s} fill={breed.dark} opacity="0.15" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 0.5 * s} Q${cx + 1 * s},${mouthY + 3 * s} ${cx + 4 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
          {/* Bandana */}
          <path d={`M${cx - 14 * s},${cy - 5 * s} Q${cx},${cy - 8 * s} ${cx + 14 * s},${cy - 5 * s}`} fill="#E8739A" opacity="0.8" />
          <circle cx={cx + 10 * s} cy={cy - 4 * s} r={1.2 * s} fill="#FFD700" />
        </g>
      );

    // ─── Black Pirate / Eyepatch ───
    case "eyepatch":
      return (
        <g>
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-1 * s} ${cx - 2 * s},${5 * s}`} fill={breed.dark} opacity="0.5" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-1 * s} ${cx + 12 * s},${4 * s}`} fill={breed.dark} opacity="0.5" />
          {/* One visible eye */}
          <circle cx={cx - 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5 * s} cy={eyeY + 0.3 * s} r={2 * s} fill="#FFD700" />
          <circle cx={cx - 4.5 * s} cy={eyeY - 0.5 * s} r={0.8 * s} fill="white" />
          {/* Eyepatch */}
          <line x1={cx - 12 * s} y1={cy - 4 * s} x2={cx + 12 * s} y2={cy - 4 * s} stroke="#222" strokeWidth={1 * s} />
          <ellipse cx={cx + 5.5 * s} cy={eyeY} rx={4.5 * s} ry={3.5 * s} fill="#222" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 0.5 * s} Q${cx + 1 * s},${mouthY + 3 * s} ${cx + 4 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
          <line x1={cx - 14 * s} y1={mouthY - 2 * s} x2={cx - 6 * s} y2={mouthY} stroke={fc} strokeWidth={sw * 0.4} opacity="0.4" strokeLinecap="round" />
          <line x1={cx + 14 * s} y1={mouthY - 2 * s} x2={cx + 6 * s} y2={mouthY} stroke={fc} strokeWidth={sw * 0.4} opacity="0.4" strokeLinecap="round" />
        </g>
      );

    // ─── Pirate Hat (Adventurer orange) ───
    case "pirate_hat":
      return (
        <g>
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-1 * s} ${cx - 2 * s},${5 * s}`} fill={breed.dark} opacity="0.5" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-1 * s} ${cx + 12 * s},${4 * s}`} fill={breed.dark} opacity="0.5" />
          <path d={`M${cx - 5.5 * s - 3 * s},${eyeY + 1 * s} Q${cx - 5.5 * s},${eyeY - 4 * s} ${cx - 5.5 * s + 3 * s},${eyeY + 1 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d={`M${cx + 5.5 * s - 3 * s},${eyeY + 1 * s} Q${cx + 5.5 * s},${eyeY - 4 * s} ${cx + 5.5 * s + 3 * s},${eyeY + 1 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 1 * s} Q${cx},${mouthY + 4 * s} ${cx + 3 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" />
          {/* Pirate hat */}
          <ellipse cx={cx} cy={1 * s} rx={13 * s} ry={3.5 * s} fill="#222" />
          <path d={`M${cx - 11 * s},${1 * s} Q${cx - 7 * s},${-10 * s} ${cx},${-8 * s} Q${cx + 7 * s},${-10 * s} ${cx + 11 * s},${1 * s}`} fill="#333" />
          <circle cx={cx} cy={-4 * s} r={2 * s} fill="white" />
          <circle cx={cx - 0.8 * s} cy={-4.5 * s} r={0.4 * s} fill="#333" />
          <circle cx={cx + 0.8 * s} cy={-4.5 * s} r={0.4 * s} fill="#333" />
          <line x1={cx - 1.5 * s} y1={-2.5 * s} x2={cx + 1.5 * s} y2={-2.5 * s} stroke="#333" strokeWidth={0.3 * s} />
        </g>
      );

    // ─── Pink Persian (Ribbon) ───
    case "ribbon":
      return (
        <g>
          <circle cx={cx - 9 * s} cy={2 * s} r={4 * s} fill={breed.dark} opacity="0.4" />
          <circle cx={cx + 9 * s} cy={2 * s} r={4 * s} fill={breed.dark} opacity="0.4" />
          <ellipse cx={cx} cy={cy + 3 * s} rx={14 * s} ry={10 * s} fill={breed.body} opacity="0.2" />
          {/* Cute round eyes */}
          <circle cx={cx - 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx + 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5 * s} cy={eyeY + 0.5 * s} r={2.5 * s} fill="#E8739A" />
          <circle cx={cx + 5 * s} cy={eyeY + 0.5 * s} r={2.5 * s} fill="#E8739A" />
          <circle cx={cx - 4.5 * s} cy={eyeY - 0.5 * s} r={1 * s} fill="white" />
          <circle cx={cx + 4.5 * s} cy={eyeY - 0.5 * s} r={1 * s} fill="white" />
          <ellipse cx={cx} cy={mouthY - 2 * s} rx={2 * s} ry={1.2 * s} fill="#FFB5C2" opacity="0.8" />
          <path d={`M${cx - 2 * s},${mouthY} Q${cx},${mouthY + 2 * s} ${cx + 2 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.5} fill="none" strokeLinecap="round" />
          {/* Ribbon */}
          <circle cx={cx + 8 * s} cy={-1 * s} r={2.5 * s} fill="#FF1493" />
          <polygon points={`${cx + 5.5 * s},${-1 * s} ${cx + 3 * s},${-4 * s} ${cx + 5 * s},${-2.5 * s}`} fill="#FF1493" />
          <polygon points={`${cx + 10.5 * s},${-1 * s} ${cx + 13 * s},${-4 * s} ${cx + 11 * s},${-2.5 * s}`} fill="#FF1493" />
          <circle cx={cx + 8 * s} cy={-1 * s} r={1.2 * s} fill="#FF69B4" />
          <circle cx={cx - 7 * s} cy={eyeY + 5 * s} r={2 * s} fill="#FF8FAA" opacity="0.3" />
          <circle cx={cx + 7 * s} cy={eyeY + 5 * s} r={2 * s} fill="#FF8FAA" opacity="0.3" />
        </g>
      );

    // ─── Angora Angel ───
    case "angel":
      return (
        <g>
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-1 * s} ${cx - 2 * s},${5 * s}`} fill={breed.dark} opacity="0.3" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-1 * s} ${cx + 12 * s},${4 * s}`} fill={breed.dark} opacity="0.3" />
          <ellipse cx={cx} cy={cy + 3 * s} rx={14 * s} ry={10 * s} fill={breed.light} opacity="0.3" />
          <circle cx={cx - 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx + 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5 * s} cy={eyeY + 0.3 * s} r={2.2 * s} fill="#4A90D9" />
          <circle cx={cx + 5 * s} cy={eyeY + 0.3 * s} r={2.2 * s} fill="#D4A030" />
          <circle cx={cx - 4.5 * s} cy={eyeY - 0.5 * s} r={0.8 * s} fill="white" />
          <circle cx={cx + 4.5 * s} cy={eyeY - 0.5 * s} r={0.8 * s} fill="white" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.4" />
          <path d={`M${cx - 3 * s},${mouthY + 0.5 * s} Q${cx},${mouthY + 3 * s} ${cx + 3 * s},${mouthY + 0.5 * s}`} stroke={fc} strokeWidth={sw * 0.5} fill="none" strokeLinecap="round" />
          {/* Halo */}
          <ellipse cx={cx} cy={-5 * s} rx={7 * s} ry={2 * s} fill="none" stroke="#FFD700" strokeWidth={1.2 * s} opacity="0.8" />
          {/* Wings */}
          <path d={`M${cx - 13 * s},${cy + 5 * s} Q${cx - 19 * s},${cy - 5 * s} ${cx - 14 * s},${cy + 10 * s}`} fill="white" opacity="0.5" />
          <path d={`M${cx + 13 * s},${cy + 5 * s} Q${cx + 19 * s},${cy - 5 * s} ${cx + 14 * s},${cy + 10 * s}`} fill="white" opacity="0.5" />
        </g>
      );

    // ─── DJ Siamese ───
    case "headphones":
      return (
        <g>
          <polygon points={`${cx - 13 * s},${4 * s} ${cx - 8 * s},${-2 * s} ${cx - 3 * s},${5 * s}`} fill={breed.dark} opacity="0.6" />
          <polygon points={`${cx + 3 * s},${5 * s} ${cx + 8 * s},${-2 * s} ${cx + 13 * s},${4 * s}`} fill={breed.dark} opacity="0.6" />
          <ellipse cx={cx - 5 * s} cy={eyeY} rx={3 * s} ry={2.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <ellipse cx={cx + 5 * s} cy={eyeY} rx={3 * s} ry={2.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <ellipse cx={cx - 5 * s} cy={eyeY} rx={1.5 * s} ry={2 * s} fill="#2196F3" />
          <ellipse cx={cx + 5 * s} cy={eyeY} rx={1.5 * s} ry={2 * s} fill="#2196F3" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 0.5 * s} Q${cx + 1 * s},${mouthY + 3 * s} ${cx + 4 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
          {/* Headphones */}
          <path d={`M${cx - 12 * s},${cy} Q${cx - 12 * s},${-7 * s} ${cx},${-7 * s} Q${cx + 12 * s},${-7 * s} ${cx + 12 * s},${cy}`} fill="none" stroke="#333" strokeWidth={2 * s} />
          <rect x={cx - 15 * s} y={cy - 3 * s} width={5 * s} height={7 * s} rx={2 * s} fill="#333" />
          <rect x={cx + 10 * s} y={cy - 3 * s} width={5 * s} height={7 * s} rx={2 * s} fill="#333" />
          <rect x={cx - 14 * s} y={cy - 2 * s} width={3 * s} height={5 * s} rx={1.5 * s} fill="#E8739A" />
          <rect x={cx + 11 * s} y={cy - 2 * s} width={3 * s} height={5 * s} rx={1.5 * s} fill="#E8739A" />
        </g>
      );

    // ─── Rainbow Cat (Magical/Mythical) ───
    case "rainbow":
      return (
        <g>
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-1 * s} ${cx - 2 * s},${5 * s}`} fill="#E8739A" opacity="0.5" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-1 * s} ${cx + 12 * s},${4 * s}`} fill="#9C27B0" opacity="0.5" />
          {/* Sparkle eyes */}
          <circle cx={cx - 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx + 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.4} />
          <circle cx={cx - 5 * s} cy={eyeY + 0.3 * s} r={2.2 * s} fill="#9C27B0" />
          <circle cx={cx + 5 * s} cy={eyeY + 0.3 * s} r={2.2 * s} fill="#E8739A" />
          <circle cx={cx - 4.5 * s} cy={eyeY - 0.5 * s} r={1 * s} fill="white" />
          <circle cx={cx + 4.5 * s} cy={eyeY - 0.5 * s} r={1 * s} fill="white" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 1 * s} Q${cx},${mouthY + 3.5 * s} ${cx + 3 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
          {/* Rainbow arc */}
          {["#FF0000", "#FF8800", "#FFD700", "#00CC00", "#0066FF", "#8800FF"].map((color, i) => (
            <path key={i}
              d={`M${cx - 12 * s},${-1 * s + i * 1.2 * s} Q${cx},${-10 * s + i * 1.2 * s} ${cx + 12 * s},${-1 * s + i * 1.2 * s}`}
              stroke={color} strokeWidth={1 * s} fill="none" opacity="0.6" />
          ))}
          <circle cx={cx - 7 * s} cy={eyeY + 5 * s} r={2 * s} fill="#FF8FAA" opacity="0.3" />
          <circle cx={cx + 7 * s} cy={eyeY + 5 * s} r={2 * s} fill="#FF8FAA" opacity="0.3" />
        </g>
      );

    default:
      return (
        <g>
          <polygon points={`${cx - 12 * s},${4 * s} ${cx - 7 * s},${-1 * s} ${cx - 2 * s},${5 * s}`} fill={fc} opacity="0.5" />
          <polygon points={`${cx + 2 * s},${5 * s} ${cx + 7 * s},${-1 * s} ${cx + 12 * s},${4 * s}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 5.5 * s - 3 * s},${eyeY + 1 * s} Q${cx - 5.5 * s},${eyeY - 4 * s} ${cx - 5.5 * s + 3 * s},${eyeY + 1 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d={`M${cx + 5.5 * s - 3 * s},${eyeY + 1 * s} Q${cx + 5.5 * s},${eyeY - 4 * s} ${cx + 5.5 * s + 3 * s},${eyeY + 1 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <polygon points={`${cx},${mouthY - 2 * s} ${cx - 1.5 * s},${mouthY} ${cx + 1.5 * s},${mouthY}`} fill={fc} opacity="0.5" />
          <path d={`M${cx - 3 * s},${mouthY + 1 * s} Q${cx},${mouthY + 4 * s} ${cx + 3 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" />
        </g>
      );
  }
}
