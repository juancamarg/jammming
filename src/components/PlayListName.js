import React from "react";

export default function PlayListName(props) {
    
   return (
         <input placeholder = " Type the new Playlist "type="text" value={props.value} onChange={props.onChange}/>
   );
}