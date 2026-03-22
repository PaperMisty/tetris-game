import type { BoardShape, TetrominoShape, BoardCell } from '../types';
import { checkCollision, STAGE_WIDTH, STAGE_HEIGHT } from './gameHelpers';

// Pierre Dellacherie 权重 (用户提供的精确值)
const WEIGHTS = {
  landingHeight: -4.5,
  erodedPieceCells: 3.418,
  rowTransitions: -3.21789,
  colTransitions: -9.3487,
  holes: -7.899,
  cumulativeWells: -3.3856,
};

/**
 * 模拟放置后的局面评分
 */
export const evaluateBoard = (board: BoardShape, _lastX: number, lastY: number, lastPiecesCount: number, linesCleared: number) => {
  const landingHeight = STAGE_HEIGHT - lastY;
  const erodedPieceCells = linesCleared * lastPiecesCount;
  
  let rowTransitions = 0;
  let colTransitions = 0;
  let holes = 0;
  let wells = 0;

  for (let y = 0; y < STAGE_HEIGHT; y++) {
    for (let x = 0; x < STAGE_WIDTH - 1; x++) {
      if ((board[y][x][0] === 0) !== (board[y][x + 1][0] === 0)) {
        rowTransitions++;
      }
    }
    if (board[y][0][0] === 0) rowTransitions++;
    if (board[y][STAGE_WIDTH - 1][0] === 0) rowTransitions++;
  }

  for (let x = 0; x < STAGE_WIDTH; x++) {
    for (let y = 0; y < STAGE_HEIGHT - 1; y++) {
      if ((board[y][x][0] === 0) !== (board[y + 1][x][0] === 0)) {
        colTransitions++;
      }
    }
    if (board[STAGE_HEIGHT - 1][x][0] === 0) colTransitions++;
  }

  for (let x = 0; x < STAGE_WIDTH; x++) {
    let blockFound = false;
    let wellDepth = 0;
    for (let y = 0; y < STAGE_HEIGHT; y++) {
      if (board[y][x][0] !== 0) {
        blockFound = true;
        if (wellDepth > 0) {
          wells += (wellDepth * (wellDepth + 1)) / 2;
          wellDepth = 0;
        }
      } else {
        if (blockFound) {
          holes++;
        }
        const leftWall = x === 0 || board[y][x - 1][0] !== 0;
        const rightWall = x === STAGE_WIDTH - 1 || board[y][x + 1][0] !== 0;
        if (leftWall && rightWall) {
          wellDepth++;
        } else {
          if (wellDepth > 0) {
            wells += (wellDepth * (wellDepth + 1)) / 2;
            wellDepth = 0;
          }
        }
      }
    }
    if (wellDepth > 0) {
      wells += (wellDepth * (wellDepth + 1)) / 2;
    }
  }

  return (
    WEIGHTS.landingHeight * landingHeight +
    WEIGHTS.erodedPieceCells * erodedPieceCells +
    WEIGHTS.rowTransitions * rowTransitions +
    WEIGHTS.colTransitions * colTransitions +
    WEIGHTS.holes * holes +
    WEIGHTS.cumulativeWells * wells
  );
};

/**
 * 寻找当前方块的最优落点 (适配中途接管的情况)
 */
export const findBestMove = (board: BoardShape, tetromino: TetrominoShape, startY: number = 0) => {
  let bestScore = -Infinity;
  let bestMove = { x: 0, rotation: 0 };

  for (let r = 0; r < 4; r++) {
    let currentTetro = tetromino;
    for (let i = 0; i < r; i++) {
      currentTetro = currentTetro.map((_, index) => currentTetro.map(col => col[index])).map(row => row.reverse());
    }

    // 尝试横向所有位置
    for (let x = -2; x < STAGE_WIDTH; x++) {
      const playerObj = { pos: { x, y: startY }, tetromino: currentTetro };
      
      // 检查中途开启时的位置是否合法
      if (checkCollision(playerObj, board, { x: 0, y: 0 })) continue;

      let y = startY;
      while (!checkCollision(playerObj, board, { x: 0, y: y + 1 })) {
        y++;
      }

      const finalY = y;
      const { tempBoard, erodedPieces, linesCleared } = simulatePlacement(board, currentTetro, x, finalY);
      const score = evaluateBoard(tempBoard, x, finalY, erodedPieces, linesCleared);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = { x, rotation: r };
      }
    }
  }

  return bestMove;
};

const simulatePlacement = (board: BoardShape, tetromino: TetrominoShape, posX: number, posY: number) => {
  const tempBoard = board.map(row => row.map(cell => [...cell])) as BoardShape;
  let erodedPieces = 0;

  tetromino.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const boardY = y + posY;
        const boardX = x + posX;
        if (tempBoard[boardY] && tempBoard[boardY][boardX]) {
          tempBoard[boardY][boardX] = [value, 'merged'];
        }
      }
    });
  });

  let linesCleared = 0;
  const filteredBoard = tempBoard.filter(row => {
    const isFull = row.every(cell => cell[0] !== 0);
    if (isFull) {
      linesCleared++;
      return false;
    }
    return true;
  });

  tetromino.forEach((row, ty) => {
    row.forEach((value, _tx) => {
      if (value !== 0) {
        const boardY = ty + posY;
        if (tempBoard[boardY] && tempBoard[boardY].every(cell => cell[0] !== 0)) {
           erodedPieces++;
        }
      }
    });
  });

  while (filteredBoard.length < STAGE_HEIGHT) {
    filteredBoard.unshift(new Array<BoardCell>(STAGE_WIDTH).fill([0, 'clear']));
  }

  return { tempBoard: filteredBoard as BoardShape, erodedPieces, linesCleared };
};
