import type { CatType } from "./game-logic";

// ─── Block Skin Types ───
export type BlockSkin = "cat" | "pig" | "dog" | "fox" | "rabbit" | "bear";

export interface BlockSkinDef {
  id: BlockSkin;
  name: string;
  emoji: string;
  price: number; // premium (whitePaw)
  colors: { name: string; color: string; darkColor: string; lightColor: string; faceColor: string }[];
  nearReaction: string; // description of nearby reaction
  farReaction: string;  // description of far reaction
}

export const BLOCK_SKINS: BlockSkinDef[] = [
  {
    id: "cat", name: "고양이", emoji: "🐱", price: 0,
    colors: [
      { name: "orange",  color: "#FF9F43", darkColor: "#E58A2F", lightColor: "#FFBf76", faceColor: "#7A4A1A" },
      { name: "gray",    color: "#A4B0BE", darkColor: "#8395A7", lightColor: "#C8D1DA", faceColor: "#4A5568" },
      { name: "black",   color: "#555555", darkColor: "#3D3D3D", lightColor: "#777777", faceColor: "#EEEEEE" },
      { name: "white",   color: "#F0EDE8", darkColor: "#D5D0C8", lightColor: "#FAFAF8", faceColor: "#6B5E50" },
      { name: "calico",  color: "#FF7B7B", darkColor: "#E55A5A", lightColor: "#FFA8A8", faceColor: "#7A2A2A" },
      { name: "siamese", color: "#E8D5B7", darkColor: "#D4BC96", lightColor: "#F5EBD9", faceColor: "#5C4A32" },
    ],
    nearReaction: "놀라는 표정", farReaction: "입을 벌리며 쳐다봄",
  },
  {
    id: "pig", name: "돼지", emoji: "🐷", price: 3000,
    colors: [
      { name: "pink",      color: "#FFB5C2", darkColor: "#E8939F", lightColor: "#FFD4DC", faceColor: "#8B4560" },
      { name: "lightpink", color: "#FFC8D0", darkColor: "#E8A8B0", lightColor: "#FFE0E5", faceColor: "#7A3A50" },
      { name: "rose",      color: "#E8899A", darkColor: "#D06A7B", lightColor: "#FFA8B8", faceColor: "#5A2030" },
      { name: "cream",     color: "#FFE0D0", darkColor: "#E8C0B0", lightColor: "#FFF0E8", faceColor: "#8B5540" },
      { name: "peach",     color: "#FFD0B0", darkColor: "#E8B090", lightColor: "#FFE8D0", faceColor: "#7A4530" },
      { name: "hotpink",   color: "#FF8FAA", darkColor: "#E06880", lightColor: "#FFB8CA", faceColor: "#6A2040" },
    ],
    nearReaction: "코가 벌렁거림", farReaction: "입을 벌리고 눈만 따라옴",
  },
  {
    id: "dog", name: "강아지", emoji: "🐶", price: 3000,
    colors: [
      { name: "golden",  color: "#DEB887", darkColor: "#C49A6C", lightColor: "#F0D4A8", faceColor: "#5C3A1A" },
      { name: "gray",    color: "#B0B8C0", darkColor: "#8A9AA8", lightColor: "#D0D8E0", faceColor: "#3A4560" },
      { name: "brown",   color: "#A0765A", darkColor: "#885A3E", lightColor: "#C09878", faceColor: "#3A2010" },
      { name: "white",   color: "#F5F0EA", darkColor: "#D8D0C8", lightColor: "#FFFFF5", faceColor: "#5A4A3A" },
      { name: "spotted", color: "#E8D0B0", darkColor: "#D0B890", lightColor: "#FFF0D8", faceColor: "#5A3A20" },
      { name: "husky",   color: "#8898A8", darkColor: "#6878A0", lightColor: "#A8B8C8", faceColor: "#2A3A50" },
    ],
    nearReaction: "기쁜 표정", farReaction: "낑낑거리는 표정",
  },
  {
    id: "fox", name: "여우", emoji: "🦊", price: 5000,
    colors: [
      { name: "orange",  color: "#E87830", darkColor: "#C86020", lightColor: "#FF9850", faceColor: "#5A2A10" },
      { name: "red",     color: "#D05030", darkColor: "#B03820", lightColor: "#F07050", faceColor: "#3A1510" },
      { name: "arctic",  color: "#E8E8F0", darkColor: "#C8C8D8", lightColor: "#FFFFFF", faceColor: "#4A4A5A" },
      { name: "gray",    color: "#90908A", darkColor: "#707068", lightColor: "#B0B0A8", faceColor: "#3A3A30" },
      { name: "gold",    color: "#D0A030", darkColor: "#B08820", lightColor: "#F0C050", faceColor: "#5A4010" },
      { name: "dark",    color: "#6A4A30", darkColor: "#4A3020", lightColor: "#8A6A48", faceColor: "#F0E0D0" },
    ],
    nearReaction: "교활한 눈빛", farReaction: "호기심 가득한 표정",
  },
  {
    id: "rabbit", name: "토끼", emoji: "🐰", price: 5000,
    colors: [
      { name: "white",   color: "#F5F0F0", darkColor: "#D8D0D0", lightColor: "#FFFFFF", faceColor: "#8A5060" },
      { name: "brown",   color: "#C09878", darkColor: "#A07858", lightColor: "#E0B898", faceColor: "#5A3020" },
      { name: "gray",    color: "#B0A8B0", darkColor: "#908890", lightColor: "#D0C8D0", faceColor: "#4A3A4A" },
      { name: "lop",     color: "#FFD8C0", darkColor: "#E8B8A0", lightColor: "#FFF0E0", faceColor: "#7A4A30" },
      { name: "dutch",   color: "#404040", darkColor: "#282828", lightColor: "#606060", faceColor: "#E0E0E0" },
      { name: "angora",  color: "#F0E8F0", darkColor: "#D0C8D0", lightColor: "#FFFFF8", faceColor: "#6A5060" },
    ],
    nearReaction: "귀가 쫑긋", farReaction: "코를 킁킁",
  },
  {
    id: "bear", name: "곰", emoji: "🐻", price: 8000,
    colors: [
      { name: "brown",   color: "#8B6914", darkColor: "#6B4F0E", lightColor: "#AB8930", faceColor: "#3A2A0A" },
      { name: "black",   color: "#404040", darkColor: "#282828", lightColor: "#606060", faceColor: "#D0D0D0" },
      { name: "polar",   color: "#F0F0F0", darkColor: "#D0D0D0", lightColor: "#FFFFFF", faceColor: "#4A4A5A" },
      { name: "honey",   color: "#D0A040", darkColor: "#B08828", lightColor: "#F0C060", faceColor: "#4A3010" },
      { name: "panda",   color: "#F5F5F5", darkColor: "#D5D5D5", lightColor: "#FFFFFF", faceColor: "#1A1A1A" },
      { name: "grizzly", color: "#6A5030", darkColor: "#4A3020", lightColor: "#8A7048", faceColor: "#F0E0C0" },
    ],
    nearReaction: "으르렁", farReaction: "어슬렁 쳐다봄",
  },
];

export function getSkinDef(skin: BlockSkin): BlockSkinDef {
  return BLOCK_SKINS.find(s => s.id === skin) || BLOCK_SKINS[0];
}

export function getSkinColors(skin: BlockSkin) {
  return getSkinDef(skin).colors;
}

// ─── Skin-specific board checkerboard colors ───
export interface BoardTheme {
  cellLight: string;      // lighter checkerboard cell
  cellDark: string;       // darker checkerboard cell
  border: string;         // cell border
  boardBg: string;        // board container background
  ghostValid: string;     // ghost preview when valid
  ghostInvalid: string;   // ghost preview when invalid
  // ─── Piece tray ───
  trayBg: string;           // tray container background
  trayItemBg: string;       // individual piece slot bg
  trayItemDragBg: string;   // piece slot when dragging
  trayItemDragBorder: string; // piece slot border when dragging
  trayEmptyBg: string;      // empty slot bg
  // ─── UI accent colors ───
  accent: string;            // main accent color
  accentAlpha: string;       // accent with alpha (for bg tints)
  accentLight: string;       // lighter accent for labels
  hintColor: string;         // hint text color
  // ─── Combo ───
  comboColor: string;        // normal combo text
  comboHighColor: string;    // high combo text
  comboBadge: string;        // combo badge gradient
  // ─── App background ───
  appBg: string;             // full page background gradient
  // ─── Button / UI gradients ───
  buttonGradient: string;      // primary CTA button gradient
  buttonGradientLight: string; // lighter button color for gradient start
  sidebarBg: string;           // sidebar background gradient
  sidebarBorder: string;       // sidebar divider color
  cardBorder: string;          // card border color
  tabActiveGradient: string;   // active tab gradient
  // ─── Board pattern ───
  cellPatternEmoji: string;    // subtle pattern emoji on board cells
  // ─── Title ───
  titleShadow: string;         // title text-shadow color
}

const BOARD_THEMES: Record<BlockSkin, BoardTheme> = {
  cat: {
    cellLight: "rgba(255,230,238,0.45)",
    cellDark:  "rgba(245,215,225,0.65)",
    border:    "rgba(200,160,175,0.35)",
    boardBg:   "rgba(255,255,255,0.5)",
    ghostValid:   "rgba(130,220,180,0.55)",
    ghostInvalid: "rgba(255,100,100,0.25)",
    trayBg: "rgba(255,255,255,0.5)",
    trayItemBg: "rgba(255,220,230,0.15)",
    trayItemDragBg: "rgba(255,181,194,0.3)",
    trayItemDragBorder: "#E8739A",
    trayEmptyBg: "rgba(255,220,230,0.2)",
    accent: "#E8739A",
    accentAlpha: "rgba(232,115,154,0.25)",
    accentLight: "#C3A0B1",
    hintColor: "#D4B8C8",
    comboColor: "#E8739A",
    comboHighColor: "#FF6B6B",
    comboBadge: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
    appBg: "linear-gradient(165deg, #FFF0F5 0%, #FFE4EC 30%, #FDD6E0 60%, #F8C8D8 100%)",
    buttonGradient: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
    buttonGradientLight: "#FF8E53",
    sidebarBg: "linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 30%, #FDD6E0 60%, #F8C8D8 100%)",
    sidebarBorder: "#E8739A",
    cardBorder: "#E8739A",
    tabActiveGradient: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
    cellPatternEmoji: "🐱",
    titleShadow: "0 0 10px rgba(232,115,154,0.5)",
  },
  pig: {
    cellLight: "rgba(255,225,230,0.50)",
    cellDark:  "rgba(255,200,210,0.65)",
    border:    "rgba(220,150,170,0.35)",
    boardBg:   "rgba(255,245,248,0.55)",
    ghostValid:   "rgba(150,230,170,0.55)",
    ghostInvalid: "rgba(255,120,120,0.25)",
    trayBg: "rgba(255,245,248,0.55)",
    trayItemBg: "rgba(255,210,220,0.15)",
    trayItemDragBg: "rgba(255,175,190,0.3)",
    trayItemDragBorder: "#F06292",
    trayEmptyBg: "rgba(255,210,220,0.2)",
    accent: "#F06292",
    accentAlpha: "rgba(240,98,146,0.25)",
    accentLight: "#D4879E",
    hintColor: "#E0A8B8",
    comboColor: "#F06292",
    comboHighColor: "#FF5277",
    comboBadge: "linear-gradient(135deg, #FF5277, #FF8A80)",
    appBg: "linear-gradient(165deg, #FFF0F3 0%, #FFE0E8 30%, #FFD0DC 60%, #FFC0D0 100%)",
    buttonGradient: "linear-gradient(135deg, #FF5277, #FF8A80)",
    buttonGradientLight: "#FF8A80",
    sidebarBg: "linear-gradient(135deg, #FFF0F3 0%, #FFE0E8 30%, #FFD0DC 60%, #FFC0D0 100%)",
    sidebarBorder: "#F06292",
    cardBorder: "#F06292",
    tabActiveGradient: "linear-gradient(135deg, #FF5277, #FF8A80)",
    cellPatternEmoji: "🐷",
    titleShadow: "0 0 10px rgba(240,98,146,0.5)",
  },
  dog: {
    cellLight: "rgba(245,235,220,0.50)",
    cellDark:  "rgba(230,215,195,0.65)",
    border:    "rgba(190,165,130,0.35)",
    boardBg:   "rgba(255,250,242,0.55)",
    ghostValid:   "rgba(140,215,160,0.55)",
    ghostInvalid: "rgba(240,120,100,0.25)",
    trayBg: "rgba(255,250,242,0.55)",
    trayItemBg: "rgba(235,218,195,0.15)",
    trayItemDragBg: "rgba(210,185,150,0.3)",
    trayItemDragBorder: "#C8956C",
    trayEmptyBg: "rgba(235,218,195,0.2)",
    accent: "#C8956C",
    accentAlpha: "rgba(200,149,108,0.25)",
    accentLight: "#B5A08A",
    hintColor: "#CCBA9E",
    comboColor: "#C8956C",
    comboHighColor: "#E87830",
    comboBadge: "linear-gradient(135deg, #E87830, #FFA855)",
    appBg: "linear-gradient(165deg, #FFF8F0 0%, #FFEEDD 30%, #FFE0C8 60%, #F8D4B0 100%)",
    buttonGradient: "linear-gradient(135deg, #E87830, #FFA855)",
    buttonGradientLight: "#FFA855",
    sidebarBg: "linear-gradient(165deg, #FFF8F0 0%, #FFEEDD 30%, #FFE0C8 60%, #F8D4B0 100%)",
    sidebarBorder: "#C8956C",
    cardBorder: "#C8956C",
    tabActiveGradient: "linear-gradient(135deg, #E87830, #FFA855)",
    cellPatternEmoji: "🐶",
    titleShadow: "0 0 10px rgba(200,149,108,0.5)",
  },
  fox: {
    cellLight: "rgba(255,235,215,0.50)",
    cellDark:  "rgba(245,218,190,0.65)",
    border:    "rgba(210,160,110,0.35)",
    boardBg:   "rgba(255,248,240,0.55)",
    ghostValid:   "rgba(120,220,170,0.55)",
    ghostInvalid: "rgba(255,110,90,0.25)",
    trayBg: "rgba(255,248,240,0.55)",
    trayItemBg: "rgba(245,220,190,0.15)",
    trayItemDragBg: "rgba(230,180,130,0.3)",
    trayItemDragBorder: "#E07828",
    trayEmptyBg: "rgba(245,220,190,0.2)",
    accent: "#E07828",
    accentAlpha: "rgba(224,120,40,0.25)",
    accentLight: "#C09060",
    hintColor: "#D4A878",
    comboColor: "#E07828",
    comboHighColor: "#FF5522",
    comboBadge: "linear-gradient(135deg, #FF5522, #FF9944)",
    appBg: "linear-gradient(165deg, #FFF5EC 0%, #FFE8D5 30%, #FFDCC0 60%, #F8CCA8 100%)",
    buttonGradient: "linear-gradient(135deg, #FF5522, #FF9944)",
    buttonGradientLight: "#FF9944",
    sidebarBg: "linear-gradient(165deg, #FFF5EC 0%, #FFE8D5 30%, #FFDCC0 60%, #F8CCA8 100%)",
    sidebarBorder: "#E07828",
    cardBorder: "#E07828",
    tabActiveGradient: "linear-gradient(135deg, #FF5522, #FF9944)",
    cellPatternEmoji: "🦊",
    titleShadow: "0 0 10px rgba(224,120,40,0.5)",
  },
  rabbit: {
    cellLight: "rgba(248,240,248,0.50)",
    cellDark:  "rgba(235,225,240,0.65)",
    border:    "rgba(195,175,200,0.35)",
    boardBg:   "rgba(255,252,255,0.55)",
    ghostValid:   "rgba(145,225,185,0.55)",
    ghostInvalid: "rgba(245,115,130,0.25)",
    trayBg: "rgba(255,252,255,0.55)",
    trayItemBg: "rgba(240,228,245,0.15)",
    trayItemDragBg: "rgba(220,200,230,0.3)",
    trayItemDragBorder: "#B07CC0",
    trayEmptyBg: "rgba(240,228,245,0.2)",
    accent: "#B07CC0",
    accentAlpha: "rgba(176,124,192,0.25)",
    accentLight: "#A890B0",
    hintColor: "#C8B0D4",
    comboColor: "#B07CC0",
    comboHighColor: "#D050E0",
    comboBadge: "linear-gradient(135deg, #D050E0, #E888FF)",
    appBg: "linear-gradient(165deg, #FDF5FF 0%, #F5E8FA 30%, #EDD8F5 60%, #E4C8EE 100%)",
    buttonGradient: "linear-gradient(135deg, #D050E0, #E888FF)",
    buttonGradientLight: "#E888FF",
    sidebarBg: "linear-gradient(165deg, #FDF5FF 0%, #F5E8FA 30%, #EDD8F5 60%, #E4C8EE 100%)",
    sidebarBorder: "#B07CC0",
    cardBorder: "#B07CC0",
    tabActiveGradient: "linear-gradient(135deg, #D050E0, #E888FF)",
    cellPatternEmoji: "🐰",
    titleShadow: "0 0 10px rgba(176,124,192,0.5)",
  },
  bear: {
    cellLight: "rgba(240,230,210,0.50)",
    cellDark:  "rgba(225,210,185,0.65)",
    border:    "rgba(180,155,115,0.35)",
    boardBg:   "rgba(252,248,238,0.55)",
    ghostValid:   "rgba(130,210,150,0.55)",
    ghostInvalid: "rgba(235,110,100,0.25)",
    trayBg: "rgba(252,248,238,0.55)",
    trayItemBg: "rgba(230,215,185,0.15)",
    trayItemDragBg: "rgba(200,180,140,0.3)",
    trayItemDragBorder: "#A08040",
    trayEmptyBg: "rgba(230,215,185,0.2)",
    accent: "#A08040",
    accentAlpha: "rgba(160,128,64,0.25)",
    accentLight: "#9A8868",
    hintColor: "#BBA878",
    comboColor: "#A08040",
    comboHighColor: "#C86820",
    comboBadge: "linear-gradient(135deg, #C86820, #E8A844)",
    appBg: "linear-gradient(165deg, #FDF8EE 0%, #F5ECD8 30%, #EDE0C0 60%, #E2D0A8 100%)",
    buttonGradient: "linear-gradient(135deg, #C86820, #E8A844)",
    buttonGradientLight: "#E8A844",
    sidebarBg: "linear-gradient(165deg, #FDF8EE 0%, #F5ECD8 30%, #EDE0C0 60%, #E2D0A8 100%)",
    sidebarBorder: "#A08040",
    cardBorder: "#A08040",
    tabActiveGradient: "linear-gradient(135deg, #C86820, #E8A844)",
    cellPatternEmoji: "🐻",
    titleShadow: "0 0 10px rgba(160,128,64,0.5)",
  },
};

export function getBoardTheme(skin: BlockSkin): BoardTheme {
  return BOARD_THEMES[skin] || BOARD_THEMES.cat;
}

// ─── Special Cat Icons (Profile Pictures) ───
export interface SpecialCatIcon {
  id: string;
  name: string;
  desc: string;
  baseCatType: CatType;
  accessory: string; // visual identifier
  questDesc: string;
  questType: QuestType;
  questTarget: number;
  stars: number; // 1-3
}

export type QuestType =
  | "lines_at_once"       // N줄 한번에 클리어
  | "max_combo"           // 콤보 N회 이상
  | "total_combos"        // 한 게임 총 콤보 N회
  | "knead_uses"          // 꾹꾹이 N회 사용
  | "churu_uses"          // 츄르 N회 사용
  | "catnip_uses"         // 고양이풀 N회 사용
  | "total_item_uses"     // 아이템 총 N회 사용
  | "total_lines"         // 한 게임 총 N줄 클리어
  | "score"               // N점 달성
  | "collect_all_icons"   // 모든 아이콘 수집
  | "games_played"        // N회 게임 플레이
  | "consecutive_clears"  // N연속 클리어
  ;

export const SPECIAL_CAT_ICONS: SpecialCatIcon[] = [
  { id: "pirate_black",  name: "해적 봄베이",  desc: "금빛 눈의 검은 봄베이 고양이", baseCatType: 2, accessory: "eyepatch", questDesc: "한번에 4줄 이상 클리어", questType: "lines_at_once", questTarget: 4, stars: 2 },
  { id: "rebel_siam",    name: "반항아 샴냥",   desc: "푸른 눈의 반항적인 샴 고양이", baseCatType: 5, accessory: "bandana", questDesc: "한 게임에서 콤보 10회 이상", questType: "total_combos", questTarget: 10, stars: 2 },
  { id: "churu_orange",  name: "스코티시폴드",  desc: "접힌 귀의 귀여운 스코티시폴드", baseCatType: 0, accessory: "churu", questDesc: "꾹꾹이 5회 이상 사용", questType: "knead_uses", questTarget: 5, stars: 2 },
  { id: "royal_white",   name: "왕관 페르시안", desc: "납작 얼굴의 기품있는 페르시안", baseCatType: 3, accessory: "crown", questDesc: "10,000점 이상 달성", questType: "score", questTarget: 10000, stars: 2 },
  { id: "cool_gray",     name: "브리티시숏헤어", desc: "통통한 뺨의 쿨한 브리티시숏헤어", baseCatType: 1, accessory: "sunglasses", questDesc: "한번에 5줄 이상 클리어", questType: "lines_at_once", questTarget: 5, stars: 3 },
  { id: "ribbon_calico",name: "핑크 페르시안",  desc: "리본을 단 핑크빛 페르시안", baseCatType: 4, accessory: "ribbon", questDesc: "3연속 콤보 달성", questType: "max_combo", questTarget: 3, stars: 1 },
  { id: "wizard_black",  name: "마법사 스핑크스", desc: "주름진 피부의 신비로운 스핑크스", baseCatType: 2, accessory: "wizard_hat", questDesc: "한 게임에 아이템 10회 사용", questType: "total_item_uses", questTarget: 10, stars: 3 },
  { id: "flower_siam",   name: "래그돌",        desc: "사파이어 눈의 우아한 래그돌", baseCatType: 5, accessory: "flower", questDesc: "한 게임에서 20줄 클리어", questType: "total_lines", questTarget: 20, stars: 2 },
  { id: "scarf_gray",    name: "러시안블루",     desc: "초록 눈의 고급스러운 러시안블루", baseCatType: 1, accessory: "scarf", questDesc: "총 50줄 클리어", questType: "total_lines", questTarget: 50, stars: 2 },
  { id: "santa_orange",  name: "메인쿤",        desc: "야생미 넘치는 거대한 메인쿤", baseCatType: 0, accessory: "santa_hat", questDesc: "15,000점 달성", questType: "score", questTarget: 15000, stars: 2 },
  { id: "ninja_black",   name: "닌자 봄베이",   desc: "형광 눈빛의 은밀한 봄베이", baseCatType: 2, accessory: "ninja", questDesc: "한번에 6줄 이상 클리어", questType: "lines_at_once", questTarget: 6, stars: 3 },
  { id: "bowtie_white",  name: "터키시앙고라",  desc: "오드아이의 우아한 터키시앙고라", baseCatType: 3, accessory: "bowtie", questDesc: "5연속 콤보 달성", questType: "max_combo", questTarget: 5, stars: 2 },
  { id: "chef_calico",   name: "엑조틱숏헤어",  desc: "납작 코의 사랑스러운 엑조틱", baseCatType: 4, accessory: "chef_hat", questDesc: "츄르 아이템 10회 사용 (누적)", questType: "churu_uses", questTarget: 10, stars: 2 },
  { id: "detective_gray", name: "샤르트뢰",     desc: "호박색 눈의 지적인 샤르트뢰", baseCatType: 1, accessory: "monocle", questDesc: "고양이풀 10회 사용 (누적)", questType: "catnip_uses", questTarget: 10, stars: 2 },
  { id: "pirate_orange", name: "해적 모험가",   desc: "해적 모자의 용감한 모험가 고양이", baseCatType: 0, accessory: "pirate_hat", questDesc: "20,000점 달성", questType: "score", questTarget: 20000, stars: 3 },
  { id: "angel_white",   name: "천사 앙고라",   desc: "오드아이의 신성한 앙고라", baseCatType: 3, accessory: "angel", questDesc: "7연속 콤보 달성", questType: "max_combo", questTarget: 7, stars: 3 },
  { id: "devil_black",   name: "악마 봄베이",   desc: "붉은 눈의 위험한 봄베이", baseCatType: 2, accessory: "devil", questDesc: "한번에 7줄 이상 클리어", questType: "lines_at_once", questTarget: 7, stars: 3 },
  { id: "dj_siam",       name: "DJ 샴냥",       desc: "핫핑크 헤드폰의 DJ 샴 고양이", baseCatType: 5, accessory: "headphones", questDesc: "30,000점 달성", questType: "score", questTarget: 30000, stars: 3 },
  { id: "astro_calico",  name: "우주 벵갈",     desc: "표범 무늬의 우주 탐험 벵갈", baseCatType: 4, accessory: "spacesuit", questDesc: "한 게임에 아이템 20회 사용", questType: "total_item_uses", questTarget: 20, stars: 3 },
  { id: "rainbow_cat",   name: "무지개냥",      desc: "무지개빛 신비로운 전설의 고양이", baseCatType: 0, accessory: "rainbow", questDesc: "모든 고양이 아이콘 수집 완료", questType: "collect_all_icons", questTarget: 19, stars: 3 },
];

// ─── Block Skin Quests ───
export interface SkinQuest {
  id: string;
  skinId: BlockSkin;
  desc: string;
  questType: QuestType;
  questTarget: number;
  stars: number; // always 4
  requiresSkin: BlockSkin; // must be using this skin
}

export const SKIN_QUESTS: SkinQuest[] = [
  // Pig quests
  { id: "pig_q1", skinId: "pig", desc: "돼지 스킨으로 25,000점 달성", questType: "score", questTarget: 25000, stars: 4, requiresSkin: "pig" },
  { id: "pig_q2", skinId: "pig", desc: "돼지 스킨으로 한번에 5줄 이상 클리어", questType: "lines_at_once", questTarget: 5, stars: 4, requiresSkin: "pig" },
  { id: "pig_q3", skinId: "pig", desc: "돼지 스킨으로 콤보 15회 달성", questType: "total_combos", questTarget: 15, stars: 4, requiresSkin: "pig" },
  { id: "pig_q4", skinId: "pig", desc: "돼지 스킨으로 꾹꾹이 8회 사용", questType: "knead_uses", questTarget: 8, stars: 4, requiresSkin: "pig" },
  // Dog quests
  { id: "dog_q1", skinId: "dog", desc: "강아지 스킨으로 25,000점 달성", questType: "score", questTarget: 25000, stars: 4, requiresSkin: "dog" },
  { id: "dog_q2", skinId: "dog", desc: "강아지 스킨으로 한번에 5줄 이상 클리어", questType: "lines_at_once", questTarget: 5, stars: 4, requiresSkin: "dog" },
  { id: "dog_q3", skinId: "dog", desc: "강아지 스킨으로 콤보 15회 달성", questType: "total_combos", questTarget: 15, stars: 4, requiresSkin: "dog" },
  { id: "dog_q4", skinId: "dog", desc: "강아지 스킨으로 고양이풀 8회 사용", questType: "catnip_uses", questTarget: 8, stars: 4, requiresSkin: "dog" },
  // Fox quests
  { id: "fox_q1", skinId: "fox", desc: "여우 스킨으로 30,000점 달성", questType: "score", questTarget: 30000, stars: 4, requiresSkin: "fox" },
  { id: "fox_q2", skinId: "fox", desc: "여우 스킨으로 한번에 6줄 이상 클리어", questType: "lines_at_once", questTarget: 6, stars: 4, requiresSkin: "fox" },
  { id: "fox_q3", skinId: "fox", desc: "여우 스킨으로 콤보 20회 달성", questType: "total_combos", questTarget: 20, stars: 4, requiresSkin: "fox" },
  { id: "fox_q4", skinId: "fox", desc: "여우 스킨으로 아이템 15회 사용", questType: "total_item_uses", questTarget: 15, stars: 4, requiresSkin: "fox" },
  // Rabbit quests
  { id: "rabbit_q1", skinId: "rabbit", desc: "토끼 스킨으로 30,000점 달성", questType: "score", questTarget: 30000, stars: 4, requiresSkin: "rabbit" },
  { id: "rabbit_q2", skinId: "rabbit", desc: "토끼 스킨으로 한번에 6줄 이상 클리어", questType: "lines_at_once", questTarget: 6, stars: 4, requiresSkin: "rabbit" },
  { id: "rabbit_q3", skinId: "rabbit", desc: "토끼 스킨으로 8연속 콤보 달성", questType: "max_combo", questTarget: 8, stars: 4, requiresSkin: "rabbit" },
  { id: "rabbit_q4", skinId: "rabbit", desc: "토끼 스킨으로 츄르 12회 사용", questType: "churu_uses", questTarget: 12, stars: 4, requiresSkin: "rabbit" },
  // Bear quests
  { id: "bear_q1", skinId: "bear", desc: "곰 스킨으로 40,000점 달성", questType: "score", questTarget: 40000, stars: 4, requiresSkin: "bear" },
  { id: "bear_q2", skinId: "bear", desc: "곰 스킨으로 한번에 7줄 이상 클리어", questType: "lines_at_once", questTarget: 7, stars: 4, requiresSkin: "bear" },
  { id: "bear_q3", skinId: "bear", desc: "곰 스킨으로 콤보 25회 달성", questType: "total_combos", questTarget: 25, stars: 4, requiresSkin: "bear" },
  { id: "bear_q4", skinId: "bear", desc: "곰 스킨으로 꾹꾹이 10회 사용", questType: "knead_uses", questTarget: 10, stars: 4, requiresSkin: "bear" },
];

// ─── Game Stats (tracked per game) ───
export interface GameStats {
  maxLinesAtOnce: number;
  totalCombos: number;
  maxCombo: number;
  kneadUses: number;
  churuUses: number;
  catnipUses: number;
  totalItemUses: number;
  totalLines: number;
  finalScore: number;
  skinUsed: BlockSkin;
  blocksPlaced: number;
}

export function createEmptyStats(skin: BlockSkin): GameStats {
  return {
    maxLinesAtOnce: 0, totalCombos: 0, maxCombo: 0,
    kneadUses: 0, churuUses: 0, catnipUses: 0,
    totalItemUses: 0, totalLines: 0, finalScore: 0,
    skinUsed: skin, blocksPlaced: 0,
  };
}

// ─── Player Progress ───
export interface PlayerProgress {
  nickname: string;
  equippedIcon: string; // icon id or "default_N"
  equippedSkin: BlockSkin;
  ownedSkins: BlockSkin[];
  unlockedIcons: string[];
  completedSkinQuests: string[];
  // Cumulative stats for quest tracking
  cumulativeStats: {
    totalChuruUses: number;
    totalCatnipUses: number;
    totalKneadUses: number;
    totalGamesPlayed: number;
    highestScore: number;
  };
}

export function createDefaultProgress(): PlayerProgress {
  return {
    nickname: "플레이어",
    equippedIcon: "default_0",
    equippedSkin: "cat",
    ownedSkins: ["cat"],
    unlockedIcons: [],
    completedSkinQuests: [],
    cumulativeStats: {
      totalChuruUses: 0, totalCatnipUses: 0, totalKneadUses: 0,
      totalGamesPlayed: 0, highestScore: 0,
    },
  };
}

// ─── Star Calculation ───
export function calculateTotalStars(progress: PlayerProgress): number {
  let stars = 0;
  // Icon stars
  for (const iconId of progress.unlockedIcons) {
    const icon = SPECIAL_CAT_ICONS.find(i => i.id === iconId);
    if (icon) stars += icon.stars;
  }
  // Skin quest stars
  for (const questId of progress.completedSkinQuests) {
    const quest = SKIN_QUESTS.find(q => q.id === questId);
    if (quest) stars += quest.stars;
  }
  // Owned skin stars (premium skins = 4 stars each)
  for (const skinId of progress.ownedSkins) {
    if (skinId !== "cat") stars += 4;
  }
  return stars;
}

// ─── Quest Checking ───
export function checkIconQuests(stats: GameStats, progress: PlayerProgress): string[] {
  const newUnlocks: string[] = [];
  for (const icon of SPECIAL_CAT_ICONS) {
    if (progress.unlockedIcons.includes(icon.id)) continue;
    if (checkQuestCondition(icon.questType, icon.questTarget, stats, progress)) {
      newUnlocks.push(icon.id);
    }
  }
  return newUnlocks;
}

export function checkSkinQuests(stats: GameStats, progress: PlayerProgress): string[] {
  const newCompletes: string[] = [];
  for (const quest of SKIN_QUESTS) {
    if (progress.completedSkinQuests.includes(quest.id)) continue;
    if (!progress.ownedSkins.includes(quest.requiresSkin)) continue;
    if (stats.skinUsed !== quest.requiresSkin) continue;
    if (checkQuestCondition(quest.questType, quest.questTarget, stats, progress)) {
      newCompletes.push(quest.id);
    }
  }
  return newCompletes;
}

function checkQuestCondition(type: QuestType, target: number, stats: GameStats, progress: PlayerProgress): boolean {
  switch (type) {
    case "lines_at_once": return stats.maxLinesAtOnce >= target;
    case "max_combo": return stats.maxCombo >= target;
    case "total_combos": return stats.totalCombos >= target;
    case "knead_uses": return stats.kneadUses >= target || progress.cumulativeStats.totalKneadUses >= target;
    case "churu_uses": return stats.churuUses >= target || progress.cumulativeStats.totalChuruUses >= target;
    case "catnip_uses": return stats.catnipUses >= target || progress.cumulativeStats.totalCatnipUses >= target;
    case "total_item_uses": return stats.totalItemUses >= target;
    case "total_lines": return stats.totalLines >= target;
    case "score": return stats.finalScore >= target || progress.cumulativeStats.highestScore >= target;
    case "collect_all_icons": return progress.unlockedIcons.length >= target;
    case "games_played": return progress.cumulativeStats.totalGamesPlayed >= target;
    case "consecutive_clears": return stats.maxCombo >= target;
    default: return false;
  }
}

// Premium currency packages
export const PREMIUM_PACKAGES = [
  { id: "com.catblockpop.premium_1000", amount: 1000, price: "₩1,000", priceNum: 1000, bonus: "" },
  { id: "com.catblockpop.premium_5000", amount: 5000, price: "₩5,000", priceNum: 5000, bonus: "" },
  { id: "com.catblockpop.premium_10000", amount: 11000, price: "₩10,000", priceNum: 10000, bonus: "+10% 보너스!" },
  { id: "com.catblockpop.premium_30000", amount: 33000, price: "₩30,000", priceNum: 30000, bonus: "+10% 보너스!" },
];