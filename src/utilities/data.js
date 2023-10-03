import {useState,useEffect} from "react";

const client = "003b4d8d38824fc9bb79fe010654db0a";
const secretClient = "cd890076056d4b808ed0efc9a393f67d";

async function getData(song){
    //Api access token
    useEffect(() => {
        let autParameters = {
            method : 'POST',
            headers :{
                'Content-Type': 'application/x-www-form-urlencoded',

            },
            body : `grant_type=client_credentials&client_id=${client}&client_secret=${secretClient}`
            }
          
        fetch('https://accounts.spotify.com/api/token',autParameters)
            .then(res => res.json())
            .then(data => console.log(data))
    },[])
}