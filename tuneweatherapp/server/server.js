"use strict";
import e from "axios";
import t from "dotenv";
import s from "express";
import o from "cors";
import * as a from "node:querystring";
import i from "mongoose";
import r from "express-session";
import n from "connect-mongo";
import l from "openai";
import c from "express-rate-limit";
import d from "cookie-parser";

let env = t.config(),
  client_id = process.env.client_id,
  client_secret = process.env.client_secret,
  WEATHERAPI_TOKEN = process.env.WEATHERAPI_TOKEN,
  session_secret = process.env.session_secret,
  OPENAI_API_KEY = process.env.OPENAI_API_KEY,
  server_url = process.env.server_url,
  client_url = process.env.client_url,
  mongoURI = process.env.mongodbURI,
  openai = new l({ apiKey: OPENAI_API_KEY }),
  PORT = process.env.PORT || 5001,
  app = s(),
  lat,
  lon;
i.connect(mongoURI, {}).then((e) => {
  console.log("MongoDB connected");
});
let UserSchema = new i.Schema({
    access_token: String,
    refresh_token: String,
    expires_in: Number,
    date_issued: Number,
    latitude: String,
    longitude: String,
    isLoggedIn: Boolean,
    needsRefresh: Boolean,
  }),
  UserModel = i.model("Users", UserSchema);
app.use(d()),
  app.use(
    r({
      secret: session_secret,
      resave: !1,
      saveUninitialized: !0,
      store: n.create({ mongoUrl: mongoURI }),
      cookie: { sameSite: "none", secure: !0, httpOnly: !0 },
    }),
  ),
  app.use(
    o({
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
  app.options("*", o()),
  app.use(s.json()),
  app.use(s.urlencoded({ extended: !0 })),
  app.use(
    c({
      windowMs: 6e4,
      max: 50,
      handler(e, t) {
        t.status(429).json({
          error: { status: 429, message: "Rate limit exceeded" },
        });
      },
    }),
  ),
  app.use((e, t, s) => {
    console.log("Session data :", e.sessionID), s();
  }),
  app.set("trust proxy", 1);
let validateUser = async (e, t, s) => {
    let o = e.sessionID;
    if ((console.log("REQUEST COOKIE ID: ", o), o)) {
      console.log("Request made from ID:", o);
      let a = await UserModel.collection.findOne({ _id: o });
      a
        ? !a.isLoggedIn || a.needsRefresh
          ? (console.error("user access has expired"),
            t
              .status(403)
              .json({
                error: { message: "Your access has expired, please login" },
              }))
          : (console.log("User has passed validation check"), s())
        : (console.log("User does not exist"),
          t.status(403).json({
            error: {
              session: e.sessionID || "hello",
              message: "User not found for the given session",
            },
          }));
    } else t.status(403).json({ error: { message: "No session id provided" } });
  },
  checkTokenExpired = async (e, t, s) => {
    console.log("User at token expiry check: ", e.sessionID);
    let o = await UserModel.collection.findOne({ _id: e.session.id });
    if (o) {
      let a = Date.now() - o.date_issued;
      console.log("Date difference:", a),
        a >= o.expires_in
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
            t.json({
              error: {
                status: 401,
                message: "Your token has expired, please login again",
                redirect_url: "http://localhost:5001/login",
              },
            }))
          : s();
    } else
      console.error("Issue at token expiry"),
        t.status(401).json({
          error: {
            status: 401,
            message: "Unauthorized, please login",
          },
        });
  };
app.delete("/logout", async (e, t) => {
  let s = await UserModel.collection.findOne({ _id: e.sessionID });
  s && (await UserModel.collection.deleteOne({ _id: e.sessionID })),
    e.session.destroy(),
    t.status(200).json({ message: "User deleted" });
});
let redirect_uri = `${server_url}/callback`;
app.post("/login", async (e, t) => {
  console.log("saved user session", e.sessionID);
  let s = await UserModel.collection.findOne({ _id: e.sessionID });
  if (s) {
    if (
      (console.log("CURRENT USER REFRESH STATUS", s.needsRefresh),
      !s.needsRefresh && s.isLoggedIn)
    ) {
      console.log("user is authorized (cookie)"),
        t.status(200).json({
          data: {
            status: 200,
            message: "User is logged in",
          },
        });
      return;
    }
  } else await UserModel.collection.insertOne({ _id: e.sessionID });
  console.log("User is not authorized");
  let o = new URLSearchParams({
      response_type: "code",
      client_id: client_id,
      scope:
        "user-read-private playlist-read-private playlist-modify-private user-top-read",
      redirect_uri: redirect_uri,
    }),
    a = `https://accounts.spotify.com/authorize?${o}`;
  console.log(a), t.status(200).json({ redirectLink: a });
}),
  app.get("/callback", async (t, s) => {
    console.log(`session id at oath flow ${JSON.stringify(t.cookies)}`);
    let o = t.query.code,
      a = new Buffer.from(client_id + ":" + client_secret)
        .toString("base64")
        .replace("=", ""),
      i = {
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${a}`,
        },
        data: {
          code: o,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code",
        },
      };
    try {
      let r = await e(i),
        n = r.data,
        l = n.access_token,
        c = n.refresh_token,
        d = 1e3 * n.expires_in;
      console.log("Access token:", l),
        console.table(n),
        await UserModel.collection.findOne({ _id: t.sessionID }),
        await UserModel.collection.updateOne(
          { _id: t.sessionID },
          {
            $set: {
              access_token: l,
              refresh_token: c,
              expires_in: d,
              date_issued: Date.now(),
              isLoggedIn: !0,
              needsRefresh: !1,
            },
          },
        );
    } catch (u) {
      console.error(u.response ? u.response.status : u),
        s.status(500).json({ message: "Internal server error" });
    }
    s.redirect(`${client_url}/playlist`);
  }),
  app.get("/playlist", async (e, t) => {
    await UserModel.collection.insertOne({ _id: e.session.id }).then(() => {
      (e.session.isAuth = !1),
        console.log("session id at playlist", e.session.id),
        t.send({
          data: {
            code: 201,
            session_id: e.session.id,
          },
        });
    });
  }),
  app.post("/location", async (e, t) => {
    console.log("Query at location enpoint", e.query);
    let s = await UserModel.collection.findOne({ _id: e.sessionID });
    if (
      ((lat = e.query.latitude),
      (lon = e.query.longitude),
      console.log(lat, lon),
      lat && lon)
    ) {
      console.log("User coords: " + lat, lon);
      let o = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`,
        ),
        a = (await o.json()).locality;
      console.log(a),
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
    } else t.status(418).json("Error: Coordinates not provided");
  }),
  app.get("/tracks", validateUser, checkTokenExpired, async (t, s) => {
    console.log("session ID at /tracks: ", t.session.id),
      console.log(
        "session stored in DB",
        await UserModel.collection.findOne({ _id: t.session.id }),
      );
    try {
      let o = await h(),
        a = await d(o);
      console.log(await a),
        s.status(201).json({ data: { message: "success", playlist_id: a } });
    } catch (i) {
      s.status(500).json({ error: { message: "Internal server error" } }),
        console.error("Error fetching tracks"),
        console.error(i);
    }

    async function r(e, s, o) {
      let a = await UserModel.collection.findOne({ _id: t.session.id });
      if (!a) {
        console.log("User not found");
        return;
      }
      try {
        let i = await fetch(`https://api.spotify.com/${e}`, {
          headers: { Authorization: `Bearer ${await a.access_token}` },
          method: s,
          body: JSON.stringify(o),
        });
        return await i.json();
      } catch (r) {
        return (
          console.error("spotify API could not be reached"),
          console.error(r),
          null
        );
      }
    }

    async function n() {
      try {
        let e = await r("v1/me/top/tracks?limit=50", "GET");
        console.log(e);
        let t = [];
        if (e)
          for (let s = 0; s < 50; s++) {
            let o = await e.items[s].id;
            t.push(await o);
          }
        return t;
      } catch (a) {
        return console.log(a), null;
      }
    }

    async function l(e, t, s, o, a = 20) {
      let i = new URLSearchParams({
        seed_tracks: e,
        target_danceability: t,
        targe_energy: s,
        target_valence: o,
        limit: a,
      });
      try {
        let n = r(`v1/recommendations?${i}`, "GET"),
          l = [];
        for (let c = 0; c < a; c++)
          l.push(
            { name: (await n).tracks[c].name },
            { artist: (await n).tracks[c].album.artists[0].name },
            { image: (await n).tracks[c].album.images[1].url },
            { link: (await n).tracks[c].external_urls },
            { uri: (await n).tracks[c].uri },
          );
        return l;
      } catch (d) {
        return (
          console.log(d.response),
          console.log("Recommened tracks could not be fetched"),
          null
        );
      }
    }

    async function c() {
      try {
        let e = await r("v1/me", "GET");
        return { name: await e.display_name, email: await e.email };
      } catch (t) {
        return console.error(t), null;
      }
    }

    async function d(e) {
      let t = (await c()).name;
      if (!t && !e)
        throw Error("Username or track recommedations could not be retrieved");
      console.log(t);
      let s,
        o = {
          name: `Playlist for ${t} by TuneWeather`,
          description: "A Playlist by the TuneWeather App",
          public: !1,
        },
        a = await r("v1/me/playlists", "POST", o),
        i;
      if (e)
        (i = e
          .map((e) => (void 0 !== e.uri ? e.uri : ""))
          .filter((e) => "" !== e)),
          console.log(e),
          (s = await a.id),
          console.log("playlist id", s),
          console.log(i);
      else {
        console.log("Could not create playlist");
        return;
      }
      try {
        return (
          await r(`v1/playlists/${s}/tracks?uris=${i.join(",")}`, "POST"),
          console.log("Items have been added"),
          s
        );
      } catch (n) {
        return console.log(n), null;
      }
    }

    async function u() {
      try {
        let s = await UserModel.collection.findOne({ _id: t.sessionID }),
          o = await e.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${await s.latitude}&lon=${await s.longitude}&appid=${WEATHERAPI_TOKEN}`,
          ),
          a = o.data.weather.description,
          i = o.data.main.temp;
        return await g(a, i - 273);
      } catch (r) {
        return (
          console.error(r),
          console.error("Weather data could not be fetched"),
          null
        );
      }
    }

    async function p(e) {
      try {
        let t = await openai.chat.completions.create({
          messages: [{ role: "system", content: `${e}` }],
          model: "gpt-4o",
        });
        return t.choices[0].message.content;
      } catch (s) {
        return console.error(s), null;
      }
    }

    async function g(e, t) {
      if (!e && !t)
        throw Error(
          "Cannot retrieve track features: Weather information is missing",
        );
      try {
        let s = await p(
          `what danceability, energy, and valence do ${await e} weather conditions with a temperature of ${await t}c evoke? Give me results in a JSON format that i can pass to spotify's api to give me music recommendations based on the audio features. Only return the JSON file with the audio features and no additional text or links. Make sure to ALWAYS title the features field "audio-features". Also, I would like you to base the values not explicity based on the weather condition and temperature provided, but also based on me being able to provide accurate recommendations to the users.`,
        );
        return (
          (s = s
            .replace("```", "")
            .replace("json", "")
            .replace("```", "")
            .trim()),
          JSON.parse(s)
        );
      } catch (o) {
        return console.log(o), null;
      }
    }

    async function m() {
      let e = await r("v1/browse/new-releases?limit=10", "GET");
      e = (e = (await e).albums.items).map((e) => e.id);
      let t = new URLSearchParams({ ids: e }),
        s = await r(`v1/albums?${t}`, "GET");
      return (
        (s = (s = (await s).albums).map((e) => e.tracks.items[0].id)),
        console.log(`New releases ${s}`),
        s
      );
    }

    async function h() {
      let e = await u();
      e ||
        (console.error("No track features could be generated."),
        (e = {
          "audio-features": {
            danceability: 0.6,
            energy: 0.7,
            valence: 0.5,
          },
        })),
        console.log(e);
      try {
        let t = await n(),
          s = [];
        t ||
          (console.error(
            "Top tracks could not be fetched, moving to backup method",
          ),
          (t = await m()),
          console.log(`Backup tracks: ${t}`));
        for (let o = 0; o < 5; o++)
          s.push(t[Math.floor(Math.random() * t.length)]);
        console.log(s);
        let a = e["audio-features"].danceability,
          i = e["audio-features"].energy,
          r = e["audio-features"].valence;
        return await l(s, a, i, r);
      } catch (c) {
        return console.log(c), null;
      }
    }
  }),
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
