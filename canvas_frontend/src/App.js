import { ReactSketchCanvas } from "react-sketch-canvas";
import React, { useRef, useState} from "react";
import './App.css';
import modelViewer from "./modelViewer";



function App() {
  const canvasRef = useRef();
  const [description, setDescription] = useState("");
  const [modelUrl, setModelUrl] = useState(null);

  const handleClear = () => {
    canvasRef.current.clearCanvas();
  }

  const handleSubmit = async () => {
    const dataUrl = await canvasRef.current.exportImage("png");
    const blob = await (await fetch(dataUrl)).blob();

    const formData = new FormData();
    formData.append("file", blob, "sketch.png");
    formData.append("description", description)

    const response = await fetch("http://localhost:8000/upload-sketch/", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.model_url) {
      setModelUrl(`http://localhost:8000${result.model_url}`);
    } else {
      alert("Failed to recieve model.")
    }
  };


  return (
    <div className="App">
      <h1>Sketch to 3D model - v1 Interface</h1>
      <ReactSketchCanvas
        ref = {canvasRef}
        strokeWidth = {3}
        strokeColor = "black"
        style = {{ border: "1px solid #000", width: 500, height: 400}}
      />
        <div style={{marginTop: 15}}>
          <textarea
            placeholder="Enter description (e.g. 'Make the sketch look hyperealistic')"
            value = {description}
            onChange = {(e) => setDescription(e.target.value)}
            rows = {2}
            style = {{width: 500}} 
          />
        </div>

        <div style={{marginTop: 16}}>
          <button onClick={handleClear} style={{marginLeft: 10}}>Clear</button>
          <button onClick={handleSubmit}>Submit Sketch</button>
        </div>

        { modelUrl && (
          <div style = {{ marginTop: 34}}>
              <h2>Generated 3D Model</h2>
              <modelViewer modelUrl={modelUrl}/>
          </div>
        )}
    </div>
  );
}

export default App;
