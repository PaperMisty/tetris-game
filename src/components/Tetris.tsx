import { useState, useEffect } from 'react';
import type { FC, KeyboardEvent } from 'react';
import { createBoard, checkCollision, getMergedAndSweptBoard } from '../utils/gameHelpers';
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useBoard } from '../hooks/useBoard';
import { useGameStatus } from '../hooks/useGameStatus';
import { useHistory } from '../hooks/useHistory';
import { playButtonSound, playClearSound, playMoveSound, playRotateSound } from '../utils/audio';
import { TETROMINOES } from '../types';
import { findBestMove } from '../utils/aiLogic';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import HistoryBoard from './HistoryBoard';
import Cell from './Cell';

interface AITarget {
  x: number;
  rotation: number;
  isDone: boolean;
}

const Tetris: FC = () => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isAIMode, setIsAIMode] = useState<boolean>(false);
  
  const [aiTarget, setAiTarget] = useState<AITarget | null>(null);
  const [currentAiRot, setCurrentAiRot] = useState(0);

  const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const { score, setScore, rows, setRows, level, setLevel, updateScore } = useGameStatus();
  const { board, setBoard } = useBoard(player);
  const { history, addRecord } = useHistory();

  // 1. AI 决策触发逻辑 - 修复“切入卡死”问题
  useEffect(() => {
    // 只要开启了 AI 模式且没有正在执行的任务，就开始决策
    if (isAIMode && !isPaused && !gameOver && dropTime !== null && !aiTarget) {
      // 这里的决策逻辑不再限制于 y == 0
      const best = findBestMove(board, player.tetromino, player.pos.y);
      setAiTarget({ ...best, isDone: false });
      // 注意：当方块已经在空中时，之前的旋转次数我们假设为 0 (AI接管时的初始状态)
      setCurrentAiRot(0);
    }
  }, [isAIMode, isPaused, gameOver, board, player, dropTime, aiTarget]);

  // 2. AI 动作执行逻辑
  useEffect(() => {
    if (isAIMode && !isPaused && !gameOver && aiTarget && !aiTarget.isDone) {
      const stepTimer = setTimeout(() => {
        // AI 接管后的指令序列
        // A. 优先旋转同步
        if (currentAiRot < aiTarget.rotation) {
          playerRotate(board, 1);
          playRotateSound();
          setCurrentAiRot(prev => prev + 1);
        }
        // B. 左右平移同步
        else if (player.pos.x < aiTarget.x) {
          movePlayer(1);
        } else if (player.pos.x > aiTarget.x) {
          movePlayer(-1);
        }
        // C. 落位执行
        else {
          setAiTarget(prev => prev ? { ...prev, isDone: true } : null);
          const finalY = calculateFinalY(player, board);
          executeFinalDrop(finalY);
        }
      }, 60);

      return () => clearTimeout(stepTimer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAIMode, isPaused, gameOver, aiTarget, player, board, currentAiRot]);

  const calculateFinalY = (curPlayer: any, curBoard: any) => {
    let tempY = 0;
    while (!checkCollision(curPlayer, curBoard, { x: 0, y: tempY + 1 })) {
      tempY += 1;
    }
    return curPlayer.pos.y + tempY;
  };

  const executeFinalDrop = (y: number) => {
    const finalPlayer = { ...player, pos: { ...player.pos, y } };
    const { newBoard, cleared } = getMergedAndSweptBoard(finalPlayer, board);
    setBoard(newBoard);
    
    if (cleared > 0) {
      updateScore(cleared);
      playClearSound();
    }
    
    if (finalPlayer.pos.y < 1) {
      setGameOver(true);
      setDropTime(null);
      addRecord({ score, rows, level });
    } else {
      setAiTarget(null);
      resetPlayer();
    }
  };

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, board, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
      playMoveSound();
    }
  };

  const startGame = () => {
    playButtonSound();
    setBoard(createBoard());
    setDropTime(1000);
    resetPlayer(true);
    setGameOver(false);
    setIsPaused(false);
    setIsAIMode(false);
    setAiTarget(null);
    setScore(0);
    setRows(0);
    setLevel(1);
  };

  const togglePause = () => {
    if (gameOver) return;
    playButtonSound();
    if (isPaused) {
      setIsPaused(false);
      setDropTime(1000 / (level + 1) + 200);
    } else {
      setIsPaused(true);
      setDropTime(null);
    }
  };

  const toggleAI = () => {
    playButtonSound();
    const targetState = !isAIMode;
    setIsAIMode(targetState);
    
    if (targetState) {
      setAiTarget(null); // 强制重置目标触发重新决策
      if (gameOver || dropTime === null) {
        startGame();
        setIsAIMode(true);
      }
    }
  };

  const drop = () => {
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        addRecord({ score, rows, level });
        return;
      }

      const { newBoard, cleared } = getMergedAndSweptBoard(player, board);
      setBoard(newBoard);
      
      if (cleared > 0) {
        updateScore(cleared);
        playClearSound();
      }
      
      resetPlayer();
    }
  };

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver && !isPaused && !isAIMode) {
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const hardDrop = () => {
    const finalY = calculateFinalY(player, board);
    executeFinalDrop(finalY);
  }

  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!gameOver && !isPaused && !isAIMode) {
      if (e.keyCode === 37) {
        movePlayer(-1);
      } else if (e.keyCode === 39) {
        movePlayer(1);
      } else if (e.keyCode === 40) {
        setDropTime(30);
      } else if (e.keyCode === 38 || e.keyCode === 87) {
        playerRotate(board, 1);
        playRotateSound();
      } else if (e.keyCode === 32) {
        hardDrop();
      }
    }
  };

  useInterval(() => {
    if (!isPaused && !isAIMode) drop();
  }, dropTime);

  const renderPreview = () => {
    const previewGrid = Array.from(Array(4), () => new Array(4).fill(0));
    const type = player.nextType;
    if (type !== 0) {
      TETROMINOES[type].shape.forEach((row, y) => {
        row.forEach((val, x) => {
          if (val !== 0) previewGrid[y][x] = val;
        });
      });
    }
    return (
      <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 25px)', gridTemplateColumns: 'repeat(4, 25px)', gap: '2px', background: '#111', padding: '10px', borderRadius: '10px', border: '2px solid rgba(0,255,128,0.2)', margin: '0 0 20px 0', boxSizing: 'border-box', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), 0 0 10px rgba(0,255,128,0.1)' }}>
        {previewGrid.map((row, y) => row.map((type, x) => <Cell key={`${x}-${y}`} type={type as any} />))}
      </div>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ([32, 37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
        if (!gameOver) move(e);
      }}
      onKeyUp={keyUp as any}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'transparent',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '30px',
        outline: 'none',
        flexWrap: 'nowrap'
      }}
    >
      <div style={{ width: '280px', flexShrink: 0 }}>
        <div style={{ color: '#00ff80', textShadow: '0 0 5px rgba(0,255,128,0.5)', margin: '0 0 10px 0', fontFamily: 'Consolas, monospace', fontWeight: 'bold', fontSize: '1.2rem'}}>🏆 历史战绩</div>
        <HistoryBoard history={history} />
      </div>

      <div style={{ width: 'auto', position: 'relative' }}>
        <Stage stage={board} />
        {isAIMode && !gameOver && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '2px solid #00ff80',
              color: '#00ff80',
              padding: '10px 20px',
              borderRadius: '10px',
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              boxShadow: '0 0 30px rgba(0, 255, 128, 0.3)',
              whiteSpace: 'nowrap',
              animation: 'aiPulse 1s infinite'
            }}>
              🤖 PIERRE AI THINKING...
            </div>
          </div>
        )}
      </div>

      <aside style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        {gameOver ? (
          <Display gameOver={gameOver} text="👾 游戏结束 Game Over!" />
        ) : (
          <div>
            <Display text={`🔹 得分: ${score}`} />
            <Display text={`🔹 行数: ${rows}`} />
            <Display text={`🔹 等级: ${level}`} />
            {isPaused && <Display text="⏸️ 暂停中" />}
          </div>
        )}
        
        <div style={{color: '#00ff80', textShadow: '0 0 5px rgba(0,255,128,0.5)', margin: '0 0 10px 0', fontFamily: 'sans-serif', fontWeight: 'bold'}}>✨ 下一个 Next：</div>
        {renderPreview()}

        <StartButton callback={startGame} text={gameOver ? "重新挑战" : "开始游戏"} />
        {!gameOver && <StartButton callback={togglePause} text={isPaused ? "继续游戏" : "暂停游戏"} />}
        
        <button
          onClick={toggleAI}
          style={{
            boxSizing: 'border-box',
            margin: '0 0 20px 0',
            padding: '16px',
            borderRadius: '8px',
            border: isAIMode ? 'none' : '4px solid #00ff80',
            background: isAIMode ? '#00ff80' : 'rgba(0,0,0,0.5)',
            color: isAIMode ? '#111' : '#00ff80',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: isAIMode ? '0 0 30px #00ff80' : 'none',
            transition: 'all 0.3s'
          }}
        >
          {isAIMode ? "停止 AI 自动博弈" : "开启 Pierre AI 自动博弈"}
        </button>

        {aiTarget && isAIMode && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            border: '1px solid rgba(0, 255, 128, 0.3)',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.3)',
            color: '#00ff80',
            fontSize: '0.9rem',
            fontFamily: 'monospace'
          }}>
            <div>📍 目标轨迹定位...</div>
            <div style={{fontSize: '0.8rem', opacity: 0.7}}>目标 X: {aiTarget.x} | 旋转: {aiTarget.rotation}</div>
          </div>
        )}
      </aside>

      <style>{`
        @keyframes aiPulse {
          0% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.95); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          100% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.95); }
        }
      `}</style>
    </div>
  );
};

export default Tetris;
