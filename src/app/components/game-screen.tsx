import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { CatCell, CatCellMini, type ReactionType } from "./cat-cell";
import {
  type Board, type Piece, type CatType, type ItemInventory, type ItemKey, type Direction,
  BOARD_SIZE, createEmptyBoard, canPlace, placePiece,
  checkAndClearLines, calculateScore, isGameOver,
  generatePieces, getShapeBounds, clearStrip, clearAllBlocks,
} from "./game-logic";
import { playPlace, playHiss, playSad, playCatBreak, playChirp, playChuruSound, playCatnipSound, playKneadSound, playSkinBreak } from "./sound-effects";
import { ChuruEffect, CatnipEffect, KneadEffect } from "./item-effects";
import { ChuruIcon, CatnipIcon, KneadIcon } from "./paw-icons";
import { type BlockSkin, type GameStats, type BoardTheme, createEmptyStats, getSkinColors, getBoardTheme } from "./skins-data";

interface GameScreenProps {
  onGameOver: (score: number, stats: GameStats) => void;
  onGoLobby: () => void;
  items: ItemInventory;
  onUseItem: (key: ItemKey) => boolean;
  gameBgmOn: boolean;
  onToggleGameBgm: () => void;
  skin: BlockSkin;
  initialScore?: number;
}

const DRAG_LIFT = 80;

export function GameScreen({ onGameOver, onGoLobby, items, onUseItem, gameBgmOn, onToggleGameBgm, skin, initialScore = 0 }: GameScreenProps) {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [pieces, setPieces] = useState<(Piece | null)[]>(generatePieces);
  const [score, setScore] = useState(initialScore);
  const [combo, setCombo] = useState(0);
  const [clearingCells, setClearingCells] = useState<Set<string>>(new Set());
  const [comboText, setComboText] = useState<{ text: string; key: number } | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const comboKeyRef = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);

  // Game stats tracking
  const statsRef = useRef<GameStats>(createEmptyStats(skin));

  // Drag state
  const [dragPieceIdx, setDragPieceIdx] = useState<number | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  // Item state
  const [activeItem, setActiveItem] = useState<ItemKey | null>(null);
  const [showEffect, setShowEffect] = useState<{ type: ItemKey; dir?: Direction } | null>(null);
  const [catnipDragStart, setCatnipDragStart] = useState<{ row: number; col: number; x: number; y: number } | null>(null);

  // Block reaction state
  const [reactions, setReactions] = useState<Map<string, ReactionType>>(new Map());

  // Cell size
  const [cellSize, setCellSize] = useState(40);
  useEffect(() => {
    function calc() {
      const w = Math.min(window.innerWidth - 72, 380); // leave room for item bar
      setCellSize(Math.floor(w / BOARD_SIZE));
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Board drop position from drag
  const boardDropPos = useMemo(() => {
    if (dragPieceIdx === null || !dragPos || !gridRef.current) return null;
    const piece = pieces[dragPieceIdx];
    if (!piece) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const { rows, cols } = getShapeBounds(piece.shape);
    const x = dragPos.x - rect.left - 4;
    const y = dragPos.y - DRAG_LIFT - rect.top - 4;
    const col = Math.round(x / cellSize - cols / 2);
    const row = Math.round(y / cellSize - rows / 2);
    return { row, col };
  }, [dragPieceIdx, dragPos, cellSize, pieces]);

  const draggedPiece = dragPieceIdx !== null ? pieces[dragPieceIdx] : null;

  const isValidDrop = useMemo(() => {
    if (!draggedPiece || !boardDropPos) return false;
    return canPlace(board, draggedPiece, boardDropPos.row, boardDropPos.col);
  }, [board, draggedPiece, boardDropPos]);

  const ghostCells = useMemo(() => {
    if (!draggedPiece || !boardDropPos) return new Set<string>();
    const cells = new Set<string>();
    for (const [dr, dc] of draggedPiece.shape.cells) {
      cells.add(`${boardDropPos.row + dr},${boardDropPos.col + dc}`);
    }
    return cells;
  }, [draggedPiece, boardDropPos]);

  // Place piece logic
  const doPlace = useCallback((pieceIdx: number, row: number, col: number) => {
    const piece = pieces[pieceIdx];
    if (!piece) return;
    if (!canPlace(board, piece, row, col)) {
      playHiss(skin);
      if (gridRef.current) {
        gridRef.current.style.animation = "none";
        void gridRef.current.offsetHeight;
        gridRef.current.style.animation = "shake 0.3s ease";
      }
      return;
    }

    const newBoard = placePiece(board, piece, row, col);
    playPlace(skin);

    // Track blocks placed
    statsRef.current.blocksPlaced += piece.shape.cells.length;

    // ─── Block Reactions ───
    // Calculate placed cells positions
    const placedCells = piece.shape.cells.map(([dr, dc]) => ({ r: row + dr, c: col + dc }));
    const newReactions = new Map<string, ReactionType>();
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] === null) continue; // only existing blocks react
        if (placedCells.some(p => p.r === r && p.c === c)) continue; // skip newly placed
        // Calculate min distance to any placed cell
        let minDist = Infinity;
        for (const p of placedCells) {
          const dist = Math.abs(p.r - r) + Math.abs(p.c - c);
          minDist = Math.min(minDist, dist);
        }
        // Assign reaction based on skin and distance
        const key = `${r},${c}`;
        if (skin === "cat") {
          newReactions.set(key, minDist <= 2 ? "surprised" : "mouthOpen");
        } else if (skin === "dog") {
          newReactions.set(key, minDist <= 2 ? "happy" : "whimper");
        } else if (skin === "pig") {
          newReactions.set(key, minDist <= 2 ? "noseFlare" : "mouthOpen");
        } else if (skin === "fox") {
          newReactions.set(key, minDist <= 2 ? "sly" : "curious");
        } else if (skin === "rabbit") {
          newReactions.set(key, minDist <= 2 ? "earPerk" : "sniff");
        } else if (skin === "bear") {
          newReactions.set(key, minDist <= 2 ? "growl" : "lumbering");
        }
      }
    }
    setReactions(newReactions);
    setTimeout(() => setReactions(new Map()), 800);

    const { board: clearedBoard, linesCleared, clearedCells } = checkAndClearLines(newBoard);

    if (linesCleared > 0) {
      setClearingCells(clearedCells);
      const newCombo = combo + 1;
      const points = calculateScore(linesCleared, newCombo);

      // Update stats
      statsRef.current.totalLines += linesCleared;
      statsRef.current.maxLinesAtOnce = Math.max(statsRef.current.maxLinesAtOnce, linesCleared);
      statsRef.current.totalCombos++;
      statsRef.current.maxCombo = Math.max(statsRef.current.maxCombo, newCombo);

      const clearedTypes = new Set<CatType>();
      for (const key of clearedCells) {
        const [r, c] = key.split(",").map(Number);
        const val = newBoard[r][c];
        if (val !== null) clearedTypes.add(val);
      }
      let delay = 0;
      for (const ct of clearedTypes) {
        if (skin === "cat") {
          setTimeout(() => playCatBreak(ct), delay);
        } else {
          setTimeout(() => playSkinBreak(skin), delay);
        }
        delay += 80;
      }
      if (newCombo > 1) setTimeout(() => playChirp(skin), delay);

      comboKeyRef.current++;
      const text = newCombo > 1 ? `+${points} 🔥 x${newCombo} 콤보!` : `+${points}`;
      setComboText({ text, key: comboKeyRef.current });
      setTimeout(() => setComboText(null), 1200);

      setTimeout(() => { setClearingCells(new Set()); setBoard(clearedBoard); }, 300);

      setScore(s => s + points);
      setCombo(newCombo);
      setBoard(newBoard);
    } else {
      setBoard(newBoard);
      setCombo(0);
    }

    const newPieces = [...pieces];
    newPieces[pieceIdx] = null;

    const remainingPieces = newPieces.filter(p => p !== null);
    if (remainingPieces.length === 0) {
      const freshPieces = generatePieces();
      setTimeout(() => {
        const finalBoard = linesCleared > 0 ? clearedBoard : newBoard;
        if (isGameOver(finalBoard, freshPieces)) {
          setGameEnded(true); playSad(skin);
          setTimeout(() => onGameOver(score + (linesCleared > 0 ? calculateScore(linesCleared, combo + 1) : 0), statsRef.current), 500);
        }
      }, linesCleared > 0 ? 350 : 50);
      setPieces(freshPieces);
    } else {
      setTimeout(() => {
        const finalBoard = linesCleared > 0 ? clearedBoard : newBoard;
        if (isGameOver(finalBoard, newPieces)) {
          setGameEnded(true); playSad(skin);
          setTimeout(() => onGameOver(score + (linesCleared > 0 ? calculateScore(linesCleared, combo + 1) : 0), statsRef.current), 500);
        }
      }, linesCleared > 0 ? 350 : 50);
      setPieces(newPieces);
    }
  }, [board, pieces, score, combo, onGameOver, skin]);

  // ─── Drag handlers ───
  const handlePiecePointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    if (!pieces[idx] || gameEnded || activeItem) return;
    e.preventDefault();
    setDragPieceIdx(idx);
    const pos = { x: e.clientX, y: e.clientY };
    posRef.current = pos;
    setDragPos(pos);
  }, [pieces, gameEnded, activeItem]);

  useEffect(() => {
    if (dragPieceIdx === null) return;
    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      posRef.current = { x: e.clientX, y: e.clientY };
      if (floatingRef.current) {
        floatingRef.current.style.left = `${e.clientX}px`;
        floatingRef.current.style.top = `${e.clientY - DRAG_LIFT}px`;
      }
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setDragPos({ x: posRef.current.x, y: posRef.current.y });
      });
    };
    const onUp = () => {
      cancelAnimationFrame(rafRef.current);
      const pos = posRef.current;
      if (gridRef.current && dragPieceIdx !== null) {
        const piece = pieces[dragPieceIdx];
        if (piece) {
          const rect = gridRef.current.getBoundingClientRect();
          const { rows, cols } = getShapeBounds(piece.shape);
          const x = pos.x - rect.left - 4;
          const y = pos.y - DRAG_LIFT - rect.top - 4;
          const col = Math.round(x / cellSize - cols / 2);
          const row = Math.round(y / cellSize - rows / 2);
          if (canPlace(board, piece, row, col)) {
            doPlace(dragPieceIdx, row, col);
          }
        }
      }
      setDragPieceIdx(null);
      setDragPos(null);
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [dragPieceIdx, pieces, board, cellSize, doPlace]);

  // ─── Item usage ───
  const handleItemClick = useCallback((key: ItemKey) => {
    if (gameEnded || showEffect) return;
    if (items[key] <= 0) return;
    if (activeItem === key) { setActiveItem(null); return; }
    setActiveItem(key);
  }, [gameEnded, showEffect, items, activeItem]);

  // 츄르: immediate use
  const handleChuruUse = useCallback(() => {
    if (!onUseItem("churu")) return;
    statsRef.current.churuUses++;
    statsRef.current.totalItemUses++;
    setActiveItem(null);
    playChuruSound(skin);
    setShowEffect({ type: "churu" });
  }, [onUseItem, skin]);

  const handleChuruComplete = useCallback(() => {
    setShowEffect(null);
    // Replace waiting pieces with new ones
    setPieces(generatePieces());
  }, []);

  // ─── Refs for item effects (to avoid stale closures) ───
  const boardRef = useRef(board);
  boardRef.current = board;

  // 고양이풀: drag on board to pick direction
  const handleCatnipBoardDown = useCallback((e: React.PointerEvent, row: number, col: number) => {
    if (activeItem !== "catnip") return;
    e.preventDefault();
    setCatnipDragStart({ row, col, x: e.clientX, y: e.clientY });
  }, [activeItem]);

  useEffect(() => {
    if (!catnipDragStart) return;
    const onUp = (e: PointerEvent) => {
      const dx = e.clientX - catnipDragStart.x;
      const dy = e.clientY - catnipDragStart.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 20) { setCatnipDragStart(null); return; } // Too short

      let dir: Direction;
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? "right" : "left";
      } else {
        dir = dy > 0 ? "down" : "up";
      }

      if (!onUseItem("catnip")) { setCatnipDragStart(null); return; }
      statsRef.current.catnipUses++;
      statsRef.current.totalItemUses++;
      setActiveItem(null);
      playCatnipSound(skin);
      setShowEffect({ type: "catnip", dir });

      const startRow = catnipDragStart.row;
      const startCol = catnipDragStart.col;
      setTimeout(() => {
        const result = clearStrip(boardRef.current, startRow, startCol, dir);
        if (result.cellCount > 0) {
          setClearingCells(result.clearedCells);
          setScore(s => s + result.cellCount * 2);
          setTimeout(() => { setClearingCells(new Set()); setBoard(result.board); }, 300);
        }
      }, 1200);

      setCatnipDragStart(null);
    };
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, [catnipDragStart, onUseItem, skin]);

  const handleCatnipComplete = useCallback(() => {
    setShowEffect(null);
  }, []);

  // 꾹꾹이: immediate use
  const handleKneadUse = useCallback(() => {
    if (!onUseItem("knead")) return;
    statsRef.current.kneadUses++;
    statsRef.current.totalItemUses++;
    setActiveItem(null);
    playKneadSound(skin);
    setShowEffect({ type: "knead" });
  }, [onUseItem, skin]);

  const handleKneadComplete = useCallback(() => {
    setShowEffect(null);
    const result = clearAllBlocks(boardRef.current);
    if (result.cellCount > 0) {
      setClearingCells(result.clearedCells);
      setScore(s => s + result.cellCount * 3);
      setTimeout(() => { setClearingCells(new Set()); setBoard(result.board); }, 300);
    }
  }, []);

  // Handle board cell click for items
  const handleBoardCellClick = useCallback((row: number, col: number) => {
    if (activeItem === "churu") {
      handleChuruUse();
    } else if (activeItem === "knead") {
      handleKneadUse();
    }
    // catnip uses drag, handled separately
  }, [activeItem, handleChuruUse, handleKneadUse]);

  const gridSize = cellSize * BOARD_SIZE;
  const pieceTraySize = Math.floor(cellSize * 0.42);
  const boardTheme = getBoardTheme(skin);

  return (
    <div className="flex flex-col items-center min-h-screen select-none"
      style={{ fontFamily: "'Nunito', sans-serif", touchAction: "none" }}>

      {/* Top Bar */}
      <div className="w-full max-w-[440px] px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button onClick={onGoLobby}
            className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.5)", color: boardTheme.accent }}>←</button>
          <button onClick={onToggleGameBgm}
            className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90"
            style={{ background: gameBgmOn ? boardTheme.accentAlpha : "rgba(255,255,255,0.5)", color: boardTheme.accent }}>
            {gameBgmOn ? "🎵" : "🔇"}
          </button>
        </div>
        <div className="flex items-center gap-3">
          {combo > 0 && (
            <div className="px-2 py-0.5 rounded-full text-[10px] text-white"
              style={{ background: boardTheme.comboBadge }}>🔥 x{combo}</div>
          )}
          <div className="px-3 py-1 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.6)", minWidth: 80 }}>
            <p className="text-[9px]" style={{ color: boardTheme.accentLight }}>SCORE</p>
            <p className="text-lg" style={{ color: boardTheme.accent }}>{score.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Combo popup */}
      {comboText && (
        <div key={comboText.key} className="fixed z-40 pointer-events-none text-center"
          style={{
            top: "30%", left: "50%", transform: "translateX(-50%)",
            color: combo > 1 ? boardTheme.comboHighColor : boardTheme.comboColor,
            fontSize: combo > 1 ? "26px" : "20px",
            textShadow: "0 2px 8px rgba(0,0,0,0.1)",
            animation: "floatUp 1.2s ease-out forwards",
          }}>{comboText.text}</div>
      )}

      {/* Main content: board + item bar */}
      <div className="flex items-start gap-2 mt-1 mb-3">
        {/* Game Board */}
        <div ref={gridRef} className="relative rounded-2xl p-1"
          style={{
            background: boardTheme.boardBg,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
            width: gridSize + 8, height: gridSize + 8,
            outline: activeItem ? `2px dashed ${boardTheme.accent}` : "none",
          }}>
          {activeItem && (
            <div className="absolute -top-6 left-0 right-0 text-center text-[10px] z-10"
              style={{ color: boardTheme.accent }}>
              {activeItem === "catnip" ? "보드를 드래그하세요" : "보드를 터치하세요"}
            </div>
          )}
          <div className="grid"
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
            }}>
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
              const row = Math.floor(i / BOARD_SIZE);
              const col = i % BOARD_SIZE;
              const cellKey = `${row},${col}`;
              const cellValue = board[row][col];
              const isGhost = ghostCells.has(cellKey);
              const isClearing = clearingCells.has(cellKey);
              const cellReaction = reactions.get(cellKey) || "none";

              return (
                <div key={cellKey}
                  className="relative flex items-center justify-center"
                  style={{
                    width: cellSize, height: cellSize,
                    background: isGhost
                      ? isValidDrop ? boardTheme.ghostValid : boardTheme.ghostInvalid
                      : (row + col) % 2 === 0 ? boardTheme.cellDark : boardTheme.cellLight,
                    borderRadius: 4,
                    border: `1px solid ${boardTheme.border}`,
                    transition: "background 0.1s",
                  }}
                  onClick={() => handleBoardCellClick(row, col)}
                  onPointerDown={(e) => activeItem === "catnip" ? handleCatnipBoardDown(e, row, col) : undefined}
                >
                  {cellValue !== null && (
                    <CatCell catType={cellValue} size={cellSize - 2} clearing={isClearing} skin={skin} reaction={cellReaction} />
                  )}
                  {cellValue === null && !isGhost && (row + col) % 4 === 0 && (
                    <span className="absolute pointer-events-none select-none"
                      style={{ fontSize: cellSize * 0.28, opacity: 0.08 }}>
                      {boardTheme.cellPatternEmoji}
                    </span>
                  )}
                  {isGhost && cellValue === null && draggedPiece && isValidDrop && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <GhostBlock catType={draggedPiece.catType} size={cellSize - 2} skin={skin} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Item bar (right side) */}
        <div className="flex flex-col gap-2 pt-1">
          <ItemButton
            icon={<ChuruIcon size={24} skin={skin} />}
            count={items.churu}
            active={activeItem === "churu"}
            onClick={() => handleItemClick("churu")}
            label={skin === "rabbit" ? "당근" : skin === "bear" ? "꿀" : skin === "cat" ? "츄르" : "간식"}
            boardTheme={boardTheme}
          />
          <ItemButton
            icon={<CatnipIcon size={24} skin={skin} />}
            count={items.catnip}
            active={activeItem === "catnip"}
            onClick={() => handleItemClick("catnip")}
            label="풀"
            boardTheme={boardTheme}
          />
          <ItemButton
            icon={<KneadIcon size={24} skin={skin} />}
            count={items.knead}
            active={activeItem === "knead"}
            onClick={() => handleItemClick("knead")}
            label="꾹꾹"
            boardTheme={boardTheme}
          />
        </div>
      </div>

      {/* Piece Tray */}
      <div className="flex items-center justify-center gap-3 px-3 py-3 rounded-2xl"
        style={{ background: boardTheme.trayBg, boxShadow: "0 -2px 12px rgba(0,0,0,0.04)", minHeight: 90 }}>
        {pieces.map((piece, idx) => (
          <PieceTray key={idx} piece={piece} cellSize={pieceTraySize}
            isDragging={dragPieceIdx === idx}
            onPointerDown={(e) => handlePiecePointerDown(e, idx)}
            skin={skin} boardTheme={boardTheme} />
        ))}
      </div>

      {!gameEnded && dragPieceIdx === null && !activeItem && (
        <p className="text-[10px] mt-2" style={{ color: boardTheme.hintColor }}>블록을 드래그하여 보드에 놓으세요</p>
      )}

      {/* Floating drag piece */}
      {dragPieceIdx !== null && draggedPiece && dragPos && (
        <div ref={floatingRef} className="fixed pointer-events-none z-50"
          style={{ left: dragPos.x, top: dragPos.y - DRAG_LIFT, transform: "translate(-50%, -50%) scale(1.05)", opacity: 0.85 }}>
          <DragPiecePreview piece={draggedPiece} cellSize={cellSize} skin={skin} />
        </div>
      )}

      {/* Item effects */}
      {showEffect?.type === "churu" && <ChuruEffect onComplete={handleChuruComplete} skin={skin} />}
      {showEffect?.type === "catnip" && showEffect.dir && (
        <CatnipEffect direction={showEffect.dir} onComplete={handleCatnipComplete} skin={skin} />
      )}
      {showEffect?.type === "knead" && <KneadEffect onComplete={handleKneadComplete} skin={skin} />}

      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        @keyframes floatUp { 0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } 50% { opacity: 1; transform: translateX(-50%) translateY(-30px) scale(1.1); } 100% { opacity: 0; transform: translateX(-50%) translateY(-60px) scale(0.9); } }
      `}</style>
    </div>
  );
}

// ─── Item Button ───
function ItemButton({ icon, count, active, onClick, label, boardTheme }: {
  icon: React.ReactNode; count: number; active: boolean; onClick: () => void; label: string; boardTheme: BoardTheme;
}) {
  const disabled = count <= 0;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl cursor-pointer transition-all active:scale-90 disabled:opacity-35 disabled:cursor-not-allowed"
      style={{
        background: active ? boardTheme.accentAlpha : "rgba(255,255,255,0.5)",
        border: active ? `2px solid ${boardTheme.accent}` : "2px solid transparent",
        minWidth: 44,
      }}
    >
      {icon}
      <span className="text-[9px]" style={{ color: disabled ? "#ccc" : boardTheme.accent }}>×{count}</span>
      <span className="text-[8px]" style={{ color: boardTheme.accentLight }}>{label}</span>
    </button>
  );
}

// ─── Floating drag piece preview ───
function DragPiecePreview({ piece, cellSize, skin }: { piece: Piece; cellSize: number; skin: BlockSkin }) {
  const { rows, cols } = getShapeBounds(piece.shape);
  const cellSet = new Set(piece.shape.cells.map(([r, c]) => `${r},${c}`));
  return (
    <div className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
      }}>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return (
          <div key={i} className="flex items-center justify-center" style={{ width: cellSize, height: cellSize }}>
            {cellSet.has(`${r},${c}`) && <CatCell catType={piece.catType} size={cellSize - 2} skin={skin} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Piece Tray Item ───
function PieceTray({ piece, cellSize, isDragging, onPointerDown, skin, boardTheme }: {
  piece: Piece | null; cellSize: number; isDragging: boolean; onPointerDown: (e: React.PointerEvent) => void; skin: BlockSkin; boardTheme: BoardTheme;
}) {
  if (!piece) {
    return <div className="flex items-center justify-center rounded-xl" style={{ width: 72, height: 72, background: boardTheme.trayEmptyBg }} />;
  }
  const { rows, cols } = getShapeBounds(piece.shape);
  const cellSet = new Set(piece.shape.cells.map(([r, c]) => `${r},${c}`));
  const maxDim = Math.max(rows, cols);
  const adaptedSize = maxDim > 4 ? Math.floor(cellSize * 0.7) : cellSize;

  return (
    <div onPointerDown={onPointerDown}
      className="flex items-center justify-center rounded-xl p-1.5 transition-all cursor-grab active:cursor-grabbing"
      style={{
        background: isDragging ? boardTheme.trayItemDragBg : boardTheme.trayItemBg,
        border: isDragging ? `2px dashed ${boardTheme.trayItemDragBorder}` : "2px solid transparent",
        opacity: isDragging ? 0.3 : 1,
        transform: isDragging ? "scale(0.9)" : "scale(1)",
        minWidth: 72, minHeight: 72, touchAction: "none",
      }}>
      <div className="grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${cols}, ${adaptedSize}px)`, gridTemplateRows: `repeat(${rows}, ${adaptedSize}px)` }}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          return (
            <div key={i} className="flex items-center justify-center" style={{ width: adaptedSize, height: adaptedSize }}>
              {cellSet.has(`${r},${c}`) && <CatCellMini catType={piece.catType} size={adaptedSize - 1} skin={skin} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Ghost Block ───
// Simple colored block without animal face - cleaner drop preview
function GhostBlock({ catType, size, skin }: { catType: CatType; size: number; skin: BlockSkin }) {
  const colors = getSkinColors(skin);
  const style = colors[catType] || colors[0];
  const radius = size * 0.22;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ opacity: 0.55 }}>
      <rect x={1} y={1} width={size - 2} height={size - 3} rx={radius}
        fill={style.color} stroke={style.darkColor} strokeWidth={0.8} strokeOpacity={0.3} />
      <rect x={3} y={2} width={size - 6} height={(size - 4) * 0.35} rx={radius - 1}
        fill={style.lightColor} opacity={0.5} />
    </svg>
  );
}