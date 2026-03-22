import { TETROMINOES } from '../types';
import type { BoardShape, BoardCell, Position, TetrominoData, TetrominoKeys } from '../types';

export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

export const createBoard = (): BoardShape =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, 'clear'])
  );

export const randomTetrominoType = (): TetrominoKeys => {
  const tetrominos: TetrominoKeys[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  return tetrominos[Math.floor(Math.random() * tetrominos.length)];
};

export const randomTetromino = (): TetrominoData => {
  return TETROMINOES[randomTetrominoType()];
};

export const checkCollision = (
  player: any,
  board: BoardShape,
  { x: moveX, y: moveY }: Position
) => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      if (player.tetromino[y][x] !== 0) {
        if (
          !board[y + player.pos.y + moveY] ||
          !board[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          board[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
            'clear'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

/**
 * 核心物理逻辑：合并当前方块到棋盘，并扫描消行
 * 这是一个纯函数，输入当前状态，返回新棋盘和消行数。
 */
export const getMergedAndSweptBoard = (player: any, board: BoardShape): { newBoard: BoardShape, cleared: number } => {
  // 1. 深度克隆棋盘
  const newBoard = board.map(row => 
    row.map(cell => (cell[1] === 'merged' ? [...cell] : [0, 'clear']))
  ) as BoardShape;

  // 2. 合并当前方块
  player.tetromino.forEach((row: any[], y: number) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const boardY = y + player.pos.y;
        const boardX = x + player.pos.x;
        if (newBoard[boardY] && newBoard[boardY][boardX]) {
          newBoard[boardY][boardX] = [value, 'merged'];
        }
      }
    });
  });

  // 3. 扫描消行
  let cleared = 0;
  const sweptBoard = newBoard.reduce((acc, row) => {
    if (row.findIndex(cell => cell[0] === 0) === -1) {
      cleared += 1;
      acc.unshift(new Array<BoardCell>(newBoard[0].length).fill([0, 'clear']));
      return acc;
    }
    acc.push(row);
    return acc;
  }, [] as BoardShape);

  return { newBoard: sweptBoard, cleared };
};
