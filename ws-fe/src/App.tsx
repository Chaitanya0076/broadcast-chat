import { useEffect, useRef, useState } from 'react';
import './App.css'


function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const inputBox = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket>(null)

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) =>{
      setMessages(prev => [...prev, event.data])
    }
    wsRef.current = ws;
    ws.onopen = () =>{
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId: "red"
        }
      }))
    }

    return () => {
      ws.close();
    }
  },[])

  function handleClick(){
      wsRef.current?.send(JSON.stringify({
        type:"chat",
        payload:{
          message: inputBox.current?.value,
          roomId: "red"
        }
      }))
      if (inputBox.current) {
        inputBox.current.value = "";
      }
  }
  
  return (
    <div className= 'flex flex-col h-[100vh] items-center justify-center'>
      <div className='text-grey-500 text-2xl font-bold'>ChatApp</div>
      <div className='h-[70vh] w-[60vw] bg-black border-purple-300 rounded-xl overflow-y-scroll snap-y snap-mandatory'>
        {messages.map((msg, index)=>(
          <div key={index} className ='m-4'><span className='bg-white text-stone-900 p-2 m-1 rounded-2xl'>{msg}</span></div>
        ))}
      </div>
      <div className='flex items-center w-[60vw] rounded-xl'>
        <input type="text" placeholder="enter the message" ref={inputBox} className='w-full border-2 p-2 rounded-xl' />
        <button className='bg-green-500 hover:bg-green-700 rounded-xl h-full text-black w-[5vw] p-2 cursor-pointer' onClick={handleClick}>Send</button>
      </div>
    </div>
  )
}

export default App
