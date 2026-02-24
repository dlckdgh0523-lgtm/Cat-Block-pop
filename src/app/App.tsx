import React, { useState, useCallback, useEffect, Component, type ReactNode } from "react";
import { Lobby } from "./components/lobby";
import { GameScreen } from "./components/game-screen";
import { GameOver } from "./components/game-over";
import { LoadingScreen } from "./components/loading-screen";
import { Sidebar } from "./components/sidebar";
import { CatShop } from "./components/cat-shop";
import { SettingsPage } from "./components/settings-page";
import { MyCatsPage } from "./components/my-cats-page";
import { CollectionPage } from "./components/collection-page";
import { QuestPage } from "./components/quest-page";
import { lobbyBgm, stopAllBgm, getSkinGameBgm } from "./components/sound-effects";
import { ITEM_DEFS, type ItemKey, type ItemInventory } from "./components/game-logic";
import {
  type PlayerProgress, type BlockSkin, type GameStats,
  createDefaultProgress, checkIconQuests, checkSkinQuests,
  BLOCK_SKINS, getBoardTheme,
} from "./components/skins-data";
import {
  type QuestProgress,
  loadQuestProgress, saveQuestProgress,
  updateQuestProgressAfterGame, refreshQuestProgress,
} from "./components/daily-quests";
import { AuthProvider, useAuthOptional } from "./components/auth-context";
import { AuthPage } from "./components/auth-page";
import { AuthSyncBridge } from "./components/auth-sync-bridge";
import { InactivityWarning } from "./components/inactivity-warning";

type Screen = "lobby" | "loading" | "playing" | "gameover" | "shop" | "settings" | "my-cats" | "collection" | "quests";

// ─── Error Boundary ───
// Catches render errors and shows a recovery screen (no auth dependency)
class AuthErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; errorMsg: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error?.message || "Unknown error" };
  }
  componentDidCatch(error: Error) {
    console.error("[AuthErrorBoundary] Caught render error:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: "fixed", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(160deg, #FFF0F5, #FFE4EC, #FFD6E0)",
          fontFamily: "'Nunito', sans-serif",
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🐱</div>
          <h2 style={{ color: "#E8739A", marginBottom: 8 }}>앱 로딩 중 문제가 발생했어요</h2>
          <p style={{ color: "#9B7A8A", fontSize: 12, marginBottom: 16 }}>{this.state.errorMsg}</p>
          <button
            onClick={() => {
              // Clear auth storage and reload
              try { localStorage.removeItem("catblockpop_auth"); } catch {}
              this.setState({ hasError: false, errorMsg: "" });
              window.location.reload();
            }}
            style={{
              padding: "10px 24px", borderRadius: 16,
              background: "linear-gradient(135deg, #FF6B8A, #E8739A)",
              color: "white", border: "none", cursor: "pointer", fontSize: 14,
            }}>
            🔄 새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Persistent state ───
function loadNumber(key: string, fallback = 0): number {
  try { return Number(localStorage.getItem(key) || String(fallback)); } catch { return fallback; }
}
function loadBool(key: string, fallback = false): boolean {
  try { const v = localStorage.getItem(key); if (v === null) return fallback; return v === "true"; } catch { return fallback; }
}
function loadItems(): ItemInventory {
  try { const raw = localStorage.getItem("catblockpop_items"); if (raw) return JSON.parse(raw); } catch {}
  return { churu: 1, catnip: 1, knead: 0 };
}
function loadProgress(): PlayerProgress {
  try { const raw = localStorage.getItem("catblockpop_progress"); if (raw) return JSON.parse(raw); } catch {}
  return createDefaultProgress();
}
function saveItems(items: ItemInventory) {
  try { localStorage.setItem("catblockpop_items", JSON.stringify(items)); } catch {}
}
function saveNumber(key: string, val: number) {
  try { localStorage.setItem(key, String(val)); } catch {}
}
function saveBool(key: string, val: boolean) {
  try { localStorage.setItem(key, String(val)); } catch {}
}
function saveProgress(p: PlayerProgress) {
  try { localStorage.setItem("catblockpop_progress", JSON.stringify(p)); } catch {}
}

const SCORE_TO_CURRENCY_RATIO = 0.8;

// ─── Auth Gate ───
// Uses useAuthOptional (never throws) to survive HMR & context issues
function AuthGate() {
  const auth = useAuthOptional();

  // Context not ready or still loading
  if (!auth || auth.isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center"
        style={{
          background: "linear-gradient(160deg, #FFF0F5, #FFE4EC, #FFD6E0)",
          fontFamily: "'Nunito', sans-serif",
        }}>
        <div className="text-center">
          <div className="text-4xl mb-3" style={{ animation: "authBob 2s ease-in-out infinite" }}>
            <svg width="60" height="60" viewBox="0 0 100 100">
              <path d="M20 45 L30 10 L45 35 Z" fill="#FF9F43" />
              <path d="M80 45 L70 10 L55 35 Z" fill="#FF9F43" />
              <ellipse cx="50" cy="58" rx="32" ry="28" fill="#FF9F43" />
              <ellipse cx="38" cy="52" rx="4" ry="5" fill="white" />
              <ellipse cx="62" cy="52" rx="4" ry="5" fill="white" />
              <ellipse cx="39" cy="53" rx="2.5" ry="3.5" fill="#333" />
              <ellipse cx="63" cy="53" rx="2.5" ry="3.5" fill="#333" />
              <ellipse cx="50" cy="62" rx="3" ry="2" fill="#FF6B8A" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: "#E8739A" }}>Cat Block Pop</p>
          <p className="text-xs mt-1" style={{ color: "#C3A0B1" }}>로딩 중...</p>
        </div>
        <style>{`
          @keyframes authBob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    );
  }

  // Not logged in
  if (!auth.isAuthenticated) {
    return <AuthPage />;
  }

  // Authenticated
  return <GameApp />;
}

// ─── Main Game App ───
function GameApp() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [prevScreen, setPrevScreen] = useState<Screen>("lobby");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [bestScore, setBestScore] = useState(() => loadNumber("catblockpop_best"));
  const [blackPaw, setBlackPaw] = useState(() => loadNumber("catblockpop_black", 100));
  const [whitePaw, setWhitePaw] = useState(() => loadNumber("catblockpop_white", 50));
  const [items, setItems] = useState<ItemInventory>(loadItems);
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);
  const [questProgress, setQuestProgress] = useState<QuestProgress>(() => loadQuestProgress());
  const [lastScore, setLastScore] = useState(0);
  const [earnedPaw, setEarnedPaw] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [questUnlocks, setQuestUnlocks] = useState<string[]>([]);
  const [adRemoved, setAdRemoved] = useState(() => loadBool("catblockpop_adremoved"));
  const [previousBestScore, setPreviousBestScore] = useState(() => loadNumber("catblockpop_best"));

  const [continueScore, setContinueScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const [lobbyBgmOn, setLobbyBgmOn] = useState(true);
  const [gameBgmOn, setGameBgmOn] = useState(true);

  useEffect(() => {
    const refreshed = refreshQuestProgress(questProgress);
    if (refreshed !== questProgress) {
      setQuestProgress(refreshed);
      saveQuestProgress(refreshed);
    }
  }, [screen]);

  useEffect(() => {
    const lobbyScreens = ["lobby", "shop", "settings", "my-cats", "collection", "quests"];
    if (lobbyScreens.includes(screen)) {
      stopAllBgm();
      if (lobbyBgmOn) { if (!lobbyBgm.isPlaying) lobbyBgm.start(); } else { lobbyBgm.stop(); }
    } else if (screen === "playing") {
      lobbyBgm.stop();
      if (gameBgmOn) { const skinBgm = getSkinGameBgm(progress.equippedSkin); if (!skinBgm.isPlaying) skinBgm.start(); } else { stopAllBgm(); }
    } else { stopAllBgm(); }
    return () => { stopAllBgm(); };
  }, [screen, lobbyBgmOn, gameBgmOn, progress.equippedSkin]);

  const handleStartGame = useCallback(() => {
    stopAllBgm(); setContinueScore(0); setGameKey(k => k + 1); setScreen("loading");
  }, []);

  const handleLoadingComplete = useCallback(() => { setScreen("playing"); }, []);

  const handleGameOver = useCallback((finalScore: number, stats: GameStats) => {
    stopAllBgm();
    setLastScore(finalScore);
    setPreviousBestScore(bestScore);
    const updatedStats = { ...stats, finalScore, skinUsed: progress.equippedSkin };
    const newIcons = checkIconQuests(updatedStats, progress);
    const newSkinQuests = checkSkinQuests(updatedStats, progress);
    const newProgress = { ...progress };
    if (newIcons.length > 0) newProgress.unlockedIcons = [...progress.unlockedIcons, ...newIcons];
    if (newSkinQuests.length > 0) newProgress.completedSkinQuests = [...progress.completedSkinQuests, ...newSkinQuests];
    newProgress.cumulativeStats = {
      ...progress.cumulativeStats,
      totalGamesPlayed: progress.cumulativeStats.totalGamesPlayed + 1,
      totalChuruUses: progress.cumulativeStats.totalChuruUses + stats.churuUses,
      totalCatnipUses: progress.cumulativeStats.totalCatnipUses + stats.catnipUses,
      totalKneadUses: progress.cumulativeStats.totalKneadUses + stats.kneadUses,
      highestScore: Math.max(progress.cumulativeStats.highestScore, finalScore),
    };
    setProgress(newProgress); saveProgress(newProgress);
    const updatedQP = updateQuestProgressAfterGame(questProgress, updatedStats);
    setQuestProgress(updatedQP); saveQuestProgress(updatedQP);
    if (newIcons.length > 0 || newSkinQuests.length > 0) setQuestUnlocks([...newIcons, ...newSkinQuests]);
    const newBest = finalScore > bestScore;
    if (newBest) { setBestScore(finalScore); saveNumber("catblockpop_best", finalScore); }
    setIsNewBest(newBest);
    const earned = Math.floor(finalScore * SCORE_TO_CURRENCY_RATIO);
    setEarnedPaw(earned);
    setBlackPaw(prev => { const next = prev + earned; saveNumber("catblockpop_black", next); return next; });
    setScreen("gameover");
  }, [bestScore, progress, questProgress]);

  const handlePlayAgain = useCallback(() => {
    stopAllBgm(); setIsNewBest(false); setQuestUnlocks([]); setContinueScore(lastScore); setGameKey(k => k + 1); setScreen("playing");
  }, [lastScore]);

  const handleGoLobby = useCallback(() => { stopAllBgm(); setQuestUnlocks([]); setScreen("lobby"); }, []);
  const handleOpenSidebar = useCallback(() => { setSidebarOpen(true); }, []);

  const handleSidebarNavigate = useCallback((page: "my-cats" | "shop" | "settings" | "collection" | "quests") => {
    setSidebarOpen(false); setPrevScreen(screen); setScreen(page);
  }, [screen]);

  const handleBackFromSubpage = useCallback(() => {
    setScreen(prevScreen === "playing" ? "lobby" : prevScreen);
  }, [prevScreen]);

  const handleBuyItem = useCallback((key: ItemKey): boolean => {
    const price = ITEM_DEFS[key].price;
    if (blackPaw < price) return false;
    setBlackPaw(prev => { const n = prev - price; saveNumber("catblockpop_black", n); return n; });
    setItems(prev => { const n = { ...prev, [key]: prev[key] + 1 }; saveItems(n); return n; });
    return true;
  }, [blackPaw]);

  const handleBuyPremium = useCallback((amount: number) => {
    setWhitePaw(prev => { const n = prev + amount; saveNumber("catblockpop_white", n); return n; });
  }, []);

  const handleBuySkin = useCallback((skinId: BlockSkin): boolean => {
    const skinDef = BLOCK_SKINS.find(s => s.id === skinId);
    if (!skinDef) return false;
    const price = skinDef.price;
    if (whitePaw < price || progress.ownedSkins.includes(skinId)) return false;
    setWhitePaw(prev => { const n = prev - price; saveNumber("catblockpop_white", n); return n; });
    setProgress(prev => { const n = { ...prev, ownedSkins: [...prev.ownedSkins, skinId] }; saveProgress(n); return n; });
    return true;
  }, [whitePaw, progress]);

  const handleExchangeCurrency = useCallback((whiteAmount: number) => {
    if (whitePaw < whiteAmount) return;
    setWhitePaw(prev => { const n = prev - whiteAmount; saveNumber("catblockpop_white", n); return n; });
    setBlackPaw(prev => { const n = prev + whiteAmount; saveNumber("catblockpop_black", n); return n; });
  }, [whitePaw]);

  const handleBuyAdRemoval = useCallback(() => { setAdRemoved(true); saveBool("catblockpop_adremoved", true); }, []);

  const handleUseItem = useCallback((key: ItemKey): boolean => {
    if (items[key] <= 0) return false;
    setItems(prev => { const n = { ...prev, [key]: prev[key] - 1 }; saveItems(n); return n; });
    return true;
  }, [items]);

  const handleUpdateProgress = useCallback((patch: Partial<PlayerProgress>) => {
    setProgress(prev => { const n = { ...prev, ...patch }; saveProgress(n); return n; });
  }, []);

  const handleUpdateQuests = useCallback((qp: QuestProgress) => { setQuestProgress(qp); saveQuestProgress(qp); }, []);

  const handleAddCurrency = useCallback((black: number, white: number) => {
    if (black > 0) setBlackPaw(prev => { const n = prev + black; saveNumber("catblockpop_black", n); return n; });
    if (white > 0) setWhitePaw(prev => { const n = prev + white; saveNumber("catblockpop_white", n); return n; });
  }, []);

  const toggleLobbyBgm = useCallback(() => {
    setLobbyBgmOn(prev => {
      if (prev) lobbyBgm.stop(); else if (["lobby", "shop", "settings", "my-cats", "collection", "quests"].includes(screen)) lobbyBgm.start();
      return !prev;
    });
  }, [screen]);

  const toggleGameBgm = useCallback(() => {
    setGameBgmOn(prev => {
      const skinBgm = getSkinGameBgm(progress.equippedSkin);
      if (prev) skinBgm.stop(); else if (screen === "playing") skinBgm.start();
      return !prev;
    });
  }, [screen, progress.equippedSkin]);

  const appTheme = getBoardTheme(progress.equippedSkin);

  return (
    <div className="size-full min-h-screen"
      style={{ background: appTheme.appBg, fontFamily: "'Nunito', sans-serif", minHeight: "100dvh" }}>

      <AuthSyncBridge bestScore={bestScore} progress={progress} />
      <InactivityWarning />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}
        blackPaw={blackPaw} whitePaw={whitePaw} items={items} progress={progress}
        onNavigate={handleSidebarNavigate} />

      {screen === "lobby" && (
        <Lobby bestScore={bestScore} blackPaw={blackPaw} whitePaw={whitePaw}
          progress={progress} onStartGame={handleStartGame} onOpenSidebar={handleOpenSidebar}
          lobbyBgmOn={lobbyBgmOn} onToggleLobbyBgm={toggleLobbyBgm}
          adRemoved={adRemoved} lastGameScore={lastScore} previousBestScore={previousBestScore} />
      )}

      {screen === "loading" && <LoadingScreen onComplete={handleLoadingComplete} skin={progress.equippedSkin} />}

      {screen === "playing" && (
        <GameScreen key={gameKey} onGameOver={handleGameOver} onGoLobby={handleGoLobby}
          items={items} onUseItem={handleUseItem} gameBgmOn={gameBgmOn} onToggleGameBgm={toggleGameBgm}
          skin={progress.equippedSkin} initialScore={continueScore} />
      )}

      {screen === "gameover" && (
        <GameOver score={lastScore} bestScore={isNewBest ? lastScore : bestScore}
          isNewBest={isNewBest} onPlayAgain={handlePlayAgain} onGoLobby={handleGoLobby}
          questUnlocks={questUnlocks} earnedPaw={earnedPaw}
          adRemoved={adRemoved} skin={progress.equippedSkin} />
      )}

      {screen === "shop" && (
        <CatShop blackPaw={blackPaw} whitePaw={whitePaw} items={items}
          progress={progress} onBuy={handleBuyItem} onBuyPremium={handleBuyPremium}
          onBuySkin={handleBuySkin} onExchangeCurrency={handleExchangeCurrency}
          onBuyAdRemoval={handleBuyAdRemoval} adRemoved={adRemoved}
          onClose={handleBackFromSubpage} />
      )}

      {screen === "settings" && (
        <SettingsPage lobbyBgmOn={lobbyBgmOn} gameBgmOn={gameBgmOn}
          onToggleLobbyBgm={toggleLobbyBgm} onToggleGameBgm={toggleGameBgm}
          onClose={handleBackFromSubpage} onAccountChange={() => {}} skin={progress.equippedSkin} />
      )}

      {screen === "my-cats" && (
        <MyCatsPage progress={progress} onUpdateProgress={handleUpdateProgress} onClose={handleBackFromSubpage} />
      )}

      {screen === "collection" && (
        <CollectionPage progress={progress} onClose={handleBackFromSubpage} />
      )}

      {screen === "quests" && (
        <QuestPage questProgress={questProgress} onUpdateQuests={handleUpdateQuests}
          onAddCurrency={handleAddCurrency} onClose={handleBackFromSubpage} skin={progress.equippedSkin} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthErrorBoundary>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </AuthErrorBoundary>
  );
}