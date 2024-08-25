// dependencies: @google/generative-ai, express, body-parser, cors, dotenv
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

// Express server setup
const app = express();
app.use(bodyParser.json());

// to avoid cors error
app.use(cors({
    origin: 'https://chat-gemini-wine.vercel.app',
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type'], 
  }));;

// Gemini API key setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// send the array of object of models as JSON object to frontend
app.get('/models', async (req, res) => {
    try {
        const get_model_url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.API_KEY}`

        const response = await fetch(get_model_url);
        const data = await response.json();

        // solve duplicate Gemini-1.0 model name from request by using unique name
        const modelNames = data.models.map((item) => item.displayName);
        const modelNameSet = new Set(modelNames);
        const uniqueModelNames = [...modelNameSet];
        
        res.send(uniqueModelNames);
    } catch (error) {
        console.error("Error fetching models list:", error);
        res.status(500).send({ message: "Failed to get models list." }); 
    }
});



let model="gemini-1.5-flash", max_tokens = 50, temperature = 0.5, top_p = 0.9;

app.post("/postModel", async (req, res) => {
    model = req.body.model;
});



app.post("/postSlider", async (req, res) => {
    max_tokens = +req.body.max_tokens;
    temperature = +req.body.temperature;
    top_p = +req.body.top_p;
});



app.post("/", async (req, res) => {
    let userPrompt = req.body.userPrompt;

    // If userPrompt is present, make the OpenAI API call
    if (userPrompt) {
        try {
            const client = await genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                generationConfig: {
                    maxOutputTokens: max_tokens,
                    temperature: temperature,
                    topP: top_p
                },
            });
            const result = await client.generateContent(userPrompt);
            const response = await result.response;
            const text = response.text();
            console.log(text);

            res.send({
                gpt: text
            });
        } catch (err) {
            console.error(err);
            res.send({
                gpt: err
            });
        }
    }
});



const port = 5174;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
