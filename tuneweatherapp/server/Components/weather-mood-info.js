import queryApi from "./openai-query.js"
import axios from "axios";
import {WEATHERAPI_TOKEN} from "../config.js";
// import {USER_LOCATION} from "./server.js";

export async function getWeatherConditions(){
    try {
        const res = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_TOKEN}&q=edmonton&aqi=yes`)
        const conditionsToPassToLLM = res.data["current"]["condition"]["text"];
        const tempToPassToLLM = res.data["current"].temp_c
        return await getTrackFeatures(conditionsToPassToLLM, tempToPassToLLM);

    } catch (err) {
        console.error(err["code"]);
        console.log("The requested m :(")
    }

}

// Gets
const getTrackFeatures = async (condition, temp) => {
    let moods = await queryApi(`what danceability, energy, and valence do ${await condition} weather conditions with a temperature of ${await temp}c evoke? Give me results in a JSON format that i can pass to spotify's api to give me music recommendations based on the audio features. Only return the JSON file with the audio features and no additional text or links. Make sure to ALWAYS title the features field "audio-features". Also, I would like you to base the values not explicity based on the weather condition and temperature provided, but also based on me being able to provide accurate recommendations to the users.`)
    moods = moods.replace("```", "").replace("json", "").replace("```", "").trim()
    return JSON.parse(moods)
}

console.log(await getWeatherConditions())