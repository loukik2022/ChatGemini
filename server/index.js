import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// for API key from env
dotenv.config();

const app = express();
app.use(bodyParser.json());

// CORS configuration 
const corsOptions = {
    origin: 'https://chat-gemini-wine.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Gemini API key setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Model parameters
let modelParams = {
    model: "gemini-1.5-flash",
    max_tokens: 100,
    temperature: 0.5,
    top_p: 0.9
};

// Get models from Gemini API
app.get('/models', async (req, res) => {
    try {
        const get_model_url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.API_KEY}`;

        const response = await fetch(get_model_url);
        const data = await response.json();

        // create { displayName : name } map 
        const modelNameMap = new Map();
        for (const item of data.models) {
            if (!modelNameMap[item.displayName]) {
                modelNameMap[item.displayName] = item.name.split("models/")[1];
            }
        }

        res.json(modelNameMap);
    } catch (error) {
        console.error("Error fetching models list:", error);
        res.status(500).json({ message: "Failed to get models list." });
    }
});

// Update model changed from client
app.post("/postModel", (req, res) => {
    const { modelName } = req.body;
    // console.log("Updating model to:", modelName);
    modelParams.model = modelName;
    res.status(200).json({ message: "Model updated successfully", currentModel: modelParams.model });
});

// Update max_tokens, temperature, top_p changed from client
app.post("/postSlider", (req, res) => {
    const { max_tokens, temperature, top_p } = req.body;
    // console.log("Updating parameters:", { max_tokens, temperature, top_p });
    modelParams = { ...modelParams, max_tokens: Number(max_tokens), temperature: Number(temperature), top_p: Number(top_p) };
    res.status(200).json({ message: "Parameters updated successfully", currentParams: modelParams });
});

app.post("/", async (req, res) => {
    const { userPrompt } = req.body;
    // console.log("Received prompt:", userPrompt);
    // console.log("Current model parameters:", modelParams);

    try {
        const client = await genAI.getGenerativeModel({
            model: modelParams.model,
            generationConfig: {
                maxOutputTokens:  modelParams.max_tokens,
                temperature:  modelParams.temperature,
                topP:  modelParams.top_p,
            },
        });
        const result = await client.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);

        res.send({
            gpt: text
        });
    } 
    catch (err) {
        console.error("Error generating content:", err);
        res.status(500).json({ 
            error: "Gemini API error", 
            details: err.message,
            modelParams: modelParams
        });
    }
});

// when hit backend 
app.get('/', function(req, res) {
    res.send("Backend running");
});

// const port = 5174;
// app.listen(port, () => {
//     console.log(`Listening at http://localhost:${port}`);
// });

export default app;