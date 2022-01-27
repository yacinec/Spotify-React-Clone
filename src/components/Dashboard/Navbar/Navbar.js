import React from 'react';
import './Navbar.css';

export default function Navbar({ url, name }) {
  return (
    <section className='navbar'>
      <div className='navbar--btn'>
        <img src={url} alt={name} className='navbar--btn--image' />
        <span className='navbar--btn--name'>{name}</span>
      </div>
    </section>
  );
}
