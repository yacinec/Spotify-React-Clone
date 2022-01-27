import React, { useState, useEffect } from 'react';
import './MusicSearch.css';

import Music from '../Music/Music';

export default function MusicSearch({
  handleSearchingSong,
  handleChangeSong,
  search,
}) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(search);
  }, [search]);
  return (
    <section className='searching'>
      <input
        className='searching--input'
        type='text'
        placeholder='Search a song'
        onChange={(e) => {
          handleSearchingSong(e.target.value);
        }}
      />
      <div className='searching--results'>
        {results.map((track, index) => {
          return (
            <Music
              key={index}
              handleChangeSong={handleChangeSong}
              uri={track.uri}
              title={track.title}
              artist={track.artist}
              image={track.image}
            />
          );
        })}
      </div>
    </section>
  );
}
