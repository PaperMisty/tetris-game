import { useRef } from 'react';
import type { FC } from 'react';

interface MobileControlsProps {
  movePlayer: (dir: number) => void;
  playerRotate: (board: any, dir: number) => void;
  drop: () => void;
  hardDrop: () => void;
  isAIMode: boolean;
  gameOver: boolean;
  isPaused: boolean;
  board: any;
}

const MobileControls: FC<MobileControlsProps> = ({
  movePlayer,
  playerRotate,
  drop,
  hardDrop,
  isAIMode,
  gameOver,
  isPaused,
  board
}) => {
  const lastClickTime = useRef(0);

  if (isAIMode || gameOver || isPaused) return null;

  const buttonStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '2px solid #00ff80',
    background: 'rgba(0, 255, 128, 0.1)',
    color: '#00ff80',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    touchAction: 'manipulation',
    boxShadow: '0 0 10px rgba(0, 255, 128, 0.2)',
    transition: 'transform 0.1s, background 0.1s'
  };

  const handlePress = (e: React.MouseEvent | React.TouchEvent, action: () => void) => {
    // 阻止浏览器模拟的点击事件
    if (e.cancelable) e.preventDefault();
    
    const now = Date.now();
    // 200ms 内的重复触发判定为同一动作
    if (now - lastClickTime.current < 200) {
      return;
    }
    lastClickTime.current = now;
    action();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      marginTop: '20px',
      padding: '10px',
      width: '100%'
    }}>
      {/* 旋转和硬降 */}
      <div style={{ display: 'flex', gap: '30px' }}>
        <button 
          style={{ ...buttonStyle, background: 'rgba(0, 255, 128, 0.2)' }} 
          onMouseDown={(e) => handlePress(e, () => playerRotate(board, 1))}
          onTouchStart={(e) => handlePress(e, () => playerRotate(board, 1))}
        >
          🔄
        </button>
        <button 
          style={{ ...buttonStyle, background: 'rgba(0, 255, 128, 0.3)', borderColor: '#00ff80' }} 
          onMouseDown={(e) => handlePress(e, hardDrop)}
          onTouchStart={(e) => handlePress(e, hardDrop)}
        >
          ⚡
        </button>
      </div>

      {/* 左右移动 */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        <button 
          style={buttonStyle} 
          onMouseDown={(e) => handlePress(e, () => movePlayer(-1))}
          onTouchStart={(e) => handlePress(e, () => movePlayer(-1))}
        >
          ⬅️
        </button>
        <button 
          style={buttonStyle} 
          onMouseDown={(e) => handlePress(e, drop)}
          onTouchStart={(e) => handlePress(e, drop)}
        >
          ⬇️
        </button>
        <button 
          style={buttonStyle} 
          onMouseDown={(e) => handlePress(e, () => movePlayer(1))}
          onTouchStart={(e) => handlePress(e, () => movePlayer(1))}
        >
          ➡️
        </button>
      </div>
      
      <div style={{ fontSize: '0.8rem', color: 'rgba(0, 255, 128, 0.5)', fontFamily: 'monospace' }}>
        CONTROL DEBOUNCE ACTIVE
      </div>
    </div>
  );
};

export default MobileControls;
