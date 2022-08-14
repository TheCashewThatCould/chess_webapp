import { useEffect,useState,useRef} from 'react';
import { socketID, socket } from './socket';
import Chat  from './Chat'
import Cheese from './Chess'
export default function User(){
    const [userName,setUserName] = useState("")
    const [tempName,setTempName] = useState("")
    const [hasName,sethasName] = useState(false)
    const[attempt,setAttempt] = useState(false)
    useEffect(() => {
        if(attempt===false){
            socket.emit("join-home")
        }
        else{
            socket.emit("disconnect-from-home")
        }
    }, [attempt])
    function setName(){
        sethasName(true)
        setUserName(tempName)
    }
    function joinSession(){
        console.log("asdfsd")
        setAttempt(true)
        socket.emit("joinSession")
    }
    return (
        <div>
            {
            hasName?
            <header>User: {userName}</header>
            :
            <div>
            <input type = "text" onChange={(e) => setTempName(e.target.value)}/>
            <button onClick={setName} className="form--submit">Set Username</button>
            </div>
            }
            {
                attempt?
                <Cheese user={userName}/>
                :
                <div>
                <Chat user={userName}room="home"/>
                <button
                onClick={joinSession}
                className="form--submit"
                >Join Game
                </button>
                </div>
            }
        </div>
      );
}