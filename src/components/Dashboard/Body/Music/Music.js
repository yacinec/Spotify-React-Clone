import React from 'react';
import './Music.css';

export default function Music({ handleChangeSong, uri, title, artist, image }) {
  return (
    <div
      className='music'
      onClick={() =>
        handleChangeSong({
          title: title,
          artist: artist,
          image: image,
          uri: uri,
        })
      }
    >
      <div className='music--image'>
        <img src={image} alt='' />
      </div>
      <div className='music--info'>
        <h3>{title}</h3>
        <p>{artist}</p>
      </div>
    </div>
  );
}
