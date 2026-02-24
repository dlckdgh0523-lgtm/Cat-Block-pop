import React, { useState, useEffect, useRef, useCallback } from "react";
import { type BlockSkin, getSkinDef } from "./skins-data";
import { type CatType } from "./game-logic";
import { playTouchReaction } from "./sound-effects";

type TouchPhase = "idle" | "transitioning" | "reacting" | "returning";

/** Lerp helper */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
/** Clamp 0-1 */
function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

export function LobbyCharacter({ skin, catType, size = 180, onTouch }: {
  skin: BlockSkin; catType: CatType; size?: number; onTouch?: () => void;
}) {
  const [eyeDir, setEyeDir] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const [touchPhase, setTouchPhase] = useState<TouchPhase>("idle");
  const [reactT, setReactT] = useState(0); // 0=idle, 1=fully reacting (smooth)
  const animRef = useRef<number>(0);
  const targetRef = useRef(0);

  const skinDef = getSkinDef(skin);
  const colors = skinDef.colors[catType] || skinDef.colors[0];

  // Eye wandering
  useEffect(() => {
    const DIRS = [0, -1, -1, 0, 1, 1, 0, 0];
    let idx = 0;
    const interval = setInterval(() => { idx = (idx + 1) % DIRS.length; setEyeDir(DIRS[idx]); }, 1400);
    return () => clearInterval(interval);
  }, []);

  // Blinking
  useEffect(() => {
    const blink = () => { setBlinking(true); setTimeout(() => setBlinking(false), 130); };
    const interval = setInterval(blink, 3200 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Smooth reactT transition
  useEffect(() => {
    let running = true;
    const animate = () => {
      if (!running) return;
      setReactT(prev => {
        const target = targetRef.current;
        const diff = target - prev;
        if (Math.abs(diff) < 0.005) return target;
        // Faster rise (0.18), slower fall (0.08)
        const speed = target > prev ? 0.18 : 0.08;
        return prev + diff * speed;
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, []);

  const handleTouch = useCallback(() => {
    if (touchPhase === "reacting" || touchPhase === "transitioning") return;
    onTouch?.();
    playTouchReaction(skin);
    setTouchPhase("transitioning");
    targetRef.current = 1;
    setTimeout(() => {
      setTouchPhase("reacting");
      setTimeout(() => {
        setTouchPhase("returning");
        targetRef.current = 0;
        setTimeout(() => setTouchPhase("idle"), 800);
      }, 1200);
    }, 200);
  }, [touchPhase, onTouch, skin]);

  const s = size / 180;
  const cx = size / 2;
  const cy = size / 2 + 8 * s;
  const t = reactT; // transition progress 0→1

  const bodyColor = colors.color;
  const darkColor = colors.darkColor;
  const lightColor = colors.lightColor;
  const faceColor = colors.faceColor;

  const uid = `lc-${skin}-${catType}`;

  // ─── Per-skin ear rendering ───
  const renderEars = () => {
    switch (skin) {
      case "cat":
        return <>
          <path d={`M${cx - 38 * s},${cy - 48 * s} L${cx - 22 * s},${cy - 82 * s} L${cx - 4 * s},${cy - 44 * s} Z`}
            fill={`url(#${uid}-bodyGrad)`} stroke={darkColor} strokeWidth={0.6 * s} strokeOpacity={0.2} />
          <path d={`M${cx - 34 * s},${cy - 50 * s} L${cx - 22 * s},${cy - 72 * s} L${cx - 10 * s},${cy - 46 * s} Z`}
            fill="#FFB5C5" opacity={0.55} />
          <path d={`M${cx + 4 * s},${cy - 44 * s} L${cx + 22 * s},${cy - 82 * s} L${cx + 38 * s},${cy - 48 * s} Z`}
            fill={`url(#${uid}-bodyGrad)`} stroke={darkColor} strokeWidth={0.6 * s} strokeOpacity={0.2} />
          <path d={`M${cx + 10 * s},${cy - 46 * s} L${cx + 22 * s},${cy - 72 * s} L${cx + 34 * s},${cy - 50 * s} Z`}
            fill="#FFB5C5" opacity={0.55} />
        </>;
      case "pig":
        return <>
          <ellipse cx={cx - 30 * s} cy={cy - 54 * s} rx={16 * s} ry={13 * s} fill={`url(#${uid}-bodyGrad)`}
            transform={`rotate(-20,${cx - 30 * s},${cy - 54 * s})`} stroke={darkColor} strokeWidth={0.4 * s} strokeOpacity={0.15} />
          <ellipse cx={cx - 28 * s} cy={cy - 52 * s} rx={9 * s} ry={7 * s} fill="#FFB5C2" opacity={0.5}
            transform={`rotate(-20,${cx - 28 * s},${cy - 52 * s})`} />
          <ellipse cx={cx + 30 * s} cy={cy - 54 * s} rx={16 * s} ry={13 * s} fill={`url(#${uid}-bodyGrad)`}
            transform={`rotate(20,${cx + 30 * s},${cy - 54 * s})`} stroke={darkColor} strokeWidth={0.4 * s} strokeOpacity={0.15} />
          <ellipse cx={cx + 28 * s} cy={cy - 52 * s} rx={9 * s} ry={7 * s} fill="#FFB5C2" opacity={0.5}
            transform={`rotate(20,${cx + 28 * s},${cy - 52 * s})`} />
        </>;
      case "dog":
        return <>
          <ellipse cx={cx - 38 * s} cy={cy - 28 * s} rx={14 * s} ry={28 * s} fill={darkColor}
            transform={`rotate(-8,${cx - 38 * s},${cy - 28 * s})`} />
          <ellipse cx={cx - 36 * s} cy={cy - 26 * s} rx={8 * s} ry={18 * s} fill={lightColor} opacity={0.3}
            transform={`rotate(-8,${cx - 36 * s},${cy - 26 * s})`} />
          <ellipse cx={cx + 38 * s} cy={cy - 28 * s} rx={14 * s} ry={28 * s} fill={darkColor}
            transform={`rotate(8,${cx + 38 * s},${cy - 28 * s})`} />
          <ellipse cx={cx + 36 * s} cy={cy - 26 * s} rx={8 * s} ry={18 * s} fill={lightColor} opacity={0.3}
            transform={`rotate(8,${cx + 36 * s},${cy - 26 * s})`} />
        </>;
      case "fox":
        return <>
          <path d={`M${cx - 42 * s},${cy - 46 * s} L${cx - 24 * s},${cy - 88 * s} L${cx - 5 * s},${cy - 42 * s} Z`}
            fill={bodyColor} stroke={darkColor} strokeWidth={0.4 * s} strokeOpacity={0.15} />
          <path d={`M${cx - 38 * s},${cy - 48 * s} L${cx - 24 * s},${cy - 76 * s} L${cx - 10 * s},${cy - 44 * s} Z`}
            fill="white" opacity={0.35} />
          <path d={`M${cx + 5 * s},${cy - 42 * s} L${cx + 24 * s},${cy - 88 * s} L${cx + 42 * s},${cy - 46 * s} Z`}
            fill={bodyColor} stroke={darkColor} strokeWidth={0.4 * s} strokeOpacity={0.15} />
          <path d={`M${cx + 10 * s},${cy - 44 * s} L${cx + 24 * s},${cy - 76 * s} L${cx + 38 * s},${cy - 48 * s} Z`}
            fill="white" opacity={0.35} />
        </>;
      case "rabbit":
        return <>
          <ellipse cx={cx - 15 * s} cy={cy - 82 * s} rx={11 * s} ry={36 * s} fill={`url(#${uid}-bodyGrad)`}
            stroke={darkColor} strokeWidth={0.6 * s} strokeOpacity={0.12} />
          <ellipse cx={cx - 15 * s} cy={cy - 82 * s} rx={5 * s} ry={22 * s} fill="#FFB5C5" opacity={0.45} />
          <ellipse cx={cx + 15 * s} cy={cy - 82 * s} rx={11 * s} ry={36 * s} fill={`url(#${uid}-bodyGrad)`}
            stroke={darkColor} strokeWidth={0.6 * s} strokeOpacity={0.12} />
          <ellipse cx={cx + 15 * s} cy={cy - 82 * s} rx={5 * s} ry={22 * s} fill="#FFB5C5" opacity={0.45} />
        </>;
      case "bear":
        return <>
          <circle cx={cx - 34 * s} cy={cy - 50 * s} r={17 * s} fill={darkColor} />
          <circle cx={cx - 34 * s} cy={cy - 50 * s} r={10 * s} fill={lightColor} opacity={0.4} />
          <circle cx={cx + 34 * s} cy={cy - 50 * s} r={17 * s} fill={darkColor} />
          <circle cx={cx + 34 * s} cy={cy - 50 * s} r={10 * s} fill={lightColor} opacity={0.4} />
        </>;
      default: return null;
    }
  };

  // ─── Big anime eyes with proper closing ───
  const eyeOffX = eyeDir * 2.5 * s;

  const renderEyes = () => {
    const leftEyeCx = cx - 18 * s + eyeOffX;
    const rightEyeCx = cx + 18 * s + eyeOffX;
    const eyeCy = cy - 24 * s;

    // Iris color per skin
    const irisColors: Record<BlockSkin, [string, string]> = {
      cat: ["#FFB347", "#E8873A"],
      pig: ["#FF8FAA", "#E06888"],
      dog: ["#8B6B4A", "#6B4B2A"],
      fox: ["#4CAF50", "#2E7D32"],
      rabbit: ["#FF69B4", "#E04090"],
      bear: ["#2A2A2A", "#1A1A1A"],
    };
    const [irisC1, irisC2] = irisColors[skin] || irisColors.cat;

    // ── Blink state (unrelated to touch) ──
    if (blinking && t < 0.3) {
      return <>
        <path d={`M${leftEyeCx - 10 * s},${eyeCy} Q${leftEyeCx},${eyeCy - 4 * s} ${leftEyeCx + 10 * s},${eyeCy}`}
          stroke={faceColor} strokeWidth={2.5 * s} strokeLinecap="round" fill="none" />
        <path d={`M${rightEyeCx - 10 * s},${eyeCy} Q${rightEyeCx},${eyeCy - 4 * s} ${rightEyeCx + 10 * s},${eyeCy}`}
          stroke={faceColor} strokeWidth={2.5 * s} strokeLinecap="round" fill="none" />
      </>;
    }

    // ── Touch reaction: smoothly transition from open eyes → happy squint ^_^ ──
    // Phase 1 (t 0→0.35): eyes start shrinking
    // Phase 2 (t 0.35→0.65): cross-fade from round eyes to happy arcs
    // Phase 3 (t 0.65→1): fully happy squinted eyes only

    const openEyeOpacity = clamp01(1 - (t - 0.2) * 2.5); // 1 at t=0, 0 at t=0.6
    const squintArcOpacity = clamp01((t - 0.15) * 2.5);    // 0 at t=0.15, 1 at t=0.55

    const eyeRX = lerp(13, 8, clamp01(t * 1.5)) * s;
    const eyeRY = lerp(14, 3, clamp01(t * 1.5)) * s;
    const pupilR = lerp(7, 2, clamp01(t * 1.5)) * s;
    const irisR = lerp(9, 3, clamp01(t * 1.5)) * s;

    // Happy squint arc dimensions
    const arcW = lerp(10, 14, clamp01(t)) * s;
    const arcH = lerp(3, 6, clamp01(t)) * s;
    const arcStroke = lerp(2, 3, clamp01(t)) * s;

    return <>
      {/* ── Open round eyes (fade out during touch) ── */}
      {openEyeOpacity > 0.01 && <>
        {/* Left eye */}
        <ellipse cx={leftEyeCx} cy={eyeCy} rx={eyeRX} ry={eyeRY} fill="white"
          stroke={faceColor} strokeWidth={0.8 * s} strokeOpacity={0.15}
          opacity={openEyeOpacity} />
        <ellipse cx={leftEyeCx + eyeOffX * 0.5} cy={eyeCy + 1 * s} rx={irisR} ry={Math.min(irisR, eyeRY - 1 * s)}
          fill={`url(#${uid}-iris)`} opacity={openEyeOpacity} />
        <circle cx={leftEyeCx + eyeOffX * 0.5} cy={eyeCy + 2 * s} r={Math.min(pupilR, eyeRY - 2 * s)}
          fill={irisC2} opacity={openEyeOpacity} />
        {/* Highlights */}
        <circle cx={leftEyeCx - 3 * s} cy={eyeCy - 4 * s} r={lerp(3.5, 1.5, t) * s}
          fill="white" opacity={openEyeOpacity * 0.9} />
        <circle cx={leftEyeCx + 2 * s} cy={eyeCy - 1 * s} r={lerp(1.8, 0.8, t) * s}
          fill="white" opacity={openEyeOpacity * 0.6} />

        {/* Right eye */}
        <ellipse cx={rightEyeCx} cy={eyeCy} rx={eyeRX} ry={eyeRY} fill="white"
          stroke={faceColor} strokeWidth={0.8 * s} strokeOpacity={0.15}
          opacity={openEyeOpacity} />
        <ellipse cx={rightEyeCx + eyeOffX * 0.5} cy={eyeCy + 1 * s} rx={irisR} ry={Math.min(irisR, eyeRY - 1 * s)}
          fill={`url(#${uid}-iris)`} opacity={openEyeOpacity} />
        <circle cx={rightEyeCx + eyeOffX * 0.5} cy={eyeCy + 2 * s} r={Math.min(pupilR, eyeRY - 2 * s)}
          fill={irisC2} opacity={openEyeOpacity} />
        <circle cx={rightEyeCx - 3 * s} cy={eyeCy - 4 * s} r={lerp(3.5, 1.5, t) * s}
          fill="white" opacity={openEyeOpacity * 0.9} />
        <circle cx={rightEyeCx + 2 * s} cy={eyeCy - 1 * s} r={lerp(1.8, 0.8, t) * s}
          fill="white" opacity={openEyeOpacity * 0.6} />
      </>}

      {/* ── Happy squint arcs ^_^ (fade in during touch) ── */}
      {squintArcOpacity > 0.01 && <>
        {/* Left happy eye - upward curve like ^  */}
        <path d={`M${leftEyeCx - arcW},${eyeCy + 2 * s} Q${leftEyeCx},${eyeCy - arcH} ${leftEyeCx + arcW},${eyeCy + 2 * s}`}
          stroke={faceColor} strokeWidth={arcStroke} strokeLinecap="round" fill="none"
          opacity={squintArcOpacity} />
        {/* Small lash accent */}
        {squintArcOpacity > 0.5 && <>
          <circle cx={leftEyeCx - arcW * 0.3} cy={eyeCy - arcH * 0.4} r={1.2 * s}
            fill={faceColor} opacity={squintArcOpacity * 0.3} />
          <circle cx={leftEyeCx + arcW * 0.3} cy={eyeCy - arcH * 0.4} r={1.2 * s}
            fill={faceColor} opacity={squintArcOpacity * 0.3} />
        </>}

        {/* Right happy eye */}
        <path d={`M${rightEyeCx - arcW},${eyeCy + 2 * s} Q${rightEyeCx},${eyeCy - arcH} ${rightEyeCx + arcW},${eyeCy + 2 * s}`}
          stroke={faceColor} strokeWidth={arcStroke} strokeLinecap="round" fill="none"
          opacity={squintArcOpacity} />
        {squintArcOpacity > 0.5 && <>
          <circle cx={rightEyeCx - arcW * 0.3} cy={eyeCy - arcH * 0.4} r={1.2 * s}
            fill={faceColor} opacity={squintArcOpacity * 0.3} />
          <circle cx={rightEyeCx + arcW * 0.3} cy={eyeCy - arcH * 0.4} r={1.2 * s}
            fill={faceColor} opacity={squintArcOpacity * 0.3} />
        </>}
      </>}
    </>;
  };

  // ─── Nose & Snout ───
  const renderNose = () => {
    const noseY = cy - lerp(8, 6, t) * s;
    switch (skin) {
      case "pig":
        return <>
          <ellipse cx={cx} cy={noseY} rx={12 * s} ry={9 * s} fill={darkColor} opacity={0.35} />
          <ellipse cx={cx} cy={noseY} rx={9 * s} ry={6 * s} fill={lightColor} opacity={0.3} />
          <circle cx={cx - 3.5 * s} cy={noseY} r={2.5 * s} fill={faceColor} opacity={0.5} />
          <circle cx={cx + 3.5 * s} cy={noseY} r={2.5 * s} fill={faceColor} opacity={0.5} />
        </>;
      case "dog":
      case "bear":
        return <>
          <ellipse cx={cx} cy={noseY + 2 * s} rx={10 * s} ry={7 * s} fill={lightColor} opacity={0.5} />
          <ellipse cx={cx} cy={noseY} rx={6 * s} ry={4 * s} fill={faceColor} opacity={0.65} />
          <ellipse cx={cx - 1 * s} cy={noseY - 1.5 * s} rx={2 * s} ry={1 * s} fill="white" opacity={0.4} />
        </>;
      case "rabbit":
        return <>
          <circle cx={cx} cy={noseY} r={4 * s} fill="#FFB5C5" opacity={0.7} />
          <circle cx={cx - 0.5 * s} cy={noseY - 1 * s} r={1 * s} fill="white" opacity={0.4} />
        </>;
      case "fox":
        return <>
          <path d={`M${cx},${noseY - 4 * s} L${cx - 5 * s},${noseY + 2 * s} L${cx + 5 * s},${noseY + 2 * s} Z`}
            fill={faceColor} opacity={0.55} />
          <ellipse cx={cx} cy={noseY - 2 * s} rx={1.5 * s} ry={1 * s} fill="white" opacity={0.35} />
        </>;
      default: // cat
        return <>
          <path d={`M${cx},${noseY - 3 * s} L${cx - 5 * s},${noseY + 2 * s} L${cx + 5 * s},${noseY + 2 * s} Z`}
            fill="#E8739A" />
          <ellipse cx={cx} cy={noseY - 1 * s} rx={1.5 * s} ry={0.8 * s} fill="white" opacity={0.35} />
        </>;
    }
  };

  // ─── Mouth ───
  const renderMouth = () => {
    const mouthY = cy + lerp(3, 6, t) * s;
    const mouthW = lerp(7, 12, t) * s;
    const mouthCurve = lerp(5, 12, t) * s;

    if (skin === "bear" && t > 0.5) {
      return <>
        <path d={`M${cx - mouthW},${mouthY} L${cx},${mouthY + 4 * s} L${cx + mouthW},${mouthY}`}
          stroke={faceColor} strokeWidth={2.2 * s} fill="none" strokeLinecap="round" />
        <polygon points={`${cx - 2 * s},${mouthY + 1 * s} ${cx},${mouthY + 4 * s} ${cx + 2 * s},${mouthY + 1 * s}`}
          fill="white" opacity={t * 0.8} />
      </>;
    }

    // Dog: tongue out when reacting
    if (skin === "dog" && t > 0.4) {
      const tongueOpacity = clamp01((t - 0.4) * 2.5);
      return <>
        <path d={`M${cx - mouthW},${mouthY} Q${cx},${mouthY + mouthCurve} ${cx + mouthW},${mouthY}`}
          stroke={faceColor} strokeWidth={2 * s} fill="none" strokeLinecap="round" />
        {/* Tongue */}
        <ellipse cx={cx} cy={mouthY + mouthCurve * 0.6} rx={5 * s} ry={lerp(0, 6, tongueOpacity) * s}
          fill="#FF7C9E" opacity={tongueOpacity * 0.8} />
        <ellipse cx={cx} cy={mouthY + mouthCurve * 0.6 - 1 * s} rx={3 * s} ry={lerp(0, 3, tongueOpacity) * s}
          fill="#FFB0C0" opacity={tongueOpacity * 0.5} />
      </>;
    }

    return (
      <path d={`M${cx - mouthW},${mouthY} Q${cx},${mouthY + mouthCurve} ${cx + mouthW},${mouthY}`}
        stroke={faceColor} strokeWidth={2 * s} fill="none" strokeLinecap="round" />
    );
  };

  // ─── Whiskers (cat & fox) ───
  const renderWhiskers = () => {
    if (skin !== "cat" && skin !== "fox") return null;
    const wY = cy - 8 * s;
    // Whiskers wiggle slightly during touch
    const wiggle = t > 0.3 ? Math.sin(t * Math.PI * 2) * 2 * s : 0;
    return <>
      <line x1={cx - 50 * s} y1={wY - 5 * s + wiggle} x2={cx - 20 * s} y2={wY} stroke={faceColor} strokeWidth={1.2 * s} opacity={0.3} strokeLinecap="round" />
      <line x1={cx - 48 * s} y1={wY + 4 * s - wiggle} x2={cx - 20 * s} y2={wY + 3 * s} stroke={faceColor} strokeWidth={1.2 * s} opacity={0.3} strokeLinecap="round" />
      <line x1={cx + 50 * s} y1={wY - 5 * s + wiggle} x2={cx + 20 * s} y2={wY} stroke={faceColor} strokeWidth={1.2 * s} opacity={0.3} strokeLinecap="round" />
      <line x1={cx + 48 * s} y1={wY + 4 * s - wiggle} x2={cx + 20 * s} y2={wY + 3 * s} stroke={faceColor} strokeWidth={1.2 * s} opacity={0.3} strokeLinecap="round" />
    </>;
  };

  // ─── Blush cheeks (intensify on touch) ───
  const blushOpacity = lerp(0.35, 0.75, t);
  const blushR = lerp(8, 11, t) * s;

  // ─── Touch particle effects ───
  const renderTouchEffects = () => {
    if (t < 0.3) return null;
    const op = clamp01((t - 0.3) * 2);
    const floatY = -35 * clamp01((t - 0.3) * 1.5) * s;

    const effectMap: Record<BlockSkin, React.ReactNode> = {
      cat: <>
        <text x={cx - 10 * s} y={cy - 65 * s + floatY} fontSize={16 * s} opacity={op}>💕</text>
        <text x={cx + 14 * s} y={cy - 52 * s + floatY * 0.7} fontSize={12 * s} opacity={op * 0.8}>💖</text>
        <text x={cx - 24 * s} y={cy - 48 * s + floatY * 0.5} fontSize={10 * s} opacity={op * 0.6}>❤️</text>
      </>,
      dog: <>
        <text x={cx - 28 * s} y={cy - 58 * s + floatY} fontSize={14 * s} opacity={op}>✨</text>
        <text x={cx + 18 * s} y={cy - 62 * s + floatY * 0.8} fontSize={11 * s} opacity={op * 0.8}>✨</text>
        <text x={cx + 2 * s} y={cy - 50 * s + floatY * 0.6} fontSize={16 * s} opacity={op * 0.7}>🦴</text>
      </>,
      pig: <>
        <text x={cx - 12 * s} y={cy - 60 * s + floatY} fontSize={14 * s} opacity={op}>🌸</text>
        <text x={cx + 16 * s} y={cy - 55 * s + floatY * 0.7} fontSize={12 * s} opacity={op * 0.8}>💗</text>
      </>,
      rabbit: <>
        <text x={cx + 20 * s} y={cy - 60 * s + floatY} fontSize={14 * s} opacity={op}>⭐</text>
        <text x={cx - 26 * s} y={cy - 52 * s + floatY * 0.8} fontSize={11 * s} opacity={op * 0.8}>✨</text>
        <text x={cx} y={cy - 68 * s + floatY * 0.5} fontSize={12 * s} opacity={op * 0.6}>🥕</text>
      </>,
      fox: <>
        <text x={cx - 8 * s} y={cy - 62 * s + floatY} fontSize={14 * s} opacity={op}>💛</text>
        <text x={cx + 18 * s} y={cy - 54 * s + floatY * 0.6} fontSize={12 * s} opacity={op * 0.7}>🍂</text>
      </>,
      bear: <>
        <text x={cx + 22 * s} y={cy - 56 * s + floatY * 0.5} fontSize={14 * s} opacity={op}>💢</text>
        <text x={cx - 30 * s} y={cy - 50 * s + floatY * 0.3} fontSize={12 * s} opacity={op * 0.8}>😤</text>
      </>,
    };

    return effectMap[skin] || null;
  };

  // ─── Tail ───
  const renderTail = () => {
    const tailWag = t > 0.2 ? Math.sin(t * Math.PI * 6) * 4 * s : 0;
    if (skin === "rabbit") {
      return <circle cx={cx + 48 * s} cy={cy + 28 * s} r={lerp(10, 12, t) * s} fill="white" stroke={darkColor} strokeWidth={0.3 * s} strokeOpacity={0.12} />;
    }
    if (skin === "pig") {
      return <path d={`M${cx + 45 * s},${cy + 30 * s} Q${cx + 58 * s},${cy + 20 * s + tailWag} ${cx + 52 * s},${cy + 14 * s} Q${cx + 62 * s},${cy + 8 * s - tailWag} ${cx + 54 * s},${cy + 3 * s}`}
        stroke={bodyColor} strokeWidth={4 * s} fill="none" strokeLinecap="round" />;
    }
    if (skin === "dog") {
      // Dog tail wags more vigorously on touch
      const dogWag = t > 0.2 ? Math.sin(t * Math.PI * 8) * 8 * s : 0;
      return <>
        <path d={`M${cx + 44 * s},${cy + 28 * s} Q${cx + 70 * s + dogWag},${cy + 6 * s} ${cx + 58 * s + dogWag * 0.5},${cy - 10 * s}`}
          stroke={`url(#${uid}-bodyGrad)`} strokeWidth={10 * s} fill="none" strokeLinecap="round" />
        <path d={`M${cx + 58 * s + dogWag * 0.5},${cy - 10 * s} Q${cx + 50 * s + dogWag},${cy - 18 * s} ${cx + 55 * s + dogWag * 0.3},${cy - 24 * s}`}
          stroke={darkColor} strokeWidth={9 * s} fill="none" strokeLinecap="round" opacity={0.75} />
      </>;
    }
    // Cat, fox, bear
    return <>
      <path d={`M${cx + 44 * s},${cy + 28 * s} Q${cx + 70 * s + tailWag},${cy + 6 * s} ${cx + 58 * s},${cy - 10 * s}`}
        stroke={`url(#${uid}-bodyGrad)`} strokeWidth={10 * s} fill="none" strokeLinecap="round" />
      <path d={`M${cx + 58 * s},${cy - 10 * s} Q${cx + 50 * s},${cy - 18 * s} ${cx + 55 * s},${cy - 24 * s}`}
        stroke={darkColor} strokeWidth={9 * s} fill="none" strokeLinecap="round" opacity={0.75} />
    </>;
  };

  // ─── Body squish on touch ───
  const bodyScaleX = lerp(1, skin === "rabbit" ? 0.96 : 1.04, t);
  const bodyScaleY = lerp(1, skin === "rabbit" ? 1.08 : 0.94, t);
  const bodyTranslateY = lerp(0, skin === "rabbit" ? -6 : 4, t);

  // ─── Iris gradient colors ───
  const irisGradColors: Record<BlockSkin, [string, string]> = {
    cat: ["#FFD080", "#E8873A"],
    pig: ["#FFB0C8", "#E06888"],
    dog: ["#A08060", "#6B4B2A"],
    fox: ["#80D080", "#2E7D32"],
    rabbit: ["#FF90C0", "#E04090"],
    bear: ["#505050", "#1A1A1A"],
  };
  const [iris1, iris2] = irisGradColors[skin] || irisGradColors.cat;

  return (
    <svg width={size} height={size + 30 * s} viewBox={`0 0 ${size} ${size + 30 * s}`}
      style={{ overflow: "visible", cursor: "pointer" }}
      onClick={handleTouch}>
      <defs>
        <radialGradient id={`${uid}-bodyGrad`} cx="42%" cy="38%" r="58%">
          <stop offset="0%" stopColor={lightColor} />
          <stop offset="100%" stopColor={bodyColor} />
        </radialGradient>
        <radialGradient id={`${uid}-headGrad`} cx="38%" cy="32%" r="62%">
          <stop offset="0%" stopColor={lightColor} />
          <stop offset="80%" stopColor={bodyColor} />
          <stop offset="100%" stopColor={darkColor} stopOpacity={0.2} />
        </radialGradient>
        <radialGradient id={`${uid}-shadowGrad`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id={`${uid}-iris`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={iris1} />
          <stop offset="100%" stopColor={iris2} />
        </radialGradient>
        <radialGradient id={`${uid}-blush`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF8FAA" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF8FAA" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-softShadow`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx={0} dy={2 * s} stdDeviation={3 * s} floodColor="rgba(0,0,0,0.08)" />
        </filter>
      </defs>

      <g style={{
        transform: `translate(0px, ${bodyTranslateY * s}px) scale(${bodyScaleX}, ${bodyScaleY})`,
        transformOrigin: `${cx}px ${cy + 20 * s}px`,
        transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        {/* Ground shadow */}
        <ellipse cx={cx} cy={cy + 62 * s} rx={58 * s} ry={10 * s} fill={`url(#${uid}-shadowGrad)`} />

        {/* Body */}
        <ellipse cx={cx} cy={cy + 16 * s} rx={54 * s} ry={50 * s}
          fill={`url(#${uid}-bodyGrad)`} stroke={darkColor} strokeWidth={0.5 * s} strokeOpacity={0.1}
          filter={`url(#${uid}-softShadow)`} />
        {/* Body highlight */}
        <ellipse cx={cx - 10 * s} cy={cy + 5 * s} rx={28 * s} ry={22 * s} fill="white" opacity={0.12} />
        {/* Belly */}
        <ellipse cx={cx} cy={cy + 28 * s} rx={38 * s} ry={32 * s} fill={lightColor} opacity={0.5} />
        <ellipse cx={cx} cy={cy + 22 * s} rx={25 * s} ry={20 * s} fill="white" opacity={0.12} />

        {/* Tail */}
        {renderTail()}

        {/* Head */}
        <circle cx={cx} cy={cy - 24 * s} r={46 * s} fill={`url(#${uid}-headGrad)`}
          stroke={darkColor} strokeWidth={0.5 * s} strokeOpacity={0.08}
          filter={`url(#${uid}-softShadow)`} />
        {/* Head highlight */}
        <ellipse cx={cx - 10 * s} cy={cy - 42 * s} rx={22 * s} ry={14 * s} fill="white" opacity={0.18} />
        <ellipse cx={cx + 5 * s} cy={cy - 52 * s} rx={10 * s} ry={6 * s} fill="white" opacity={0.1} />

        {/* Ears */}
        {renderEars()}

        {/* Face area lighter (for fox, bear) */}
        {(skin === "fox" || skin === "bear") && (
          <ellipse cx={cx} cy={cy - 15 * s} rx={28 * s} ry={22 * s} fill="white" opacity={skin === "fox" ? 0.35 : 0.2} />
        )}

        {/* Eyes */}
        {renderEyes()}

        {/* Nose */}
        {renderNose()}

        {/* Mouth */}
        {renderMouth()}

        {/* Whiskers */}
        {renderWhiskers()}

        {/* Blush cheeks */}
        <circle cx={cx - 30 * s} cy={cy - 10 * s} r={blushR} fill={`url(#${uid}-blush)`} opacity={blushOpacity} />
        <circle cx={cx + 30 * s} cy={cy - 10 * s} r={blushR} fill={`url(#${uid}-blush)`} opacity={blushOpacity} />

        {/* Paws */}
        <ellipse cx={cx - 24 * s} cy={cy + 54 * s} rx={15 * s} ry={10 * s} fill={`url(#${uid}-bodyGrad)`}
          stroke={darkColor} strokeWidth={0.4 * s} strokeOpacity={0.12} />
        <ellipse cx={cx + 24 * s} cy={cy + 54 * s} rx={15 * s} ry={10 * s} fill={`url(#${uid}-bodyGrad)`}
          stroke={darkColor} strokeWidth={0.4 * s} strokeOpacity={0.12} />
        {/* Paw pads */}
        <ellipse cx={cx - 24 * s} cy={cy + 56 * s} rx={5 * s} ry={3 * s} fill={darkColor} opacity={0.12} />
        <ellipse cx={cx + 24 * s} cy={cy + 56 * s} rx={5 * s} ry={3 * s} fill={darkColor} opacity={0.12} />

        {/* Touch effects */}
        {renderTouchEffects()}
      </g>
    </svg>
  );
}
