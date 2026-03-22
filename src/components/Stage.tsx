import type { FC } from 'react';
import Cell from './Cell';
import type { BoardShape } from '../types';

interface Props {
  stage: BoardShape;
}

const Stage: FC<Props> = ({ stage }) => (
  // 固定它的最小与最大高宽以便在左右面板结构更协调
  <div
    className="Stage"
    style={{
      display: 'grid',
      gridTemplateRows: `repeat(${stage.length}, 30px)`,
      gridTemplateColumns: `repeat(${stage[0].length}, 30px)`,
      gap: '2px',
      border: '4px solid rgba(0, 255, 128, 0.4)',
      padding: '4px',
      borderRadius: '8px',
      background: 'rgba(20, 20, 20, 0.95)',
      boxShadow: '0 0 40px rgba(0, 255, 128, 0.2), inset 0 0 30px rgba(0,255,128,0.1)'
    }}
  >
    {stage.map(row =>
      row.map((cell, x) => <Cell key={x} type={cell[0]} />)
    )}
  </div>
);

export default Stage;
