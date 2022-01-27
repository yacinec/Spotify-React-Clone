const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
var querystring = require('querystring');

app.use(cors());
app.use(bodyParser.json());
app.listen(3001);

/**
 * GET THE ACCESS TOKEN
 */
app.post('/login', (req, res) => {
  const code = req.body.code;
  const clientSecret = req.body.client_secret;
  const clientId = req.body.client_id;
  const redirectUri = req.body.redirect_uri;
  const grantType = req.body.grant_type;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: grantType,
      code: code,
      redirect_uri: redirectUri,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    /*data: {
      code: code,
      redirect_uri: 'http://localhost:3000',
      grant_type: 'authorization_code',
      client_secret: clientSecret,
      client_id: clientId,
    },*/
  })
    .then((data) => {
      //res.json(data.body);
      //console.log(data);
      res.json({
        access_token: data.data.access_token,
        expires_in: data.data.expires_in,
        refresh_token: data.data.refresh_token,
      });
    })
    .catch((err) => {
      res.status(400);
      res.send(err.response.data.error_description);
    });
});

/**
 * GET THE REFRESH TOKEN
 */
app.post('/refresh', (req, res) => {
  const code = req.body.code;
  const clientSecret = req.body.client_secret;
  const clientId = req.body.client_id;
  const redirectUri = req.body.redirect_uri;
  const grantType = req.body.grant_type;
  const refreshToken = req.body.refresh_token;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: grantType,
      code: code,
      redirect_uri: redirectUri,
      refresh_token: refreshToken,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
  })
    .then((data) => {
      res.json({
        access_token: data.data.access_token,
        expires_in: data.data.expires_in,
      });
    })
    .catch((err) => {
      res.status(400);
      res.send(err.response.data.error_description);
    });
});
