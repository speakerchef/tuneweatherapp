import axios from 'axios';
import {SPOTIFY_AUTH_TOKEN} from "./config.js";
import {SPOTIFY_CLIENT_ID} from "./config.js";
import {SPOTIFY_CLIENT_SECRET} from "./config.js";
import express from "express";
import cors from "cors";
import {getWeatherConditions} from "./Components/weather-mood-info.js";

const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));

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
    const createPlaylist = async(userId) => {
        await axios.post(`https://api.spotify.com/users/${userId}/playlists`, {
            header:{
                Authorization: `Bearer ${SPOTIFY_AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: {
                "name": `TuneWeatherApp Playlist ${Date.}`
            }
        })
    }
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
        })}&target_danceability=${danceability}&target_energy=${energy}&target_valence=${valence}\`.replaceAll(',','')`, {
            header: {
                Authorization: `Bearer ${SPOTIFY_AUTH_TOKEN}`
            }
        })
        let recommendedTracks = []
        for (let i = 0; i < limit; i++) {
            recommendedTracks.push({name: (await res).tracks[i].name}, {artist: (await res).tracks[i].album.artists[0].name}, {image: (await res).tracks[i].album.images[1].url}, {link: (await res).tracks[i].external_urls},)
        }

        return recommendedTracks

    } catch (err) {
        console.log(err)
    }


}


const arrOfTrackIds = await getTopTrackIds()
console.log(arrOfTrackIds)
const trackFeatures = await getWeatherConditions()
const db = trackFeatures['audio-features'].danceability
const eg = trackFeatures['audio-features'].energy
const vl = trackFeatures['audio-features'].valence
let recommendedTracks = await getRecommendedTracks(arrOfTrackIds, db, eg, vl)
console.log(recommendedTracks)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)

})


//