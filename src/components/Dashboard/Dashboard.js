import React, { useState, useEffect } from 'react';
import './Dashboard.css';

import Navbar from './Navbar/Navbar';
import Home from './Body/Home/Home';
import Playlist from './Body/Playlist/Playlist';
import MusicSearch from './Body/MusicSearch/MusicSearch';

export default function Dashboard(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [page, setPage] = useState('home');
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    setCurrentUser(props.currentUser);
    setTopArtists(props.topArtists);
    setPage(props.page);
    setTracks(props.tracks);
  }, [props]);

  return (
    <section className='dashboard'>
      {currentUser !== null && (
        <Navbar url={currentUser.image} name={currentUser.name} />
      )}
      {topArtists !== null && page === 'home' && (
        <Home topArtists={topArtists} />
      )}
      {page === 'search' && (
        <MusicSearch
          handleSearchingSong={props.handleSearchingSong}
          handleChangeSong={props.handleChangeSong}
          search={props.search}
        />
      )}

      {page === 'playlist' && (
        <Playlist tracks={tracks} handleChangeSong={props.handleChangeSong} />
      )}
    </section>
  );
}
