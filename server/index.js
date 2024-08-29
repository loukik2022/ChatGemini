// // dependencies: @google/generative-ai, express, body-parser, cors, dotenv
// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from 'dotenv';
// dotenv.config();

// // Express server setup
// const app = express();
// app.use(bodyParser.json());

// // to avoid cors error
// // CORS configuration
// const corsOptions = {
//     origin: '*', // Allow all origins
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
//   };

//   // Apply CORS middleware
//   app.use(cors(corsOptions));
// // app.use(cors({
// //     origin: 'https://chat-gemini-wine.vercel.app',
// //     methods: ['GET', 'POST', 'OPTIONS'],           
// //     allowedHeaders: ['Content-Type'],
// // }));;

// // // Handle OPTIONS preflight request
// // app.options('*', cors());

// // Gemini API key setup
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// // send the array of object of models as JSON object to frontend
// app.get('/models', async (req, res) => {
//     try {
//         const get_model_url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.API_KEY}`

//         const response = await fetch(get_model_url);
//         const data = await response.json();

//         // solve duplicate Gemini-1.0 model name from request by using unique name
//         const modelNames = data.models.map((item) => item.displayName);
//         const modelNameSet = new Set(modelNames);
//         const uniqueModelNames = [...modelNameSet];

//         res.send(uniqueModelNames);
//     } catch (error) {
//         console.error("Error fetching models list:", error);
//         res.status(500).send({ message: "Failed to get models list." });
//     }
// });



// let model = "gemini-1.5-flash", max_tokens = 50, temperature = 0.5, top_p = 0.9;

// app.post("/postModel", async (req, res) => {
//     model = req.body.model;
// });



// app.post("/postSlider", async (req, res) => {
//     max_tokens = +req.body.max_tokens;
//     temperature = +req.body.temperature;
//     top_p = +req.body.top_p;
// });



// app.post("/", async (req, res) => {
//     let userPrompt = req.body.userPrompt;

//     // If userPrompt is present, make the OpenAI API call
//     if (userPrompt) {
//         try {
//             const client = await genAI.getGenerativeModel({
//                 model: "gemini-1.5-flash",
//                 generationConfig: {
//                     maxOutputTokens: max_tokens,
//                     temperature: temperature,
//                     topP: top_p
//                 },
//             });
//             const result = await client.generateContent(userPrompt);
//             const response = await result.response;
//             const text = response.text();
//             console.log(text);

//             res.send({
//                 gpt: text
//             });
//         } catch (err) {
//             console.error(err);
//             res.send({
//                 gpt: err
//             });
//         }
//     }
// });



// const port = 5174;
// app.listen(port, () => {
//     console.log(`Listening at http://localhost:${port}`);
// });



///////////////////////////////////    V2



// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// app.use(bodyParser.json());

// // CORS configuration
// const corsOptions = {
//     origin: ['https://chat-gemini-wine.vercel.app', 'http://localhost:3000'],
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//     optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));

// // Gemini API key setup
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// // Store model parameters
// let modelParams = {
//     model: "gemini-1.5-flash",
//     max_tokens: 50,
//     temperature: 0.5,
//     top_p: 0.9
// };

// // GET /models endpoint
// app.get('/models', async (req, res) => {
//     try {
//         const get_model_url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.API_KEY}`;

//         const response = await fetch(get_model_url);
//         const data = await response.json();

//         // Solve duplicate Gemini-1.0 model name from request by using unique name
//         const modelNames = data.models.map((item) => item.displayName);
//         const modelNameSet = new Set(modelNames);
//         const uniqueModelNames = [...modelNameSet];

//         res.json(uniqueModelNames);
//     } catch (error) {
//         console.error("Error fetching models list:", error);
//         res.status(500).json({ message: "Failed to get models list." });
//     }
// });

// app.post("/postModel", (req, res) => {
//     modelParams.model = req.body.model;
//     res.status(200).json({ message: "Model updated successfully" });
// });

// app.post("/postSlider", (req, res) => {
//     const { max_tokens, temperature, top_p } = req.body;
//     modelParams = { ...modelParams, max_tokens, temperature, top_p };
//     res.status(200).json({ message: "Parameters updated successfully" });
// });

// app.post("/", async (req, res) => {
//     const { userPrompt } = req.body;

//     try {
//         const client = await genAI.getGenerativeModel({
//             model: modelParams.model,
//             generationConfig: {
//                 maxOutputTokens: modelParams.max_tokens,
//                 temperature: modelParams.temperature,
//                 topP: modelParams.top_p
//             },
//         });
//         const result = await client.generateContent(userPrompt);
//         const response = await result.response;
//         const text = response.text();
//         res.json({ gpt: text });
//     } 
//     catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "An error occurred while processing your request" });
//     }
// });

// export default app;

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
    origin: ['https://chat-gemini-wine.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Gemini API key setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Store model parameters
let modelParams = {
    model: "gemini-1.5-flash",
    max_tokens: 50,
    temperature: 0.5,
    top_p: 0.9
};

// GET /models endpoint
app.get('/models', async (req, res) => {
    try {
        const get_model_url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.API_KEY}`;

        const response = await fetch(get_model_url);
        const data = await response.json();

        const modelNames = data.models.map((item) => item.displayName);
        const modelNameSet = new Set(modelNames);
        const uniqueModelNames = [...modelNameSet];

        res.json(uniqueModelNames);
    } catch (error) {
        console.error("Error fetching models list:", error);
        res.status(500).json({ message: "Failed to get models list." });
    }
});

app.post("/postModel", (req, res) => {
    const { model } = req.body;
    console.log("Updating model to:", model);
    modelParams.model = model;
    res.status(200).json({ message: "Model updated successfully", currentModel: modelParams.model });
});

app.post("/postSlider", (req, res) => {
    const { max_tokens, temperature, top_p } = req.body;
    console.log("Updating parameters:", { max_tokens, temperature, top_p });
    modelParams = { ...modelParams, max_tokens: Number(max_tokens), temperature: Number(temperature), top_p: Number(top_p) };
    res.status(200).json({ message: "Parameters updated successfully", currentParams: modelParams });
});

app.post("/", async (req, res) => {
    const { userPrompt } = req.body;
    console.log("Received prompt:", userPrompt);
    console.log("Current model parameters:", modelParams);

    try {
        // const model = genAI.getGenerativeModel({ model: modelParams.model });
        
        // const result = await model.generateContent(userPrompt, {
        //     temperature: modelParams.temperature,
        //     topP: modelParams.top_p,
        //     maxOutputTokens: modelParams.max_tokens,
        // });

        // console.log("API Response:", JSON.stringify(result, null, 2));

        // if (!result.response) {
        //     throw new Error("No response from the API");
        // }

        // const text = result.response.text();
        // if (!text) {
        //     throw new Error("Empty response from the API");
        // }

        // res.json({ gpt: text });



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
            error: "An error occurred while processing your request", 
            details: err.message,
            modelParams: modelParams
        });
    }
});

export default app;