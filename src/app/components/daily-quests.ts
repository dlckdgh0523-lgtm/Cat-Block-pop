import type { GameStats } from "./skins-data";

// ─── Daily Quest Definitions ───
export interface DailyQuestDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  type: DailyQuestType;
  target: number;
  rewardBlack: number;
  rewardWhite: number;
}

export type DailyQuestType =
  | "churu_uses"      // 츄르 N회 사용
  | "score_in_game"   // 한 판에 N점 달성
  | "lines_total"     // 줄 N개 클리어
  | "games_played"    // N판 플레이
  | "combo_reach"     // 콤보 N회 달성
  | "knead_uses"      // 꾹꾹이 N회 사용
  | "catnip_uses"     // 고양이풀 N회 사용
  | "item_uses"       // 아이템 N회 사용
  | "blocks_placed"   // 블록 N개 배치
  | "lines_at_once"   // 한번에 N줄 클리어
  ;

// 일간 퀘스트 풀 (매일 3개 랜덤 선택)
const DAILY_QUEST_POOL: DailyQuestDef[] = [
  { id: "d_feed", name: "내 펫 밥먹이기", desc: "츄르 5개 사용", icon: "🍖", type: "churu_uses", target: 5, rewardBlack: 300, rewardWhite: 50 },
  { id: "d_play", name: "내 펫이랑 놀아주기", desc: "한 판에 3,000점 달성", icon: "🎾", type: "score_in_game", target: 3000, rewardBlack: 400, rewardWhite: 80 },
  { id: "d_walk", name: "산책하기", desc: "3판 플레이", icon: "🚶", type: "games_played", target: 3, rewardBlack: 200, rewardWhite: 30 },
  { id: "d_train", name: "훈련시키기", desc: "콤보 5회 달성", icon: "🏋️", type: "combo_reach", target: 5, rewardBlack: 350, rewardWhite: 60 },
  { id: "d_clean", name: "목욕시키기", desc: "줄 15개 클리어", icon: "🛁", type: "lines_total", target: 15, rewardBlack: 300, rewardWhite: 50 },
  { id: "d_nap", name: "꾹꾹이 타임", desc: "꾹꾹이 3회 사용", icon: "😴", type: "knead_uses", target: 3, rewardBlack: 500, rewardWhite: 100 },
  { id: "d_garden", name: "정원 가꾸기", desc: "고양이풀 4회 사용", icon: "🌿", type: "catnip_uses", target: 4, rewardBlack: 400, rewardWhite: 70 },
  { id: "d_puzzle", name: "퍼즐 마스터", desc: "블록 50개 배치", icon: "🧩", type: "blocks_placed", target: 50, rewardBlack: 250, rewardWhite: 40 },
  { id: "d_streak", name: "연속 콤보 도전", desc: "한 판에 콤보 3연속", icon: "🔥", type: "combo_reach", target: 3, rewardBlack: 300, rewardWhite: 50 },
  { id: "d_bigclear", name: "대청소", desc: "한번에 3줄 이상 클리어", icon: "✨", type: "lines_at_once", target: 3, rewardBlack: 600, rewardWhite: 120 },
  { id: "d_item_fan", name: "아이템 매니아", desc: "아이템 6회 사용", icon: "🎒", type: "item_uses", target: 6, rewardBlack: 400, rewardWhite: 80 },
  { id: "d_scorer", name: "고득점 도전", desc: "한 판에 5,000점 달성", icon: "🏆", type: "score_in_game", target: 5000, rewardBlack: 700, rewardWhite: 150 },
  { id: "d_warmup", name: "워밍업", desc: "1판 플레이", icon: "☀️", type: "games_played", target: 1, rewardBlack: 100, rewardWhite: 20 },
  { id: "d_line_rush", name: "줄 러시", desc: "줄 8개 클리어", icon: "⚡", type: "lines_total", target: 8, rewardBlack: 200, rewardWhite: 30 },
  { id: "d_builder", name: "건축가", desc: "블록 100개 배치", icon: "🏗️", type: "blocks_placed", target: 100, rewardBlack: 500, rewardWhite: 80 },
];

// ─── Weekly Quest Definitions ───
export interface WeeklyQuestDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  target: number; // how many daily quests to complete
  rewardBlack: number;
  rewardWhite: number;
}

const WEEKLY_QUEST_POOL: WeeklyQuestDef[] = [
  { id: "w_diligent", name: "성실한 집사", desc: "일간 퀘스트 3개 달성 ×5회", icon: "📅", target: 5, rewardBlack: 800, rewardWhite: 200 },
  { id: "w_devoted", name: "헌신적인 집사", desc: "일간 퀘스트 3개 달성 ×3회", icon: "💪", target: 3, rewardBlack: 500, rewardWhite: 120 },
  { id: "w_master", name: "퀘스트 마스터", desc: "일간 퀘스트 3개 달성 ×7회", icon: "👑", target: 7, rewardBlack: 1000, rewardWhite: 300 },
];

// ─── Quest Progress State ───
export interface QuestProgress {
  // Daily
  dailyQuests: DailyQuestDef[];       // today's 3 quests
  dailyProgress: number[];             // progress for each (index matches dailyQuests)
  dailyCompleted: boolean[];           // claimed?
  dailyDate: string;                   // YYYY-MM-DD when generated
  dailyCompletionCount: number;        // how many daily 3-sets completed today (for weekly)

  // Weekly
  weeklyQuest: WeeklyQuestDef;
  weeklyProgress: number;              // times all 3 daily quests completed
  weeklyCompleted: boolean;
  weeklyStartDate: string;             // YYYY-MM-DD Monday
  
  // Cumulative session trackers (reset per day)
  todayChuruUses: number;
  todayKneadUses: number;
  todayCatnipUses: number;
  todayItemUses: number;
  todayGamesPlayed: number;
  todayLinesCleared: number;
  todayBlocksPlaced: number;
  todayBestScore: number;
  todayMaxLinesAtOnce: number;
  todayMaxCombo: number;
}

function getDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
}

// Seeded random for consistent daily selection
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return (hash % 1000) / 1000;
  };
}

function pickDailyQuests(date: string): DailyQuestDef[] {
  const rng = seededRandom(date + "_catblockpop");
  const pool = [...DAILY_QUEST_POOL];
  const picked: DailyQuestDef[] = [];
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

function pickWeeklyQuest(weekStart: string): WeeklyQuestDef {
  const rng = seededRandom(weekStart + "_weekly");
  return WEEKLY_QUEST_POOL[Math.floor(rng() * WEEKLY_QUEST_POOL.length)];
}

export function createFreshQuestProgress(): QuestProgress {
  const today = getDateStr();
  const weekStart = getWeekStart();
  return {
    dailyQuests: pickDailyQuests(today),
    dailyProgress: [0, 0, 0],
    dailyCompleted: [false, false, false],
    dailyDate: today,
    dailyCompletionCount: 0,
    weeklyQuest: pickWeeklyQuest(weekStart),
    weeklyProgress: 0,
    weeklyCompleted: false,
    weeklyStartDate: weekStart,
    todayChuruUses: 0,
    todayKneadUses: 0,
    todayCatnipUses: 0,
    todayItemUses: 0,
    todayGamesPlayed: 0,
    todayLinesCleared: 0,
    todayBlocksPlaced: 0,
    todayBestScore: 0,
    todayMaxLinesAtOnce: 0,
    todayMaxCombo: 0,
  };
}

// Check if quests need refresh (new day/week)
export function refreshQuestProgress(qp: QuestProgress): QuestProgress {
  const today = getDateStr();
  const weekStart = getWeekStart();
  let result = { ...qp };

  // New day → reset daily
  if (result.dailyDate !== today) {
    // Check if all 3 were completed yesterday (for weekly progress)
    const allDone = result.dailyCompleted.every(c => c);
    const prevWeeklyProgress = result.weeklyProgress + (allDone ? 1 : 0);

    result.dailyQuests = pickDailyQuests(today);
    result.dailyProgress = [0, 0, 0];
    result.dailyCompleted = [false, false, false];
    result.dailyDate = today;
    result.dailyCompletionCount = 0;
    result.todayChuruUses = 0;
    result.todayKneadUses = 0;
    result.todayCatnipUses = 0;
    result.todayItemUses = 0;
    result.todayGamesPlayed = 0;
    result.todayLinesCleared = 0;
    result.todayBlocksPlaced = 0;
    result.todayBestScore = 0;
    result.todayMaxLinesAtOnce = 0;
    result.todayMaxCombo = 0;

    // Carry weekly progress
    if (result.weeklyStartDate === weekStart) {
      result.weeklyProgress = prevWeeklyProgress;
    }
  }

  // New week → reset weekly
  if (result.weeklyStartDate !== weekStart) {
    result.weeklyQuest = pickWeeklyQuest(weekStart);
    result.weeklyProgress = 0;
    result.weeklyCompleted = false;
    result.weeklyStartDate = weekStart;
  }

  return result;
}

// Update quest progress after a game ends
export function updateQuestProgressAfterGame(qp: QuestProgress, stats: GameStats): QuestProgress {
  const result = { ...qp };
  result.todayGamesPlayed++;
  result.todayChuruUses += stats.churuUses;
  result.todayKneadUses += stats.kneadUses;
  result.todayCatnipUses += stats.catnipUses;
  result.todayItemUses += stats.totalItemUses;
  result.todayLinesCleared += stats.totalLines;
  result.todayBlocksPlaced += stats.blocksPlaced;
  result.todayBestScore = Math.max(result.todayBestScore, stats.finalScore);
  result.todayMaxLinesAtOnce = Math.max(result.todayMaxLinesAtOnce, stats.maxLinesAtOnce);
  result.todayMaxCombo = Math.max(result.todayMaxCombo, stats.maxCombo);

  // Evaluate daily quest progress
  result.dailyProgress = result.dailyQuests.map((quest, i) => {
    if (result.dailyCompleted[i]) return result.dailyProgress[i]; // already claimed
    return evaluateQuestProgress(quest, result);
  });

  return result;
}

function evaluateQuestProgress(quest: DailyQuestDef, qp: QuestProgress): number {
  switch (quest.type) {
    case "churu_uses": return qp.todayChuruUses;
    case "score_in_game": return qp.todayBestScore;
    case "lines_total": return qp.todayLinesCleared;
    case "games_played": return qp.todayGamesPlayed;
    case "combo_reach": return qp.todayMaxCombo;
    case "knead_uses": return qp.todayKneadUses;
    case "catnip_uses": return qp.todayCatnipUses;
    case "item_uses": return qp.todayItemUses;
    case "blocks_placed": return qp.todayBlocksPlaced;
    case "lines_at_once": return qp.todayMaxLinesAtOnce;
    default: return 0;
  }
}

// Check if a daily quest is ready to claim
export function isDailyQuestComplete(qp: QuestProgress, index: number): boolean {
  return qp.dailyProgress[index] >= qp.dailyQuests[index].target && !qp.dailyCompleted[index];
}

// Claim a daily quest → returns reward amounts
export function claimDailyQuest(qp: QuestProgress, index: number): { qp: QuestProgress; black: number; white: number } | null {
  if (!isDailyQuestComplete(qp, index)) return null;
  const quest = qp.dailyQuests[index];
  const result = { ...qp };
  result.dailyCompleted = [...qp.dailyCompleted];
  result.dailyCompleted[index] = true;

  // Check if all 3 daily quests are now done
  if (result.dailyCompleted.every(c => c)) {
    result.dailyCompletionCount++;
    result.weeklyProgress++;
  }

  return { qp: result, black: quest.rewardBlack, white: quest.rewardWhite };
}

// Check & claim weekly quest
export function isWeeklyQuestComplete(qp: QuestProgress): boolean {
  return qp.weeklyProgress >= qp.weeklyQuest.target && !qp.weeklyCompleted;
}

export function claimWeeklyQuest(qp: QuestProgress): { qp: QuestProgress; black: number; white: number } | null {
  if (!isWeeklyQuestComplete(qp)) return null;
  const result = { ...qp, weeklyCompleted: true };
  return { qp: result, black: qp.weeklyQuest.rewardBlack, white: qp.weeklyQuest.rewardWhite };
}

// ─── Persistence ───
export function loadQuestProgress(): QuestProgress {
  try {
    const raw = localStorage.getItem("catblockpop_quests");
    if (raw) {
      const parsed = JSON.parse(raw);
      return refreshQuestProgress(parsed);
    }
  } catch {}
  return createFreshQuestProgress();
}

export function saveQuestProgress(qp: QuestProgress) {
  try { localStorage.setItem("catblockpop_quests", JSON.stringify(qp)); } catch {}
}
