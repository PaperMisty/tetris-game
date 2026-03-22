import { useState, useEffect } from 'react';
import { createBoard } from '../utils/gameHelpers';
import type { PlayerState } from './usePlayer';
import type { BoardShape } from '../types';

export const useBoard = (player: PlayerState) => {
  const [board, setBoard] = useState(createBoard());

  // 渲染层 Effect：仅负责将活动方块绘制到视图使用的板子上
  useEffect(() => {
    const updateBoard = (prevBoard: BoardShape): BoardShape => {
      const newBoard = prevBoard.map(row =>
        row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
      ) as BoardShape;

      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = y + player.pos.y;
            const boardX = x + player.pos.x;
            if (newBoard[boardY] && newBoard[boardY][boardX]) {
              newBoard[boardY][boardX] = [value, 'clear'];
            }
          }
        });
      });

      return newBoard;
    };

    setBoard(prev => updateBoard(prev));
  }, [player]);

  return { board, setBoard };
};
