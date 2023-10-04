import React from "react";

export default function SearchBar(props){

    return <input placeholder = "Type a Song or Artist" type="Text" value = {props.value} onChange={props.onChange}></input>;

}