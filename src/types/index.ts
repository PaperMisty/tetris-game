export type TetrominoKeys = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
export type TetrominoType = TetrominoKeys | 0;
export type TetrominoShape = TetrominoType[][];

export interface TetrominoData {
  shape: TetrominoShape;
  color: string;
}

export const TETROMINOES: Record<TetrominoType, TetrominoData> = {
  0: { shape: [[0]], color: '0, 0, 0' },
  I: {
    shape: [
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
    ],
    color: '0, 255, 255',
  },
  J: {
    shape: [
      [0, 'J', 0],
      [0, 'J', 0],
      ['J', 'J', 0],
    ],
    color: '0, 102, 255',
  },
  L: {
    shape: [
      [0, 'L', 0],
      [0, 'L', 0],
      [0, 'L', 'L'],
    ],
    color: '255, 153, 0',
  },
  O: {
    shape: [
      ['O', 'O'],
      ['O', 'O'],
    ],
    color: '255, 255, 0',
  },
  S: {
    shape: [
      [0, 'S', 'S'],
      ['S', 'S', 0],
      [0, 0, 0],
    ],
    color: '0, 255, 0',
  },
  T: {
    shape: [
      [0, 0, 0],
      ['T', 'T', 'T'],
      [0, 'T', 0],
    ],
    color: '204, 0, 255',
  },
  Z: {
    shape: [
      ['Z', 'Z', 0],
      [0, 'Z', 'Z'],
      [0, 0, 0],
    ],
    color: '255, 0, 0',
  },
};

export type BoardCell = [TetrominoType, 'clear' | 'merged'];
export type BoardShape = BoardCell[][];

export interface Position {
  x: number;
  y: number;
}
