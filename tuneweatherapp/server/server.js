"use strict";

import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as querystring from "node:querystring";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import OpenAI from "openai";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const env = dotenv.config();

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const WEATHERAPI_TOKEN = process.env.WEATHERAPI_TOKEN;
const session_secret = process.env.session_secret;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const server_url = process.env.server_url;
const client_url = process.env.client_url;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const PORT = process.env.PORT || 5001;
const app = express();
const mongoURI =
    "mongodb+srv://tuneweather:YQMsoAyqdsIhbQ0U@tuneweather.tozzrsv.mongodb.net/?retryWrites=true&w=majority&appName=tuneweather";
let userLocation;
let lat;
let lon;
let currentUserSession;

mongoose.connect(mongoURI, {}).then((res) => {
    console.log("MongoDB connected");
});

const UserSchema = new mongoose.Schema({
    access_token: String,
    refresh_token: String,
    expires_in: Number,
    date_issued: Number,
    latitude: String,
    longitude: String,
    isLoggedIn: Boolean,
    needsRefresh: Boolean,
});
const UserModel = mongoose.model("Users", UserSchema);
app.use(cookieParser());
app.use(
    session({
        secret: session_secret,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: mongoURI,
        }),
        cookie: {
            sameSite: "none",
            secure: true,
            httpOnly: true,
        },
    }),
);
app.use(
    cors({
        origin: [
            `https://tuneweather.com`,
            `https://www.tuneweather.com`,
            `https://api.tuneweather.com`,
        ],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Set-Cookie"],
    })
);
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    rateLimit({
        windowMs: 60 * 1000,
        max: 10,
        handler: (req, res) => {
            res.status(429).json({
                error: {
                    status: 429,
                    message: "Rate limit exceeded",
                },
            });
        },
    }),
);

app.use((req, res, next) => {
    console.log("Session data :", req.sessionID);
    next();
});

app.set("trust proxy", 1);

//TESTING POINT

const validateUser = async (req, res, next) => {
    const requestId = req.sessionID;
    console.log("REQUEST COOKIE ID: ", requestId);
    if (!requestId) {
        res.status(403).json({
            error: {
                message: "No session id provided",
            },
        });
    } else {
        console.log("Request made from ID:", requestId);
        const user = await UserModel.collection.findOne({ _id: requestId });
        if (!user) {
            console.log("User does not exist");
            res.status(403).json({
                error: {
                    session: req.sessionID || "hello",
                    message: "User not found for the given session",
                },
            });
        } else {
            if (!user.isLoggedIn || user.needsRefresh) {
                console.error("user access has expired");
                res.status(403).json({
                    error: {
                        message: "Your access has expired, please login",
                    },
                });
            } else {
                console.log("User has passed validation check");
                next();
            }
        }
    }
};

// Check if token is expired
const checkTokenExpired = async (req, res, next) => {
    console.log("User at token expiry check: ", req.sessionID);
    const currentUser = await UserModel.collection.findOne({
        _id: req.session.id,
    });
    if (currentUser) {
        let dateDiff = Date.now() - currentUser.date_issued;
        console.log("Date difference:", dateDiff);
        if (dateDiff >= currentUser.date_issued) {
            await UserModel.collection.updateOne(
                { _id: req.sessionID },
                {
                    $set: {
                        needsRefresh: true,
                        isLoggedIn: false,
                    },
                },
            );
            console.error("Token expired, redirecting to login.");
            res.json({
                error: {
                    status: 401,
                    message: "Your token has expired, please login again",
                    redirect_url: "http://localhost:5001/login",
                },
            });
        } else {
            next();
        }
    } else {
        console.error("Issue at token expiry");
        res.status(401).json({
            error: {
                status: 401,
                message: "Unauthorized, please login",
            },
        });
        // res.redirect(`${server_url}/login`);
    }
};

app.delete('/logout', async (req, res) => {
    const currUser = await UserModel.collection.findOne({ _id: req.sessionID });
    if (currUser) {
        await UserModel.collection.deleteOne({_id: req.sessionID});
    }
    req.session.destroy();
    res.status(200).json({message: "User deleted"});

})

const redirect_uri = `${server_url}/callback`;
app.post("/login", async (req, res) => {
    console.log("saved user session", req.sessionID);
    const currUser = await UserModel.collection.findOne({
        _id: req.sessionID,
    });
    if (!currUser) {
        await UserModel.collection.insertOne({ _id: req.sessionID });
    } else {
        console.log("CURRENT USER REFRESH STATUS", currUser.needsRefresh);
        if (!currUser.needsRefresh && currUser.isLoggedIn) {
            console.log("user is authorized (cookie)");
            res.status(200).json({
                data: {
                    status: 200,
                    message: "User is logged in",
                },
            });
            return;
        }
    }

    console.log("User is not authorized");

    const scope =
        "user-read-private playlist-read-private playlist-modify-private user-top-read";
    const authUrl = "https://accounts.spotify.com/authorize";
    const params = new URLSearchParams({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
    });
    const redirectLink = `${authUrl}?${params}`;
    console.log(redirectLink);
    res.status(200).json({ redirectLink: redirectLink });
});

app.get("/callback", async (req, res) => {
    console.log(`session id at oath flow ${JSON.stringify(req.cookies)}`);
    const authCode = req.query.code;
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const basicToken = new Buffer.from(client_id + ":" + client_secret)
        .toString("base64")
        .replace("=", "")
    const authOptions = {
        method: "post",
        url: tokenUrl,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${basicToken}`,
        },
        data: {
            code: authCode,
            redirect_uri: redirect_uri,
            grant_type: "authorization_code",
        },
    };

    try {
        const response = await axios(authOptions);
        const body = response.data;
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;
        const expires_in = body.expires_in * 1000;
        console.log("Access token:", access_token);
        console.table(body);
        const existingUser = await UserModel.collection.findOne({
            _id: req.sessionID,
        });
        await UserModel.collection.updateOne(
            {
                _id: req.sessionID,
            },
            {
                $set: {
                    access_token: access_token,
                    refresh_token: refresh_token,
                    expires_in: expires_in,
                    date_issued: Date.now(),
                    isLoggedIn: true,
                    needsRefresh: false,
                },
            },
        );
    } catch (error) {
        console.error(error.response ? error.response.status : error);
        res.status(500).json({ message: "Internal server error" });
    }
    res.redirect(`${client_url}/playlist`);
});

app.get("/playlist", async (req, res) => {
    await UserModel.collection.insertOne({ _id: req.session.id }).then(() => {
        req.session.isAuth = false;
        console.log("session id at playlist", req.session.id);
        res.send({
            data: {
                code: 201,
                session_id: req.session.id,
            },
        });
    });
});

app.post("/location", async (req, res) => {
    console.log("Query at location enpoint", req.query);
    const currentUser = await UserModel.collection.findOne({
        _id: req.sessionID,
    });
    lat = req.query.latitude;
    lon = req.query.longitude;
    console.log(lat, lon);
    if (!lat || !lon) {
        res.status(418).json("Error: Coordinates not provided");
    } else {
        console.log("User coords: " + lat, lon);
        const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`,
        );
        const userLocation = (await response.json()).locality;
        console.log(userLocation);

        if (currentUser) {
            if (currentUser.latitude && currentUser.longitude) {
                console.log("location exists");
            } else {
                await UserModel.collection.updateOne(
                    { _id: req.sessionID },
                    { $set: { latitude: lat, longitude: lon } },
                );
                console.log("Existing user's location updated")
            }
        } else {
            await UserModel.collection.insertOne({_id: req.sessionID, latitude: lat, longitude: lon});
            console.log(`New user created with id: ${req.sessionID}`);
            req.session.location = true;
        }
    }
});

app.get(
    "/tracks",
    validateUser,
    checkTokenExpired,
    ///////////////// testing ////////////////////
    async (req, res) => {
        console.log("session ID at /tracks: ", req.session.id);
        console.log(
            "session stored in DB",
            await UserModel.collection.findOne({ _id: req.session.id }),
        );
        ////////////// testing ////////////////////
        try {
            const response = await runOperations();
            const playlistId = await createPlaylist(response);
            console.log(await playlistId);
            res.status(201).json({
                data: {
                    message: "success",
                    playlist_id: playlistId,
                },
            });
        } catch (e) {
            res.status(500).json({
                error: {
                    message: "Internal server error",
                },
            });
            console.error("Error fetching tracks");
            console.error(e);
        }

        async function fetchSpotifyApi(endpoint, method, body) {
            const currUser = await UserModel.collection.findOne({
                _id: req.session.id,
            });
            if (!currUser) {
                console.log("User not found");
                return;
            }
            try {
                const response = await fetch(`https://api.spotify.com/${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${await currUser.access_token}`,
                    },
                    method,
                    body: JSON.stringify(body),
                });
                return await response.json();
            } catch (err) {
                console.error("spotify API could not be reached");
                console.error(err);
                return null;
            }
        }

        // Getting user's top tracks
        async function getTopTrackIds() {
            try {
                const topTracks = await fetchSpotifyApi(
                    `v1/me/top/tracks?limit=30`,
                    "GET",
                );
                let arrOfTopTrackID = [];
                for (let i = 0; i < 30; i++) {
                    let trackId = await topTracks["items"][i]["id"];
                    arrOfTopTrackID.push(await trackId);
                }
                return arrOfTopTrackID;
            } catch (err) {
                console.log(err);
                return null;
            }
        }

        // Function to get track recommendations
        async function getRecommendedTracks(
            seedTracks,
            danceability,
            energy,
            valence,
            limit = 20,
        ) {
            try {
                const response = fetchSpotifyApi(
                    `v1/recommendations?seed_tracks=${seedTracks.map((trackId, index) => {
                        return index !== seedTracks.length - 1 ? `${trackId}%2C` : trackId;
                    })}&target_danceability=${danceability}&target_energy=${energy}&limit=${limit}`.replaceAll(
                        ",",
                        "",
                    ),
                    "GET",
                );
                let recommendedTracks = [];
                for (let i = 0; i < limit; i++) {
                    recommendedTracks.push(
                        { name: (await response).tracks[i].name },
                        { artist: (await response).tracks[i].album.artists[0].name },
                        { image: (await response).tracks[i].album.images[1].url },
                        { link: (await response).tracks[i].external_urls },
                        { uri: (await response).tracks[i].uri },
                    );
                }

                return recommendedTracks;
            } catch (err) {
                console.log(err.response);
                console.log("Recommened tracks could not be fetched");
                return null;
            }
        }

        async function getCurrentUserInfo() {
            try {
                const result = await fetchSpotifyApi(`v1/me`, "GET");
                return {
                    name: await result.display_name,
                    email: await result.email,
                    // userId: await result.id,
                    // userProfileImage: (await result).images.url,
                };
            } catch (e) {
                console.error(e);
                return null;
            }
        }

        async function createPlaylist(tracks) {
            const userName = (await getCurrentUserInfo()).name;
            if (!userName && !tracks) {
                throw new Error(
                    "Username or track recommedations could not be retrieved",
                );
                return;
            }
            console.log(userName);
            let pid;
            const targetUrl = "v1/me/playlists";
            const payload = {
                name: `Playlist for ${userName} by TuneWeather`,
                description: "A Playlist by the TuneWeather App",
                public: false,
            };
            const request = await fetchSpotifyApi(targetUrl, "POST", payload);

            let trackUris;
            if (tracks) {
                trackUris = tracks
                    .map((track) => {
                        return typeof track.uri !== "undefined" ? track.uri : "";
                    })
                    .filter((uri) => uri !== "");
                console.log(tracks);
                pid = await request.id;
                console.log("playlist id", pid);
                console.log(trackUris);
            } else {
                console.log("Could not create playlist");
                return;
            }

            try {
                await fetchSpotifyApi(
                    `v1/playlists/${pid}/tracks?uris=${trackUris.join(",")}`,
                    "POST",
                );
                console.log("Items have been added");
                return pid;
            } catch (e) {
                console.log(e);
                return null;
            }
        }

        //Getting weather conditions at client location
        async function getWeatherConditions() {
            try {
                const currUser = await UserModel.collection.findOne({
                    _id: req.sessionID,
                });
                const result = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${await currUser.latitude}&lon=${await currUser.longitude}&appid=${WEATHERAPI_TOKEN}`,
                );
                const conditionsToPassToLLM = result.data.weather.description;
                const tempToPassToLLM = result.data.main.temp;
                return await getTrackFeatures(
                    conditionsToPassToLLM,
                    tempToPassToLLM - 273,
                );
            } catch (err) {
                console.error(err);
                console.error("Weather data could not be fetched");
                return null;
            }
        }

        async function queryOpenAiApi(messageStr) {
            try {
                const completion = await openai.chat.completions.create({
                    messages: [{ role: "system", content: `${messageStr}` }],
                    model: "gpt-4o",
                });

                return completion.choices[0]["message"]["content"];
            } catch (e) {
                console.error(e);
                return null;
            }
        }

        // Gets track features with weather at clients location
        async function getTrackFeatures(condition, temp) {
            if (!condition && !temp) {
                throw new Error(
                    "Cannot retrieve track features: Weather information is missing",
                );
                return;
            }
            try {
                let moods = await queryOpenAiApi(
                    `what danceability, energy, and valence do ${await condition} weather conditions with a temperature of ${await temp}c evoke? Give me results in a JSON format that i can pass to spotify's api to give me music recommendations based on the audio features. Only return the JSON file with the audio features and no additional text or links. Make sure to ALWAYS title the features field "audio-features". Also, I would like you to base the values not explicity based on the weather condition and temperature provided, but also based on me being able to provide accurate recommendations to the users.`,
                );
                moods = moods
                    .replace("```", "")
                    .replace("json", "")
                    .replace("```", "")
                    .trim();
                return JSON.parse(moods);
            } catch (e) {
                console.log(e);
                return null;
            }
        }

        // Runs the server functions
        async function runOperations() {
            let trackFeatures = await getWeatherConditions();
            if (!trackFeatures) {
                throw new Error("No track features found.");
                return;
            } else {
                console.log(trackFeatures);
                try {
                    let arrOfTrackIds = await getTopTrackIds();
                    let randomTracks = [];
                    if (!arrOfTrackIds) {
                        console.error("Tracks could not be fetched, please try again!");
                    } else {
                        for (let i = 0; i < 5; i++) {
                            randomTracks.push(
                                arrOfTrackIds[Math.floor(Math.random() * arrOfTrackIds.length)],
                            );
                        }
                        // TODO: remove log
                        console.log(randomTracks);
                        const db = await trackFeatures["audio-features"].danceability;
                        const eg = await trackFeatures["audio-features"].energy;
                        const vl = await trackFeatures["audio-features"].valence;
                        return await getRecommendedTracks(randomTracks, db, eg, vl);
                    }
                } catch (e) {
                    console.log(e);
                    return null;
                }
            }
        }
    },
);

// use spotify API

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
