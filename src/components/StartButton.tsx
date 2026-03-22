import type { FC } from 'react';

interface Props {
  callback: () => void;
  text?: string;
}

const StartButton: FC<Props> = ({ callback, text = "开始游戏" }) => (
  <button
    style={{
      boxSizing: 'border-box',
      margin: '0 0 20px 0',
      padding: '16px',
      minHeight: '30px',
      width: '100%',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(135deg, #00b359 0%,#00ff80 50%,#00cc66 100%)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      outline: 'none',
      cursor: 'pointer',
      boxShadow: '0 5px 25px rgba(0, 255, 128, 0.5)',
      transition: 'all 0.2s',
      color: '#111'
    }}
    onClick={callback}
    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 255, 128, 0.7)'; }}
    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 25px rgba(0, 255, 128, 0.5)'; }}
  >
    {text}
  </button>
);

export default StartButton;
