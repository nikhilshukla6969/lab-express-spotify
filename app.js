require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
// GET http://localhost:3000/home

app.get('/home', (request, response, next) => {
    response.render('search-form');
});

app.get('/artist-search', (request, response, next) => {

    request.query.my_artist // we have access to the URL : e.g. http://localhost:3000/artist-search?my_artist=beatles

    let artistNamePassedByUser = request.query.my_artist

    spotifyApi
        .searchArtists(artistNamePassedByUser)
        .then(data => {
            //response.send(data) // <- this is the trick to check out data from external APIs
            // console.log('The received data from the API: ', data.body.artists.items);
            // console.log('The received data from the API: ', data.body.artists.items[0].images);
            response.render('artist-search-results.hbs', { itemsReceivedFromSpotify: data.body.artists.items });
        })

    
});





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
