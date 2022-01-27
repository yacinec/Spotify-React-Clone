import React, { useState, useEffect } from 'react';
import './Home.css';

import Artist from './Artist/Artist';

export default function Home(props) {
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    if (props.topArtists !== undefined) {
      setTopArtists(props.topArtists);
    }
  }, [props]);

  return (
    <section className='home'>
      <div className='artists'>
        {topArtists.map((artist) => {
          return (
            <Artist
              key={artist.id}
              image={artist.images[0].url}
              name={artist.name}
            />
          );
        })}
      </div>
    </section>
  );
}
