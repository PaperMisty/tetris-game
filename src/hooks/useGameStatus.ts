import { useState, useCallback } from 'react';

export const useGameStatus = () => {
  const [score, setScore] = useState<number>(0);
  const [rows, setRows] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);

  const updateScore = useCallback((cleared: number) => {
    const linePoints = [40, 100, 300, 1200];
    if (cleared > 0) {
      const earned = linePoints[cleared - 1] || (1200 * cleared / 4);
      setScore(prev => prev + earned * level);
      setRows(prev => {
        const newRows = prev + cleared;
        setLevel(Math.floor(newRows / 10) + 1);
        return newRows;
      });
    }
  }, [level]);

  return { score, setScore, rows, setRows, level, setLevel, updateScore };
};
