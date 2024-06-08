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