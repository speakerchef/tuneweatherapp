//
//
//
//
// let trackUris = 'spotify%3Atrack%3A1O5NK7yqhQGTGySBAOEVJg,spotify%3Atrack%3A5nzhL67GpF9szXWg5y509A,spotify%3Atrack%3A7fLvwshMQrWbUNTdufN8Je,spotify%3Atrack%3A0EFyu4Ayh58pnqFGJXIwij,spotify%3Atrack%3A1SC5rEoYDGUK4NfG82494W,spotify%3Atrack%3A03pUMeqVUQrv0XtP81ALFa,spotify%3Atrack%3A20D5VNSZY8pnFEPVErdL2U,spotify%3Atrack%3A6htI7rbBrWFEVI1qqVaU3u,spotify%3Atrack%3A4AucdOLEtLrUWlQUZdj8Wa,spotify%3Atrack%3A7l9IqDtVWJurTvkQHq1BGh'
//
// console.log(trackUris.replaceAll('%3A',':').split(','))
//
//
//
// //3lOK4sXpYNqvJHSMK3oLcN
//
//

import {client_id} from "../config.js";

const expires_in = 10*1000;
const date_issued = Date.now()

setTimeout(() => {
    if (Date.now() - date_issued >= expires_in){
        console.log(Date.now() - date_issued)
        console.log("Token has expired")
    } else {
        console.log("Token has not expired")
    }
}, 10000)





app.get('/refresh-token', async (req, res) => {
    console.error("THIS IS THE REFRESH TOKEN CHECKPOINT")
    const currentUser = await UserModel.collection.findOne({cookieId: req.session.id})
    if (currentUser) {
        const refreshToken = currentUser.refresh_token;
        const url = 'https://accounts.spotify.com/api/token'
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: client_id
            }),
        }

        const body = await fetch(url, payload);
        const response = await body.json();
        console.log(response)
        // await UserModel.collection.updateOne(
        //   { 'cookieId': currentUser.cookieId },
        //   {
        //     '$set': {
        //       'access_token': response.access_token,
        //       'expires_in': expires_in,
        //       'date_issued': Date.now(),
        //     },
        //   },
        // );


    }
})