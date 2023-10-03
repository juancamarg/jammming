import React from "react";

export default function Track(props){
    return <li>{props.track}<button value={props.value} name={props.name} onClick={props.onClick}>+</button></li>;
}