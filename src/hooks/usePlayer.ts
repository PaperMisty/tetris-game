import { useState, useCallback } from 'react';
import { TETROMINOES } from '../types';
import type { TetrominoShape, BoardShape, TetrominoType } from '../types';
import { randomTetrominoType, STAGE_WIDTH, checkCollision } from '../utils/gameHelpers';

export interface PlayerState {
  pos: { x: number; y: number };
  tetromino: TetrominoShape;
  nextType: TetrominoType;
  collided: boolean;
}

export const usePlayer = () => {
  const [player, setPlayer] = useState<PlayerState>({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOES[0].shape,
    nextType: 0,
    collided: false,
  });

  const rotate = (matrix: TetrominoShape, dir: number) => {
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map(col => col[index])
    );
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = (board: BoardShape, dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, board, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir); 
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: prev.pos.x + x, y: prev.pos.y + y },
      collided,
    }));
  };

  // 通过明确判定强制新方块或是平滑继承实现精确预览
  const resetPlayer = useCallback((forceInitial?: boolean) => {
    setPlayer(prev => {
      const isInitial = forceInitial || prev.nextType === 0;
      const t1Type = isInitial ? randomTetrominoType() : prev.nextType;
      const t2Type = randomTetrominoType();
      
      return {
        pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
        tetromino: TETROMINOES[t1Type].shape,
        nextType: t2Type,
        collided: false,
      };
    });
  }, []);

  return { player, updatePlayerPos, resetPlayer, playerRotate, setPlayer };
};
