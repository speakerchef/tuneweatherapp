import axios from 'axios';
import {SPOTIFY_AUTH_TOKEN} from "./config.js";
import {SPOTIFY_CLIENT_ID} from "./config.js";
import {SPOTIFY_CLIENT_SECRET} from "./config.js";
import express from "express";
import cors from "cors";
const PORT = process.env.PORT || 5001;
const app = express();
export const USER_LOCATION = "Edmonton";

// app.use(express.static("build"));
app.use(cors());



// Home page


// Gets results from spotify API
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


// Gets the users top tracks
app.get('/get-tracks', async (req, res) => {
    const getTopTrackIds = async () => {
        try {
            const topTracks = await fetchSpotifyApi("v1/me/top/tracks?time_range=long_term&limit=5")
            let arrOfTopTrackID = []
            let names = []
            for (let i = 0; i < 5; i++) {

                let trackId = await topTracks["items"][i]["id"]
                let trackName = await topTracks["items"][i]["name"]
                arrOfTopTrackID.push(await trackId);
                names.push(await trackName);

            }
            return names
        } catch(err) {
            console.log(err)
            console.log("Something went wrong :(")
        }
    }

    res.send({"tracks":await getTopTrackIds()})
})


// let arrOfTrackIds = await getTopTrackIds()


// console.log("Array of track IDS", arrOfTrackIds)

// Get track's audio features for recommendations (NOT USED NOW)
const getTrackAudioFeatures = async (trackId) => {
    const trackFeatures = await fetchSpotifyApi(`v1/audio-features/${trackId}`)
    return await trackFeatures
}

// Storing track features into an array (NOW IN MOCK MODE)
const storeTrackAudioFeatures = async (arr) => {
    let trackDanceability = []
    let trackEnergy = []
    let trackValence = []
    let trackFeatures = []
    let features = []
    try {
        for (let i = 0; i < 5; i++) {
            features.push(await getTrackAudioFeatures(arr[i]))
            trackDanceability.push((await features[i].danceability))
            trackEnergy.push((await features[i].energy))
            trackValence.push((await features[i].valence))
        }
        trackFeatures.push(trackDanceability, trackEnergy, trackValence)
        return trackFeatures;
    } catch (err) {
        // console.log(err.response.status)
        console.log("Track audio features could not be stored :(", err.response.status)
    }
}

let danceability = []
let energy = []
let valence = []

// await storeTrackAudioFeatures(arrOfTrackIds)
//     .then(res => {
//         console.log(res)
//         danceability.push(res[0])
//         energy.push(res[1])
//         valence.push(res[2])
//     })
//     .catch(() => console.log("The audio features could not be loaded"))


// console.log(danceability, energy, valence)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

