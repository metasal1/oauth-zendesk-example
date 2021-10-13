require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/auth', (req, res) => {
  res.redirect(
    // `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`,
    `https://d3v-k4.zendesk.com/oauth/authorizations/new?response_type=code&client_id=milysec_oauth_app&scope=read%20write&redirect_uri=http://localhost:3000/oauth-callback`,
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {"grant_type": "authorization_code", "code": code,
    "client_id": process.env.CLIENT_ID, "client_secret": process.env.SECRET, 
    "redirect_uri": "http://localhost:3000/oauth-callback", "scope": "read write" };

  const opts = { headers: { accept: 'application/json' } };
  axios
    .post('https://d3v-k4.zendesk.com/oauth/tokens', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      console.log('My token:', token);

      res.redirect(`/?token=${token}`);


    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

app.listen(3000);
// eslint-disable-next-line no-console
console.log('App listening on port 3000');
