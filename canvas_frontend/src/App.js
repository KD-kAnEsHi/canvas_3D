import { ReactSketchCanvas } from "react-sketch-canvas";
import React, { useRef } from "react";
import './App.css';



function App() {
  const canvasRef = useRef();

  const handleClear = () => {
    canvasRef.current.clearCanvas();
  }

  const handleSubmit = async () => {
    const dataUrl = await canvasRef.current.exportImage("png");
    const blob = await (await fetch(dataUrl)).blob();

    const formData = new FormData();
    formData.append("file", blob, "sketch.png");

    const response = await fetch("http://localhost:3000/upload-sketch/", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    alert(result.message || "Upload complete");
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

        <div style={{marginTop: 16}}>
          <button onClick={handleClear} style={{marginLeft: 10}}>Clear</button>
          <button onClick={handleSubmit}>Submit Sketch</button>
        </div>
    </div>
  );
}

export default App;
