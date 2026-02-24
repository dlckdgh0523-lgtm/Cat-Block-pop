import React, { useState, useEffect, useCallback, useRef } from "react";
import { CatCell } from "./cat-cell";
import { type CatType } from "./game-logic";
import { BlackPaw, WhitePaw } from "./paw-icons";
import { type PlayerProgress, type BlockSkin, SPECIAL_CAT_ICONS, calculateTotalStars, getSkinDef, getBoardTheme } from "./skins-data";
import {
  initKakaoSDK, kakaoSilentLogin, getKakaoFriends, isKakaoLoggedIn,
  type KakaoFriend, shareGameViaKakao,
} from "./kakao-sdk";
import {
  initGoogleSDK, googleSilentSignIn, getGoogleFriends, type GoogleFriend,
} from "./google-sdk";
import { initAdMob, loadInterstitialAd, showInterstitialAd, loadRewardedAd, canShowAd, recordAdShown } from "./admob-sdk";
import { LobbyCharacter } from "./lobby-character";
import { useAuthOptional } from "./auth-context";
import { AuthModal } from "./auth-modal";

// ─── Unified Friend type for merged ranking ───
interface UnifiedFriend {
  id: string;
  nickname: string;
  score: number;
  stars: number;
  catType: number;
  rank: number;
  platform: "kakao" | "google" | "me";
  profileImage?: string;
}

function mergeAllFriends(
  kakaoFriends: KakaoFriend[],
  googleFriends: GoogleFriend[],
  myScore: number,
  myStars: number,
  myNickname: string,
): UnifiedFriend[] {
  const all: UnifiedFriend[] = [];

  // Deduplicate by nickname (cross-platform same person)
  const seenNicknames = new Set<string>();

  for (const kf of kakaoFriends) {
    all.push({ ...kf, platform: "kakao" });
    seenNicknames.add(kf.nickname);
  }
  for (const gf of googleFriends) {
    if (!seenNicknames.has(gf.nickname)) {
      all.push({ ...gf, platform: "google" });
      seenNicknames.add(gf.nickname);
    }
  }

  // Add me
  all.push({
    id: "me",
    nickname: myNickname,
    score: myScore,
    stars: myStars,
    catType: 0,
    rank: 0,
    platform: "me",
  });

  // Sort descending
  all.sort((a, b) => b.score - a.score);
  all.forEach((f, i) => { f.rank = i + 1; });

  return all;
}

interface LobbyProps {
  bestScore: number;
  blackPaw: number;
  whitePaw: number;
  progress: PlayerProgress;
  onStartGame: () => void;
  onOpenSidebar: () => void;
  lobbyBgmOn: boolean;
  onToggleLobbyBgm: () => void;
  adRemoved?: boolean;
  lastGameScore?: number;
  previousBestScore?: number;
}

// ─── Tutorial Overlay ───
function TutorialOverlay({ onClose, accent, gradient }: { onClose: () => void; accent: string; gradient: string }) {
  const [step, setStep] = useState(0);
  const steps = [
    { emoji: "🎮", title: "게임 시작!", text: "블록을 드래그하여 8×8 보드에 놓아보세요.\n가로/세로 줄을 완성하면 클리어!" },
    { emoji: "☰", title: "메뉴 (사이드바)", text: "왼쪽 상단 ☰ 버튼을 누르면\n상점, 도감, 내 고양이, 퀘스트 등\n모든 메뉴를 확인할 수 있어요." },
    { emoji: "🛒", title: "상점", text: "아이템, 블록 스킨, 프리미엄 포인트를\n구매할 수 있는 곳이에요!\n위기를 탈출하는 아이템도 있어요." },
    { emoji: "📖", title: "도감 & 퀘스트", text: "퀘스트를 클리어하면 특별한 고양이를\n수집할 수 있어요! 도감에서\n내가 모은 고양이를 확인하세요." },
    { emoji: "🐱", title: "터치해보세요!", text: "로비에서 캐릭터를 터치하면\n귀여운 반응을 볼 수 있어요!\n스킨마다 반응이 달라요~" },
  ];

  const currentStep = steps[step];
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-[320px] rounded-3xl p-6 text-center"
        style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div className="text-4xl mb-3">{currentStep.emoji}</div>
        <h3 className="text-lg mb-2" style={{ color: accent }}>{currentStep.title}</h3>
        <p className="text-xs mb-5 whitespace-pre-line" style={{ color: "#8A7080", lineHeight: "1.8" }}>{currentStep.text}</p>

        <div className="flex items-center justify-center gap-1.5 mb-4">
          {steps.map((_, i) => (
            <div key={i} className="rounded-full transition-all" style={{
              width: i === step ? 20 : 6, height: 6,
              background: i === step ? accent : "rgba(232,115,154,0.25)",
            }} />
          ))}
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95"
              style={{ background: "rgba(255,181,194,0.15)", color: accent, border: `1px solid ${accent}30` }}>
              ← 이전
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex-1 py-2.5 rounded-xl text-white cursor-pointer transition-all active:scale-95"
              style={{ background: gradient }}>
              다음 →
            </button>
          ) : (
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-white cursor-pointer transition-all active:scale-95"
              style={{ background: gradient }}>
              시작하기! 🎮
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Pre-game Ad ───
function PreGameAd({ onClose, accent, gradient }: { onClose: () => void; accent: string; gradient: string }) {
  const [timer, setTimer] = useState(3);
  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="w-full max-w-[340px] rounded-2xl overflow-hidden" style={{ background: "#1a1a2e" }}>
        <div className="p-6 text-center">
          <p className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>광고</p>
          <div className="rounded-xl p-5 mb-4" style={{ background: "linear-gradient(135deg, #FF6B8A, #FF8E53)" }}>
            <span className="text-3xl">🐱</span>
            <p className="text-lg mt-2 text-white">Cat Block Pop</p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>최고의 퍼즐 게임과 함께하세요!</p>
          </div>
          {timer > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ border: "2px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.5)" }}>
                <span>{timer}</span>
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{timer}초 후 시</p>
            </div>
          ) : (
            <button onClick={onClose}
              className="w-full py-3 rounded-xl text-white cursor-pointer transition-all active:scale-95"
              style={{ background: gradient }}>
              ✖ 닫고 게임 시작
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getRankStyle(rank: number) {
  if (rank === 1) return { bg: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#fff", badge: "🥇" };
  if (rank === 2) return { bg: "linear-gradient(135deg, #C0C0C0, #A0A0A0)", color: "#fff", badge: "🥈" };
  if (rank === 3) return { bg: "linear-gradient(135deg, #CD7F32, #A0612B)", color: "#fff", badge: "🥉" };
  return { bg: "rgba(255,220,230,0.4)", color: "#C3A0B1", badge: `${rank}` };
}

// ─── Rank-Up Animation Overlay ───
function RankUpAnimation({ oldRank, newRank, friends, myNickname, onComplete, accent, gradient, accentAlpha }: {
  oldRank: number;
  newRank: number;
  friends: UnifiedFriend[];
  myNickname: string;
  onComplete: () => void;
  accent: string;
  gradient: string;
  accentAlpha: string;
}) {
  const [phase, setPhase] = useState<"show" | "animating" | "done">("show");
  const [animOffset, setAnimOffset] = useState(0);
  const ITEM_HEIGHT = 48;

  useEffect(() => {
    // Start animation after brief pause
    const t1 = setTimeout(() => setPhase("animating"), 600);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "animating") return;
    const steps = oldRank - newRank;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnimOffset(currentStep * ITEM_HEIGHT);
      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => setPhase("done"), 400);
      }
    }, 350);
    return () => clearInterval(interval);
  }, [phase, oldRank, newRank]);

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(onComplete, 1200);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  // Show the portion of the leaderboard around the animation
  const startIdx = Math.max(0, newRank - 2);
  const endIdx = Math.min(friends.length, oldRank + 2);
  const visibleFriends = friends.slice(startIdx, endIdx);

  // Find me in the list
  const myEntry = friends.find(f => f.id === "me" || f.nickname === myNickname);

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-[340px] rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.97)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

        {/* Header */}
        <div className="px-4 py-3 text-center" style={{ background: gradient }}>
          <p className="text-sm text-white">🎉 순위 상승!</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>
            {oldRank}위 → {newRank}위
          </p>
        </div>

        {/* Animated Leaderboard */}
        <div className="px-3 py-3 overflow-hidden" style={{ maxHeight: 280 }}>
          <div className="space-y-1.5 relative">
            {visibleFriends.map((friend) => {
              const isMe = friend.id === "me" || friend.nickname === myNickname;
              const rankStyle = getRankStyle(isMe ? newRank : friend.rank);
              const isDisplaced = !isMe && friend.rank >= newRank && friend.rank < oldRank;

              return (
                <div key={friend.id}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all"
                  style={{
                    background: isMe
                      ? "linear-gradient(135deg, rgba(255,181,194,0.35), rgba(232,115,154,0.2))"
                      : friend.rank <= 3 ? "rgba(255,240,245,0.6)" : "rgba(255,250,252,0.4)",
                    border: isMe ? `2px solid ${accent}` : "2px solid transparent",
                    transform: isMe
                      ? `translateY(-${animOffset}px)`
                      : isDisplaced
                        ? `translateY(${ITEM_HEIGHT}px)`
                        : "translateY(0)",
                    transition: phase === "animating" ? "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
                    zIndex: isMe ? 10 : 1,
                    position: "relative",
                  }}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: isMe ? getRankStyle(phase === "done" ? newRank : oldRank).bg : rankStyle.bg,
                      color: isMe ? getRankStyle(phase === "done" ? newRank : oldRank).color : rankStyle.color,
                      fontSize: (isMe ? (phase === "done" ? newRank : oldRank) : friend.rank) <= 3 ? "12px" : "10px",
                    }}>
                    {isMe
                      ? getRankStyle(phase === "done" ? newRank : oldRank).badge
                      : rankStyle.badge}
                  </div>
                  <div className="shrink-0"><CatCell catType={friend.catType as CatType} size={26} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate" style={{ color: isMe ? accent : "#9B7A8A" }}>
                      {isMe ? `${myNickname} (나)` : friend.nickname}
                    </p>
                  </div>
                  <p className="text-xs shrink-0" style={{ color: isMe ? accent : "#C3A0B1" }}>
                    {friend.score.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Celebration */}
        {phase === "done" && (
          <div className="px-4 pb-4 text-center" style={{ animation: "rankCelebrate 0.5s ease-out" }}>
            <div className="text-2xl mb-2">🎊</div>
            <p className="text-sm" style={{ color: accent }}>
              {newRank}위 달성!
            </p>
            <button onClick={onComplete}
              className="mt-3 w-full py-2.5 rounded-xl text-white text-sm cursor-pointer transition-all active:scale-95"
              style={{ background: gradient }}>
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Lobby({ bestScore, blackPaw, whitePaw, progress, onStartGame, onOpenSidebar, lobbyBgmOn, onToggleLobbyBgm, adRemoved = false, lastGameScore, previousBestScore }: LobbyProps) {
  const totalStars = calculateTotalStars(progress);
  const equippedCatType = progress.equippedIcon.startsWith("default_")
    ? parseInt(progress.equippedIcon.split("_")[1]) as CatType
    : (SPECIAL_CAT_ICONS.find(i => i.id === progress.equippedIcon)?.baseCatType ?? 0);

  // Auth
  const auth = useAuthOptional();
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const user = auth?.user ?? null;
  const authLoading = auth?.isLoading ?? false;
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Tutorial: show once
  const [showTutorial, setShowTutorial] = useState(() => {
    try { return !localStorage.getItem("catblockpop_tutorial_done"); } catch { return false; }
  });
  const closeTutorial = () => {
    setShowTutorial(false);
    try { localStorage.setItem("catblockpop_tutorial_done", "true"); } catch {}
  };

  // Pre-game ad
  const [showPreAd, setShowPreAd] = useState(false);

  const handleStartGame = () => {
    if (!adRemoved && Math.random() < 0.3) {
      setShowPreAd(true);
    } else {
      onStartGame();
    }
  };

  const skinDef = getSkinDef(progress.equippedSkin);
  const skinName = skinDef.name;
  const boardTheme = getBoardTheme(progress.equippedSkin);
  const myNickname = progress.nickname || "나";

  // Kakao friends
  const [kakaoFriends, setKakaoFriends] = useState<KakaoFriend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [kakaoConnected, setKakaoConnected] = useState(() => isKakaoLoggedIn());

  // Google friends
  const [googleFriends, setGoogleFriends] = useState<GoogleFriend[]>([]);
  const [googleConnected, setGoogleConnected] = useState(false);

  // Init Kakao SDK & Auto-login both platforms silently
  useEffect(() => {
    const autoConnect = async () => {
      setLoadingFriends(true);
      // Init & auto-login Kakao
      await initKakaoSDK();
      if (!isKakaoLoggedIn()) {
        await kakaoSilentLogin();
      }
      setKakaoConnected(isKakaoLoggedIn());
      try { const kf = await getKakaoFriends(); setKakaoFriends(kf); } catch {}

      // Init & auto-login Google
      await initGoogleSDK();
      await googleSilentSignIn();
      setGoogleConnected(true);
      try { const gf = await getGoogleFriends(); setGoogleFriends(gf); } catch {}

      setLoadingFriends(false);
    };
    autoConnect();
  }, []);

  const handleShareScore = () => {
    shareGameViaKakao(bestScore);
  };

  // Build merged friends list
  const mergedFriends = mergeAllFriends(
    kakaoFriends, googleFriends, bestScore, totalStars, myNickname,
  );

  // ─── Rank-Up Animation ───
  const [showRankUp, setShowRankUp] = useState(false);
  const [rankUpOld, setRankUpOld] = useState(0);
  const [rankUpNew, setRankUpNew] = useState(0);
  const prevBestRef = useRef(previousBestScore ?? bestScore);

  useEffect(() => {
    // Detect rank change when lastGameScore is set (returning from a game)
    if (lastGameScore === undefined || lastGameScore === 0) return;

    const prevScore = prevBestRef.current;
    if (bestScore <= prevScore) return; // No improvement

    // Calculate old rank (with previous score) and new rank (with current score)
    const friendsWithOldScore = mergeAllFriends(
      kakaoFriends, googleFriends, prevScore, totalStars, myNickname,
    );
    const oldMe = friendsWithOldScore.find(f => f.id === "me" || f.nickname === myNickname);
    const newMe = mergedFriends.find(f => f.id === "me" || f.nickname === myNickname);

    if (oldMe && newMe && oldMe.rank > newMe.rank) {
      setRankUpOld(oldMe.rank);
      setRankUpNew(newMe.rank);
      setShowRankUp(true);
    }

    prevBestRef.current = bestScore;
  }, [lastGameScore]); // Only trigger when returning from game

  return (
    <div className="flex flex-col items-center min-h-screen h-full p-4 pb-4"
      style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100dvh" }}>

      {showTutorial && <TutorialOverlay onClose={closeTutorial} accent={boardTheme.accent} gradient={boardTheme.comboBadge} />}
      {showPreAd && <PreGameAd onClose={() => { setShowPreAd(false); onStartGame(); }} accent={boardTheme.accent} gradient={boardTheme.comboBadge} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} skin={progress.equippedSkin} />}
      {showRankUp && (
        <RankUpAnimation
          oldRank={rankUpOld}
          newRank={rankUpNew}
          friends={mergedFriends}
          myNickname={myNickname}
          onComplete={() => setShowRankUp(false)}
          accent={boardTheme.accent}
          gradient={boardTheme.comboBadge}
          accentAlpha={boardTheme.accentAlpha}
        />
      )}

      {/* Top bar */}
      <div className="w-full max-w-[380px] flex items-center justify-between mb-1">
        <button onClick={onOpenSidebar}
          className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.5)", color: boardTheme.accent, fontSize: "18px" }}>☰</button>
        <div className="flex gap-2">
          {/* Auth button */}
          <button onClick={() => setShowAuthModal(true)}
            className="h-9 px-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-90"
            style={{
              background: isAuthenticated ? boardTheme.accentAlpha : "rgba(255,255,255,0.5)",
              color: boardTheme.accent,
              fontSize: "11px",
            }}>
            {authLoading ? "..." : isAuthenticated ? (
              <>
                <span className="w-2 h-2 rounded-full" style={{ background: "#4CAF50" }} />
                <span className="text-[10px] max-w-[60px] truncate">{user?.user_metadata?.name || "Me"}</span>
              </>
            ) : (
              <span className="text-[10px]">로그인</span>
            )}
          </button>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.5)" }}>
            <span style={{ fontSize: "10px", color: "#FFB800" }}>⭐</span>
            <span className="text-[10px]" style={{ color: boardTheme.accent }}>{totalStars}</span>
          </div>
          <button onClick={onToggleLobbyBgm}
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90"
            style={{ background: lobbyBgmOn ? boardTheme.accentAlpha : "rgba(255,255,255,0.5)", color: boardTheme.accent }}>
            {lobbyBgmOn ? "🎵" : "🔇"}
          </button>
        </div>
      </div>

      {/* Currency */}
      <div className="w-full max-w-[380px] flex gap-2 mb-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.5)" }}>
          <BlackPaw size={14} /><span className="text-xs" style={{ color: "#555" }}>{blackPaw.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.5)" }}>
          <WhitePaw size={14} /><span className="text-xs" style={{ color: "#B8A080" }}>{whitePaw.toLocaleString()}</span>
        </div>
      </div>

      {/* Lobby character - enhanced illustrated style */}
      <div className="mb-1" style={{ animation: "gentleBob 3s ease-in-out infinite" }}>
        <LobbyCharacter skin={progress.equippedSkin} catType={equippedCatType} size={180} />
      </div>

      <h1 className="text-3xl mb-0.5 text-center" style={{ color: boardTheme.accent, textShadow: boardTheme.titleShadow }}>
        {skinDef.emoji} {skinName} Block Pop
      </h1>

      {/* Best Score */}
      <div className="rounded-2xl py-2.5 px-5 mb-3 text-center w-full max-w-[260px]"
        style={{ background: "rgba(255,255,255,0.6)", border: `2px solid ${boardTheme.accent}30` }}>
        <p className="text-[10px] mb-0.5" style={{ color: boardTheme.accentLight }}>🏆 최고 기록</p>
        <p className="text-2xl" style={{ color: boardTheme.accent }}>{bestScore.toLocaleString()}</p>
      </div>

      <button onClick={handleStartGame}
        className="px-10 py-3 rounded-2xl text-white text-lg transition-all duration-200 active:scale-95 hover:scale-105 cursor-pointer mb-4"
        style={{ background: boardTheme.comboBadge, boxShadow: `0 6px 20px ${boardTheme.accentAlpha}` }}>
        🎮 게임 시작
      </button>

      {/* Friends Leaderboard */}
      <div className="w-full max-w-[340px] rounded-2xl overflow-hidden flex-1 flex flex-col"
        style={{ background: "rgba(255,255,255,0.55)", border: `1px solid ${boardTheme.accent}25`, minHeight: 0 }}>
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: `1px solid ${boardTheme.accent}20` }}>
          <p className="text-sm" style={{ color: boardTheme.accent }}>🐾 친구 랭킹</p>
          {kakaoConnected && (
            <button onClick={handleShareScore}
              className="px-2 py-0.5 rounded text-[8px] cursor-pointer transition-all active:scale-95"
              style={{ background: "#FEE500", color: "#3C1E1E" }}>
              📤 공유
            </button>
          )}
        </div>
        <div className="px-3 py-2 space-y-1" style={{ maxHeight: 320, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          {loadingFriends ? (
            <div className="py-4 text-center">
              <p className="text-xs" style={{ color: "#C3A0B1" }}>친구 목록 불러오는 중...</p>
            </div>
          ) : (
            mergedFriends.map((friend) => {
              const isMe = friend.id === "me" || friend.nickname === myNickname;
              const rankStyle = getRankStyle(friend.rank);
              return (
                <div key={friend.id} className="flex items-center gap-2 px-2.5 py-2 rounded-xl"
                  style={{
                    background: isMe
                      ? `linear-gradient(135deg, ${boardTheme.accentAlpha}, ${boardTheme.accent}15)`
                      : friend.rank <= 3 ? "rgba(255,240,245,0.6)" : "rgba(255,250,252,0.4)",
                    border: isMe ? `1.5px solid ${boardTheme.accent}55` : "1.5px solid transparent",
                  }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: rankStyle.bg, color: rankStyle.color, fontSize: friend.rank <= 3 ? "12px" : "10px" }}>
                    {rankStyle.badge}
                  </div>
                  <div className="shrink-0"><CatCell catType={(friend.catType ?? 0) as CatType} size={28} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate" style={{ color: isMe ? boardTheme.accent : "#9B7A8A" }}>
                      {isMe ? `${friend.nickname} (나)` : friend.nickname}
                    </p>
                  </div>
                  <p className="text-xs shrink-0" style={{ color: isMe ? boardTheme.accent : "#C3A0B1" }}>
                    {friend.score.toLocaleString()}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        @keyframes gentleBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes heartFloat { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-40px); } }
        @keyframes sparkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
        @keyframes dogPant { 0% { ry: 10; } 100% { ry: 12; } }
        @keyframes angerPop { 0% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1.3); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes catCrouch { 0%,100% { transform: scaleY(1); } 30% { transform: scaleY(0.92) translateY(5px); } }
        @keyframes rabbitStand { 0%,100% { transform: scaleY(1); } 40% { transform: scaleY(1.08) translateY(-8px); } }
        @keyframes foxNuzzle { 0%,100% { transform: translateX(0); } 30% { transform: translateX(6px) rotate(3deg); } 60% { transform: translateX(-3px) rotate(-1deg); } }
        @keyframes bearShake { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-3deg); } 75% { transform: rotate(3deg); } }
        @keyframes dogWag { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } }
        @keyframes rankCelebrate { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes iapSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}