import React, { useState, useEffect } from "react";
import type { Direction } from "./game-logic";
import type { BlockSkin } from "./skins-data";

// ─── Skin-aware color/character config ───
const SKIN_EFFECT: Record<BlockSkin, {
  body: string; bodyLight: string; bodyDark: string; belly: string;
  face: string; blush: string; nose: string; earInner: string;
  label: string; treatName: string; treatColor: string; treatBg: string;
  eatingText: string; doneText: string; doneEmoji: string;
  chaseText: string; chaseEmoji: string;
  kneadBg: string; pawColor: string; pawInner: string; kneadEmoji: string;
}> = {
  cat: {
    body: "#FF9F43", bodyLight: "#FFBf76", bodyDark: "#E58A2F", belly: "#FFD5A0",
    face: "#7A4A1A", blush: "#FFB5C2", nose: "#E8739A", earInner: "#FFB5C2",
    label: "고양이", treatName: "츄르", treatColor: "#FFBf76", treatBg: "#FFD5A0",
    eatingText: "냠냠...", doneText: "냐옹~!", doneEmoji: "🐱",
    chaseText: "냐아아아옹~!", chaseEmoji: "🌿",
    kneadBg: "rgba(255,220,235,0.85)", pawColor: "#FFB5C2", pawInner: "#E8739A", kneadEmoji: "🐾",
  },
  pig: {
    body: "#FFB5C2", bodyLight: "#FFD4DC", bodyDark: "#E8939F", belly: "#FFE0E5",
    face: "#8B4560", blush: "#FF8FAA", nose: "#E8939F", earInner: "#FFD4DC",
    label: "돼지", treatName: "간식", treatColor: "#FF8FAA", treatBg: "#FFD4DC",
    eatingText: "꿀꿀...", doneText: "꿀꿀~!", doneEmoji: "🐷",
    chaseText: "꿀꿀꿀~!", chaseEmoji: "🍎",
    kneadBg: "rgba(255,210,225,0.85)", pawColor: "#FFD4DC", pawInner: "#FFB5C2", kneadEmoji: "🐾",
  },
  dog: {
    body: "#DEB887", bodyLight: "#F0D4A8", bodyDark: "#C49A6C", belly: "#F5E6D0",
    face: "#5C3A1A", blush: "#F0C8A0", nose: "#5C3A1A", earInner: "#C49A6C",
    label: "강아지", treatName: "간식", treatColor: "#C49A6C", treatBg: "#F0D4A8",
    eatingText: "냠냠...", doneText: "멍~!", doneEmoji: "🐶",
    chaseText: "멍멍멍~!", chaseEmoji: "🦴",
    kneadBg: "rgba(240,220,195,0.85)", pawColor: "#F0D4A8", pawInner: "#DEB887", kneadEmoji: "🐾",
  },
  fox: {
    body: "#E87830", bodyLight: "#FF9850", bodyDark: "#C86020", belly: "#FFD0A0",
    face: "#5A2A10", blush: "#FFA860", nose: "#5A2A10", earInner: "#FFD0A0",
    label: "여우", treatName: "간식", treatColor: "#C86020", treatBg: "#FF9850",
    eatingText: "아삭...", doneText: "링~!", doneEmoji: "🦊",
    chaseText: "캬아앙~!", chaseEmoji: "🫐",
    kneadBg: "rgba(255,200,160,0.85)", pawColor: "#FF9850", pawInner: "#E87830", kneadEmoji: "🐾",
  },
  rabbit: {
    body: "#F5F0F0", bodyLight: "#FFFFFF", bodyDark: "#D8D0D0", belly: "#FFFFFF",
    face: "#8A5060", blush: "#FFD4DC", nose: "#E8739A", earInner: "#FFB5C2",
    label: "토끼", treatName: "당근", treatColor: "#FF8C42", treatBg: "#FFA060",
    eatingText: "아삭...", doneText: "깡총~!", doneEmoji: "🐰",
    chaseText: "깡총깡총~!", chaseEmoji: "🥕",
    kneadBg: "rgba(255,230,240,0.85)", pawColor: "#FFD4DC", pawInner: "#FFB5C2", kneadEmoji: "🐾",
  },
  bear: {
    body: "#8B6914", bodyLight: "#AB8930", bodyDark: "#6B4F0E", belly: "#C0A040",
    face: "#3A2A0A", blush: "#C0A040", nose: "#3A2A0A", earInner: "#6B4F0E",
    label: "곰", treatName: "꿀", treatColor: "#FFD700", treatBg: "#AB8930",
    eatingText: "꿀꺽...", doneText: "크앙~!", doneEmoji: "🐻",
    chaseText: "크르르~!", chaseEmoji: "🍯",
    kneadBg: "rgba(200,180,120,0.85)", pawColor: "#AB8930", pawInner: "#8B6914", kneadEmoji: "🐾",
  },
};

// ─── Skin-specific animal face SVG parts ───
function AnimalFace({ skin, phase, cx, cy }: { skin: BlockSkin; phase: number; cx: number; cy: number }) {
  const s = SKIN_EFFECT[skin];

  // Shared: blush circles
  const blush = (
    <>
      <circle cx={cx - 22} cy={cy + 8} r={6} fill={s.blush} opacity={0.4} />
      <circle cx={cx + 22} cy={cy + 8} r={6} fill={s.blush} opacity={0.4} />
    </>
  );

  // Whiskers (cat/fox/rabbit)
  const whiskers = (skin === "cat" || skin === "fox" || skin === "rabbit") ? (
    <>
      <line x1={cx - 45} y1={cy + 5} x2={cx - 20} y2={cy + 10} stroke={s.face} strokeWidth={1} opacity={0.3} />
      <line x1={cx - 45} y1={cy + 13} x2={cx - 20} y2={cy + 14} stroke={s.face} strokeWidth={1} opacity={0.3} />
      <line x1={cx + 45} y1={cy + 5} x2={cx + 20} y2={cy + 10} stroke={s.face} strokeWidth={1} opacity={0.3} />
      <line x1={cx + 45} y1={cy + 13} x2={cx + 20} y2={cy + 14} stroke={s.face} strokeWidth={1} opacity={0.3} />
    </>
  ) : null;

  // Eyes (happy squint when eating done, open when eating)
  const eyes = phase >= 1 ? (
    <>
      <path d={`M${cx - 18},${cy - 2} Q${cx - 12},${cy - 10} ${cx - 6},${cy - 2}`} stroke={s.face} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d={`M${cx + 6},${cy - 2} Q${cx + 12},${cy - 10} ${cx + 18},${cy - 2}`} stroke={s.face} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </>
  ) : (
    <>
      <circle cx={cx - 12} cy={cy - 2} r={5} fill="white" />
      <circle cx={cx + 12} cy={cy - 2} r={5} fill="white" />
      <circle cx={cx - 12} cy={cy - 3} r={3} fill={s.face} />
      <circle cx={cx + 12} cy={cy - 3} r={3} fill={s.face} />
      <circle cx={cx - 13} cy={cy - 4} r={1.2} fill="white" />
      <circle cx={cx + 11} cy={cy - 4} r={1.2} fill="white" />
    </>
  );

  // Nose
  let noseEl: React.ReactNode;
  if (skin === "pig") {
    // Pig snout
    noseEl = (
      <g>
        <ellipse cx={cx} cy={cy + 10} rx={10} ry={7} fill={s.bodyDark} />
        <circle cx={cx - 3} cy={cy + 10} r={2} fill={s.face} />
        <circle cx={cx + 3} cy={cy + 10} r={2} fill={s.face} />
      </g>
    );
  } else if (skin === "dog") {
    // Dog big nose
    noseEl = (
      <g>
        <ellipse cx={cx} cy={cy + 8} rx={6} ry={5} fill={s.face} />
        <ellipse cx={cx} cy={cy + 7} rx={3} ry={2} fill="white" opacity={0.3} />
      </g>
    );
  } else if (skin === "bear") {
    // Bear muzzle
    noseEl = (
      <g>
        <ellipse cx={cx} cy={cy + 10} rx={14} ry={10} fill={s.belly} opacity={0.6} />
        <ellipse cx={cx} cy={cy + 7} rx={5} ry={4} fill={s.face} />
      </g>
    );
  } else {
    // Cat/fox/rabbit triangle nose
    noseEl = <polygon points={`${cx},${cy + 10} ${cx - 3},${cy + 14} ${cx + 3},${cy + 14}`} fill={s.nose} />;
  }

  // Mouth
  const mouth = phase === 0
    ? <ellipse cx={cx} cy={cy + 20} rx={6} ry={4} fill={s.face} opacity={0.6} />
    : <path d={`M${cx - 8},${cy + 18} Q${cx},${cy + 26} ${cx + 8},${cy + 18}`} stroke={s.face} strokeWidth={2} fill="none" strokeLinecap="round" />;

  return (
    <>
      {eyes}
      {blush}
      {noseEl}
      {mouth}
      {whiskers}
    </>
  );
}

// ─── Ears per animal ───
function AnimalEars({ skin, cx, cy }: { skin: BlockSkin; cx: number; cy: number }) {
  const s = SKIN_EFFECT[skin];

  if (skin === "rabbit") {
    // Long floppy ears
    return (
      <>
        <ellipse cx={cx - 15} cy={cy - 40} rx={8} ry={28} fill={s.body} />
        <ellipse cx={cx + 15} cy={cy - 40} rx={8} ry={28} fill={s.body} />
        <ellipse cx={cx - 15} cy={cy - 40} rx={5} ry={22} fill={s.earInner} opacity={0.5} />
        <ellipse cx={cx + 15} cy={cy - 40} rx={5} ry={22} fill={s.earInner} opacity={0.5} />
      </>
    );
  }
  if (skin === "bear") {
    // Round ears
    return (
      <>
        <circle cx={cx - 30} cy={cy - 25} r={14} fill={s.body} />
        <circle cx={cx + 30} cy={cy - 25} r={14} fill={s.body} />
        <circle cx={cx - 30} cy={cy - 25} r={8} fill={s.earInner} />
        <circle cx={cx + 30} cy={cy - 25} r={8} fill={s.earInner} />
      </>
    );
  }
  if (skin === "pig") {
    // Triangular floppy
    return (
      <>
        <polygon points={`${cx - 35},${cy - 25} ${cx - 25},${cy - 55} ${cx - 10},${cy - 30}`} fill={s.body} />
        <polygon points={`${cx + 10},${cy - 30} ${cx + 25},${cy - 55} ${cx + 35},${cy - 25}`} fill={s.body} />
        <polygon points={`${cx - 32},${cy - 27} ${cx - 26},${cy - 48} ${cx - 14},${cy - 30}`} fill={s.earInner} opacity={0.5} />
        <polygon points={`${cx + 14},${cy - 30} ${cx + 26},${cy - 48} ${cx + 32},${cy - 27}`} fill={s.earInner} opacity={0.5} />
      </>
    );
  }
  if (skin === "dog") {
    // Floppy dog ears
    return (
      <>
        <ellipse cx={cx - 32} cy={cy - 10} rx={12} ry={22} fill={s.bodyDark} transform={`rotate(-15, ${cx - 32}, ${cy - 10})`} />
        <ellipse cx={cx + 32} cy={cy - 10} rx={12} ry={22} fill={s.bodyDark} transform={`rotate(15, ${cx + 32}, ${cy - 10})`} />
      </>
    );
  }
  // Cat / fox: pointed ears
  return (
    <>
      <polygon points={`${cx - 35},${cy - 25} ${cx - 25},${cy - 60} ${cx - 10},${cy - 30}`} fill={s.body} />
      <polygon points={`${cx + 10},${cy - 30} ${cx + 25},${cy - 60} ${cx + 35},${cy - 25}`} fill={s.body} />
      <polygon points={`${cx - 32},${cy - 27} ${cx - 26},${cy - 52} ${cx - 14},${cy - 30}`} fill={s.earInner} opacity={0.5} />
      <polygon points={`${cx + 14},${cy - 30} ${cx + 26},${cy - 52} ${cx + 32},${cy - 27}`} fill={s.earInner} opacity={0.5} />
    </>
  );
}

// ─── Treat item on ground per skin ───
function TreatItem({ skin, phase }: { skin: BlockSkin; phase: number }) {
  const s = SKIN_EFFECT[skin];
  const opacity = phase === 0 ? 1 : 0.3;

  if (skin === "rabbit") {
    return (
      <g style={{ opacity, transition: "opacity 0.5s" }}>
        <polygon points="120,260 108,235 132,235" fill="#FF8C42" />
        <path d="M115,235 Q112,225 110,226" stroke="#4CAF50" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M120,235 L120,225" stroke="#66BB6A" strokeWidth={2.5} strokeLinecap="round" />
        <path d="M125,235 Q128,225 130,226" stroke="#81C784" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </g>
    );
  }
  if (skin === "bear") {
    return (
      <g style={{ opacity, transition: "opacity 0.5s" }}>
        <ellipse cx="120" cy="245" rx="18" ry="14" fill="#8B6914" />
        <ellipse cx="120" cy="245" rx="13" ry="10" fill="#AB8930" />
        <rect x="110" y="230" width="20" height="8" rx="2" fill="#6B4F0E" />
        <path d="M108,238 Q120,243 132,238" fill="#FFD700" opacity={0.7} />
        <text x="120" y="250" textAnchor="middle" fontSize="7" fill="#3A2A0A" fontWeight="bold">꿀</text>
      </g>
    );
  }
  if (skin === "dog") {
    return (
      <g style={{ opacity, transition: "opacity 0.5s" }}>
        <rect x="102" y="238" width="36" height="12" rx="5" fill={s.bodyLight} />
        <circle cx="100" cy="238" r="7" fill={s.bodyLight} />
        <circle cx="100" cy="250" r="7" fill={s.bodyLight} />
        <circle cx="140" cy="238" r="7" fill={s.bodyLight} />
        <circle cx="140" cy="250" r="7" fill={s.bodyLight} />
        <text x="120" y="248" textAnchor="middle" fontSize="6" fill={s.face} fontWeight="bold">간식</text>
      </g>
    );
  }
  if (skin === "pig") {
    return (
      <g style={{ opacity, transition: "opacity 0.5s" }}>
        <circle cx="120" cy="244" r="14" fill="#FF6B6B" />
        <circle cx="120" cy="244" r="10" fill="#FF8A8A" />
        <rect x="118" y="228" width="4" height="8" rx="2" fill="#8B5540" />
        <ellipse cx="126" cy="232" rx="4" ry="2.5" fill="#81C784" transform="rotate(25,126,232)" />
        <text x="120" y="248" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">간식</text>
      </g>
    );
  }
  if (skin === "fox") {
    return (
      <g style={{ opacity, transition: "opacity 0.5s" }}>
        <circle cx="120" cy="244" r="14" fill="#7B4FBF" />
        <circle cx="120" cy="244" r="10" fill="#9B6FDF" />
        {[0, 60, 120, 180, 240, 300].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return <circle key={i} cx={120 + Math.cos(rad) * 8} cy={244 + Math.sin(rad) * 8} r={3.5} fill="#6B3FAF" opacity={0.5} />;
        })}
        <path d="M117,228 Q120,224 123,228" fill="#66BB6A" />
        <text x="120" y="248" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="bold">간식</text>
      </g>
    );
  }
  // Cat default: churu tube
  return (
    <g style={{ opacity, transition: "opacity 0.5s" }}>
      <rect x="90" y="230" width="60" height="16" rx="6" fill="#FFBf76" />
      <rect x="94" y="232" width="52" height="12" rx="4" fill="#FFD5A0" />
      <text x="120" y="242" textAnchor="middle" fontSize="8" fill="#7A4A1A" fontWeight="bold">츄르</text>
    </g>
  );
}

// ════════════════════════════════════════════════
// ─── ChuruEffect (skin-aware) ───
// ════════════════════════════════════════════════
export function ChuruEffect({ onComplete, skin = "cat" }: { onComplete: () => void; skin?: BlockSkin }) {
  const [phase, setPhase] = useState(0);
  const s = SKIN_EFFECT[skin];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(onComplete, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      style={{ background: "rgba(255,240,245,0.85)" }}>
      <div style={{ animation: "fadeInScale 0.3s ease-out" }}>
        <svg width="240" height="280" viewBox="0 0 240 280">
          {/* Ground */}
          <ellipse cx="120" cy="260" rx="80" ry="12" fill="rgba(0,0,0,0.06)" />

          {/* Treat on ground */}
          <TreatItem skin={skin} phase={phase} />

          {/* Animal body - gets fatter in phase 1 */}
          <ellipse cx="120" cy="190"
            rx={phase >= 1 ? 65 : 50} ry={phase >= 1 ? 55 : 45}
            fill={s.body} style={{ transition: "all 0.5s ease" }} />
          <ellipse cx="120" cy="200"
            rx={phase >= 1 ? 50 : 35} ry={phase >= 1 ? 40 : 28}
            fill={s.belly} opacity={0.7} style={{ transition: "all 0.5s ease" }} />

          {/* Head */}
          <circle cx="120" cy="120" r="42" fill={s.body} />
          <ellipse cx="120" cy="110" rx="30" ry="18" fill={s.bodyLight} opacity={0.5} />

          {/* Ears */}
          <AnimalEars skin={skin} cx={120} cy={120} />

          {/* Face */}
          <AnimalFace skin={skin} phase={phase} cx={120} cy={120} />

          {/* Smoke burp in phase 1 */}
          {phase >= 1 && (
            <g style={{ animation: "smokeRise 1.5s ease-out forwards" }}>
              <circle cx="130" cy="135" r="8" fill="white" opacity={0.6} />
              <circle cx="138" cy="125" r="6" fill="white" opacity={0.5} />
              <circle cx="135" cy="112" r="5" fill="white" opacity={0.3} />
              <circle cx="142" cy="100" r="4" fill="white" opacity={0.2} />
            </g>
          )}

          {/* Tail */}
          {skin === "rabbit" ? (
            <circle cx="155" cy="215" r="8" fill={s.bodyLight} />
          ) : skin === "pig" ? (
            <path d="M155,200 Q165,195 160,185 Q170,190 165,200" fill={s.bodyDark} strokeWidth="2" />
          ) : (
            <path d="M155,210 Q175,195 170,180" stroke={s.bodyDark} strokeWidth="6" fill="none" strokeLinecap="round" />
          )}
        </svg>

        <div className="text-center mt-2" style={{
          animation: "bounceIn 0.5s ease",
          color: "#E8739A",
          fontSize: "24px",
          textShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
          {phase === 0 ? s.eatingText : `${s.doneText} ${s.doneEmoji}`}
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes smokeRise {
          0% { opacity: 0.6; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════
// ─── CatnipEffect (skin-aware top-down chase) ───
// ════════════════════════════════════════════════
export function CatnipEffect({ direction, onComplete, skin = "cat" }: { direction: Direction; onComplete: () => void; skin?: BlockSkin }) {
  const [phase, setPhase] = useState(0);
  const s = SKIN_EFFECT[skin];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(onComplete, 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const getTransform = () => {
    if (phase < 1) return "translate(0, 0)";
    const dist = 200;
    switch (direction) {
      case "up": return `translate(0, ${-dist}px)`;
      case "down": return `translate(0, ${dist}px)`;
      case "left": return `translate(${-dist}px, 0)`;
      case "right": return `translate(${dist}px, 0)`;
    }
  };

  const rotation = direction === "up" ? 0 : direction === "down" ? 180 : direction === "left" ? 270 : 90;

  // Chase target (grass for cat, carrot for rabbit, etc.)
  const targetColor = skin === "rabbit" ? "#FF8C42" : skin === "bear" ? "#FFD700" : "#66BB6A";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      style={{ background: "rgba(200,255,220,0.5)" }}>

      {/* Chase target trail */}
      <div style={{
        position: "absolute",
        transform: getTransform(),
        transition: phase >= 1 ? "transform 0.8s ease-in" : "none",
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: "shake 0.3s infinite" }}>
          {skin === "rabbit" ? (
            /* Carrot */
            <>
              <polygon points="20,35 12,12 28,12" fill="#FF8C42" />
              <path d="M17,12 Q15,5 13,6" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M20,12 L20,5" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round" />
              <path d="M23,12 Q25,5 27,6" stroke="#81C784" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          ) : skin === "bear" ? (
            /* Honey */
            <>
              <ellipse cx="20" cy="24" rx="12" ry="10" fill="#8B6914" />
              <ellipse cx="20" cy="24" rx="8" ry="7" fill="#AB8930" />
              <rect x="14" y="14" width="12" height="6" rx="2" fill="#6B4F0E" />
              <path d="M14,20 Q20,24 26,20" fill="#FFD700" opacity={0.7} />
            </>
          ) : (
            /* Grass/herb */
            <>
              <path d="M20,35 Q15,20 20,5 Q25,20 20,35" fill="#66BB6A" />
              <path d="M20,30 Q10,18 8,8 Q16,16 20,30" fill="#81C784" />
              <path d="M20,30 Q30,18 32,8 Q24,16 20,30" fill="#4CAF50" />
            </>
          )}
        </svg>
      </div>

      {/* Animal (top-down view) */}
      <div style={{
        transform: `${getTransform()} rotate(${rotation}deg)`,
        transition: phase >= 1 ? "transform 0.8s ease-in" : "none",
        animation: phase < 1 ? "fadeInScale 0.3s ease-out" : "none",
      }}>
        <svg width="80" height="100" viewBox="0 0 80 100">
          {/* Body (top-down oval) */}
          <ellipse cx="40" cy="55" rx="25" ry="35" fill={s.body} />
          <ellipse cx="40" cy="55" rx="18" ry="28" fill={s.bodyLight} opacity={0.5} />

          {/* Head */}
          <circle cx="40" cy="20" r="18" fill={s.body} />

          {/* Ears (top-down) */}
          {skin === "rabbit" ? (
            <>
              <ellipse cx="30" cy="-5" rx="5" ry="18" fill={s.body} />
              <ellipse cx="50" cy="-5" rx="5" ry="18" fill={s.body} />
              <ellipse cx="30" cy="-5" rx="3" ry="14" fill={s.earInner} opacity={0.5} />
              <ellipse cx="50" cy="-5" rx="3" ry="14" fill={s.earInner} opacity={0.5} />
            </>
          ) : skin === "bear" ? (
            <>
              <circle cx="26" cy="8" r="8" fill={s.body} />
              <circle cx="54" cy="8" r="8" fill={s.body} />
              <circle cx="26" cy="8" r="5" fill={s.earInner} />
              <circle cx="54" cy="8" r="5" fill={s.earInner} />
            </>
          ) : skin === "dog" ? (
            <>
              <ellipse cx="25" cy="14" rx="8" ry="12" fill={s.bodyDark} transform="rotate(-15,25,14)" />
              <ellipse cx="55" cy="14" rx="8" ry="12" fill={s.bodyDark} transform="rotate(15,55,14)" />
            </>
          ) : skin === "pig" ? (
            <>
              <polygon points="25,15 28,0 35,12" fill={s.body} />
              <polygon points="45,12 52,0 55,15" fill={s.body} />
              <polygon points="28,14 30,4 34,13" fill={s.earInner} opacity={0.5} />
              <polygon points="46,13 50,4 52,14" fill={s.earInner} opacity={0.5} />
            </>
          ) : (
            /* Cat/fox pointed ears */
            <>
              <polygon points="25,15 28,0 35,12" fill={s.body} />
              <polygon points="45,12 52,0 55,15" fill={s.body} />
              <polygon points="28,14 30,4 34,13" fill={s.earInner} opacity={0.5} />
              <polygon points="46,13 50,4 52,14" fill={s.earInner} opacity={0.5} />
            </>
          )}

          {/* Eyes (excited, looking forward) */}
          <circle cx="34" cy="20" r="4" fill="white" />
          <circle cx="46" cy="20" r="4" fill="white" />
          <circle cx="34" cy="19" r="2.5" fill={s.face} />
          <circle cx="46" cy="19" r="2.5" fill={s.face} />
          <circle cx="33" cy="18" r="1" fill="white" />
          <circle cx="45" cy="18" r="1" fill="white" />

          {/* Nose */}
          {skin === "pig" ? (
            <>
              <ellipse cx="40" cy="26" rx="5" ry="3.5" fill={s.bodyDark} />
              <circle cx="38" cy="26" r="1" fill={s.face} />
              <circle cx="42" cy="26" r="1" fill={s.face} />
            </>
          ) : skin === "dog" || skin === "bear" ? (
            <ellipse cx="40" cy="26" rx="3" ry="2.5" fill={s.face} />
          ) : (
            <polygon points="40,25 38,28 42,28" fill={s.nose} />
          )}

          {/* Tail */}
          {skin === "rabbit" ? (
            <circle cx="40" cy="92" r="5" fill={s.bodyLight} />
          ) : skin === "pig" ? (
            <path d="M40,90 Q48,88 45,82 Q50,86 46,92" fill={s.bodyDark} />
          ) : (
            <path d="M40,90 Q55,88 60,80 Q58,95 45,92" fill={s.bodyDark} />
          )}

          {/* Paws (running) */}
          <ellipse cx="22" cy="40" rx="6" ry="4" fill={s.bodyLight}
            style={{ animation: "pawRun 0.3s infinite alternate" }} />
          <ellipse cx="58" cy="40" rx="6" ry="4" fill={s.bodyLight}
            style={{ animation: "pawRun 0.3s infinite alternate-reverse" }} />
          <ellipse cx="22" cy="70" rx="6" ry="4" fill={s.bodyLight}
            style={{ animation: "pawRun 0.3s infinite alternate-reverse" }} />
          <ellipse cx="58" cy="70" rx="6" ry="4" fill={s.bodyLight}
            style={{ animation: "pawRun 0.3s infinite alternate" }} />
        </svg>
      </div>

      {/* Direction text */}
      <div className="absolute" style={{
        bottom: "20%",
        color: targetColor,
        fontSize: "22px",
        textShadow: "0 2px 8px rgba(0,0,0,0.1)",
        animation: "bounceIn 0.5s ease",
      }}>
        {s.chaseText} {s.chaseEmoji}
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(-5deg); }
          50% { transform: translateX(3px) rotate(5deg); }
        }
        @keyframes pawRun {
          from { transform: translateY(-3px); }
          to { transform: translateY(3px); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════
// ─── KneadEffect (skin-aware paw prints) ───
// ════════════════════════════════════════════════
export function KneadEffect({ onComplete, skin = "cat" }: { onComplete: () => void; skin?: BlockSkin }) {
  const [pawIndex, setPawIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const s = SKIN_EFFECT[skin];

  useEffect(() => {
    const t1 = setTimeout(() => setPawIndex(1), 200);
    const t2 = setTimeout(() => setPawIndex(2), 700);
    const t3 = setTimeout(() => setPawIndex(3), 1200);
    const t4 = setTimeout(() => setFading(true), 1800);
    const t5 = setTimeout(onComplete, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [onComplete]);

  const pawPositions = [
    { x: 70, y: 90, rot: -15 },
    { x: 170, y: 100, rot: 10 },
    { x: 120, y: 160, rot: -5 },
  ];

  // Paw shapes vary by animal
  const renderPaw = (i: number) => {
    if (skin === "dog" || skin === "bear") {
      // Rounder paw pads
      return (
        <>
          <ellipse cx="20" cy="24" rx="13" ry="11" fill={s.pawColor} />
          <circle cx="10" cy="12" r="5.5" fill={s.pawColor} />
          <circle cx="20" cy="8" r="5.5" fill={s.pawColor} />
          <circle cx="30" cy="12" r="5.5" fill={s.pawColor} />
          <ellipse cx="20" cy="24" rx="9" ry="8" fill={s.pawInner} opacity={0.5} />
          <circle cx="10" cy="12" r="3.8" fill={s.pawInner} opacity={0.4} />
          <circle cx="20" cy="8" r="3.8" fill={s.pawInner} opacity={0.4} />
          <circle cx="30" cy="12" r="3.8" fill={s.pawInner} opacity={0.4} />
          {/* Extra toe for dog */}
          {skin === "dog" && <circle cx="15" cy="5" r="3" fill={s.pawColor} />}
          {skin === "dog" && <circle cx="25" cy="5" r="3" fill={s.pawColor} />}
        </>
      );
    }
    if (skin === "pig") {
      // Pig hoof shape
      return (
        <>
          <ellipse cx="20" cy="20" rx="12" ry="14" fill={s.pawColor} />
          <line x1="20" y1="8" x2="20" y2="32" stroke={s.pawInner} strokeWidth="2" opacity={0.4} />
          <ellipse cx="20" cy="20" rx="8" ry="10" fill={s.pawInner} opacity={0.3} />
        </>
      );
    }
    if (skin === "rabbit") {
      // Bunny foot (longer, oval)
      return (
        <>
          <ellipse cx="20" cy="20" rx="10" ry="16" fill={s.pawColor} />
          <circle cx="14" cy="6" r="4" fill={s.pawColor} />
          <circle cx="20" cy="4" r="4" fill={s.pawColor} />
          <circle cx="26" cy="6" r="4" fill={s.pawColor} />
          <ellipse cx="20" cy="20" rx="7" ry="12" fill={s.pawInner} opacity={0.4} />
        </>
      );
    }
    // Cat / fox: standard paw
    return (
      <>
        <ellipse cx="20" cy="25" rx="12" ry="10" fill={s.pawColor} />
        <circle cx="10" cy="13" r="5" fill={s.pawColor} />
        <circle cx="20" cy="9" r="5" fill={s.pawColor} />
        <circle cx="30" cy="13" r="5" fill={s.pawColor} />
        <ellipse cx="20" cy="25" rx="8" ry="7" fill={s.pawInner} opacity={0.5} />
        <circle cx="10" cy="13" r="3.5" fill={s.pawInner} opacity={0.4} />
        <circle cx="20" cy="9" r="3.5" fill={s.pawInner} opacity={0.4} />
        <circle cx="30" cy="13" r="3.5" fill={s.pawInner} opacity={0.4} />
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      style={{
        background: s.kneadBg,
        perspective: "600px",
      }}>

      <div style={{
        transform: "rotateX(25deg)",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.4s ease",
      }}>
        <svg width="240" height="260" viewBox="0 0 240 260">
          {/* Animal body silhouette (viewed from below) */}
          <ellipse cx="120" cy="50" rx="70" ry="35" fill={s.pawColor} opacity={0.3} />

          {/* Paw prints appearing sequentially */}
          {pawPositions.map((pos, i) => (
            <g key={i} style={{
              opacity: pawIndex > i ? 1 : 0,
              transform: `translate(${pos.x - 20}px, ${pos.y - 15}px) rotate(${pos.rot}deg)`,
              transition: "opacity 0.3s ease",
            }}>
              {renderPaw(i)}

              {/* Press effect ring */}
              {pawIndex === i + 1 && (
                <circle cx="20" cy="20" r="25" fill="none" stroke={s.pawInner} strokeWidth="2" opacity={0.5}
                  style={{ animation: "ripple 0.5s ease-out" }} />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Text */}
      <div className="absolute" style={{
        bottom: "18%",
        color: s.pawInner,
        fontSize: "22px",
        textShadow: "0 2px 8px rgba(0,0,0,0.1)",
        animation: "bounceIn 0.5s ease 0.3s both",
      }}>
        꾹...꾹...꾹... {s.kneadEmoji}
      </div>

      <style>{`
        @keyframes ripple {
          from { r: 15; opacity: 0.8; }
          to { r: 35; opacity: 0; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
