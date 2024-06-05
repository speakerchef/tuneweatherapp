export const OPENAI_API_KEY = "sk-proj-lKIBXlJGJI0lQ7CgzB9gT3BlbkFJ9ptXykabwGdtgHOfJZPH"
export const SPOTIFY_AUTH_TOKEN = "BQAX9KV3uHNu4ClmkxI0g3AOzZFtYZRsys5jABFpUnL55AdwImQfZHocbuB4CzecT2vRPs9K5mPeSzcGPqkJV72IkB5GO9uEBvgKFnIBSebB15sevjja0xxw8JDw27Oc-DpY5tbcrc76rBuhT602siHlerh9ZF8GClYTnp-cjKy5RcAPN7vViJ3Zami5EzWQGB48PVzsjDk9998I-AESQye19AR6T7bfxr_FQ1nF"
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