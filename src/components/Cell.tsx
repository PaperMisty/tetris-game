import { memo } from 'react';
import type { FC } from 'react';
import { TETROMINOES } from '../types';
import type { TetrominoType } from '../types';

interface Props {
  type: TetrominoType;
}

const Cell: FC<Props> = ({ type }) => {
  const color = TETROMINOES[type].color;
  return (
    <div
      style={{
        width: 'auto',
        background: type === 0 ? 'rgba(0, 0, 0, 0.4)' : `rgba(${color}, 0.8)`,
        border: type === 0 ? '0px solid' : '4px solid',
        borderBottomColor: `rgba(${color}, 0.1)`,
        borderRightColor: `rgba(${color}, 1)`,
        borderTopColor: `rgba(${color}, 1)`,
        borderLeftColor: `rgba(${color}, 0.3)`,
        // 如果是活动方块，提供一点发光特效
        boxShadow: type !== 0 ? `0 0 10px rgba(${color}, 0.8)` : 'none',
        borderRadius: type === 0 ? '0' : '4px'
      }}
    />
  );
};

export default memo(Cell);
