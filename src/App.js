import './App.css';
import { useState,useEffect } from 'react';
import SearchBar from './components/SearchBar';
import PlaylistItem from './components/PlaylistItem';
import Track from './components/Track';
import SearchResults from './components/SearchResults';
import PlayListName from './components/PlayListName';


function App() {
//-------------------------------------------------------------
  // Parameters to use Spotify API
//-------------------------------------------------------------    
  const clientId = "389ce1fffa864b00944cecf8ecba15f5";
  const clientSecret = "e3a5f7dd21d4452b82f3dc9c5a69ad93";
  const redirectUri = 'https://charming-centaur-60d721.netlify.app/'; // 
  const scopes = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
//------------------------------------------------
  // Hooks to use
//------------------------------------------------  
  const[search,setSearch] = useState(""); // value of the search
  const[list,setlist] = useState([]); // List of songs that match the search
  const[token,setToken] = useState(""); // token
  const[songList,setSongList] = useState([]); // list of songs added to the playlist
  const[playlistN,setPlaylistN] = useState(""); //Playlist Name

//-------------------------------------------------------------
  // Function log inside spotify 
//-------------------------------------------------------------  
  function login() {
    const authorizationUrl = `https://accounts.spotify.com/authorize` +
      `?client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes)}`;

    window.location.href = authorizationUrl;
  }

//-------------------------------------------------------------
  // Function to search a list of tracks by specific word.
//-------------------------------------------------------------  
  async function getToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const base64Credentials = btoa(`${clientId}:${clientSecret}`);
    const requestData = {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
    };
    
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', requestData);
      const data = await response.json();
      setToken(data.access_token);
    } catch (error) {
      console.error('Error al obtener el Access Token:', error);
    }
  }
  useEffect(() => {
    if (!token) {
      getToken();
    }
  }, [token]);
//-------------------------------------------------------------
  // Function to search a list of tracks by specific word.
//-------------------------------------------------------------  
  async function browser(){
    //search for artist
    let searchParameters = {
      method : 'GET',
      headers : {
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer '+ token
      },
    }

    await fetch('https://api.spotify.com/v1/search?q=' +search +'&type=track' ,searchParameters)
      .then(res => res.json())
      .then(data => {setlist(data.tracks.items)});
  }
//-------------------------------------------------------------
  // Function to create a new Playlist
//-------------------------------------------------------------    
  async function createPlaylist(tracks){
    try {
      // get the user ID
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userData = await userResponse.json();
      const userId = userData.id;
      console.log(userId);
  
      // Create a new playlist
      const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'name': playlistN,
          'description': "Playlist created by the tutorial on developer.spotify.com",
          'public': false
        })
      });
      const createdPlaylistData = await createPlaylistResponse.json();
      const playlistId = createdPlaylistData.id;
  
      // add tracks to the playlist
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${tracks.join(',')}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await addTracksResponse.json();  
    } catch (error) {
      console.error('Error al crear la playlist y agregar pistas:', error);
    }
  }  
  
// Function to handle the Search
  function handleSearch(e){
    if(token == null){
      alert("Please login first")
    }else{
      if(search === "" ){
        alert("Please insert a word to search")
      }
      else{
        e.preventDefault();
        browser();
      }
    }
  }

// Function to handle the addition of song to the playlist 
  function addPlayListItem(e){
    e.preventDefault();
    setSongList((songList) => [...songList,{name : e.target.name, uri: e.target.value}]);
    console.log(songList);
  }

// Function to handle the creation of a new playlist
  function handleAdd(e){
    e.preventDefault();
    if (playlistN === ""){
      alert("Please insert a playlist Name")
    }else{
      if(token === undefined){
        alert("Please login first")
      }else{
        if(songList.length === 0){
          alert("Please add a song to the playlist")
        }else{
          let list = [];
          songList.map(item => list.push(item.uri));
          createPlaylist(list);
          alert('Playlist added successfully');
          setSongList([]);
          setPlaylistN("");  
        }

      }
    }
  }


// Function to handle the deletion of a song from the playlist
  function handleDelete(e){
    e.preventDefault();
    console.log(e.target.value);
    setSongList((songList) =>
    songList.filter((item) => item.name !== e.target.value)
    );
    console.log(songList);
  }

  return (
    <div className="App">
      <h1>Jammming</h1>
      <button onClick={login} className='login'>Login with Spotify </button>
      <div className='container'>
      <div className='searchContainer'>
        <h2>Search a Song !!</h2>
        <SearchBar value = {search} onChange ={e => setSearch(e.target.value)} />
        <SearchResults onClick={handleSearch}/>
        <h2>RESULTS</h2>
        <ul>
        {list.map((track) =>
          <Track key={track.id} track={track.name + ' by ' + track.artists[0].name } name= {track.name + ' by ' + track.artists[0].name } value={track.uri}  onClick={addPlayListItem} />
        )}
      </ul>
      </div>
      <div className='playListContainer'>
        <h2>New Playlist</h2>
        <PlayListName value ={playlistN} onChange= {e => setPlaylistN(e.target.value)} />
        <button onClick={handleAdd}>Save Playlist</button>
        <ul>
        {songList.map(item =>
            <PlaylistItem name = {item.name} value={item.name} onClick = {handleDelete}/>
        )}
        </ul> 
      </div>
      </div>
    </div>
  );
}

export default App;
