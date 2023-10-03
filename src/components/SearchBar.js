import React from "react";
import { useState } from "react";

export default function SearchBar(props){

    return <input type="Text" value = {props.value} onChange={props.onChange}></input>;

}