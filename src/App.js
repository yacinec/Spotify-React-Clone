import './App.css';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard/Dashboard';
import LeftBar from './components/LeftBar/LeftBar';
import Player from './components/Player/Player';

/*https://accounts.spotify.com/authorize?client_id=75271286754c43d48a609fd214b00ce4&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state*/

function App() {
  const AUTH_URL = 'https://accounts.spotify.com/authorize?';
  const responseType = 'response_type=code';
  const clientId = '75271286754c43d48a609fd214b00ce4';
  const clientSecret = '30371c7c66344730a59fe64a810c5026';
  const redirectUri = 'redirect_uri=http://localhost:3000';
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'playlist-read-private',
    'user-library-read',
    'streaming',
  ];

  const scopesUrl = 'scope=' + scopes.join('%20');

  const [code, setCode] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresIn, setExpiresIn] = useState('');

  const [currentUser, setCurrentUser] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [tracksFlow, setTracksFlow] = useState([]);
  const [page, setPage] = useState('home');

  const current_url = new URLSearchParams(window.location.search);

  const getAuthURL = () => {
    return (
      AUTH_URL +
      '&' +
      responseType +
      '&' +
      'client_id=' +
      clientId +
      '&' +
      redirectUri +
      '&' +
      scopesUrl
    );
  };

  const getCode = () => {
    window.location.href = getAuthURL();
  };

  const getAccessToken = () => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/login',
      data: {
        code: code,
        redirect_uri: 'http://localhost:3000',
        grant_type: 'authorization_code',
        client_secret: clientSecret,
        client_id: clientId,
      },
    })
      .then((res) => {
        //console.log(res);
        setAccessToken(res.data.access_token);
        setExpiresIn(res.data.expires_in);
        setRefreshToken(res.data.refresh_token);
      })
      .catch((err) => {
        const error = err.response.data;
        if (
          error === 'Invalid authorization code' ||
          'Authorization code expired'
        ) {
          getCode();
        } else {
          getRefreshToken();
        }
      });
  };

  const getRefreshToken = () => {
    if (refreshToken !== '') {
      axios({
        method: 'post',
        url: 'http://localhost:3001/refresh',
        data: {
          code: code,
          redirect_uri: 'http://localhost:3000',
          grant_type: 'refresh_token',
          client_secret: clientSecret,
          client_id: clientId,
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      })
        .then((res) => {
          setAccessToken(res.data.access_token);
          setExpiresIn(res.data.expires_in);
        })
        .catch((err) => {
          getAccessToken();
        });
    }
  };

  const logout = () => {
    const url = 'https://www.spotify.com/logout/';
    const spotifyLogoutWindow = window.open(
      url,
      'Spotify Logout',
      'width=700,height=500,top=40,left=40'
    );
    setTimeout(() => spotifyLogoutWindow.close(), 2000);
  };

  const getProfil = () => {
    const url = 'https://api.spotify.com/v1/me';
    axios({
      method: 'get',
      url: url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then((res) => {
        setCurrentUser({ url: res.data.href });
      })
      .catch((err) => {
        const error = err.response.data;

        if (error === 'Invalid authorization code') {
          getCode();
        } else {
          getRefreshToken();
          getProfil();
        }
      });
  };

  const getTopArtist = () => {
    const url = 'https://api.spotify.com/v1/me/top/artists';
    if (accessToken !== '') {
      axios({
        method: 'get',
        url: url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
        .then((res) => {
          setTopArtists(res.data.items);
        })
        .catch((err) => {
          const error = err.response.data;

          if (error === 'Invalid authorization code') {
            getCode();
          } else if (error === 'ffezrf') {
            getRefreshToken();
            getProfil();
          }
        });
    }
  };

  const getPlaylists = () => {
    const url = 'https://api.spotify.com/v1/me/playlists';
    if (accessToken !== '') {
      axios({
        method: 'get',
        url: url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
        .then((res) => {
          setPlaylists(res.data.items);
        })
        .catch((err) => {
          const error = err.response.data;

          if (error === 'Invalid authorization code') {
            getCode();
          } else if (error === 'ffezrf') {
            getRefreshToken();
            getProfil();
          }
        });
    }
  };

  const getSinglePlaylist = (id) => {
    const url = 'https://api.spotify.com/v1/playlists/' + id + '/tracks';
    if (accessToken !== '') {
      axios({
        method: 'get',
        url: url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
        .then((res) => {
          //console.log(res.data.items[0].track.uri);
          let newArray = [];
          res.data.items.map((track) => {
            newArray.push({
              title: track.track.name,
              artist: track.track.artists[0].name,
              uri: track.track.uri,
              image: track.track.album.images[0].url,
            });
          });
          setTracks(newArray);
          //setTracksFlow(newArray);
          //setUris([...uris, res.data.items[0].track.uri]);
          setPage('playlist');
        })
        .catch((err) => {
          //console.log(err);
          const error = err.response.data;
          if (error === 'Invalid authorization code') {
            getCode();
          } else if (error === 'ffezrf') {
            getRefreshToken();
            getProfil();
          }
        });
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeSong = (newSong) => {
    setTracksFlow([newSong]);
  };

  const handleLikedSongs = () => {
    const url = 'https://api.spotify.com/v1/me/tracks';
    if (accessToken !== '') {
      axios({
        method: 'get',
        url: url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
        .then((res) => {
          //console.log(res.data.items[0].track.uri);
          let newArray = [];
          res.data.items.map((track) => {
            newArray.push({
              title: track.track.name,
              artist: track.track.artists[0].name,
              uri: track.track.uri,
              image: track.track.album.images[0].url,
            });
          });
          setTracks(newArray);
          //setTracksFlow(newArray);
          //setUris([...uris, res.data.items[0].track.uri]);
          setPage('playlist');
        })
        .catch((err) => {
          //console.log(err);
          const error = err.response.data;
          if (error === 'Invalid authorization code') {
            getCode();
          } else if (error === 'ffezrf') {
            getRefreshToken();
            getProfil();
          }
        });
    }
  };

  useEffect(() => {
    if (
      currentUser !== null &&
      currentUser.url !== undefined &&
      currentUser.name === undefined
    ) {
      axios({
        method: 'get',
        url: currentUser.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
        .then((res) => {
          setCurrentUser({
            url: currentUser.url,
            name: res.data.display_name,
            image: res.data.images[0].url,
          });
        })
        .catch((err) => {});
    }
  }, [currentUser]);

  useEffect(() => {
    if (current_url.has('code')) {
      setCode(current_url.get('code'));
    } else {
      getCode();
    }
  }, []);

  useEffect(() => {
    if (code !== '') {
      getAccessToken();
    }
  }, [code]);

  useEffect(() => {
    if (accessToken !== '') {
      getProfil();
      getTopArtist();
      getPlaylists();
    }
  }, [accessToken]);

  return (
    <main className='container'>
      <section className='top'>
        <LeftBar
          playlists={playlists}
          getSinglePlaylist={getSinglePlaylist}
          handleChangePage={handleChangePage}
          handleLikedSongs={handleLikedSongs}
        />
        <Dashboard
          currentUser={currentUser}
          topArtists={topArtists}
          page={page}
          tracks={tracks}
          handleChangeSong={handleChangeSong}
        />
      </section>
      <section className='bottom'>
        <Player accessToken={accessToken} tracks={tracksFlow} />
      </section>

      {code !== '' ? (
        <>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <></>
        /*<button onClick={getCode}>Connexion</button>*/
      )}

      {/*currentUser !== null && (
        <>
          <img src={currentUser.image} alt='' />
          <h2>{currentUser.name}</h2>
        </>
      )*/}
    </main>
  );
}

export default App;
