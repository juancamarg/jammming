import React from "react";

export default function PlaylistItem(props) {
    return <li>{props.name}<button value ={props.value} onClick = {props.onClick}>-</button></li>
}