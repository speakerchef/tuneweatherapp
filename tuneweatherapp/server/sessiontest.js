import express from 'express';
import session from 'express-session';
import MongoStore from "connect-mongo";

const mongoURI = 'mongodb://localhost:27017/test';


const app = express()
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: mongoURI
    }),
}))

app.listen(5001, () => {
    console.log("server started on port 5001")
})

app.get('/home', (req, res) => {
    res.send("home")
    console.log(req.session.id)
})







