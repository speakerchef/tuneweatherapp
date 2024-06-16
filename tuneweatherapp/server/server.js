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

const env = dotenv.config(),
  client_id = process.env.client_id,
  client_secret = process.env.client_secret,
  WEATHERAPI_TOKEN = process.env.WEATHERAPI_TOKEN,
  session_secret = process.env.session_secret,
  OPENAI_API_KEY = process.env.OPENAI_API_KEY,
  server_url = process.env.server_url,
  client_url = process.env.client_url,
  openai = new OpenAI({ apiKey: OPENAI_API_KEY }),
  PORT = process.env.PORT || 5001,
  app = express(),
  mongoURI =
    "mongodb+srv://tuneweather:YQMsoAyqdsIhbQ0U@tuneweather.tozzrsv.mongodb.net/?retryWrites=true&w=majority&appName=tuneweather";
let userLocation, lat, lon, currentUserSession;
mongoose.connect(mongoURI, {}).then((e) => {
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
  }),
  UserModel = mongoose.model("Users", UserSchema);
app.use(cookieParser()),
  app.use(
    session({
      secret: session_secret,
      resave: !1,
      saveUninitialized: !0,
      store: MongoStore.create({ mongoUrl: mongoURI }),
      cookie: { sameSite: "none", secure: !0, httpOnly: !0 },
    }),
  ),
  app.use(
    cors({
      origin: [
        "https://tuneweather.com",
        "https://www.tuneweather.com",
        "https://api.tuneweather.com",
      ],
      credentials: !0,
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Set-Cookie"],
    }),
  ),
  app.options("*", cors()),
  app.use(express.json()),
  app.use(express.urlencoded({ extended: !0 })),
  app.use(
    rateLimit({
      windowMs: 6e4,
      max: 100,
      handler: (e, o) => {
        o.redirect('https://tuneweather.com/too-many-requests');

      },
    }),
  ),
  app.use((e, o, s) => {
    console.log("Session data :", e.sessionID), s();
  }),
  app.set("trust proxy", 1);
const validateUser = async (e, o, s) => {
    const t = e.sessionID;
    if ((console.log("REQUEST COOKIE ID: ", t), t)) {
      console.log("Request made from ID:", t);
      const n = await UserModel.collection.findOne({ _id: t });
      n
        ? !n.isLoggedIn || n.needsRefresh
          ? (console.error("user access has expired"),
            o
              .status(403)
              .json({
                error: { message: "Your access has expired, please login" },
              }))
          : (console.log("User has passed validation check"), s())
        : (console.log("User does not exist"),
          o.status(403).json({
            error: {
              session: e.sessionID || "hello",
              message: "User not found for the given session",
            },
          }));
    } else o.status(403).json({ error: { message: "No session id provided" } });
  },
  checkTokenExpired = async (e, o, s) => {
    console.log("User at token expiry check: ", e.sessionID);
    const t = await UserModel.collection.findOne({ _id: e.session.id });
    if (t) {
      let n = Date.now() - t.date_issued;
      console.log("Date difference:", n),
        n >= t.date_issued
          ? (await UserModel.collection.updateOne(
              { _id: e.sessionID },
              {
                $set: {
                  needsRefresh: !0,
                  isLoggedIn: !1,
                },
              },
            ),
            console.error("Token expired, redirecting to login."),
            o.json({
              error: {
                status: 401,
                message: "Your token has expired, please login again",
                redirect_url: "http://localhost:5001/login",
              },
            }))
          : s();
    } else
      console.error("Issue at token expiry"),
        o.status(401).json({
          error: {
            status: 401,
            message: "Unauthorized, please login",
          },
        });
  };
app.delete("/logout", async (e, o) => {
  (await UserModel.collection.findOne({ _id: e.sessionID })) &&
    (await UserModel.collection.deleteOne({ _id: e.sessionID })),
    e.session.destroy(),
    o.status(200).json({ message: "User deleted" });
});
const redirect_uri = `${server_url}/callback`;
app.post("/login", async (e, o) => {
  console.log("saved user session", e.sessionID);
  const s = await UserModel.collection.findOne({ _id: e.sessionID });
  if (s) {
    if (
      (console.log("CURRENT USER REFRESH STATUS", s.needsRefresh),
      !s.needsRefresh && s.isLoggedIn)
    )
      return (
        console.log("user is authorized (cookie)"),
        void o.status(200).json({
          data: {
            status: 200,
            message: "User is logged in",
          },
        })
      );
  } else await UserModel.collection.insertOne({ _id: e.sessionID });
  console.log("User is not authorized");
  const t = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope:
      "user-read-private playlist-modify-private user-top-read",
    redirect_uri: redirect_uri,
  })}`;
  console.log(t), o.status(200).json({ redirectLink: t });
}),
  app.get("/callback", async (e, o) => {
    console.log(`session id at oath flow ${JSON.stringify(e.cookies)}`)
    const s = e.query.code,
      t = {
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${new Buffer.from(client_id + ":" + client_secret).toString("base64").replace("=", "")}`,
        },
        data: {
          code: s,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code",
        },
      };
    try {
      const o = (await axios(t)).data,
        s = o.access_token,
        n = o.refresh_token,
        r = 1e3 * o.expires_in;
      console.log("Access token:", s), console.table(o);
      await UserModel.collection.findOne({ _id: e.sessionID });
      await UserModel.collection.updateOne(
        { _id: e.sessionID },
        {
          $set: {
            access_token: s,
            refresh_token: n,
            expires_in: r,
            date_issued: Date.now(),
            isLoggedIn: !0,
            needsRefresh: !1,
          },
        },
      );
    } catch (e) {
      console.error(e.response ? e.response.status : e),
        o.status(500).json({ message: "Internal server error" });
    }
    o.redirect(`${client_url}/playlist`);
  }),
  app.get("/playlist", async (e, o) => {
    await UserModel.collection.insertOne({ _id: e.session.id }).then(() => {
      (e.session.isAuth = !1),
        console.log("session id at playlist", e.session.id),
        o.send({
          data: {
            code: 201,
            session_id: e.session.id,
          },
        });
    });
  }),
  app.post("/location", async (e, o) => {
    console.log("Query at location enpoint", e.query);
    const s = await UserModel.collection.findOne({ _id: e.sessionID });
    if (
      ((lat = e.query.latitude),
      (lon = e.query.longitude),
      console.log(lat, lon),
      lat && lon)
    ) {
      console.log("User coords: " + lat, lon);
      const o = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`,
        ),
        t = (await o.json()).locality;
      console.log(t),
        s
          ? s.latitude && s.longitude
            ? console.log("location exists")
            : (await UserModel.collection.updateOne(
                { _id: e.sessionID },
                {
                  $set: {
                    latitude: lat,
                    longitude: lon,
                  },
                },
              ),
              console.log("Existing user's location updated"))
          : (await UserModel.collection.insertOne({
              _id: e.sessionID,
              latitude: lat,
              longitude: lon,
            }),
            console.log(`New user created with id: ${e.sessionID}`),
            (e.session.location = !0));
    } else o.status(418).json("Error: Coordinates not provided");
  }),
  app.get("/tracks", validateUser, checkTokenExpired, async (e, o) => {
    console.log("session ID at /tracks: ", e.session.id),
      console.log(
        "session stored in DB",
        await UserModel.collection.findOne({ _id: e.session.id }),
      );
    try {
      const t = await (async function () {
          let o = await (async function () {
            try {
              const o = await UserModel.collection.findOne({
                  _id: e.sessionID,
                }),
                s = await axios.get(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${await o.latitude}&lon=${await o.longitude}&appid=${WEATHERAPI_TOKEN}`,
                ),
                t = s.data.weather.description,
                n = s.data.main.temp;
              return await (async function (e, o) {
                if (!e && !o)
                  throw new Error(
                    "Cannot retrieve track features: Weather information is missing",
                  );
                try {
                  let s = await (async function (e) {
                    try {
                      return (
                        await openai.chat.completions.create({
                          messages: [
                            {
                              role: "system",
                              content: `${e}`,
                            },
                          ],
                          model: "gpt-4o",
                        })
                      ).choices[0].message.content;
                    } catch (e) {
                      return console.error(e), null;
                    }
                  })(
                    `what danceability, energy, and valence do ${await e} weather conditions with a temperature of ${await o}c evoke? Give me results in a JSON format that i can pass to spotify's api to give me music recommendations based on the audio features. Only return the JSON file with the audio features and no additional text or links. Make sure to ALWAYS title the features field "audio-features". Also, I would like you to base the values not explicity based on the weather condition and temperature provided, but also based on me being able to provide accurate recommendations to the users.`,
                  );
                  return (
                    (s = s
                      .replace("```", "")
                      .replace("json", "")
                      .replace("```", "")
                      .trim()),
                    JSON.parse(s)
                  );
                } catch (e) {
                  return console.log(e), null;
                }
              })(t, n - 273);
            } catch (e) {
              return (
                console.error(e),
                console.error("Weather data could not be fetched"),
                null
              );
            }
          })();
          if (!o) throw new Error("No track features found.");
          console.log(o);
          try {
            let e = await (async function () {
                try {
                  const e = await s("v1/me/top/tracks?limit=30", "GET");
                  let o = [];
                  for (let s = 0; s < 30; s++) {
                    let t = await e.items[s].id;
                    o.push(await t);
                  }
                  return o;
                } catch (e) {
                  return console.log(e), null;
                }
              })(),
              t = [];
            if (e) {
              for (let o = 0; o < 5; o++)
                t.push(e[Math.floor(Math.random() * e.length)]);
              console.log(t);
              const n = await o["audio-features"].danceability,
                r = await o["audio-features"].energy;
              await o["audio-features"].valence;
              return await (async function (e, o, t, n, r = 20) {
                try {
                  const n = s(
                    `v1/recommendations?seed_tracks=${e.map((o, s) => (s !== e.length - 1 ? `${o}%2C` : o))}&target_danceability=${o}&target_energy=${t}&limit=${r}`.replaceAll(
                      ",",
                      "",
                    ),
                    "GET",
                  );
                  let a = [];
                  for (let e = 0; e < r; e++)
                    a.push(
                      { name: (await n).tracks[e].name },
                      { artist: (await n).tracks[e].album.artists[0].name },
                      { image: (await n).tracks[e].album.images[1].url },
                      { link: (await n).tracks[e].external_urls },
                      { uri: (await n).tracks[e].uri },
                    );
                  return a;
                } catch (e) {
                  return (
                    console.log(e.response),
                    console.log("Recommened tracks could not be fetched"),
                    null
                  );
                }
              })(t, n, r);
            }
            console.error("Tracks could not be fetched, please try again!");
          } catch (e) {
            return console.log(e), null;
          }
        })(),
        n = await (async function (e) {
          const o = (
            await (async function () {
              try {
                const e = await s("v1/me", "GET");
                return { name: await e.display_name, email: await e.email };
              } catch (e) {
                return console.error(e), null;
              }
            })()
          ).name;
          if (!o && !e)
            throw new Error(
              "Username or track recommedations could not be retrieved",
            );
          let t;
          console.log(o);
          const n = "v1/me/playlists",
            r = {
              name: `Playlist for ${o} by TuneWeather`,
              description: "A Playlist by the TuneWeather App",
              public: !1,
            },
            a = await s(n, "POST", r);
          let i;
          if (!e) return void console.log("Could not create playlist");
          (i = e
            .map((e) => (void 0 !== e.uri ? e.uri : ""))
            .filter((e) => "" !== e)),
            console.log(e),
            (t = await a.id),
            console.log("playlist id", t),
            console.log(i);
          try {
            return (
              await s(`v1/playlists/${t}/tracks?uris=${i.join(",")}`, "POST"),
              console.log("Items have been added"),
              t
            );
          } catch (e) {
            return console.log(e), null;
          }
        })(t);
      console.log(await n),
        o.status(201).json({ data: { message: "success", playlist_id: n } });
    } catch (e) {
      o.status(500).json({ error: { message: "Internal server error" } }),
        console.error("Error fetching tracks"),
        console.error(e);
    }

    async function s(o, s, t) {
      const n = await UserModel.collection.findOne({ _id: e.session.id });
      if (n)
        try {
          const e = await fetch(`https://api.spotify.com/${o}`, {
            headers: { Authorization: `Bearer ${await n.access_token}` },
            method: s,
            body: JSON.stringify(t),
          });
          return await e.json();
        } catch (e) {
          return (
            console.error("spotify API could not be reached"),
            console.error(e),
            null
          );
        }
      else console.log("User not found");
    }
  }),
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
