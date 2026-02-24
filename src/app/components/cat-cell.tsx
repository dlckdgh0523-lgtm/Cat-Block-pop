import React from "react";
import { type CatType } from "./game-logic";
import { type BlockSkin, getSkinColors } from "./skins-data";

export type ReactionType = "none" | "surprised" | "mouthOpen" | "noseFlare" | "happy" | "whimper" | "sly" | "curious" | "earPerk" | "sniff" | "growl" | "lumbering";

interface CatCellProps {
  catType: CatType;
  size: number;
  ghost?: boolean;
  clearing?: boolean;
  skin?: BlockSkin;
  reaction?: ReactionType;
}

// ─── Generic Animal Face ───
function AnimalFace({ skin, catType, size, faceColor, reaction = "none" }: {
  skin: BlockSkin; catType: CatType; size: number; faceColor: string; reaction?: ReactionType;
}) {
  if (skin === "cat") return <CatFace catType={catType} size={size} faceColor={faceColor} reaction={reaction} />;
  if (skin === "pig") return <PigFace catType={catType} size={size} faceColor={faceColor} reaction={reaction} />;
  if (skin === "dog") return <DogFace catType={catType} size={size} faceColor={faceColor} reaction={reaction} />;
  if (skin === "fox") return <FoxFace catType={catType} size={size} faceColor={faceColor} reaction={reaction} />;
  if (skin === "rabbit") return <RabbitFace catType={catType} size={size} faceColor={faceColor} reaction={reaction} />;
  if (skin === "bear") return <BearFace catType={catType} size={size} faceColor={faceColor} reaction={reaction} />;
  return <CatFace catType={catType} size={size} faceColor={faceColor} reaction={reaction} />;
}

// ─── Cat Face (Original) ───
function CatFace({ catType, size, faceColor, reaction }: { catType: CatType; size: number; faceColor: string; reaction?: ReactionType }) {
  const cx = size / 2, cy = size / 2, s = size / 40;
  const eyeY = cy + 0.5 * s, eyeL = cx - 5.5 * s, eyeR = cx + 5.5 * s;
  const mouthY = cy + 7 * s, fc = faceColor, sw = 1.8 * s;

  const ears = (
    <>
      <polygon points={`${cx - 12 * s},${4.5 * s} ${cx - 7 * s},${-1 * s} ${cx - 2 * s},${5.5 * s}`} fill={fc} opacity="0.7" />
      <polygon points={`${cx + 2 * s},${5.5 * s} ${cx + 7 * s},${-1 * s} ${cx + 12 * s},${4.5 * s}`} fill={fc} opacity="0.7" />
      <polygon points={`${cx - 10.5 * s},${4.5 * s} ${cx - 7 * s},${1 * s} ${cx - 3.5 * s},${5 * s}`} fill="#FFB5C2" opacity="0.6" />
      <polygon points={`${cx + 3.5 * s},${5 * s} ${cx + 7 * s},${1 * s} ${cx + 10.5 * s},${4.5 * s}`} fill="#FFB5C2" opacity="0.6" />
    </>
  );
  const whiskers = (
    <>
      <line x1={cx - 14 * s} y1={mouthY - 3 * s} x2={cx - 6 * s} y2={mouthY - 1 * s} stroke={fc} strokeWidth={sw * 0.55} opacity="0.5" strokeLinecap="round" />
      <line x1={cx - 13 * s} y1={mouthY} x2={cx - 6 * s} y2={mouthY} stroke={fc} strokeWidth={sw * 0.55} opacity="0.5" strokeLinecap="round" />
      <line x1={cx + 14 * s} y1={mouthY - 3 * s} x2={cx + 6 * s} y2={mouthY - 1 * s} stroke={fc} strokeWidth={sw * 0.55} opacity="0.5" strokeLinecap="round" />
      <line x1={cx + 13 * s} y1={mouthY} x2={cx + 6 * s} y2={mouthY} stroke={fc} strokeWidth={sw * 0.55} opacity="0.5" strokeLinecap="round" />
    </>
  );
  const nose = <polygon points={`${cx},${mouthY - 2.5 * s} ${cx - 1.8 * s},${mouthY - 0.5 * s} ${cx + 1.8 * s},${mouthY - 0.5 * s}`} fill={fc} opacity="0.65" />;

  // Reaction override
  if (reaction === "surprised") {
    return (
      <g>{ears}
        <circle cx={eyeL} cy={eyeY} r={4 * s} fill="white" stroke={fc} strokeWidth={sw * 0.8} />
        <circle cx={eyeR} cy={eyeY} r={4 * s} fill="white" stroke={fc} strokeWidth={sw * 0.8} />
        <circle cx={eyeL} cy={eyeY} r={2.5 * s} fill={fc} />
        <circle cx={eyeR} cy={eyeY} r={2.5 * s} fill={fc} />
        <circle cx={eyeL - 1 * s} cy={eyeY - 1 * s} r={1 * s} fill="white" />
        <circle cx={eyeR - 1 * s} cy={eyeY - 1 * s} r={1 * s} fill="white" />
        {nose}
        <ellipse cx={cx} cy={mouthY + 2 * s} rx={2 * s} ry={1.5 * s} fill={fc} opacity="0.3" />
        {whiskers}
      </g>
    );
  }
  if (reaction === "mouthOpen") {
    return (
      <g>{ears}
        <circle cx={eyeL} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.6} />
        <circle cx={eyeR} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.6} />
        <circle cx={eyeL} cy={eyeY} r={2 * s} fill={fc} />
        <circle cx={eyeR} cy={eyeY} r={2 * s} fill={fc} />
        {nose}
        <ellipse cx={cx} cy={mouthY + 2 * s} rx={3 * s} ry={2.5 * s} fill={fc} opacity="0.25" stroke={fc} strokeWidth={sw * 0.5} />
        {whiskers}
      </g>
    );
  }

  // Default cat faces by type (original code)
  switch (catType) {
    case 0: return (
      <g>{ears}
        <path d={`M${eyeL - 3.5 * s},${eyeY + 1 * s} Q${eyeL},${eyeY - 4 * s} ${eyeL + 3.5 * s},${eyeY + 1 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d={`M${eyeR - 3.5 * s},${eyeY + 1 * s} Q${eyeR},${eyeY - 4 * s} ${eyeR + 3.5 * s},${eyeY + 1 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
        {nose}
        <path d={`M${cx - 4 * s},${mouthY + 1 * s} Q${cx},${mouthY + 5 * s} ${cx + 4 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.8} fill="none" strokeLinecap="round" />
        <circle cx={eyeL - 1 * s} cy={eyeY + 5 * s} r={2.5 * s} fill="#FF8FAA" opacity="0.35" />
        <circle cx={eyeR + 1 * s} cy={eyeY + 5 * s} r={2.5 * s} fill="#FF8FAA" opacity="0.35" />
        {whiskers}
      </g>
    );
    case 1: return (
      <g>{ears}
        <path d={`M${eyeL - 3.5 * s},${eyeY} L${eyeL + 3.5 * s},${eyeY}`} stroke={fc} strokeWidth={sw * 1.2} strokeLinecap="round" />
        <path d={`M${eyeR - 3.5 * s},${eyeY} L${eyeR + 3.5 * s},${eyeY}`} stroke={fc} strokeWidth={sw * 1.2} strokeLinecap="round" />
        <circle cx={eyeL} cy={eyeY + 1.5 * s} r={1 * s} fill={fc} opacity="0.4" />
        <circle cx={eyeR} cy={eyeY + 1.5 * s} r={1 * s} fill={fc} opacity="0.4" />
        {nose}
        <ellipse cx={cx} cy={mouthY + 1.5 * s} rx={2 * s} ry={1.5 * s} fill={fc} opacity="0.3" />
        <text x={cx + 8 * s} y={eyeY - 4 * s} fill={fc} fontSize={7 * s} opacity="0.55" fontFamily="'Nunito',sans-serif" fontWeight="700">z</text>
        <text x={cx + 12 * s} y={eyeY - 8 * s} fill={fc} fontSize={5 * s} opacity="0.35" fontFamily="'Nunito',sans-serif" fontWeight="700">z</text>
        {whiskers}
      </g>
    );
    case 2: return (
      <g>{ears}
        <ellipse cx={eyeL} cy={eyeY} rx={4 * s} ry={2.5 * s} fill={fc} opacity="0.8" />
        <ellipse cx={eyeR} cy={eyeY} rx={4 * s} ry={2.5 * s} fill={fc} opacity="0.8" />
        <circle cx={eyeL + 1.5 * s} cy={eyeY - 0.8 * s} r={1.2 * s} fill="#555" opacity="0.5" />
        <circle cx={eyeR + 1.5 * s} cy={eyeY - 0.8 * s} r={1.2 * s} fill="#555" opacity="0.5" />
        <ellipse cx={eyeL} cy={eyeY + 0.3 * s} rx={1.5 * s} ry={1.8 * s} fill="#333" opacity="0.9" />
        <ellipse cx={eyeR} cy={eyeY + 0.3 * s} rx={1.5 * s} ry={1.8 * s} fill="#333" opacity="0.9" />
        {nose}
        <path d={`M${cx - 2 * s},${mouthY + 1 * s} Q${cx + 1 * s},${mouthY + 3 * s} ${cx + 4 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" />
        {whiskers}
      </g>
    );
    case 3: return (
      <g>{ears}
        <circle cx={eyeL} cy={eyeY} r={4 * s} fill="white" stroke={fc} strokeWidth={sw * 0.8} />
        <circle cx={eyeR} cy={eyeY} r={4 * s} fill="white" stroke={fc} strokeWidth={sw * 0.8} />
        <circle cx={eyeL + 0.5 * s} cy={eyeY + 0.5 * s} r={2.5 * s} fill={fc} />
        <circle cx={eyeR + 0.5 * s} cy={eyeY + 0.5 * s} r={2.5 * s} fill={fc} />
        <circle cx={eyeL - 0.8 * s} cy={eyeY - 1 * s} r={1.3 * s} fill="white" />
        <circle cx={eyeR - 0.8 * s} cy={eyeY - 1 * s} r={1.3 * s} fill="white" />
        {nose}
        <ellipse cx={cx} cy={mouthY + 2 * s} rx={2.5 * s} ry={2 * s} fill={fc} opacity="0.25" stroke={fc} strokeWidth={sw * 0.6} />
        {whiskers}
      </g>
    );
    case 4: return (
      <g>{ears}
        <path d={`M${eyeL},${eyeY + 2 * s} C${eyeL - 4 * s},${eyeY - 3 * s} ${eyeL - 1 * s},${eyeY - 5 * s} ${eyeL},${eyeY - 1.5 * s} C${eyeL + 1 * s},${eyeY - 5 * s} ${eyeL + 4 * s},${eyeY - 3 * s} ${eyeL},${eyeY + 2 * s}Z`} fill="#FF4B6E" opacity="0.85" />
        <path d={`M${eyeR},${eyeY + 2 * s} C${eyeR - 4 * s},${eyeY - 3 * s} ${eyeR - 1 * s},${eyeY - 5 * s} ${eyeR},${eyeY - 1.5 * s} C${eyeR + 1 * s},${eyeY - 5 * s} ${eyeR + 4 * s},${eyeY - 3 * s} ${eyeR},${eyeY + 2 * s}Z`} fill="#FF4B6E" opacity="0.85" />
        {nose}
        <path d={`M${cx - 3 * s},${mouthY + 0.5 * s} Q${cx},${mouthY + 4 * s} ${cx + 3 * s},${mouthY + 0.5 * s}`} stroke={fc} strokeWidth={sw * 0.8} fill="none" strokeLinecap="round" />
        <circle cx={eyeL - 2 * s} cy={eyeY + 5.5 * s} r={2.5 * s} fill="#FF8FAA" opacity="0.4" />
        <circle cx={eyeR + 2 * s} cy={eyeY + 5.5 * s} r={2.5 * s} fill="#FF8FAA" opacity="0.4" />
        {whiskers}
      </g>
    );
    case 5: return (
      <g>{ears}
        <ellipse cx={cx} cy={cy + 3 * s} rx={10 * s} ry={8 * s} fill={fc} opacity="0.12" />
        <circle cx={eyeL} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.7} />
        <circle cx={eyeL + 0.3 * s} cy={eyeY + 0.3 * s} r={2.2 * s} fill="#4A90D9" />
        <circle cx={eyeL - 0.5 * s} cy={eyeY - 0.8 * s} r={1 * s} fill="white" />
        <path d={`M${eyeR - 3.5 * s},${eyeY + 0.5 * s} Q${eyeR},${eyeY - 3 * s} ${eyeR + 3.5 * s},${eyeY + 0.5 * s}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
        {nose}
        <path d={`M${cx - 3 * s},${mouthY + 1 * s} Q${cx},${mouthY + 3.5 * s} ${cx + 3 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" />
        <polygon points={`${cx + 1.5 * s},${mouthY + 1.5 * s} ${cx + 2.5 * s},${mouthY + 4 * s} ${cx + 3.5 * s},${mouthY + 1.5 * s}`} fill="white" stroke={fc} strokeWidth={sw * 0.3} />
        {whiskers}
      </g>
    );
    default: return null;
  }
}

// ─── Pig Face ───
function PigFace({ catType, size, faceColor, reaction }: { catType: CatType; size: number; faceColor: string; reaction?: ReactionType }) {
  const cx = size / 2, cy = size / 2, s = size / 40, fc = faceColor, sw = 1.8 * s;
  const eyeY = cy - 3 * s, snoutY = cy + 3 * s, mouthY = cy + 10 * s;
  const ears = (
    <>
      <ellipse cx={cx - 10 * s} cy={2 * s} rx={6 * s} ry={5 * s} fill={fc} opacity="0.6" transform={`rotate(-20, ${cx - 10 * s}, ${2 * s})`} />
      <ellipse cx={cx + 10 * s} cy={2 * s} rx={6 * s} ry={5 * s} fill={fc} opacity="0.6" transform={`rotate(20, ${cx + 10 * s}, ${2 * s})`} />
    </>
  );
  // Snout (nose) - centered on face
  const snout = (
    <>
      <ellipse cx={cx} cy={snoutY} rx={7 * s} ry={4.5 * s} fill={fc} opacity="0.2" />
      <circle cx={cx - 2.5 * s} cy={snoutY} r={1.5 * s} fill={fc} opacity="0.55" />
      <circle cx={cx + 2.5 * s} cy={snoutY} r={1.5 * s} fill={fc} opacity="0.55" />
    </>
  );

  const noseFlare = reaction === "noseFlare" || reaction === "surprised";

  if (noseFlare) {
    return (
      <g>{ears}
        <circle cx={cx - 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.6} />
        <circle cx={cx + 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.6} />
        <circle cx={cx - 5 * s} cy={eyeY} r={2 * s} fill={fc} />
        <circle cx={cx + 5 * s} cy={eyeY} r={2 * s} fill={fc} />
        <ellipse cx={cx} cy={snoutY} rx={8 * s} ry={5.5 * s} fill={fc} opacity="0.25" style={{ animation: "pigSnort 0.3s infinite alternate" }} />
        <ellipse cx={cx - 3 * s} cy={snoutY} rx={2 * s} ry={1.8 * s} fill={fc} opacity="0.6" />
        <ellipse cx={cx + 3 * s} cy={snoutY} rx={2 * s} ry={1.8 * s} fill={fc} opacity="0.6" />
        <path d={`M${cx - 3 * s},${mouthY} Q${cx},${mouthY + 2 * s} ${cx + 3 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.5} fill="none" strokeLinecap="round" />
      </g>
    );
  }
  if (reaction === "mouthOpen") {
    return (
      <g>{ears}
        <circle cx={cx - 5 * s} cy={eyeY} r={2.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
        <circle cx={cx + 5 * s} cy={eyeY} r={2.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
        <circle cx={cx - 5 * s} cy={eyeY} r={1.5 * s} fill={fc} />
        <circle cx={cx + 5 * s} cy={eyeY} r={1.5 * s} fill={fc} />
        {snout}
        <ellipse cx={cx} cy={mouthY + 1 * s} rx={3 * s} ry={2 * s} fill={fc} opacity="0.2" stroke={fc} strokeWidth={sw * 0.4} />
      </g>
    );
  }

  // Default pig expressions by type
  const eyes = catType % 2 === 0 ? (
    <>
      <path d={`M${cx - 8 * s},${eyeY} Q${cx - 5 * s},${eyeY - 4 * s} ${cx - 2 * s},${eyeY}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d={`M${cx + 2 * s},${eyeY} Q${cx + 5 * s},${eyeY - 4 * s} ${cx + 8 * s},${eyeY}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
    </>
  ) : (
    <>
      <circle cx={cx - 5 * s} cy={eyeY} r={2.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
      <circle cx={cx + 5 * s} cy={eyeY} r={2.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
      <circle cx={cx - 5 * s} cy={eyeY} r={1.5 * s} fill={fc} />
      <circle cx={cx + 5 * s} cy={eyeY} r={1.5 * s} fill={fc} />
    </>
  );
  return (
    <g>{ears}{eyes}{snout}
      <path d={`M${cx - 3 * s},${mouthY} Q${cx},${mouthY + 2.5 * s} ${cx + 3 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
      <circle cx={cx - 5 * s} cy={eyeY + 7 * s} r={2 * s} fill="#FFB5C2" opacity="0.3" />
      <circle cx={cx + 5 * s} cy={eyeY + 7 * s} r={2 * s} fill="#FFB5C2" opacity="0.3" />
    </g>
  );
}

// ─── Dog Face ───
function DogFace({ catType, size, faceColor, reaction }: { catType: CatType; size: number; faceColor: string; reaction?: ReactionType }) {
  const cx = size / 2, cy = size / 2, s = size / 40, fc = faceColor, sw = 1.8 * s;
  const eyeY = cy - 0.5 * s, mouthY = cy + 7 * s;
  const ears = (
    <>
      <ellipse cx={cx - 11 * s} cy={5 * s} rx={5 * s} ry={8 * s} fill={fc} opacity="0.55" transform={`rotate(-15, ${cx - 11 * s}, ${5 * s})`} />
      <ellipse cx={cx + 11 * s} cy={5 * s} rx={5 * s} ry={8 * s} fill={fc} opacity="0.55" transform={`rotate(15, ${cx + 11 * s}, ${5 * s})`} />
    </>
  );
  const nose = <ellipse cx={cx} cy={mouthY - 2 * s} rx={2.5 * s} ry={2 * s} fill={fc} opacity="0.8" />;

  if (reaction === "happy" || reaction === "surprised") {
    return (
      <g>{ears}
        <path d={`M${cx - 8 * s},${eyeY} Q${cx - 5 * s},${eyeY - 5 * s} ${cx - 2 * s},${eyeY}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d={`M${cx + 2 * s},${eyeY} Q${cx + 5 * s},${eyeY - 5 * s} ${cx + 8 * s},${eyeY}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
        {nose}
        <path d={`M${cx - 5 * s},${mouthY + 1 * s} Q${cx},${mouthY + 6 * s} ${cx + 5 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.8} fill="none" strokeLinecap="round" />
        <ellipse cx={cx} cy={mouthY + 4 * s} rx={3 * s} ry={1.5 * s} fill="#FF8FAA" opacity="0.4" />
      </g>
    );
  }
  if (reaction === "whimper" || reaction === "mouthOpen") {
    return (
      <g>{ears}
        <circle cx={cx - 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.6} />
        <circle cx={cx + 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.6} />
        <circle cx={cx - 5 * s} cy={eyeY + 0.5 * s} r={2 * s} fill={fc} />
        <circle cx={cx + 5 * s} cy={eyeY + 0.5 * s} r={2 * s} fill={fc} />
        <circle cx={cx - 4 * s} cy={eyeY - 0.5 * s} r={0.8 * s} fill="white" />
        <circle cx={cx + 4 * s} cy={eyeY - 0.5 * s} r={0.8 * s} fill="white" />
        {nose}
        <path d={`M${cx - 3 * s},${mouthY + 1 * s} Q${cx},${mouthY - 1 * s} ${cx + 3 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
      </g>
    );
  }

  const eyes = catType % 3 === 0 ? (
    <>
      <path d={`M${cx - 8 * s},${eyeY} Q${cx - 5 * s},${eyeY - 4 * s} ${cx - 2 * s},${eyeY}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d={`M${cx + 2 * s},${eyeY} Q${cx + 5 * s},${eyeY - 4 * s} ${cx + 8 * s},${eyeY}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
    </>
  ) : (
    <>
      <circle cx={cx - 5 * s} cy={eyeY} r={2.8 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
      <circle cx={cx + 5 * s} cy={eyeY} r={2.8 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
      <circle cx={cx - 5 * s} cy={eyeY} r={1.8 * s} fill={fc} />
      <circle cx={cx + 5 * s} cy={eyeY} r={1.8 * s} fill={fc} />
    </>
  );
  return (
    <g>{ears}{eyes}{nose}
      <path d={`M${cx - 4 * s},${mouthY + 1 * s} Q${cx},${mouthY + 4 * s} ${cx + 4 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" />
    </g>
  );
}

// ─── Fox Face ───
function FoxFace({ catType, size, faceColor, reaction }: { catType: CatType; size: number; faceColor: string; reaction?: ReactionType }) {
  const cx = size / 2, cy = size / 2, s = size / 40, fc = faceColor, sw = 1.8 * s;
  const eyeY = cy + 0 * s, mouthY = cy + 7.5 * s;
  const ears = (
    <>
      <polygon points={`${cx - 13 * s},${3 * s} ${cx - 8 * s},${-4 * s} ${cx - 3 * s},${4 * s}`} fill={fc} opacity="0.75" />
      <polygon points={`${cx + 3 * s},${4 * s} ${cx + 8 * s},${-4 * s} ${cx + 13 * s},${3 * s}`} fill={fc} opacity="0.75" />
    </>
  );
  const nose = <polygon points={`${cx},${mouthY - 2 * s} ${cx - 2 * s},${mouthY} ${cx + 2 * s},${mouthY}`} fill={fc} opacity="0.7" />;

  if (reaction === "sly" || reaction === "surprised") {
    return (
      <g>{ears}
        <ellipse cx={cx - 5.5 * s} cy={eyeY} rx={4 * s} ry={2 * s} fill={fc} opacity="0.7" />
        <ellipse cx={cx + 5.5 * s} cy={eyeY} rx={4 * s} ry={2 * s} fill={fc} opacity="0.7" />
        <ellipse cx={cx - 5 * s} cy={eyeY} rx={1.5 * s} ry={1.5 * s} fill="white" opacity="0.6" />
        <ellipse cx={cx + 5 * s} cy={eyeY} rx={1.5 * s} ry={1.5 * s} fill="white" opacity="0.6" />
        {nose}
        <path d={`M${cx - 2 * s},${mouthY + 1 * s} Q${cx + 1 * s},${mouthY + 3 * s} ${cx + 4 * s},${mouthY}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
      </g>
    );
  }
  if (reaction === "curious" || reaction === "mouthOpen") {
    return (
      <g>{ears}
        <circle cx={cx - 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
        <circle cx={cx + 5 * s} cy={eyeY} r={3.5 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
        <circle cx={cx - 5 * s} cy={eyeY} r={2 * s} fill={fc} />
        <circle cx={cx + 5 * s} cy={eyeY} r={2 * s} fill={fc} />
        {nose}
        <ellipse cx={cx} cy={mouthY + 2 * s} rx={2 * s} ry={1.5 * s} fill={fc} opacity="0.2" stroke={fc} strokeWidth={sw * 0.4} />
      </g>
    );
  }

  const eyes = catType % 2 === 0 ? (
    <>
      <ellipse cx={cx - 5.5 * s} cy={eyeY} rx={3.5 * s} ry={2 * s} fill={fc} opacity="0.6" />
      <ellipse cx={cx + 5.5 * s} cy={eyeY} rx={3.5 * s} ry={2 * s} fill={fc} opacity="0.6" />
      <ellipse cx={cx - 5 * s} cy={eyeY} rx={1 * s} ry={1.5 * s} fill="white" opacity="0.5" />
      <ellipse cx={cx + 5 * s} cy={eyeY} rx={1 * s} ry={1.5 * s} fill="white" opacity="0.5" />
    </>
  ) : (
    <>
      <circle cx={cx - 5 * s} cy={eyeY} r={2.8 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
      <circle cx={cx + 5 * s} cy={eyeY} r={2.8 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
      <ellipse cx={cx - 5 * s} cy={eyeY} rx={1.5 * s} ry={2 * s} fill={fc} />
      <ellipse cx={cx + 5 * s} cy={eyeY} rx={1.5 * s} ry={2 * s} fill={fc} />
    </>
  );
  return <g>{ears}{eyes}{nose}<path d={`M${cx - 3 * s},${mouthY + 1 * s} Q${cx},${mouthY + 3 * s} ${cx + 3 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" /></g>;
}

// ─── Rabbit Face ───
function RabbitFace({ catType, size, faceColor, reaction }: { catType: CatType; size: number; faceColor: string; reaction?: ReactionType }) {
  const cx = size / 2, cy = size / 2, s = size / 40, fc = faceColor, sw = 1.8 * s;
  const eyeY = cy + 1 * s, mouthY = cy + 8 * s;
  // Long ears
  const ears = (
    <>
      <ellipse cx={cx - 6 * s} cy={-2 * s} rx={3 * s} ry={9 * s} fill={fc} opacity="0.65" />
      <ellipse cx={cx + 6 * s} cy={-2 * s} rx={3 * s} ry={9 * s} fill={fc} opacity="0.65" />
      <ellipse cx={cx - 6 * s} cy={-2 * s} rx={1.5 * s} ry={6 * s} fill="#FFB5C2" opacity="0.5" />
      <ellipse cx={cx + 6 * s} cy={-2 * s} rx={1.5 * s} ry={6 * s} fill="#FFB5C2" opacity="0.5" />
    </>
  );
  const nose = <circle cx={cx} cy={mouthY - 2 * s} r={1.5 * s} fill="#FFB5C2" opacity="0.8" />;

  if (reaction === "earPerk" || reaction === "surprised") {
    return (
      <g>
        <ellipse cx={cx - 6 * s} cy={-5 * s} rx={3 * s} ry={10 * s} fill={fc} opacity="0.5" />
        <ellipse cx={cx + 6 * s} cy={-5 * s} rx={3 * s} ry={10 * s} fill={fc} opacity="0.5" />
        <circle cx={cx - 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
        <circle cx={cx + 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
        <circle cx={cx - 5 * s} cy={eyeY} r={2 * s} fill={fc} />
        <circle cx={cx + 5 * s} cy={eyeY} r={2 * s} fill={fc} />
        {nose}
        <path d={`M${cx - 1 * s},${mouthY} L${cx - 3 * s},${mouthY + 3 * s}`} stroke={fc} strokeWidth={sw * 0.5} fill="none" strokeLinecap="round" />
        <path d={`M${cx + 1 * s},${mouthY} L${cx + 3 * s},${mouthY + 3 * s}`} stroke={fc} strokeWidth={sw * 0.5} fill="none" strokeLinecap="round" />
      </g>
    );
  }

  const eyes = catType % 2 === 0 ? (
    <>
      <circle cx={cx - 5 * s} cy={eyeY} r={2.8 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
      <circle cx={cx + 5 * s} cy={eyeY} r={2.8 * s} fill="white" stroke={fc} strokeWidth={sw * 0.5} />
      <circle cx={cx - 5 * s} cy={eyeY} r={1.8 * s} fill={fc} />
      <circle cx={cx + 5 * s} cy={eyeY} r={1.8 * s} fill={fc} />
    </>
  ) : (
    <>
      <path d={`M${cx - 8 * s},${eyeY} Q${cx - 5 * s},${eyeY - 3 * s} ${cx - 2 * s},${eyeY}`} stroke={fc} strokeWidth={sw * 0.8} fill="none" strokeLinecap="round" />
      <path d={`M${cx + 2 * s},${eyeY} Q${cx + 5 * s},${eyeY - 3 * s} ${cx + 8 * s},${eyeY}`} stroke={fc} strokeWidth={sw * 0.8} fill="none" strokeLinecap="round" />
    </>
  );
  // Buck teeth
  return (
    <g>{ears}{eyes}{nose}
      <rect x={cx - 2 * s} y={mouthY} width={1.5 * s} height={2.5 * s} rx={0.3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.3} />
      <rect x={cx + 0.5 * s} y={mouthY} width={1.5 * s} height={2.5 * s} rx={0.3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.3} />
    </g>
  );
}

// ─── Bear Face ───
function BearFace({ catType, size, faceColor, reaction }: { catType: CatType; size: number; faceColor: string; reaction?: ReactionType }) {
  const cx = size / 2, cy = size / 2, s = size / 40, fc = faceColor, sw = 1.8 * s;
  const eyeY = cy + 0 * s, mouthY = cy + 7 * s;
  const ears = (
    <>
      <circle cx={cx - 10 * s} cy={2 * s} r={5 * s} fill={fc} opacity="0.65" />
      <circle cx={cx + 10 * s} cy={2 * s} r={5 * s} fill={fc} opacity="0.65" />
      <circle cx={cx - 10 * s} cy={2 * s} r={3 * s} fill={fc} opacity="0.35" />
      <circle cx={cx + 10 * s} cy={2 * s} r={3 * s} fill={fc} opacity="0.35" />
    </>
  );
  const nose = <ellipse cx={cx} cy={mouthY - 1.5 * s} rx={3 * s} ry={2 * s} fill={fc} opacity="0.6" />;

  if (reaction === "growl" || reaction === "surprised") {
    return (
      <g>{ears}
        <circle cx={cx - 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.6} />
        <circle cx={cx + 5 * s} cy={eyeY} r={3 * s} fill="white" stroke={fc} strokeWidth={sw * 0.6} />
        <circle cx={cx - 5 * s} cy={eyeY} r={2 * s} fill={fc} />
        <circle cx={cx + 5 * s} cy={eyeY} r={2 * s} fill={fc} />
        {nose}
        <path d={`M${cx - 5 * s},${mouthY + 1 * s} L${cx},${mouthY + 3 * s} L${cx + 5 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" />
      </g>
    );
  }

  const eyes = catType % 2 === 0 ? (
    <>
      <circle cx={cx - 5 * s} cy={eyeY} r={2 * s} fill={fc} />
      <circle cx={cx + 5 * s} cy={eyeY} r={2 * s} fill={fc} />
      <circle cx={cx - 4 * s} cy={eyeY - 0.5 * s} r={0.8 * s} fill="white" opacity="0.6" />
      <circle cx={cx + 4 * s} cy={eyeY - 0.5 * s} r={0.8 * s} fill="white" opacity="0.6" />
    </>
  ) : (
    <>
      <path d={`M${cx - 7 * s},${eyeY} Q${cx - 5 * s},${eyeY - 3 * s} ${cx - 3 * s},${eyeY}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d={`M${cx + 3 * s},${eyeY} Q${cx + 5 * s},${eyeY - 3 * s} ${cx + 7 * s},${eyeY}`} stroke={fc} strokeWidth={sw} fill="none" strokeLinecap="round" />
    </>
  );
  return (
    <g>{ears}{eyes}{nose}
      <path d={`M${cx - 3 * s},${mouthY + 1 * s} Q${cx},${mouthY + 3 * s} ${cx + 3 * s},${mouthY + 1 * s}`} stroke={fc} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" />
    </g>
  );
}

// ─── Main CatCell Component ───
export function CatCell({ catType, size, ghost = false, clearing = false, skin = "cat", reaction = "none" }: CatCellProps) {
  const colors = getSkinColors(skin);
  const style = colors[catType] || colors[0];
  const radius = size * 0.22;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{
        opacity: ghost ? 0.45 : clearing ? 0 : 1,
        transition: clearing ? "opacity 0.3s ease-out, transform 0.3s ease-out" : "none",
        transform: clearing ? "scale(0.5)" : "scale(1)",
        overflow: "visible",
      }}>
      <rect x={1} y={2.5} width={size - 2} height={size - 2} rx={radius} fill={style.darkColor} opacity="0.45" />
      <rect x={1} y={1} width={size - 2} height={size - 3} rx={radius} fill={style.color}
        stroke={style.darkColor} strokeWidth={0.8} strokeOpacity={0.2} />
      <rect x={3} y={2} width={size - 6} height={(size - 4) * 0.35} rx={radius - 1} fill={style.lightColor} opacity="0.7" />
      <AnimalFace skin={skin} catType={catType} size={size} faceColor={style.faceColor} reaction={reaction} />
    </svg>
  );
}

export function CatCellMini({ catType, size, skin = "cat" }: { catType: CatType; size: number; skin?: BlockSkin }) {
  const colors = getSkinColors(skin);
  const style = colors[catType] || colors[0];
  const radius = size * 0.22;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <rect x={0.5} y={1} width={size - 1} height={size - 1.5} rx={radius} fill={style.color}
        stroke={style.darkColor} strokeWidth={0.6} strokeOpacity={0.15} />
      <rect x={2} y={1.5} width={size - 4} height={(size - 2) * 0.3} rx={radius - 1} fill={style.lightColor} opacity="0.5" />
      <AnimalFace skin={skin} catType={catType} size={size} faceColor={style.faceColor} />
    </svg>
  );
}