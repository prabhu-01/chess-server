const express = require('express');
const { Server } = require('ws');

const app = express();
const port = 8080;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const wss = new Server({ server });

let gameState = {
  playerA: { characters: [], moves: [] },
  playerB: { characters: [], moves: [] },
  grid: Array(5).fill().map(() => Array(5).fill(null))
};

let players = [];

function initializeGame() {
  gameState.playerA.characters = [
    { id: 'P1', type: 'P', position: [0, 0] },
    { id: 'P2', type: 'P', position: [0, 1] },
    { id: 'P3', type: 'P', position: [0, 2] },
    { id: 'H1', type: 'H1', position: [0, 3] },
    { id: 'H2', type: 'H2', position: [0, 4] }
  ];

  gameState.playerB.characters = [
    { id: 'P1', type: 'P', position: [4, 0] },
    { id: 'P2', type: 'P', position: [4, 1] },
    { id: 'P3', type: 'P', position: [4, 2] },
    { id: 'H1', type: 'H1', position: [4, 3] },
    { id: 'H2', type: 'H2', position: [4, 4] }
  ];

  updateGrid();
}

function updateGrid() {
  gameState.grid = Array(5).fill().map(() => Array(5).fill(null));

  gameState.playerA.characters.forEach(character => {
    const [x, y] = character.position;
    gameState.grid[x][y] = `A-${character.id}`;
  });

  gameState.playerB.characters.forEach(character => {
    const [x, y] = character.position;
    gameState.grid[x][y] = `B-${character.id}`;
  });
}

function handleMove(data) {
  const { player, characterId, move } = data;
  const playerCharacters = gameState[player].characters;

  const character = playerCharacters.find(c => c.id === characterId);
  if (!character) return;

  let [x, y] = character.position;

  switch (move) {
    case 'L':
      y = player === 'playerA' ? y - 1 : y + 1;
      break;
    case 'R':
      y = player === 'playerA' ? y + 1 : y - 1;
      break;
    case 'F':
      x = player === 'playerA' ? x + 1 : x - 1;
      break;
    case 'B':
      x = player === 'playerA' ? x - 1 : x + 1;
      break;
    case 'FL':
      x = player === 'playerA' ? x + 1 : x - 1;
      y = player === 'playerA' ? y - 1 : y + 1;
      break;
    case 'FR':
      x = player === 'playerA' ? x + 1 : x - 1;
      y = player === 'playerA' ? y + 1 : y - 1;
      break;
    case 'BL':
      x = player === 'playerA' ? x - 1 : x + 1;
      y = player === 'playerA' ? y - 1 : y + 1;
      break;
    case 'BR':
      x = player === 'playerA' ? x - 1 : x + 1;
      y = player === 'playerA' ? y + 1 : y - 1;
      break;
    default:
      return;
  }

  if (x < 0 || x >= 5 || y < 0 || y >= 5) return;

  const target = gameState.grid[x][y];

  if (target && target.startsWith(player[0])) return;

  if (target) {
    const opponent = target.startsWith('A') ? 'playerA' : 'playerB';
    gameState[opponent].characters = gameState[opponent].characters.filter(c => c.position[0] !== x || c.position[1] !== y);
  }

  character.position = [x, y];
  updateGrid();
}


wss.on('connection', (ws) => {
  const playerName = players.length === 0 ? 'playerA' : 'playerB';
  players.push(playerName);

  ws.send(JSON.stringify({ type: 'player', playerName }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'initialize') {
      initializeGame();
    } else if (data.type === 'move') {
      handleMove(data);
    }

    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: 'state', gameState }));
      }
    });
  });

  ws.on('close', () => {
    players = players.filter(name => name !== playerName);
  });

  ws.send(JSON.stringify({ type: 'state', gameState }));
});
