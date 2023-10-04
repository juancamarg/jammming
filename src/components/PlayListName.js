import React from "react";

export default function PlayListName(props) {
    
   return (
         <input placeholder = " Type the name of the Playlist "type="text" value={props.value} onChange={props.onChange}/>
   );
}