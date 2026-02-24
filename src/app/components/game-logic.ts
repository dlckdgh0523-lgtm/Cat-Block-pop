// ─── Types ───
export type CatType = 0 | 1 | 2 | 3 | 4 | 5;
export type Cell = CatType | null;
export type Board = Cell[][];

export interface Shape {
  cells: [number, number][];
  name: string;
}

export interface Piece {
  shape: Shape;
  catType: CatType;
}

// ─── Cat Styles ───
export const CAT_STYLES: { name: string; color: string; darkColor: string; lightColor: string; faceColor: string }[] = [
  { name: "orange",   color: "#FF9F43", darkColor: "#E58A2F", lightColor: "#FFBf76", faceColor: "#7A4A1A" },
  { name: "gray",     color: "#A4B0BE", darkColor: "#8395A7", lightColor: "#C8D1DA", faceColor: "#4A5568" },
  { name: "black",    color: "#555555", darkColor: "#3D3D3D", lightColor: "#777777", faceColor: "#EEEEEE" },
  { name: "white",    color: "#F0EDE8", darkColor: "#D5D0C8", lightColor: "#FAFAF8", faceColor: "#6B5E50" },
  { name: "calico",   color: "#FF7B7B", darkColor: "#E55A5A", lightColor: "#FFA8A8", faceColor: "#7A2A2A" },
  { name: "siamese",  color: "#E8D5B7", darkColor: "#D4BC96", lightColor: "#F5EBD9", faceColor: "#5C4A32" },
];

// ─── Shapes ───
export const SHAPES: Shape[] = [
  // 1 cell
  { cells: [[0,0]], name: "dot" },
  // 2 cells
  { cells: [[0,0],[0,1]], name: "h2" },
  { cells: [[0,0],[1,0]], name: "v2" },
  // 3 cells
  { cells: [[0,0],[0,1],[0,2]], name: "h3" },
  { cells: [[0,0],[1,0],[2,0]], name: "v3" },
  { cells: [[0,0],[0,1],[1,0]], name: "corner1" },
  { cells: [[0,0],[0,1],[1,1]], name: "corner2" },
  { cells: [[0,0],[1,0],[1,1]], name: "corner3" },
  { cells: [[0,1],[1,0],[1,1]], name: "corner4" },
  // 4 cells
  { cells: [[0,0],[0,1],[1,0],[1,1]], name: "square" },
  { cells: [[0,0],[0,1],[0,2],[0,3]], name: "h4" },
  { cells: [[0,0],[1,0],[2,0],[3,0]], name: "v4" },
  { cells: [[0,0],[1,0],[2,0],[2,1]], name: "bigL1" },
  { cells: [[0,0],[0,1],[0,2],[1,0]], name: "bigL2" },
  { cells: [[0,0],[0,1],[1,1],[2,1]], name: "bigL3" },
  { cells: [[0,0],[0,1],[0,2],[1,2]], name: "bigL4" },
  // T-shape
  { cells: [[0,0],[0,1],[0,2],[1,1]], name: "T" },
  // 5 cells
  { cells: [[0,0],[0,1],[0,2],[0,3],[0,4]], name: "h5" },
  { cells: [[0,0],[1,0],[2,0],[3,0],[4,0]], name: "v5" },
  // 3x3 square
  { cells: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]], name: "big_square" },
  // Plus
  { cells: [[0,1],[1,0],[1,1],[1,2],[2,1]], name: "plus" },
  // 2x3 rectangles
  { cells: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]], name: "rect_2x3" },
  { cells: [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1]], name: "rect_3x2" },
  // 3x3 L shapes (all rotations)
  { cells: [[0,0],[0,1],[0,2],[1,0],[2,0]], name: "L3_a" },
  { cells: [[0,0],[0,1],[0,2],[1,2],[2,2]], name: "L3_b" },
  { cells: [[0,2],[1,2],[2,0],[2,1],[2,2]], name: "L3_c" },
  { cells: [[0,0],[1,0],[2,0],[2,1],[2,2]], name: "L3_d" },
  // 3x3 donut
  { cells: [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]], name: "donut3" },
  // Long lines (6)
  { cells: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]], name: "h6" },
  { cells: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]], name: "v6" },
  // Big L shapes
  { cells: [[0,0],[1,0],[2,0],[3,0],[3,1],[3,2]], name: "bigL_4x3" },
  { cells: [[0,0],[0,1],[0,2],[0,3],[1,0],[2,0]], name: "bigL_4x3b" },
  // Big T shapes
  { cells: [[0,0],[0,1],[0,2],[0,3],[1,1],[1,2]], name: "bigT_4" },
  { cells: [[0,1],[1,0],[1,1],[1,2],[2,1],[3,1]], name: "bigT_v" },
  // Big Z/S
  { cells: [[0,0],[0,1],[1,1],[1,2],[2,2],[2,3]], name: "bigZ" },
  { cells: [[0,2],[0,3],[1,1],[1,2],[2,0],[2,1]], name: "bigS" },
  // Cross
  { cells: [[0,1],[1,0],[1,1],[1,2],[2,1],[3,1]], name: "cross" },
  // U shape
  { cells: [[0,0],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]], name: "U_shape" },
  // Staircase
  { cells: [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]], name: "stairs" },
];

// Shape weights: smaller shapes appear more often, large/complex shapes are rare but present
const SHAPE_WEIGHTS: number[] = [
  // 1 cell (dot)
  8,
  // 2 cells
  7, 7,
  // 3 cells (h3,v3, corners×4)
  6, 6, 5, 5, 5, 5,
  // 4 cells: square, h4, v4, bigL×4
  5, 4, 4, 3, 3, 3, 3,
  // T-shape (4 cells)
  3,
  // 5 cell lines
  2, 2,
  // 3x3 big square
  1,
  // Plus (5 cells)
  2,
  // 2x3, 3x2 rect
  2, 2,
  // 3x3 L shapes ×4
  2, 2, 2, 2,
  // 3x3 donut (rare)
  1,
  // h6, v6 (rare)
  1, 1,
  // bigL_4x3 ×2 (rare)
  1, 1,
  // bigT ×2 (rare)
  1, 1,
  // bigZ, bigS (rare)
  1, 1,
  // cross (rare)
  1,
  // U_shape (rare)
  1,
  // stairs (rare)
  1,
];

// ─── Board Helpers ───
export const BOARD_SIZE = 8;

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

export function canPlace(board: Board, piece: Piece, row: number, col: number): boolean {
  for (const [dr, dc] of piece.shape.cells) {
    const r = row + dr;
    const c = col + dc;
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false;
    if (board[r][c] !== null) return false;
  }
  return true;
}

export function placePiece(board: Board, piece: Piece, row: number, col: number): Board {
  const newBoard = board.map(r => [...r]);
  for (const [dr, dc] of piece.shape.cells) {
    newBoard[row + dr][col + dc] = piece.catType;
  }
  return newBoard;
}

export interface ClearResult {
  board: Board;
  linesCleared: number;
  clearedCells: Set<string>;
}

export function checkAndClearLines(board: Board): ClearResult {
  const clearedRows: number[] = [];
  const clearedCols: number[] = [];
  const clearedCells = new Set<string>();

  // Check rows
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (board[r].every(c => c !== null)) clearedRows.push(r);
  }
  // Check columns
  for (let c = 0; c < BOARD_SIZE; c++) {
    let full = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (board[r][c] === null) { full = false; break; }
    }
    if (full) clearedCols.push(c);
  }

  // Mark cleared cells
  for (const r of clearedRows) {
    for (let c = 0; c < BOARD_SIZE; c++) clearedCells.add(`${r},${c}`);
  }
  for (const c of clearedCols) {
    for (let r = 0; r < BOARD_SIZE; r++) clearedCells.add(`${r},${c}`);
  }

  const linesCleared = clearedRows.length + clearedCols.length;

  // Clear cells
  const newBoard = board.map(r => [...r]);
  for (const key of clearedCells) {
    const [r, c] = key.split(",").map(Number);
    newBoard[r][c] = null;
  }

  return { board: newBoard, linesCleared, clearedCells };
}

export function calculateScore(linesCleared: number, combo: number): number {
  if (linesCleared === 0) return 0;
  let base = 0;
  if (linesCleared === 1) base = 10;
  else if (linesCleared === 2) base = 25;
  else base = 25 + (linesCleared - 2) * 15;

  const multiplier = combo > 1 ? 1 + (combo - 1) * 0.2 : 1;
  return Math.floor(base * multiplier);
}

export function canPlaceAnywhere(board: Board, piece: Piece): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (canPlace(board, piece, r, c)) return true;
    }
  }
  return false;
}

export function isGameOver(board: Board, pieces: (Piece | null)[]): boolean {
  for (const piece of pieces) {
    if (piece && canPlaceAnywhere(board, piece)) return false;
  }
  return true;
}

export function generatePiece(): Piece {
  const totalWeight = SHAPE_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  let index = 0;
  while (random > 0) {
    random -= SHAPE_WEIGHTS[index];
    index++;
  }
  const shape = SHAPES[index - 1];
  const catType = Math.floor(Math.random() * 6) as CatType;
  return { shape, catType };
}

export function generatePieces(): Piece[] {
  return [generatePiece(), generatePiece(), generatePiece()];
}

export function getShapeBounds(shape: Shape): { rows: number; cols: number } {
  let maxR = 0, maxC = 0;
  for (const [r, c] of shape.cells) {
    maxR = Math.max(maxR, r);
    maxC = Math.max(maxC, c);
  }
  return { rows: maxR + 1, cols: maxC + 1 };
}

// ─── Item Helpers ───

export type Direction = "up" | "down" | "left" | "right";

// Clear a 3-wide strip in a direction from a starting position
export function clearStrip(board: Board, startRow: number, startCol: number, dir: Direction): { board: Board; clearedCells: Set<string>; cellCount: number } {
  const newBoard = board.map(r => [...r]);
  const cleared = new Set<string>();

  if (dir === "up" || dir === "down") {
    // Clear 3 columns centered on startCol, all rows
    for (let dc = -1; dc <= 1; dc++) {
      const c = startCol + dc;
      if (c < 0 || c >= BOARD_SIZE) continue;
      for (let r = 0; r < BOARD_SIZE; r++) {
        if (newBoard[r][c] !== null) {
          cleared.add(`${r},${c}`);
          newBoard[r][c] = null;
        }
      }
    }
  } else {
    // Clear 3 rows centered on startRow, all columns
    for (let dr = -1; dr <= 1; dr++) {
      const r = startRow + dr;
      if (r < 0 || r >= BOARD_SIZE) continue;
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (newBoard[r][c] !== null) {
          cleared.add(`${r},${c}`);
          newBoard[r][c] = null;
        }
      }
    }
  }

  return { board: newBoard, clearedCells: cleared, cellCount: cleared.size };
}

// Clear all blocks on board, return count
export function clearAllBlocks(board: Board): { board: Board; clearedCells: Set<string>; cellCount: number } {
  const newBoard = createEmptyBoard();
  const cleared = new Set<string>();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== null) {
        cleared.add(`${r},${c}`);
      }
    }
  }
  return { board: newBoard, clearedCells: cleared, cellCount: cleared.size };
}

// ─── Item Types ───
export interface ItemInventory {
  churu: number;
  catnip: number;
  knead: number;
}

export const ITEM_DEFS = {
  churu: {
    name: "은혜갚는 냥이",
    icon: "churu",
    price: 50,
    desc: "냥이가 츄르를 먹고 블록을 훔쳐갑니다!",
    shortName: "츄르",
  },
  catnip: {
    name: "고양이풀",
    icon: "catnip",
    price: 80,
    desc: "냥이가 고양이 풀을 따라갑니다!",
    shortName: "고양이풀",
  },
  knead: {
    name: "꾹꾹이",
    icon: "knead",
    price: 200,
    desc: "냥이가 꾹꾹이를 합니다!",
    shortName: "꾹꾹이",
  },
} as const;

export type ItemKey = keyof typeof ITEM_DEFS;