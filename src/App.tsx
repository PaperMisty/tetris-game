import Tetris from './components/Tetris';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1 
        style={{ 
          fontFamily: "'Inter', Arial, sans-serif", 
          fontSize: '2.5rem', 
          letterSpacing: '5px', 
          margin: '0 0 30px 0', 
          textShadow: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.2)',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        NEON TETRIS
      </h1>
      <Tetris />
    </div>
  );
}

export default App;
