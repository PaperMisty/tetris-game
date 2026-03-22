import type { FC } from 'react';

interface Props {
  gameOver?: boolean;
  text: string;
}

const Display: FC<Props> = ({ gameOver, text }) => (
  <div
    style={{
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      margin: '0 0 20px 0',
      padding: '20px',
      border: gameOver ? '4px solid #ff4040' : '4px solid rgba(0, 255, 128, 0.4)',
      minHeight: '30px',
      width: '100%',
      borderRadius: '10px',
      color: gameOver ? '#ff4040' : '#00ff80',
      background: '#0a0a0a',
      fontFamily: 'Consolas, monospace',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      boxShadow: gameOver ? '0 0 15px rgba(255, 64, 64, 0.5)' : '0 0 20px rgba(0, 255, 128, 0.15)'
    }}
  >
    {text}
  </div>
);

export default Display;
