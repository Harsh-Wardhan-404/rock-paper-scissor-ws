import { useEffect, useState } from 'react'
import { Rock } from './icons/Rock';
// import { WebSocket } from 'ws';

const SERVER_URL = "ws://localhost:8080";

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<String>("Connection to the server ..");
  const [roomId, setRoomId] = useState<String | null>(null);
  const [result, setResult] = useState<String | null>(null);
  const [move, setMove] = useState<number | null>(null);

  useEffect(() => {
    const socket = new WebSocket(SERVER_URL);
    setWs(socket);

    socket.onopen = () => {
      setStatus("Connecting! Waiting for the opponent");
    };

    socket.onmessage = (e: any) => {
      const message = JSON.parse(e.data);
      const { type, roomId, message: serverMessage, result } = message;
      if (type === "start") {
        setStatus(serverMessage);
        setRoomId(roomId);
      } else if (type === "result") {
        setResult(result);
        setStatus('Game over !');
      } else if (type === 'opponent left') {
        setStatus('Your opponent left the game');
      }
    };

    socket.onclose = () => {
      setStatus("Disconnected from the server");
    }

    return () => {
      socket.close();
    }
  }, []);

  const handleMove = (move: Number) => {
    if (ws && roomId && move !== null) {
      ws.send(JSON.stringify({ type: 'move', roomId, move }));
      setStatus('Waiting for the opponent');
    }
  };
  return (
    <div className='flex flex-col bg-slate-400 w-90 h-screen'>
      <div className='mb-2 p-4 flex flex-row justify-center items-center'>
        <h1 className='text-4xl font-bold '>Rock paper scissor</h1>
      </div>
      <div className={status !== "Connecting! Waiting for the opponent" ? " bg-green-300 flex flex-row justify-center items-center" : "bg-red-500 flex flex-row justify-center items-center"}>Status : {status}</div>
      {result &&
        <div>
          <div> Result: {result}</div>
          <div><button onClick={() => window.location.reload()}>Restart</button></div>
        </div>
      }
      {!result && roomId && (
        <div className='flex flex-col justify-center items-center'>

          <br />
          <div className='flex flex-row justify-center items-center gap-12 mt-8 p-4'>
            <div className='game-icon hover:scale-110 transition-transform cursor-pointer'>

              <img onClick={() => handleMove(1)} className='w-44 h-24' src="/rock.png" alt="" />
              <p className='text-center mt-2 text-sm font-medium'>Rock</p>
            </div>

            <div className='game-icon hover:scale-110 transition-transform cursor-pointer'>
              {/* <Paper width={50} height={50} className='hover:shadow-lg' /> */}
              <img onClick={() => handleMove(2)} className='w-32 h-32' src="/paper.png" alt="" />
              <p className='text-center mt-2 text-sm font-medium'>Paper</p>
            </div>

            <div className='game-icon hover:scale-110 transition-transform cursor-pointer'>
              {/* <Scissor width={50} height={50} className='hover:shadow-lg' /> */}

              <img onClick={() => handleMove(3)} className='w-36 h-28' src="/scissor.png" alt="" />
              <p className='text-center mt-2 text-sm font-medium'>Scissor</p>
            </div>
          </div>
        </div >
      )
      }
    </div >
  )
}

export default App
