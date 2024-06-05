import axios from 'axios';
import {SPOTIFY_AUTH_TOKEN} from "./config.js";
import {SPOTIFY_CLIENT_ID} from "./config.js";
import {SPOTIFY_CLIENT_SECRET} from "./config.js";
import express from "express";
import cors from "cors";
import {getWeatherConditions} from "./Components/weather-mood-info.js";
import * as querystring from "node:querystring";
import session from 'express-session'

const PORT = process.env.PORT || 5001;
const app = express();
const currentDate = new Date()

app.use(express.static('public'));

app.use(cors());
app.use(express.urlencoded({extended: false}));


// GET User auth token
const client_id = "a4fcad31b33a473990e70cb0594be641"
const client_secret = "1d9ff66edb394d6982c1ac9bec0339d8"
const redirect_uri = 'http://localhost:5001/callback'




app.get('/login', (req, res)=>{
    const authUrl = 'https://accounts.spotify.com/authorize'
    const scope = 'user-read-email playlist-modify-private'



    res.redirect(`${authUrl}?${querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
    })}`)
    console.log(req.body)


})

// app.get('/callback', (req, res) => {
//     const authCode = req.query.code
//
//     const authOptions = {
//         url: 'https://accounts.spotify.com/api/token',
//         method: 'POST',
//         form: {
//             code: authCode,
//             redirect_uri: redirect_uri,
//             grant_type: 'authorization_code',
//         },
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             Authorization: `Basic ${new Buffer.from(client_id + ':' + client_secret).toString('base64')}`,
//         },
//         json: true
//     }
// })



// Get from spotify API
const fetchSpotifyApi = async (endpoint) => {
    try {
        const res = await axios.get(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${SPOTIFY_AUTH_TOKEN}`
            }
        })
        return await res.data
    } catch (err) {
        console.log(err)
        // console.error(`Status: ${err.response.status}`)
        console.log("Something went wrong :(")
    }
}


// API POST new playlist (user authentication)
app.post('/login', (req, res) => {

})


// API GET (track recommendations)
// app.get('/track-recommendations', async (req, res) => {

// #######################################################

// })


const getTopTrackIds = async () => {
    try {
        const topTracks = await fetchSpotifyApi("v1/me/top/tracks?time_range=long_term&limit=5")
        let arrOfTopTrackID = []
        for (let i = 0; i < 5; i++) {

            let trackId = await topTracks["items"][i]["id"]
            arrOfTopTrackID.push(await trackId);

        }
        return arrOfTopTrackID
    } catch (err) {
        console.log(err)
        console.log("Something went wrong :(")
    }
}


// Getting recommended songs from spotify based on parameters

const getRecommendedTracks = async (seedTracks, danceability, energy, valence, limit = 10) => {
    try {

        const res = fetchSpotifyApi(`v1/recommendations?seed_tracks=${seedTracks.map((trackId, index) => {
            return (index !== seedTracks.length - 1 ? `${trackId}%2C` : trackId)
        })}&target_danceability=${danceability}&target_energy=${energy}&target_valence=${valence}`.replaceAll(',',''), {
            header: {
                Authorization: `Bearer ${SPOTIFY_AUTH_TOKEN}`
            }
        })
        let recommendedTracks = []
        for (let i = 0; i < limit; i++) {
            recommendedTracks.push({name: (await res).tracks[i].name},
                {artist: (await res).tracks[i].album.artists[0].name},
                {image: (await res).tracks[i].album.images[1].url},
                {link: (await res).tracks[i].external_urls},
                )
        }

        return recommendedTracks

    } catch (err) {
        console.log(err)
    }
}

const createPlaylist = async (userId) => {
    try {
        const request = await axios.post(`https://api.spotify.com/users/${userId}/playlists`, {
            header: {
                Authorization: `Bearer AQBT17rYBwkauIXSA1xnGj0sgGYsYiXZIp4AxoESPiYQIYZEn-tgKHjQvzYknKLOcybWP4w0GGTNymuueo2Koh-caabQBR1bqW9TW-SW-uPCK1mnQhsUoM1f-95v4O-fFh3l6MjGKmXi2fLB2XqLhOJuRsr29bw0f_lNE_cPTItrncOeG6c9DwUYrRowozmEmE0l8F2fOTPyiPucOC2XkFd88g`,
                "Content-Type": "application/json",
            }, data: {
                "name": `TuneWeatherApp Playlist ${currentDate.toDateString()}`,
                "description": "A Playlist by the TuneWeather App",
                "public": false
            }
        })
        console.log(JSON.stringify(await request))
    } catch (err) {
        console.log(err.response)
    }
}

// TODO: to be put in app.get for fetching recommendations
const arrOfTrackIds = await getTopTrackIds()
console.log(arrOfTrackIds)
const trackFeatures = await getWeatherConditions()
const db = trackFeatures['audio-features'].danceability
const eg = trackFeatures['audio-features'].energy
const vl = trackFeatures['audio-features'].valence
let recommendedTracks = await getRecommendedTracks(arrOfTrackIds, db, eg, vl)
console.log(recommendedTracks)

await createPlaylist('wokeboydidit')


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)

})


//