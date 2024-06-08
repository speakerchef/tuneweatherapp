import axios from "axios";
import express from "express";
import cors from "cors";
import * as querystring from "node:querystring";
import {
  client_id,
  client_secret,
  WEATHERAPI_TOKEN,
  session_secret,
} from "./config.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import queryApi from "./components/openai-query.js";
import { OPENAI_API_KEY } from "../config.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const PORT = process.env.PORT || 5001;
const app = express();
const mongoURI = "mongodb://localhost:27017/tuneweatherdb";
let SPOTIFY_AUTH_TOKEN;
let userCity;
let sessionExists = false;
let tokenIsExpired = true;
let needsRefresh = false;

mongoose.connect(mongoURI, {}).then((res) => {
  console.log("MongoDB connected");
});

const UserSchema = new mongoose.Schema({
  cookieId: String,
  access_token: String,
  refresh_token: String,
  expires_in: Number,
  date_issued: Number,
});
const UserModel = mongoose.model("Users", UserSchema);

const userHasCookieSession = async (req, res, next) => {
  const currentUser = await UserModel.collection.findOne({
    cookieId: req.session.id,
  });
  if (!currentUser) {
    res.redirect("/login");
  } else {
    next();
  }
};

const authTokenHasBeenInitialized = async (req, res, next) => {
  if (!SPOTIFY_AUTH_TOKEN) {
    SPOTIFY_AUTH_TOKEN = (
      await UserModel.collection.findOne({ cookieId: req.session.id })
    ).access_token;
    next();
  } else {
    next();
  }
};

// Token auth middleware
const checkTokenExpired = async (req, res, next) => {
  const currentUser = await UserModel.collection.findOne({
    cookieId: req.session.id,
  });
  if (currentUser) {
    let dateDiff = Date.now() - currentUser.date_issued;
    console.log("DATE DIFFERENCE", dateDiff);
    if (dateDiff >= currentUser.expires_in) {
      needsRefresh = true;
      res.redirect("/login");
    } else {
      next();
    }
  } else {
    res.redirect("/login");
  }
};

app.use(
  session({
    secret: session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoURI,
    }),
  }),
);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redirect_uri = "http://localhost:5001/callback";

app.get("/", (req, res) => {
  req.session.isAuth = true;
  res.send("Home");
});

// GET User auth token
app.get("/login", (req, res) => {
  const scope =
    "user-read-private playlist-read-private playlist-modify-private playlist-modify-public user-top-read";
  const authUrl = "https://accounts.spotify.com/authorize";
  res.redirect(
    `${authUrl}?${querystring.stringify({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
    })}`,
  );
});

app.get("/callback", async (req, res) => {
  const authCode = req.query.code;
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const authOptions = {
    method: "post",
    url: tokenUrl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(client_id + ":" + client_secret)
        .toString("base64")
        .replace("=", "")}`,
    },
    data: {
      code: authCode,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    },
  };

  if (
    (await UserModel.collection.findOne({ cookieId: req.session.id })) &&
    !needsRefresh
  ) {
    await UserModel.collection
      .findOne({ cookieId: req.session.id })
      .then((res) => (SPOTIFY_AUTH_TOKEN = res.access_token))
      .then((_) => {
        console.log(SPOTIFY_AUTH_TOKEN);
        needsRefresh = false;
      });
    sessionExists = true;
    res.redirect("http://localhost:3000/");
  } else {
    try {
      const response = await axios(authOptions);
      const body = response.data;
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      const expires_in = response.data.expires_in * 1000;
      console.log("Access token:", access_token);
      console.table(body);
      const existingUser = await UserModel.collection.findOne({
        cookieId: req.session.id,
      });
      if (existingUser) {
        await UserModel.collection.updateOne(
          { cookieId: existingUser.cookieId },
          {
            $set: {
              access_token: access_token,
              refresh_token: refresh_token,
              expires_in: expires_in,
              date_issued: Date.now(),
            },
          },
        );
      } else {
        await UserModel.collection.insertOne({
          cookieId: req.session.id,
          access_token: access_token,
          refresh_token: refresh_token,
          expires_in: expires_in,
          date_issued: Date.now(),
        });
      }
      SPOTIFY_AUTH_TOKEN = access_token;
      tokenIsExpired = false;
      needsRefresh = false;
      req.session.isAuth = true;
      res.redirect("http://localhost:3000/");
    } catch (error) {
      console.error(
        "Error fetching access token",
        error.response ? error.response.status : error,
      );
    }
  }
});

app.get("/location", async (req, res) => {
  if (req) {
    userCity = req.city;
    if (!userCity) {
      res.status(418).send("Error: City not provided");
    }
  }
});

app.get(
  "/tracks",
  userHasCookieSession,
  checkTokenExpired,
  authTokenHasBeenInitialized,
  async (req, res) => {
    res.send("On tracks page");
    const testToken = (
      await UserModel.collection.findOne({ cookieId: req.session.id })
    ).access_token;
    console.error(await testToken);
    console.log(SPOTIFY_AUTH_TOKEN);

    runOperations()
      .then((res) => createPlaylist(res))
      .catch((err) => console.error("ERROR RUNNING OPERATIONS:", err));
  },
);

// use spotify API
const fetchSpotifyApi = async (endpoint, method, body) => {
  try {
    const response = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${await SPOTIFY_AUTH_TOKEN}`,
      },
      method,
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (err) {
    if (err) {
      if (err.response.status === 401) {
        needsRefresh = true;
      }
    }
    console.error(err.response ? err.response : err);
    console.error("spotify API could not be reached");
  }
};

// Getting user's top tracks
const getTopTrackIds = async () => {
  try {
    const topTracks = await fetchSpotifyApi(`v1/me/top/tracks?limit=50`, "GET");
    let arrOfTopTrackID = [];
    for (let i = 0; i < 50; i++) {
      let trackId = await topTracks["items"][i]["id"];
      arrOfTopTrackID.push(await trackId);
    }
    return arrOfTopTrackID;
  } catch (err) {
    console.log(err);
  }
};

// Function to get track recommendations
const getRecommendedTracks = async (
  seedTracks,
  danceability,
  energy,
  valence,
  limit = 20,
) => {
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
  }
};

const getCurrentUserInfo = async () => {
  const res = await fetchSpotifyApi(`v1/me`, "GET");
  return {
    name: await res.display_name,
    email: await res.email,
    userId: await res.id,
    userProfileImage: (await res).images.url,
  };
};

const createPlaylist = async (tracks) => {
  const userName = (await getCurrentUserInfo()).name;
  if (!userName && !tracks) {
    throw new Error("Username or track recommedations could not be retrieved");
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

  const trackUris = tracks
    .map((track) => {
      return typeof track.uri !== "undefined" ? track.uri : "";
    })
    .filter((uri) => uri !== "");
  console.log(tracks);
  pid = await request.id;
  console.log("playlist id", pid);
  console.log(trackUris);

  try {
    await fetchSpotifyApi(
      `v1/playlists/${pid}/tracks?uris=${trackUris.join(",")}`,
      "POST",
    );
    console.log("Items have been added");
  } catch (e) {
    console.log(e.response);
  }

  try {
    await fetchSpotifyApi(`v1/playlists/${pid}/images`, "PUT", {
      "Content-Type": "image/jpg",
      body: "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paanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP7eKKKK+fPQCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApCyjgsAfQkClr8Af8Agt78VPHvwW+FfjP4jfDPXj4Z8Z6F4Y+GkWlayNN0fVzax6t8TY9H1Bf7P17T9U0ub7Rp19dW2bixmMXm+bAY50jlT9Z8EfCnGeNfiRw74bZfnGGyLH8S4zDZfgsxxuFq4vB0cXjMZhcDh/rVOhVp1oYf2uKhKtWpKvUp04ycMPWlaD/EvHPxVzrwpybgWvw3wplfGHEPiF4teHfhHkmWZ5xTi+Dsmw2beIudRyLL80zXPMBwrxpj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V/dQbsDxPq0d9qXjDxhtz8t3NquhXEqkw3SXFuWif9x08CeD4PBMnw4svDumaX4Ffw7c+E18MaNB/YulW3h27sZdNn0qxh0k2badbtZTSwIbB7aWHd5kEkcoDjrKK8bjrxU498SJYCPF3EFfH4HKIOlk2SYTDYHJuHclpNWcMo4dybDYDJcuvC0J1cLgadetCMVXq1HFM8vxE8YvEfxUeW0+NuJa+Y5bklOVHIeHcDg8uyHhXIKMlyunkfC2Q4TLcgyvmhy06lXB5dSxFeEILEVqrimfyy/GD/g03/4J5+M/G95rvwmtP+FLeDJrLToLTwH5/wAb/iN9ivLa3WO/vv8AhKPEv7R1rqtz/aVwDc/ZZYRFZ7vJhLIAaqfC/wD4NZP2fPgx4oHjP4a/Gv8A4RvxKNPu9KGpf8K38baxiwvzC13B9j1/9oXVLD96YIj5v2Xzk2fu5E3Nu/qlor3OG/HHxA4R/sefDv8AqNl2MyGOG/snN14S+E+Kz/C1cHGMcPi3xFjeCcTnuIzCHKpyzLFZjXzCrVvWq4mdWUpv3OEvH/xF4GeRVuFaPhrlOYcMrB/2JnkfA/wTxfE2CrYCMY4XHf604/w9xXEeJzSnyRnLNsXmmIzOtWvXrYupWlKo6tjbfYrKzs9/mfZLW3tvM27PM8iJIt+zc+zfs3bdzbc43HGTaoor8jlJzlKcneUpOUnZK7k227KyV29kkux+MTlKcpTk7ynJyk7JXlJtt2SSV23okl2QUUUUiQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z",
    });
  } catch (e) {
    console.log("Error adding image", e);
  }
};

//Getting weather conditions at client location
async function getWeatherConditions(location) {
  try {
    const res = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_TOKEN}&q=${location}&aqi=yes`,
    );
    const conditionsToPassToLLM = res.data["current"]["condition"]["text"];
    const tempToPassToLLM = res.data["current"].temp_c;
    return await getTrackFeatures(conditionsToPassToLLM, tempToPassToLLM);
  } catch (err) {
    console.error(err.response.data);
    console.error("Weather data could not be fetched");
  }
}

const queryOpenAiApi = async (messageStr) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: `${messageStr}` }],
    model: "gpt-4o",
  });

  return completion.choices[0]["message"]["content"];
};

// Gets track features with weather at clients location
const getTrackFeatures = async (condition, temp) => {
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
  }
};

// TODO: remove log
console.log(await getWeatherConditions());

// Runs the server functions
const runOperations = async (location) => {
  let trackFeatures = await getWeatherConditions("singapore");
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
    }
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
