import { useState, useEffect } from 'react';

export interface GameRecord {
  score: number;
  rows: number;
  level: number;
  date: string;
}

export const useHistory = () => {
  const [history, setHistory] = useState<GameRecord[]>(() => {
    try {
      const item = window.localStorage.getItem('tetris_history');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  const addRecord = (record: Omit<GameRecord, 'date'>) => {
    const newRecord: GameRecord = {
      ...record,
      date: new Date().toLocaleString(),
    };
    // 降序排列并只保留前10个高分
    const newHistory = [...history, newRecord]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setHistory(newHistory);
  };

  useEffect(() => {
    try {
      window.localStorage.setItem('tetris_history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history', error);
    }
  }, [history]);

  return { history, addRecord };
};
