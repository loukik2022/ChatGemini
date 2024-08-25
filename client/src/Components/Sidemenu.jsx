import { useState, useEffect } from "react";
import Slider from "./Slider.jsx";

const fetchModelsData = async () => {
   try {
      const response = await fetch("https://chat-gemini-server.vercel.app/models")
      const data = await response.json()
      return data;
   } catch (error) {
      console.log("Model list response error")
      console.error(error);
      return null;
   }
};

const fetchChangeModel = async (model) => {
   try {
      const response = await fetch("https://chat-gemini-server.vercel.app/postModel", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            model
         }),
      });
      const data = await response.json();
      // console.log(data);
      return data;
   } catch (error) {
      console.error(error);
      return null;
   }
};


export default function Sidemenu() {
   // state for retrieving models and storing in modelsData from the backend
   const [modelsData, setModelsData] = useState([]);
   // state for selecting and changing models from the drop down menu
   const [model, setModel] = useState("Gemini 1.5 Flash");


   // get models from the backend
   useEffect(() => {
      fetchModelsData().then(setModelsData);
   }, []);

   // change the models as selected by the user
   const handleModelsChange = (event) => {
      const selectedModel = event.target.value;
      fetchChangeModel(selectedModel);
      setModel(selectedModel);
      // console.log(selectedModel);
   };

   function handleClick() {
      localStorage.clear();
      window.location.reload();
   }

   return (
      <aside className="sidemenu">
         <div className="new-chat" onClick={handleClick}>
            <span>+</span>
            New chat
         </div>

         <div className="models">
            <div className="models-title">Models</div>
            {/* render modelsData list as drop down menu */}
            <select title={"Select a model"} value={model} onChange={handleModelsChange}>
               {modelsData.map(modelName => (
                  <option key={modelName} value={modelName}>{modelName}</option>
               ))}
            </select>
         </div>

         <div className="tokens">
            <div className="tokens-title">Tokens</div>
            <Slider type="max_tokens" id="1" />
         </div>

         <div className="temperature">
            <div className="temperature-title">Temperature</div>
            <Slider type="temperature" id="2" />
         </div>

         <div className="top-p">
            <div className="top-p-title">Top-p</div>
            <Slider type="top-p" id="3" />
         </div>
      </aside>
   )
}