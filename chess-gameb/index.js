const express = require('express');
const { WebSocketServer } = require('ws');

const sockserver = new WebSocketServer({ port: 8080 });

// const chatserver = new WebSocketServer({port: 443});

const app = express();

const gameState = {
  board: Array(5).fill(null).map(() => Array(5).fill(null)),
  players: {},
  turn: 'A', // Player A starts
};

// Basic setup for characters
const initialSetup = (player) => {
  const row = player === 'A' ? 0 : 4;
  gameState.board[row] = ['P1', 'H1', 'H2', 'P2', 'P3'].map(name =>`${player}-${name}`);
  gameState.players[player] = { characters: ['P1', 'H1', 'H2', 'P2', 'P3'] };
};

const initializeGame = () => {
  initialSetup('A');
  initialSetup('B');
};

initializeGame();

// Function to broadcast game state to all clients
const broadcastState = () => {
  sockserver.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(gameState));
    }
  });
};

function findCharacterPosition(player, character) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (gameState.board[i][j] === `${player}-${character}`) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

function calculateNewPosition(x, y, move, i) {
  switch (move) {
    case 'L': return [x, y - i];
    case 'R': return [x, y + i];
    case 'F': return [x - i, y];
    case 'B': return [x + i, y];
    case 'FL': return [x - i, y - i];
    case 'FR': return [x - i, y + i];
    case 'BL': return [x + i, y - i];
    case 'BR': return [x + i, y + i];
    default: return [x, y];
  }
}

function isValidMove(player, character, x, y, newX, newY) {
  // Check bounds
  if (newX < 0 || newX >= 5 || newY < 0 || newY >= 5) {
      return false;
    }
    
    if (gameState.board[newX][newY] && gameState.board[newX][newY][0] === player) {
        return false; 
    }

  const characterType = character.split('-')[1];

        if(characterType==='P1' || characterType==='P2' || characterType==='P3')
                return true;
        else if(characterType==='H1' || characterType==='H2')
                return true;
        else return false;
}

sockserver.on('connection', ws => {
  console.log("New client connected");
  ws.send(JSON.stringify(gameState));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      if (data.type === 'move') {
        const { player, character, move, selectedCell } = data;

        if (gameState.turn !== player || character == null) {
          ws.send(JSON.stringify({ error: 'Not your turn!' }));
          return;
        }

        const x = selectedCell.row;
        const y = selectedCell.col;

        if (x === -1 && y === -1) {
          ws.send(JSON.stringify({ error: 'Character not found!' }));
          return;
        }

        const characterType = character.split('-')[1];
        console.log(characterType)
        let i;
        if(characterType==='P1' || characterType==='P2' || characterType==='P3')
                i = 1;
        else if(characterType==='H1' || characterType==='H2')
                i = 2;
        
            const [newX, newY] = calculateNewPosition(x, y, move, i);
            console.log(newY);
          
          if (isValidMove(player, character, x, y, newX, newY)) {
            console.log("hello")
          gameState.board[x][y] = null;
          gameState.board[newX][newY] = `${character}`;
          gameState.turn = player === 'A' ? 'B' : 'A';
          console.log(gameState.board)
          broadcastState();  // Notify all clients of the updated state
        } else {
          ws.send(JSON.stringify({ error: 'Invalid move!' }));
        }
      }
    } catch (e) {
      console.error('Error processing message:', e);
      ws.send(JSON.stringify({ error: 'Invalid message format!' }));
    }
  });

  ws.on('close', () => { 
    console.log("Client disconnected"); 
  });

  ws.onerror = function () {
    console.log('WebSocket error');
  };
});



app.listen(4000, () => {
  console.log("Listening on port 4000");
});