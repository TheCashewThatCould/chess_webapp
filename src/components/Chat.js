import { useEffect,useState,useRef} from 'react';
import  {io}  from 'socket.io-client'
import { socketID, socket } from './socket';

export default function Chat(prop) {
  
  const room = prop.room
  const user = prop.user
  const [message,setMessage] = useState("")
  const [recievedMessage,setRecievedMessage] = useState([])

  socket.on("recieve-message", msg => {
    setRecievedMessage([...recievedMessage,msg])
  })
  const sendMessage = () =>{
    if(message===""||user===""){
        return 
    }
    const full = user+": "+message
    setRecievedMessage([...recievedMessage,full])
    socket.emit("send-message", ({room,message:full}))
  }
  return (
    <div>
        {recievedMessage.map(msg => {return(<div>{msg}</div>)})}
        <input type = "text" onChange={(e) => setMessage(e.target.value)}/>
        <button onClick={sendMessage} className="form--submit">Send Message</button>
    </div>
  );
}

