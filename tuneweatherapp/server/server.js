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

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const PORT = process.env.PORT || 5002;
const app = express();
const mongoURI = "mongodb+srv://tuneweather:YQMsoAyqdsIhbQ0U@tuneweather.tozzrsv.mongodb.net/?retryWrites=true&w=majority&appName=tuneweather";
let SPOTIFY_AUTH_TOKEN;
let userLatitude;
let userLongitude;
let userLocation;
let needsRefresh = false;
let isLoggedIn = false;
let sessionId;

mongoose.connect(mongoURI, {}).then((res) => {
  console.log("MongoDB connected");
});

const UserSchema = new mongoose.Schema({
  cookieId: String,
  access_token: String,
  refresh_token: String,
  expires_in: Number,
  date_issued: Number,
  latitude: String,
  longitude: String,
});
const UserModel = mongoose.model("Users", UserSchema);

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
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    handler: async (req, res) => {
      res.redirect("https://tuneweather.onrender.com/");
    },
  }),
);

app.use((req, res, next) => {
  if (req.cookies) {
    console.log("Session data before save:", req.cookies.cookie_id);
  }
  next();
});

app.set("trust proxy", 1);

//TESTING POINT
app.get("/db-test", async (req, res) => {
  console.log("cookie ID at /db-test: ", req.cookies.cookie_id);
  console.log(
    "session stored in DB",
    await UserModel.collection.findOne({ cookieId: req.cookies.cookie_id }),
  );
});

const validateUser = async (req, res, next) => {
  const requestId = req.query.session_id;
  if (!requestId) {
    res.send({ code: 401, message: "Unauthorized, please login" });
  } else {
    console.log("Request made from ID:", requestId);
    const user = await UserModel.collection.findOne({ cookieId: requestId });
    if (!user) {
      res.sendStatus(401, { code: 401, message: "User not found" });
    } else {
      const token = user.access_token;
      SPOTIFY_AUTH_TOKEN = token;
      next();
    }
  }
};


// Check if token is expired
const checkTokenExpired = async (req, res, next) => {
  const currentUser = await UserModel.collection.findOne({
    cookieId: sessionId,
  });

  if (currentUser) {
    let dateDiff = Date.now() - currentUser.date_issued;
    console.log("Date difference:", dateDiff);
    if (dateDiff >= currentUser.expires_in) {
      needsRefresh = true;
      isLoggedIn = false;
      console.log("Token expired, redirecting to login.");
      res.json({
        error: {
          data: {
            Status: 401,
            message: "Your token has expired, please login again",
            redirect_url: "http://localhost:5001/login",
          }
        }
      });
    } else {
      next();
    }
  }
};

const redirect_uri = "https://tuneweatherapp.onrender.com/callback";
app.get("/login", async (req, res) => {
    // res.redirect("http://localhost:3000/playlist");
    const scope =
      "user-read-private playlist-read-private playlist-modify-private playlist-modify-public user-top-read";
    const authUrl = "https://accounts.spotify.com/authorize";
    res.redirect(
      `${authUrl}?${querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        mode: "no-cors",
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

  try {
    sessionId = req.cookies.cookie_id;
    const response = await axios(authOptions);
    const body = response.data;
    const access_token = body.access_token;
    const refresh_token = body.refresh_token;
    const expires_in = body.expires_in * 1000;

    console.log("Access token:", access_token);
    console.table(body);

    const existingUser = await UserModel.collection.findOne({
      cookieId: sessionId,
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
      res.cookie("cookie_id", req.session.id);
      await UserModel.collection.insertOne({
        cookieId: sessionId,
        access_token: access_token,
        refresh_token: refresh_token,
        expires_in: expires_in,
        date_issued: Date.now(),
      });
    }
    SPOTIFY_AUTH_TOKEN = access_token;
    isLoggedIn = true;
    needsRefresh = false;
    res.redirect("https://tuneweather.onrender.com/playlist");
  } catch (error) {
    console.error(error.response ? error.response.status : error);
    res.send({ code: 500, message: "Internal server error" });
  }
});

app.get("/playlist", async (req, res) => {
  res.send({
    data: {
      code: 201,
      message: "Login successful!",
      access_token: SPOTIFY_AUTH_TOKEN,
      session_id: sessionId,
    },
  });
});

app.post("/location", async (req, res) => {
  console.log("Query at location enpoint", req.query)
  const currentUser = await UserModel.collection.findOne({
    cookieId: sessionId,
  });
  if (currentUser) {
    if (currentUser.latitude && currentUser.longitude) {
      userLatitude = currentUser.latitude;
      userLongitude = currentUser.longitude;
      console.log("location exists");
      return;
    }
  }
  if (req) {
    userLatitude = req.query.latitude;
    userLongitude = req.query.longitude;
    console.log(userLatitude, userLongitude);
    if (!userLatitude || !userLongitude) {
      res.status(418).json("Error: Coordinates not provided");
    } else {

      console.log("User coords: " + userLatitude, userLongitude);
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userLatitude}&longitude=${userLongitude}`,
      );
      userLocation = (await response.json()).locality;
      userLocation = userLocation.toLowerCase();
      console.log(userLocation);
      await UserModel.collection.updateOne(
        { cookieId: sessionId },
        {
          $set: {
            latitude: userLatitude,
            longitude: userLongitude,
          },
        },
      );
      res.send({
        data: {
          code: 200,
          message: "Request successful.",
          city: userLocation,
        }
      });
    }
  }
});

app.get(
  "/tracks",
  validateUser,
  checkTokenExpired,
  ///////////////// testing ////////////////////
  async (req, res) => {
    console.log("session ID at /tracks: ", sessionId);
    console.log(
      "session stored in DB",
      await UserModel.collection.findOne({ cookieId: sessionId }),
    );
    ////////////// testing ////////////////////
    let pid;
    runOperations()
      .then((response) => {
        createPlaylist(response).then((response) => {
          res.send({
            data: {
              status: 200,
              playlist_id: response,
            },
          });
          console.log(response);
        });
      })
      .catch((err) => {
        console.error("ERROR RUNNING OPERATIONS:", err);
        res.sendStatus(500);
        return;
      });
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
    console.error("spotify API could not be reached");
    console.error(err);
    return null;
  }
};

// Getting user's top tracks
const getTopTrackIds = async () => {
  try {
    const topTracks = await fetchSpotifyApi(`v1/me/top/tracks?limit=30`, "GET");
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
    return null;
  }
};

const getCurrentUserInfo = async () => {
  try {
    const res = await fetchSpotifyApi(`v1/me`, "GET");
    return {
      name: await res.display_name,
      email: await res.email,
      userId: await res.id,
      userProfileImage: (await res).images.url,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
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
};

//Getting weather conditions at client location
async function getWeatherConditions() {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${await userLatitude}&lon=${await userLongitude}&appid=${WEATHERAPI_TOKEN}`,
    );
    const conditionsToPassToLLM = res.data.weather.description;
    const tempToPassToLLM = res.data.main.temp;
    return await getTrackFeatures(conditionsToPassToLLM, tempToPassToLLM - 273);
  } catch (err) {
    console.error(err.response.data);
    console.error("Weather data could not be fetched");
    return null;
  }
}

const queryOpenAiApi = async (messageStr) => {
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
    return null;
  }
};

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
      return null;
    }
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
