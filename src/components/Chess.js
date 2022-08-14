import {Chess} from 'chess.js'
import { useEffect,useState,useRef} from 'react';
import { socketID, socket } from './socket';
import Chat  from './Chat'
export default function Cheese(prop){
    const pieces = {
        "b": {
            "r":"\u265C",
            "n":"\u265E",
            "b":"\u265D",
            "q":"\u265B",
            "k":"\u265A",
            "p":"\u265F"
        },
        "w": {
            "r":"\u2656",
            "n":"\u2658",
            "b":"\u2657",
            "q":"\u2655",
            "k":"\u2654",
            "p":"\u2659"
        }
    }
    const user = prop.user
    const[obj,setObj] = useState(new Chess())
    const[select,setSelect] = useState("")
    const[join,setJoin] = useState(true)
    const[turn,setTurn] = useState(false)
    const[room,setRoom] = useState("")
    //setInterval(function () {console.log("SocketID: "+socketID)}, 1000);
    socket.on("in-session", message => {
        console.log("sessions-status: "+message)
        setJoin(message)
    })
    socket.on("recieve-move", move => {
        console.log("recieving move: "+move)
        const splitMessage = move.split("-")
        setObj(prevObj => {
            prevObj.move({from:splitMessage[0],to:splitMessage[1]})
            return prevObj
        })
        setTurn(true)
    })
    useEffect(() => {
        const handler = (data) => {
            setTurn(data)
        }

        socket.on("recieve-turn",handler)

        return () => socket.off("recieve-turn",handler)
    }, [])
    useEffect(() => {
        const handler = (data) => {
            setRoom(data)
        }

        socket.on("recieve-room",handler)

        return () => socket.off("recieve-room",handler)
    }, [])
    useEffect( () =>{
        if(obj.game_over()){
            Disconnect()
        }
    }, [obj])
    useEffect(() => {
        console.log(turn)
    },[turn])
    function Disconnect(){
        socket.emit("Disconnect", room)
    }
    function incrementChar(start,addition){
        return String.fromCharCode(start.charCodeAt(0) + addition)
    }
    function makeMove(message){
        const splitMessage = message.split("-")
        console.log(message)
        const tempObj = obj
        if(turn===false){
            console.log("not your turn")
            return
        }
        if(tempObj.move({from:splitMessage[0],to:splitMessage[1]})===null){
            console.log("invalid move")
            return 
        } 
        setObj(prevObj => {
            prevObj.move({from:splitMessage[0],to:splitMessage[1]})
            return prevObj
        })
        socket.emit("make-move", {room,move:message})
        setTurn(false)
    }
    function selectTile(prop){
        let y = 8 - Math.floor(prop.value/8)
        let x = prop.value%8
        let tileVal = incrementChar('a',x)+incrementChar('0',y)
        if(select===""){
            setSelect(tileVal)
        }
        else{ 
            const temp = select+"-"+tileVal
            console.log(temp)
            makeMove(temp)
            setSelect("")
        }
    }
    function returnBoard(){
        let y = 0
        return(
        obj.board().map(row => {
            let x = 0
             y+=1
            return row.map(tile => {
                const num = x + (y-1)*8
                let temp  = x+y
                let color = "black"
                x+=1
                if(temp%2===1){
                    color = "white"
                }
                if(tile===null){
                    return (
                        <button value = {num} onClick={(e)=>selectTile(e.target)} class={color}></button>
                    )
                }

                return (<button value = {num} onClick={(e)=>selectTile(e.target)} class={color}>{pieces[tile.color][tile.type]}</button>)
                
            })
           
        })
        )
    }
    function isInMatch(){
        if(join){
            return (
                <div>Looking for game...</div>
            )
        }
        else{
            return (
            
            <div>
                <div class="chessboard">
                    
                {returnBoard()}
                </div>
                <button onClick={Disconnect}
                className="form--submit"
                >Resign Game
                </button>
                <Chat user={user} room={room}/>
                </div>
            )
        }
    }
    return (
        isInMatch()
    )
}