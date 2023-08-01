
import React from "react"
import "./style.css"
export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    return (
        <div  onClick={() => props.holdDice(props.id)} className="die-face" style={styles}>
            <h1 className="die-num">{props.value}</h1>
        </div>
    )
}
