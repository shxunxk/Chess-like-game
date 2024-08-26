import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file for styling

const SOCKET_URL = 'ws://localhost:8080';

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    board: Array(5).fill(null).map(() => Array(5).fill(null)),
    turn: 'A'
  });
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [chats, setChats] = useState(['Hi', 'Good game', 'Nice move', 'Demnnn']);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(SOCKET_URL);
      ws.onopen = () => {
        console.log('WebSocket connection established.');
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat') {
            setChatMessages((prevMessages) => [
              ...prevMessages,
              { message: data.message, sender: data.sender }
            ]);
          }

          if (data.board) {
            setGameState(data); // Update game state with the latest from the server
          } else if (data.error) {
            console.error(data.error); // Handle errors from server
          }
        } catch (error) {
          console.error('Invalid message received:', event.data);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed. Reconnecting in 3 seconds...');
        setTimeout(connectWebSocket, 3000); // Attempt to reconnect after 3 seconds
      };

      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      if (ws) {
        ws.close(); // Clean up WebSocket connection on component unmount
      }
    };
  }, []);

  const [moveHistory, setMoveHistory] = useState(['dsadfa','dasda','dsafdas']);

  const makeMove = (move) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      if (selectedCell.row !== null && selectedCell.col !== null) {
        const moveData = {
          player: gameState.turn,
          character: gameState.board[selectedCell.row][selectedCell.col],
          move,
          selectedCell,
        };
        socket.send(JSON.stringify({ type: 'move', ...moveData })); // Corrected structure to match server expectation
        setMoveHistory((prevHistory) => [
          ...prevHistory,
          `${gameState.turn} moved ${moveData.character} to ${move}`
        ]);
        setSelectedCell({row: null, col: null})
      } else {
        console.error('No cell selected.');
      }
    } else {
      console.error('WebSocket is not open.');
    }
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    if (gameState.board[rowIndex][cellIndex] && gameState.board[rowIndex][cellIndex].startsWith(gameState.turn)) {
      setSelectedCell({ row: rowIndex, col: cellIndex });
    }
  };



  const sendChatMessage = () => {
    if (socket && chatInput.trim() !== '') {
      const chatData = {
        type: 'chat',
        message: chatInput,
        sender: 'user'
      };
      socket.send(JSON.stringify(chatData));
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { message: chatInput, sender: 'You' }
      ]);
      setChatInput('');
    }
  };

  return (
    <div className="App">
      <div className='game-section'>
        <h1>Current User {gameState.turn}</h1>
        {gameState && <GameBoard gameState={gameState} selectedCell={selectedCell} onCellClick={handleCellClick} />}
        <div className="buttons">
        <button className="button" onClick={() => makeMove(gameState.board[selectedCell.row][selectedCell.col][2] === 'H' && gameState.board[selectedCell.row][selectedCell.col][3] === '2' ? 'FL' : 'F')}>
        {(selectedCell.row != null ) ? (gameState.board[selectedCell.row][selectedCell.col][2] === 'H' && gameState.board[selectedCell.row][selectedCell.col][3] === '2' ? 'FL' : 'F') : ''}
          </button>
          <button className="button" onClick={() => makeMove(gameState.board[selectedCell.row][selectedCell.col][2] === 'H' && gameState.board[selectedCell.row][selectedCell.col][3] === '2' ? 'FR' : 'B')}>
            {(selectedCell.row != null ) ? (gameState.board[selectedCell.row][selectedCell.col][2] === 'H' && gameState.board[selectedCell.row][selectedCell.col][3] === '2' ? 'FR' : 'B') : ''}
          </button>
          <button className="button" onClick={() => makeMove(gameState.board[selectedCell.row][selectedCell.col][2] === 'H' && gameState.board[selectedCell.row][selectedCell.col][3] === '2' ? 'BL' : 'L')}>
            {(selectedCell.row != null ) ? (gameState.board[selectedCell.row][selectedCell.col][2] === 'H' && gameState.board[selectedCell.row][selectedCell.col][3] === '2' ? 'BL' : 'L') : ''}
          </button>
          <button className="button" onClick={() => makeMove(gameState.board[selectedCell.row][selectedCell.col][2] === 'H' && gameState.board[selectedCell.row][selectedCell.col][3] === '2' ? 'BR' : 'R')}>
            {(selectedCell.row != null ) ? (gameState.board[selectedCell.row][selectedCell.col][2] === 'H' && gameState.board[selectedCell.row][selectedCell.col][3] === '2' ? 'BR' : 'R') : ''}
          </button>
        </div>
      </div>

      <div className="chat-container">
      <div className="chat">
        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className="chat-message"
            >
              {msg.sender}: {msg.message}
            </div>
          ))}
        </div>
        <div className="submit">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button className="button" onClick={sendChatMessage}>
            Send
          </button>
        </div>
        <div className="chat-options">
          {chats.map((item, index) => (
            <div className="option" key={index}>
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className='previous-moves'>
          <h2>Previous Moves:</h2>
          <ul>
            {moveHistory.map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    // </div>
  );
}

function GameBoard({ gameState, selectedCell, onCellClick }) {
  return (
    <div className="grid-container">
      {gameState.board.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className="grid-cell"
              onClick={() => onCellClick(rowIndex, cellIndex)}
              style={{
                backgroundColor:
                  selectedCell.row === rowIndex && selectedCell.col === cellIndex
                    ? 'rgba(111, 224, 255, 0.2)' // 0.7 represents 70% opacity
                    : 'rgba(0, 0, 0)',
                border: selectedCell.row === rowIndex && selectedCell.col === cellIndex
                ? '2px solid #6fe0ff' // 0.7 represents 70% opacity
                : 'white',
                color: selectedCell.row === rowIndex && selectedCell.col === cellIndex
                ? 'black' // 0.7 represents 70% opacity
                : 'white', // Black with 70% opacity
              }}
            >
              {cell || ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;