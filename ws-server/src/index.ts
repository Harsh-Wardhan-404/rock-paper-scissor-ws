import WebSocket, { WebSocketServer } from 'ws';
import { findWinner } from './utils';

const wss = new WebSocketServer({ port: 8080 });

let users: Users[] = []

const waitingPlayers: WebSocket[] = [];

interface Users {
  socket: WebSocket,
  room: string
}

const games = new Map<String, { player1: WebSocket, player2: WebSocket; moves: Map<WebSocket, number> }>();

wss.on('connection', function (socket) {
  console.log("A new client connected");
  console.log("Current waiting players:", waitingPlayers.length);
  waitingPlayers.push(socket);
  if (waitingPlayers.length >= 2) {
    const player1 = waitingPlayers.shift()!;
    const player2 = waitingPlayers.shift()!;
    const roomId = `room-${Date.now()}`;

    console.log(`Pairing players into ${roomId}`);
    games.set(roomId, { player1, player2, moves: new Map() });
    console.log(`Created room: ${roomId}`);

    player1.send(JSON.stringify({ type: 'start', roomId, message: 'You are player 1. Game started! ' }))
    player2.send(JSON.stringify({ type: 'start', roomId, message: 'You are player 2. Game started! ' }))
  }
  socket.on('message', (rawMessage) => {
    const message = JSON.parse(rawMessage.toString());
    console.log(message);
    const { type, roomId, move } = message;
    if (type === 'move' && games.has(roomId)) {
      const game = games.get(roomId);
      game?.moves.set(socket, move);

      if (game?.moves.size == 2) {
        const [player1Move, player2Move] = Array.from(game.moves.values());
        const [player1, player2] = [game.player1, game.player2]
        //Finding the winner
        let result;
        result = findWinner(player1, player2, player1Move, player2Move);
        games.get(roomId)?.moves.clear();
        console.log(result);
        if (result === "draw") {
          player1.send(JSON.stringify({ type: "result", result: "Draw" }))
          player2.send(JSON.stringify({ type: "result", result: "Draw" }))
        } else {
          if (result === "player1") {
            player1.send(JSON.stringify({ type: "result", result: "Player1" }))
            player2.send(JSON.stringify({ type: "result", result: "Player1" }))

          } else {

            player1.send(JSON.stringify({ type: "result", result: "Player2" }))
            player2.send(JSON.stringify({ type: "result", result: "Player2" }))
          }
        }
      }
    }
    if (type === 'leave' && games.has(roomId)) {
      const game = games.get(roomId);
      game?.player1.send("Game ended");
      game?.player2.send("Game ended");
      games.delete(roomId);
    }


  })

  socket.on('close', () => {
    console.log("A player disconnected");
    const idx = waitingPlayers.indexOf(socket);
    if (idx > -1) {
      waitingPlayers.splice(idx, 1);
    }

    for (const [roomId, game] of games) {
      if (game.player1 === socket || game.player2 === socket) {
        const opponent = game.player1 === socket ? game.player2 : game.player1;
        opponent.send(JSON.stringify({ type: 'opponent_left', message: 'Your opponent left the game.' }));
        games.delete(roomId);
        break;
      }
    }
  })

  // socket.send("Hello the connection is setup");
})

