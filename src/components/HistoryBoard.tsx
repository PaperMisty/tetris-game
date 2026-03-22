import type { FC } from 'react';
import type { GameRecord } from '../hooks/useHistory';

interface Props {
  history: GameRecord[];
}

const HistoryBoard: FC<Props> = ({ history }) => (
  <div style={{
    marginTop: '20px',
    padding: '20px',
    background: '#1a1a1a',
    borderRadius: '10px',
    border: '2px solid #333',
    color: '#ccc',
    width: '100%',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
  }}>
    <h3 style={{ margin: '0 0 10px 0', color: '#fff', textAlign: 'center', fontFamily: 'sans-serif' }}>🏆 历史最高分</h3>
    {history.length === 0 ? (
      <p style={{ textAlign: 'center', color: '#666' }}>暂无记录</p>
    ) : (
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #444' }}>
            <th style={{ padding: '8px 0' }}>名次</th>
            <th>得分</th>
            <th>行数</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '8px 0', color: index === 0 ? '#ffb300' : index < 3 ? '#e3d924' : '#aaa', fontWeight: index < 3 ? 'bold': 'normal' }}>#{index + 1}</td>
              <td style={{ color: '#80e3e6', fontWeight: 'bold' }}>{record.score}</td>
              <td>{record.rows}</td>
              <td style={{ fontSize: '0.75rem', color: '#666' }}>{record.date.split(' ')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default HistoryBoard;
