import { WebSocket } from "ws";

export const findWinner = (player1: WebSocket, player2: WebSocket, player1Move: Number, player2Move: Number) => {
  //Rock=1 Paper=2 Scissor=3
  if (player1Move === player2Move) {
    console.log("draw");
    return "draw";
  }
  else {
    const player1Wins = (player1Move === 1 && player2Move === 3) || (player1Move === 2 && player2Move === 1) || (player1Move === 3 && player2Move === 2)
    const player2Wins = (player1Move === 3 && player2Move === 1) || (player1Move === 1 && player2Move === 2) || (player1Move === 2 && player2Move === 3)

    const winner = (player1Wins ? "player1" : "player2");
    return winner;
  }
}