# 5x5 Chess-like Game

A turn-based chess-like game with a 5x5 grid, where each player has 3 pawns and 2 hero pieces. The game is built using React for the frontend and Node.js with WebSocket for the backend. The objective is to eliminate all of your opponent's pieces.

## Features

- **Turn-based Gameplay:** Players take turns to make their moves. The game enforces turns and displays whose turn it is.
- **Player Selection:** Players can choose to be either Player A or Player B.
- **Move History:** The game tracks and displays the history of moves made by each player.
- **WebSocket Integration:** Real-time gameplay with WebSocket communication between the client and server.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Clone the Repository

# Running the Server

This guide provides instructions on how to set up and run the WebSocket server for the 5x5 chess-like game.

## Prerequisites

- Ensure you have Node.js installed on your machine.
- The server code is located in the `server` directory of the project.

## Installation

1. **Navigate to the Server Directory:**

    Open your terminal and navigate to the `server` directory:

    ```bash
    cd server
    ```

2. **Install Dependencies:**

    Install the necessary Node.js packages:

    ```bash
    npm install
    ```

## Running the Server

1. **Start the Server:**

    After installing the dependencies, start the server using the following command:

    ```bash
    cd backend
    node server.js
    ```

2. **Server URL:**

    The server will be running at `ws://localhost:8080`.

3. **Monitoring the Server:**

    Once the server is running, you should see console logs indicating that the WebSocket connection is established and ready to handle incoming client connections.


## Running the Client

1. **Start the Client:**

    After installing the dependencies, start the client using the following command:

    ```bash
    cd frontend
    npm start
    ```

2. **Server URL:**

    The client will be running at `ws://localhost:3000`.

3. **Run second client:**

    Just open the same link `ws://localhost:3000` in a new tab.

## Troubleshooting

- **Port Issues:** If the server fails to start due to the port `8080` being in use, you can change the port in the `server.js` file and restart the server.
- **Dependencies:** Ensure that all dependencies are correctly installed. If you encounter errors related to missing packages, try running `npm install` again.

## Conclusion

Your server should now be up and running, ready to handle connections from clients in the chess-like game. Ensure that the server is running before starting the client instances.
