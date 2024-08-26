Chess-Like Game
This is a simple turn-based chess-like game implemented using Node.js, WebSockets, and React. Players take turns moving their characters on a 5x5 board, each with unique movement and attack rules. The game supports real-time communication and state updates between the server and connected clients.

Features
Three Character Types:

Pawn (P): Moves one block in a straight line in any direction (Forward, Backward, Left, Right).
Hero1 (H1): Moves two blocks in a straight line. Can eliminate any opponent directly in its path.
Hero2 (H2): Moves two blocks diagonally. Can eliminate any opponent directly in its path.
Real-Time Updates: The game uses WebSockets to keep all connected clients in sync with the current game state, ensuring seamless turn-based play.

Chat Feature: Players can communicate through an in-game chat system that updates in real-time with WebSockets.

Installation
Clone the Repository:

bash
Copy code
git clone https://github.com/your-username/chess-like-game.git
cd chess-like-game
Install Dependencies:

bash
Copy code
npm install
Run the Server:

bash
Copy code
npm start
The server will start on port 4000, and the WebSocket server will run on port 8080.

Start the React App:

bash
Copy code
cd client
npm start
The React app will be available at http://localhost:3000.

How to Play
Setup:

On connecting to the server, players are assigned either Player A or Player B and will automatically receive the initial game state.
Making a Move:

Click on a character that belongs to you (denoted by 'A' or 'B' prefix).
Use the directional buttons to move your selected character based on its movement rules.
Turn-Based System:

After a valid move, the turn switches to the other player. The game continues until one player eliminates all the opponent’s characters or a win condition is achieved.
Chat:

Players can send messages using the in-game chat, which updates in real-time. Type your message and hit the "Send" button to communicate with your opponent.
Project Structure
Server (index.js): Manages the WebSocket server, game logic, and broadcasts the game state to connected clients.
Client (client/src/App.js): Implements the React-based game interface, handling the game board display, user input, and chat.
Game Logic: Controls character movement, move validation, and game state updates.
Contributing
If you would like to contribute to the project, please fork the repository, make your changes on a separate feature branch, and submit a pull request. All contributions are welcome!

License
This project is licensed under the MIT License.

This version includes clear instructions and improvements, particularly in explaining gameplay mechanics, chat functionality, and project structure. Let me know if you'd like further customization!