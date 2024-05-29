import axios from 'axios';
import {SPOTIFY_AUTH_TOKEN} from "./config.js";

const fetchSpotifyApi = async (endpoint) => {
    try {
        const res = await axios.get(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${SPOTIFY_AUTH_TOKEN}`
            }
        })
        return await res.data
    } catch(err) {
        console.log(err)
        // console.error(`Status: ${err.response.status}`)
        console.log("Something went wrong :(")
    }
}


// Gets the users top tracks
const getTopTrackIds = async () => {
    try {
        const topTracks = await fetchSpotifyApi("v1/me/top/tracks?time_range=long_term&limit=5")
        // let arrOfTopTracks = []
        let arrOfTopTrackID = []
        // let trackNamesIds = {}
        for (let i = 0; i < 5; i++) {

            // let trackName = await topTracks["items"][i]
            let trackId = await topTracks["items"][i]["id"]
            // arrOfTopTracks.push(await trackName);
            arrOfTopTrackID.push(await trackId);
            // trackNamesIds[await trackId] = await trackName
        }
        return await arrOfTopTrackID
    } catch(err) {
        // console.log(err)
        console.log("Something went wrong :(")
    }
}
let arrOfTrackIds = await getTopTrackIds()

console.log(arrOfTrackIds)
/*console.log(await fetchSpotifyApi("v1/audio-features/4OqNp9K5doc0QxqMdjMrYS"))


for (const trackId of arrOfTrackIds) {
    console.log(`v1/audio-features/${trackId}`)

}*/

// Get track's audio features for recommendations
const getTrackAudioFeatures = async (trackId) => {
    const trackFeatures = await fetchSpotifyApi(`v1/audio-features/${trackId}`)
    return await trackFeatures
}

// Storing track features into an array
const storeTrackAudioFeatures = async (arr) => {
    let trackDanceability = []
    let trackEnergy = []
    let trackValence = []
    let trackFeatures = []
    try {
        for (let i = 0; i < 5; i++) {
            trackDanceability.push((await getTrackAudioFeatures(arr[i]))["danceability"])
            trackEnergy.push((await getTrackAudioFeatures(arr[i]))["energy"])
            trackValence.push((await getTrackAudioFeatures(arr[i]))["valence"])
        }
        trackFeatures.push(await trackDanceability, await trackEnergy, await trackValence)
        return await trackFeatures;
    } catch(err){
        // console.log(err.response.status)
        console.log("Something went wrong :(")
    }
}

let danceability, energy, valence = []

await storeTrackAudioFeatures(arrOfTrackIds)
    .then(res => {
        danceability.push(res[0])
        energy.push(res[1])
        valence.push(res[2])
    })
    .catch(() => console.log("The audio features could not be loaded"))


console.log(danceability, energy, valence)
