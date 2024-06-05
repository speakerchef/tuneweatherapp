export const OPENAI_API_KEY = "sk-proj-lKIBXlJGJI0lQ7CgzB9gT3BlbkFJ9ptXykabwGdtgHOfJZPH"
export const SPOTIFY_AUTH_TOKEN = "BQDIHSYNYGhgh8duI-hjmFrOePo7rzM3vDDOGdTkVOlwwEl7IVE-l8-sSAIlFq2d8lIeRr9uNVbrEHPl5NqQm9tryL3q7p2ogjZ5e4sV2L7qPrN6Rj9DILCarqZ33jYz59IBhCQzSL2eWSHmz-Z0xsleNSqaSE1fSA70jFQe4Ge5GyHPB9EuKU71jz4UNNqnnodVzPdgz_iftqYr4e36A4yto5DRMlUvXGxuKkipiidBSBtMuUpf5vAjKRX6cEMs4aQlLGWyezRqcN-J5Gh1d2zj"
export const WEATHERAPI_TOKEN = "1459eb711f3843df97844058242805"
export const SPOTIFY_CLIENT_ID = "a4fcad31b33a473990e70cb0594be641"
export const SPOTIFY_CLIENT_SECRET = "1d9ff66edb394d6982c1ac9bec0339d8"

/*
mock audio features url: https://71242a6c-2412-43c5-ae45-0cc2b404d9ab.mock.pstmn.io
*/



// res.redirect(`?${querystring.stringify({
//     response_type: "code",
//     client_id: client_id,
//     scope: scope,
//     redirect_uri: redirect_uri,
// })}`)
// console.log(req.body)
//
// try{
//     app.get('/', (req, res) => {
//         const authCode = req.query.code
//
//         const authOption = {
//             url: 'https://accounts.spotify.com/api/token',
//             form: {
//                 code: authCode,
//                 redirect_uri: redirect_uri,
//                 grant_type: 'authorization_code',
//             },
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 Authorization: `Basic ${new Buffer.from(client_id + ':' + client_secret).toString('base64')}`,
//             },
//             json: true
//         }
//     })
// }catch(err){
//     console.log(err.response)
// }
//
// console.log(res.body)