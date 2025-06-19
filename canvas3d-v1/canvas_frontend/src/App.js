// src/App.js
import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import "./App.css";
import ModelViewer from "./modelViewer";

function App() {
  const canvasRef = useRef();
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("realistic");
  const [modelUrl, setModelUrl] = useState(null);

  const handleClear = () => {
    canvasRef.current.clearCanvas();
  };

  const handleSubmit = async () => {
    const dataUrl = await canvasRef.current.exportImage("png");
    const blob = await (await fetch(dataUrl)).blob();

    const formData = new FormData();
    formData.append("file", blob, "sketch.png");
    formData.append("description", description);  // send separately
    formData.append("style", style);              // send separately

    const response = await fetch("http://localhost:3000/upload-sketch/", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.model_url) {
      const fullUrl = `http://localhost:3000${result.model_url}`;
      console.log("Received model URL:", fullUrl);
      setModelUrl(fullUrl);
    } else {
      alert("Failed to receive model.");
    }
  };

  return (
    <div className="App">
      <h1>Sketch to 3D Model - v1 Interface</h1>

      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={3}
        strokeColor="black"
        style={{ border: "1px solid #000", width: 850, height: 600 }}
      />

      <div style={{ marginTop: 15 }}>
        <textarea
          placeholder="Enter object description (e.g. 'robot dog with glowing eyes')"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          style={{ width: 500 }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label htmlFor="styleSelect"><strong>Select Style:</strong></label>
        <select
          id="styleSelect"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="realistic">Realistic</option>
          <option value="anime">Anime</option>
          <option value="cyberpunk">Cyberpunk</option>
          <option value="fantasy">Fantasy</option>
          <option value="steampunk">Steampunk</option>
          <option value="minimalist">Minimalist</option>
          <option value="voxel">Voxel</option>
          <option value="surreal">Surreal</option>
        </select>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleClear} style={{ marginRight: 10 }}>Clear</button>
        <button onClick={handleSubmit}>Submit Sketch</button>
      </div>

      <div style={{ marginTop: 34 }}>
        <h2>3D Model Viewer</h2>
        {/* ModelViewer is always shown, even if modelUrl is null */}
        <ModelViewer modelUrl={modelUrl} style={{ border: "1px solid #000", width: 850, height: 600 }} />
      </div>
    </div>
  );
}

export default App;
