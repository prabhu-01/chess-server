import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket from 'react-use-websocket';
import './App.css';

const SOCKET_URL = 'ws://localhost:8080';

function App() {
  const [gameState, setGameState] = useState(null);
  const [player, setPlayer] = useState(null);
  const [gamePhase, setGamePhase] = useState('notStarted');
  const { sendJsonMessage, lastMessage } = useWebSocket(SOCKET_URL, {
    onOpen: () => console.log('WebSocket connection established'),
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === 'state') {
        setGameState(data.gameState);
      } else if (data.type === 'player') {
        setPlayer(data.playerName);
        console.log(`You are assigned as ${data.playerName}`);
      }
    }
  }, [lastMessage]);

  const initializeGame = useCallback(() => {
    sendJsonMessage({ type: 'initialize' });
    setGamePhase('selectPlayer');
  }, [sendJsonMessage]);

  const selectPlayer = (playerName) => {
    setPlayer(playerName);
    setGamePhase('inProgress');
  };

  // Define the makeMove function
  const makeMove = (characterId, move) => {
    sendJsonMessage({
      type: 'move',
      player: player,
      characterId: characterId,
      move: move,
    });
  };

  return (
    <div className="App">
      <h1>Turn-Based Chess-like Game</h1>
      {gamePhase === 'notStarted' && (
        <button onClick={initializeGame}>Start New Game</button>
      )}
      {gamePhase === 'selectPlayer' && (
        <div>
          <h2>Select Player:</h2>
          <button onClick={() => selectPlayer('playerA')}>Player A</button>
          <button onClick={() => selectPlayer('playerB')}>Player B</button>
        </div>
      )}
      {gamePhase === 'inProgress' && gameState && (
        <div>
          <GridDisplay grid={gameState.grid} player={player} />
          <Controls onMove={makeMove} />
        </div>
      )}
    </div>
  );
}

function GridDisplay({ grid, player }) {
  const invertedGrid = player === 'playerA'
    ? grid.map(row => row.slice().reverse()).reverse()
    : grid;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 60px)', gap: '2px' }}>
      {invertedGrid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            style={{
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (rowIndex + cellIndex) % 2 === 0 ? '#495057' : '#212529',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
}

function Controls({ onMove }) {
  const [characterId, setCharacterId] = useState('P1');
  const [move, setMove] = useState('L');

  const handleCharacterClick = (id) => {
    setCharacterId(id);
  };

  const handleMoveClick = (moveType) => {
    setMove(moveType);
  };

  const handleMove = () => {
    onMove(characterId, move);
  };

  const characters = [
    { id: 'P1', name: 'Pawn 1' },
    { id: 'P2', name: 'Pawn 2' },
    { id: 'P3', name: 'Pawn 3' },
    { id: 'H1', name: 'Hero 1' },
    { id: 'H2', name: 'Hero 2' }
  ];

  const moves = [
    { id: 'L', name: 'Left' },
    { id: 'R', name: 'Right' },
    { id: 'F', name: 'Forward' },
    { id: 'B', name: 'Backward' },
    { id: 'FL', name: 'Forward-Left' },
    { id: 'FR', name: 'Forward-Right' },
    { id: 'BL', name: 'Backward-Left' },
    { id: 'BR', name: 'Backward-Right' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <h2>Controls</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h3>Select Character:</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {characters.map(char => (
            <button
              key={char.id}
              style={{
                padding: '10px',
                backgroundColor: characterId === char.id ? '#007bff' : '#6c757d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => handleCharacterClick(char.id)}
            >
              {char.name}
            </button>
          ))}
        </div>
        <h3>Select Move:</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {moves.map(moveOption => (
            <button
              key={moveOption.id}
              style={{
                padding: '10px',
                backgroundColor: move === moveOption.id ? '#007bff' : '#6c757d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => handleMoveClick(moveOption.id)}
            >
              {moveOption.name}
            </button>
          ))}
        </div>
      </div>
      <br />
      <button onClick={handleMove}>Make Move</button>
    </div>
  );
}

export default App;
