import React, { useEffect, useState } from 'react';
import './Player.css';
import SpotifyWebPlayer from 'react-spotify-web-playback';

export default function Player(props) {
  //const [player, setPlayer] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [tracks, setTracks] = useState([]);
  const [uris, setUris] = useState([]);

  useEffect(() => {
    if (props.accessToken !== '') {
      setAccessToken(props.accessToken);
    }

    setTracks(props.tracks);
  }, [props]);

  useEffect(() => {
    if (tracks.length > 0) {
      let newArray = [];
      tracks.map((track) => {
        newArray.push(track.uri);
      });
      setUris(newArray);
    }
  }, [tracks]);

  return (
    <section className='player'>
      {accessToken && (
        <SpotifyWebPlayer
          play={uris.length > 0}
          token={accessToken}
          autoPlay={true}
          persistDeviceSelection
          showSaveIcon
          syncExternalDevice
          uris={uris}
          styles={{
            activeColor: '#58B760',
            bgColor: '#181818',
            color: '#fff',
            loaderColor: '#fff',
            sliderColor: '#B0B0AE',
            sliderTrackColor: '#515151',
            trackArtistColor: '#B4B3B3',
            trackNameColor: '#fff',
            sliderHandleColor: '#fff',
            height: '100%',
          }}
        />
      )}
    </section>
  );
}
