const OPENAI_API_KEY = "sk-proj-lKIBXlJGJI0lQ7CgzB9gT3BlbkFJ9ptXykabwGdtgHOfJZPH"
// const GOOGLE_API_KEY = "AIzaSyCpVQ1QnnWN1KY_BymkyM-WyJT57-ywvqw"

import OpenAI from "openai";
import prompt from "prompt-sync"

const openai = new OpenAI({apiKey: OPENAI_API_KEY});

export default async function queryApi(messageStr) {
    const completion = await openai.chat.completions.create({
        messages: [{role: "system", content: `${messageStr}`}],
        model: "gpt-4o",
    });

    return completion.choices[0]["message"]["content"];
}
