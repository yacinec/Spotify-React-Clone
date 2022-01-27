import React, { useState, useEffect } from 'react';
import './Playlist.css';

import Music from '../Music/Music';

export default function Playlist(props) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (props.tracks) {
      setTracks(props.tracks);
    }
  }, [props]);

  return (
    <section className='playlist'>
      <h2 className='playlist--title'>Playlist</h2>
      {tracks.map((track, index) => {
        return (
          <Music
            handleChangeSong={props.handleChangeSong}
            key={index}
            uri={track.uri}
            title={track.title}
            artist={track.artist}
            image={track.image}
          />
        );
      })}
    </section>
  );
}
