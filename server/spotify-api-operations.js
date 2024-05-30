import axios from 'axios';
import {SPOTIFY_AUTH_TOKEN} from "./config.js";
import {SPOTIFY_CLIENT_ID} from "./config.js";
import {SPOTIFY_CLIENT_SECRET} from "./config.js";


const fetchPostmanMock = async () => {
    try {
        const res = await axios.get("https://71242a6c-2412-43c5-ae45-0cc2b404d9ab.mock.pstmn.io");
        return (await res.data)
    }catch(err){
        console.log(err)
    }
}
fetchPostmanMock()
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
/*const getTopTrackIds = async () => {
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
}*/
// let arrOfTrackIds = await getTopTrackIds()

let arrOfTrackIds = ['4LGg8tvQxix9thK83jjhm1',
    '4OqNp9K5doc0QxqMdjMrYS',
    '4tEAgr78M6nurPLWyx8Msq',
    '7GkZ2cx7i74zu1piQy3i6T',
    '1nH2PkJL1XoUq8oE6tBZoU']
console.log("Array of track IDS", arrOfTrackIds)
// }

// Get track's audio features for recommendations (NOT USED NOW)
const getTrackAudioFeatures = async (trackId) => {
    const trackFeatures = await fetchSpotifyApi(`v1/audio-features/${trackId}`)
    return await trackFeatures
}

// Storing track features into an array (NOW IN MOCK MODE)
const storeTrackAudioFeatures = async (/*arr*/) => {
    let trackDanceability = []
    let trackEnergy = []
    let trackValence = []
    let trackFeatures = []
    let features = []
    try {
        for (let i = 0; i < 5; i++) {
            features.push(await fetchPostmanMock(/*arr[i]*/))
            trackDanceability.push((await features[i].danceability))
            trackEnergy.push((await features[i].energy))
            trackValence.push((await features[i].valence))
        }
        trackFeatures.push(await trackDanceability, await trackEnergy, await trackValence)
        return await trackFeatures;
    }
    catch(err){
        // console.log(err.response.status)
        console.log("Something went wrong :(")
    }
}

let danceability = []
let energy = []
let valence = []

await storeTrackAudioFeatures(arrOfTrackIds)
    .then(res => {
        // console.log(res)
        danceability.push(res[0])
        energy.push(res[1])
        valence.push(res[2])
    })
    .catch(() => console.log("The audio features could not be loaded"))


console.log(danceability, energy, valence)
