import React, { useState } from 'react';

const Slider = (props) => {
  const defaultValue = props.type === "max_tokens" ? 100 : props.type === "temperature" ? 0.5 : 0.9;
  const [sliderValue, setSliderValue] = useState(defaultValue);

  const handleSliderChange = async (event) => {
    const newValue = +event.target.value;
    const scaledValue = props.type === "temperature" || props.type === "top-p" ? newValue / event.target.max : newValue;
    setSliderValue(scaledValue);

    localStorage.setItem(props.type, scaledValue);
    const max_tokens = localStorage.getItem('max_tokens') || 100;
    const temperature = localStorage.getItem('temperature') || 0.5;
    const top_p = localStorage.getItem('top-p') || 0.9;

    fetch('https://chat-gemini-server.vercel.app/postSlider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        max_tokens,
        temperature,
        top_p
      })
    });
  };

  const max = props.type === "max_tokens" ? 250 : "temperature" || props.type === "top-p" ? 1 : 100;
  const step = props.type === "temperature" || props.type === "top-p" ? 0.01 : 1;
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "15%" }}>
      <input
        type="range"
        id={`slider-${props.id}`}
        min="0"
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleSliderChange}
        placeholder="Select a value"
        title="Slider"
      />
      <span style={{ marginLeft: '10px' }}>{sliderValue}</span>
    </div>
  );
};

export default Slider;
