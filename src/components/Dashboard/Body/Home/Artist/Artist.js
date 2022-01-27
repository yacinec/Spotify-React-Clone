import React from 'react';
import './Artist.css';

export default function Artist({ name, image }) {
  return (
    <div className='artist'>
      <div className='artist--top'>
        <img src={image} alt='' className='artist--image' />
      </div>
      <div className='artist--bottom'>
        <h3 className='artist--name'>{name}</h3>
      </div>
    </div>
  );
}
