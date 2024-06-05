import axios from 'axios';
import express from "express";
import cors from "cors";
import {getWeatherConditions} from "./Components/weather-mood-info.js";
import * as querystring from "node:querystring";
import {client_id, client_secret} from "./config.js";

const PORT = process.env.PORT || 5001;
const app = express();
const currentDate = new Date()
let SPOTIFY_AUTH_TOKEN;

app.use(cors());
app.use(express.urlencoded({extended: false}));

// GET User auth token

const redirect_uri = 'http://localhost:5001/callback'



app.get('/login', (req, res) => {
    const scope = 'user-read-private ugc-image-upload playlist-read-private user-read-email playlist-modify-private playlist-modify-public user-top-read user-library-modify user-library-read';
    const authUrl = 'https://accounts.spotify.com/authorize';

    res.redirect(`${authUrl}?${querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
    })}`);
});


app.get('/callback', async (req, res) => {
    const authCode = req.query.code;


    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const authOptions = {
        method: 'post',
        url: tokenUrl,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(client_id + ':' + client_secret).toString('base64').replace('=','')}`,
        },
        data:{
            code: authCode,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code',
        },
    };

    try {
        const response = await axios(authOptions);
        const body = response.data;
        const access_token = response.data.access_token.toString()


        console.log('Access token:', access_token, body);
        SPOTIFY_AUTH_TOKEN = access_token;
        res.redirect('/home')
    } catch (error) {
        console.error('Error fetching access token', error.response ? error.response.data : error.message);
    }
});

app.get('/home',  (req, res) => {
    res.send("at home")
    runOperations()
})


// GET spotify API
const fetchSpotifyApi = async (endpoint) => {
    try {
        const response = await axios.get(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${await SPOTIFY_AUTH_TOKEN}`
            }
        })
        return await response.data
    } catch (err) {
        console.log(err.response.status)
        console.log('THIS IS THE ACCESS TOKEN AT FETCHSPOTIFYAPI', SPOTIFY_AUTH_TOKEN)
        // console.error(`Status: ${err.response.status}`)
        console.log("spotify API could not be reached")
    }
}

const getUserProfile = async () => {
    const res = await axios.get
}


// Getting user's top tracks
const getTopTrackIds = async (userId) => {
    try {
        const topTracks = await fetchSpotifyApi(`v1/me/top/tracks?limit=5`)
        let arrOfTopTrackID = []
        for (let i = 0; i < 5; i++) {

            let trackId = await topTracks["items"][i]["id"]
            arrOfTopTrackID.push(await trackId);

        }
        return arrOfTopTrackID
    } catch (err) {
        console.log(err.response)

        console.log("Top tracks could not be fetched")
    }
}

const getRecommendedTracks = async (seedTracks, danceability, energy, valence, limit = 10) => {
    try {

        const response = fetchSpotifyApi(`v1/recommendations?seed_tracks=${seedTracks.map((trackId, index) => {
            return (index !== seedTracks.length - 1 ? `${trackId}%2C` : trackId)
        })}&target_danceability=${danceability}&target_energy=${energy}&target_valence=${valence}`.replaceAll(',',''), {
            header: {
                Authorization: `Bearer ${await SPOTIFY_AUTH_TOKEN}`
            }
        })
        let recommendedTracks = []
        for (let i = 0; i < limit; i++) {
            recommendedTracks.push({name: (await response).tracks[i].name},
                {artist: (await response).tracks[i].album.artists[0].name},
                {image: (await response).tracks[i].album.images[1].url},
                {link: (await response).tracks[i].external_urls},
                {uri: (await response).tracks[i].uri},
            )
        }

        return recommendedTracks

    } catch (err) {
        console.log(err.response)
        console.log("Recommened tracks could not be fetched")
    }
}

const getCurrentUserInfo = async () => {

    const res = await fetchSpotifyApi(`v1/me`);
    return {
        'name': await res.display_name,
        'email': await res.email,
        'userId': await res.id,
        'userProfileImage': await res.images.url
    }
}

const createPlaylist = async (tracks) => {
    let trackUris = ''
    const makePlaylist = async () => {
        const userName = (await getCurrentUserInfo()).name
        trackUris = tracks.map(track => typeof track.uri !== 'undefined' ? track.uri.replaceAll(':','%3A'):'').join(',').replaceAll(',,,,','')
        console.log(trackUris)
        console.log(userName)
        const targetUrl = 'https://api.spotify.com/v1/me/playlists'
        const payload = {
            url: targetUrl,
            headers: {
                Authorization: `Bearer ${await SPOTIFY_AUTH_TOKEN}`,
                "Content-Type": "application/json",

            }, data: {
                name: `Playlist for ${userName} by TuneWeather`,
                description: "A Playlist by the TuneWeather App",
                public: false
            },
            method:'post'
        }



        try {
            const request = await axios(payload)
            return request.data.id
        } catch (err) {
            console.log(err)
            console.log("Playlist could not be created")
        }
    }
    const pid = await makePlaylist(tracks);
    console.log("playlist id", pid)
    console.log(trackUris)
    const trackPayload = {
        header: {
            Authorization: `Bearer ${await SPOTIFY_AUTH_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: {
            uris: trackUris
        }

    }
    try {
        await axios.post(`https://api.spotify.com/v1/playlists/${pid}/tracks`, trackPayload)
    }catch (e) {
        console.log(e.data)
    }
}



const runOperations = async() => {
    const arrOfTrackIds = await getTopTrackIds('p0aoh7sazk08iu9vdsc92tstd')
    console.log(arrOfTrackIds)
    const trackFeatures = await getWeatherConditions()
    const db = await trackFeatures['audio-features'].danceability
    const eg = await trackFeatures['audio-features'].energy
    const vl = await trackFeatures['audio-features'].valence
    let recommendedTracks = await getRecommendedTracks(arrOfTrackIds, db, eg, vl)
    console.log(await recommendedTracks)

    const pid = await createPlaylist(recommendedTracks)



    console.log("THIS IS THE ACCESS TOKEN AT THE END OF THE PROGRAM", SPOTIFY_AUTH_TOKEN)
}





// Get from spotify API



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)

})


//