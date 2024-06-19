import e from "axios";
import o from "dotenv";
import t from "express";
import s from "cors";
import * as n from "node:querystring";
import a from "mongoose";
import r from "express-session";
import i from "connect-mongo";
import c from "openai";
import l from "express-rate-limit";
import d from "cookie-parser";

o.config();
const u = process.env.client_id,
  p = process.env.client_secret,
  m = process.env.WEATHERAPI_TOKEN,
  g = process.env.session_secret,
  h = process.env.OPENAI_API_KEY,
  f = process.env.server_url,
  w = process.env.client_url,
  y = process.env.mongodbURI,
  v = new c({ apiKey: h }),
  _ = process.env.PORT || 5001,
  k = t();
let b, I;
a.connect(y, {}).then((e) => {
  console.log("MongoDB connected");
});
const x = new a.Schema({
    access_token: String,
    expires_in: Number,
    date_issued: Number,
    latitude: String,
    longitude: String,
    isLoggedIn: Boolean,
    needsRefresh: Boolean,
  }),
  O = a.model("Users", x);
k.use(d()),
  k.use(
    r({
      secret: g,
      resave: !1,
      saveUninitialized: !0,
      store: i.create({ mongoUrl: y }),
      cookie: { sameSite: "none", secure: !0, httpOnly: !0 },
    }),
  ),
  k.use(
    s({
      origin: [
        "https://tuneweather.com",
        "https://www.tuneweather.com",
        "https://api.tuneweather.com",
        "https://tuneweather.netlify.app" //Old URL
      ],
      credentials: !0,
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Set-Cookie"],
    }),
  ),
  k.options("*", s()),
  k.use(t.json()),
  k.use(t.urlencoded({ extended: !0 })),
  k.use(
    l({
      windowMs: 6e4,
      max: 50,
      message: {
          status: 429,
          message: "You have exceeded your quota",
          try_again: "1 minute from error"
      }
    }),
  ),
  k.use((e, o, t) => {
    console.log("Request made from: ", e.sessionID), t();
  }),
  k.set("trust proxy", 1);
k.delete("/logout", async (e, o) => {
  (await O.collection.findOne({ _id: e.sessionID }))
    ? (await O.collection.deleteOne({ _id: e.sessionID }),
      console.log(`User session ${e.sessionID} deleted`),
      e.session.destroy(),
      o.status(200).json({ message: "User deleted" }))
    : console.log("User does not exist");
});
const $ = `${f}/callback`;
k.post("/login", async (e, o) => {
  console.log("saved user session", e.sessionID);
  const t = await O.collection.findOne({ _id: e.sessionID });
  if (t) {
    if (!t.needsRefresh && t.isLoggedIn)
      return (
        console.log("user is authorized (cookie)"),
        void o.status(200).json({
          data: {
            status: 200,
            message: "User is logged in",
          },
        })
      );
  } else await O.collection.insertOne({ _id: e.sessionID });
  console.log("User is not authorized");
  const s = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: "code",
    client_id: u,
    scope:
      "user-read-private playlist-modify-private user-top-read",
    redirect_uri: $,
  })}`;
  console.log(s), o.status(200).json({ redirectLink: s });
}),
  k.get("/callback", async (o, t) => {
    console.log(`session id at oauth flow ${JSON.stringify(o.cookies)}`);
    const s = o.query.code,
      n = {
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${new Buffer.from(u + ":" + p).toString("base64").replace("=", "")}`,
        },
        data: { code: s, redirect_uri: $, grant_type: "authorization_code" },
      };
    try {
      const t = (await e(n)).data,
        s = t.access_token,
        r = 1e3 * t.expires_in;
      console.table(t),
        await O.collection.updateOne(
          { _id: o.sessionID },
          {
            $set: {
              access_token: s,
              expires_in: r,
              date_issued: Date.now(),
              isLoggedIn: !0,
              needsRefresh: !1,
            },
          },
        );
    } catch (e) {
      console.error(e.response ? e.response.status : e),
        t.status(500).json({ message: "Internal server error" });
    }
    t.redirect(`${w}/playlist`);
  }),
  k.post("/location", async (e, o) => {
    console.log("Query at location enpoint", e.query);
    const t = await O.collection.findOne({ _id: e.sessionID });
    if (
      ((b = e.query.latitude),
      (I = e.query.longitude),
      console.log(b, I),
      b && I)
    ) {
      console.log("User coords: " + b, I);
      const o = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${b}&longitude=${I}`,
        ),
        s = (await o.json()).locality;
      console.log(s),
        t
          ? t.latitude && t.longitude
            ? console.log("location exists")
            : (await O.collection.updateOne(
                { _id: e.sessionID },
                {
                  $set: {
                    latitude: b,
                    longitude: I,
                  },
                },
              ),
              console.log("Existing user's location updated"))
          : (await O.collection.insertOne({
              _id: e.sessionID,
              latitude: b,
              longitude: I,
            }),
            console.log(`New user created with id: ${e.sessionID}`),
            (e.session.location = !0));
    } else o.status(418).json("Error: Coordinates not provided");
  }),
  k.get(
    "/tracks",
    async (e, o, t) => {
      const s = e.sessionID;
      if (s) {
        const n = await O.collection.findOne({ _id: s });
        n
          ? !n.isLoggedIn || n.needsRefresh
            ? (console.error("user access has expired"),
              o
                .status(403)
                .json({
                  error: { message: "Your access has expired, please login" },
                }))
            : (console.log("User has passed validation check"), t())
          : (console.error("User does not exist"),
            o.status(403).json({
              error: {
                session: e.sessionID,
                message: "User not found for the given session",
              },
            }));
      } else
        o.status(403).json({ error: { message: "No session id provided" } });
    },
    async (e, o, t) => {
      console.log("User at token expiry check: ", e.sessionID);
      const s = await O.collection.findOne({ _id: e.session.id });
      if (s) {
        let n = Date.now() - s.date_issued;
        console.log("Date difference:", n),
          n >= s.expires_in
            ? (await O.collection.updateOne(
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
            : t();
      } else
        console.error("Issue at token expiry"),
          o.status(401).json({
            error: {
              status: 401,
              message: "Unauthorized, please login",
            },
          });
    },
    async (o, t) => {
      console.log(
        "session stored in DB",
        await O.collection.findOne({ _id: o.session.id }),
      );
      try {
        const n = await (async function () {
            let t = await (async function () {
              try {
                const t = await O.collection.findOne({ _id: o.sessionID }),
                  s = await e.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${await t.latitude}&lon=${await t.longitude}&appid=${m}`,
                  ),
                  n = s.data.weather.description,
                  a = s.data.main.temp;
                return await (async function (e, o) {
                  if (!e && !o)
                    return void console.error(
                      "Cannot retrieve track features: Weather information is missing",
                    );
                  try {
                    let t = await (async function (e) {
                      try {
                        return (
                          await v.chat.completions.create({
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
                      `what danceability, energy, and valence do ${await e} weather conditions with a temperature of ${await o}c evoke? Give me results in a JSON format that i can pass to spotify's api to give me music recommendations based on the audio features. Only return the JSON file with the audio features and no additional text or links. Make sure to ALWAYS title the features field "audio-features". Also, I would like you to base the values not explicity based on the weather condition and temperature provided, but also based on me being able to provide accurate recommendations to the users. Cloudy, rainy, stormy weather and all weather associated with those conditions will tend to have lower danceability energy and valence values. Sunny, clear, hot weather will tend to have higher values overall. Make your recommendations based on this informations.`,
                    );
                    return (
                      (t = t
                        .replace("```", "")
                        .replace("json", "")
                        .replace("```", "")
                        .trim()),
                      JSON.parse(t)
                    );
                  } catch (e) {
                    return console.log(e), null;
                  }
                })(n, a - 273);
              } catch (e) {
                return (
                  console.error(e),
                  console.error("Weather data could not be fetched"),
                  null
                );
              }
            })();
            t ||
              (console.error("No track features could be generated."),
              (t = {
                "audio-features": {
                  danceability: 0.6,
                  energy: 0.7,
                  valence: 0.5,
                },
              }));
            console.log(t);
            try {
              let e = await (async function () {
                  try {
                    const e = await s("v1/me/top/tracks?limit=50", "GET");
                    let o = [];
                    if (e)
                      for (let t = 0; t < 50; t++) {
                        let s = await e.items[t].id;
                        o.push(await s);
                      }
                    return o;
                  } catch (e) {
                    return console.log(e), null;
                  }
                })(),
                o = [];
              e ||
                (console.error(
                  "Top tracks could not be fetched, moving to backup method",
                ),
                (e = await (async function () {
                  let e = await s("v1/browse/new-releases?limit=10", "GET");
                  (e = (await e).albums.items), (e = e.map((e) => e.id));
                  const o = new URLSearchParams({ ids: e });
                  let t = await s(`v1/albums?${o}`, "GET");
                  return (
                    (t = (await t).albums),
                    (t = t.map((e) => e.tracks.items[0].id)),
                    t
                  );
                })()));
              for (let t = 0; t < 5; t++)
                o.push(e[Math.floor(Math.random() * e.length)]);
              console.log(o);
              const n = t["audio-features"].danceability,
                a = t["audio-features"].energy,
                r = t["audio-features"].valence;
              return await (async function (e, o, t, n, a = 20) {
                const r = new URLSearchParams({
                  seed_tracks: e,
                  target_danceability: o,
                  targe_energy: t,
                  target_valence: n,
                  limit: a,
                });
                try {
                  const e = s(`v1/recommendations?${r}`, "GET");
                  let o = [];
                  for (let t = 0; t < a; t++)
                    o.push(
                      { name: (await e).tracks[t].name },
                      { artist: (await e).tracks[t].album.artists[0].name },
                      { image: (await e).tracks[t].album.images[1].url },
                      { link: (await e).tracks[t].external_urls },
                      { uri: (await e).tracks[t].uri },
                    );
                  return o;
                } catch (e) {
                  return (
                    console.log(e.response),
                    console.log("Recommened tracks could not be fetched"),
                    null
                  );
                }
              })(o, n, a, r);
            } catch (e) {
              return console.log(e), null;
            }
          })(),
          a = await (async function (e) {
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
              return void console.error(
                "Username or track recommedations could not be retrieved",
              );
            let t;
            console.log(o);
            const n = "v1/me/playlists",
              a = {
                name: `Playlist for ${o} by TuneWeather`,
                description: "A Playlist by the TuneWeather App",
                public: !1,
              },
              r = await s(n, "POST", a);
            let i;
            if (!e) return void console.log("Could not create playlist");
            (i = e
              .map((e) => (void 0 !== e.uri ? e.uri : ""))
              .filter((e) => "" !== e)),
              (t = await r.id),
              console.log("playlist id", t);
            try {
              return (
                await s(`v1/playlists/${t}/tracks?uris=${i.join(",")}`, "POST"),
                console.log("Items have been added"),
                t
              );
            } catch (e) {
              return console.log(e), null;
            }
          })(n);
        t.status(201).json({ data: { message: "success", playlist_id: a } });
      } catch (e) {
        t.status(500).json({ error: { message: "Internal server error" } }),
          console.error("Error fetching tracks"),
          console.error(e);
      }

      async function s(e, t, s) {
        const n = await O.collection.findOne({ _id: o.session.id });
        if (n)
          try {
            const o = await fetch(`https://api.spotify.com/${e}`, {
              headers: { Authorization: `Bearer ${await n.access_token}` },
              method: t,
              body: JSON.stringify(s),
            });
            return await o.json();
          } catch (e) {
            return (
              console.error("spotify API could not be reached"),
              console.error(e),
              null
            );
          }
        else console.log("User not found");
      }
    },
  ),
  k.listen(_, () => {
    console.log(`Server is running on http://localhost:${_}`);
  });
