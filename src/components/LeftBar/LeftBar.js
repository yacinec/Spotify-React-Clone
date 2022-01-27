import React, { useState, useEffect } from 'react';
import './LeftBar.css';

export default function LeftBar(props) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (props.playlists !== undefined) {
      setPlaylists(props.playlists);
    }
  }, [props]);

  return (
    <div className='leftbar'>
      <h2 className='leftbar--title'>Spotify</h2>
      <section className='navigation'>
        <a
          href='#'
          className='navigation--link'
          onClick={() => props.handleChangePage('home')}
        >
          <i className='fas fa-home'></i> Home
        </a>
        <a
          href='#'
          className='navigation--link'
          onClick={() => props.handleChangePage('search')}
        >
          <i className='fas fa-search'></i> Search
        </a>
        {/*<a
          href='#'
          className='navigation--link'
          onClick={() => props.handleChangePage('library')}
        >
          <i className='fas fa-bookmark'></i> Library
        </a>*/}
      </section>
      <section className='playlists'>
        <div className='playlists--actions'>
          {/*<a href='#' className='playlists--actions--link'>
            <i className='fas fa-plus-circle'></i> New playlist
      </a>*/}
          <a
            href='#'
            className='playlists--actions--link'
            onClick={props.handleLikedSongs}
          >
            <i className='fas fa-heart'></i> Liked Tracks
          </a>
        </div>
        <div className='playlist--tracks'>
          {playlists.map((playlist) => {
            return (
              <a
                href='#'
                key={playlist.id}
                onClick={() => {
                  props.getSinglePlaylist(playlist.id);
                }}
                className='playlist--tracks--link'
              >
                {playlist.name}
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
