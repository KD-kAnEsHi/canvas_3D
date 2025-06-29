import { useState, useRef } from 'react';
import SketchCanvas from './component/SketchCanvas.jsx';
import ModelViewer from './component/ModelViewer.jsx';
import './App.css';

function App() {
  const [description, setDescription] = useState("");
  const [imageBlob, setImageBlob] = useState(null);
  const [sketchModelUrl, setSketchModelUrl] = useState(null);
  const [textModelUrl, setTextModelUrl] = useState(null);
  const sketchRef = useRef();

  const handleGenerate = async () => {
    if (!sketchRef.current) return;

    const blob = await sketchRef.current.exportSketch();
    setImageBlob(blob);

    if (!description.trim() || !blob) {
      alert("Please sketch and type a description before generating.");
      return;
    }

    try {
      // send  the sketch to backend
      const sketchForm = new FormData();
      sketchForm.append("image", blob, "sketch.png");
      const sketchRes = await fetch("http://localhost:8000/generate/sketch", {
        method: "POST",
        body: sketchForm,
      });
      const sketchResult = await sketchRes.json();
      setSketchModelUrl(sketchResult.model_url);

      // send the description to backend
      const textRes = await fetch("http://localhost:8000/generate/text", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const textResult = await textRes.json();
      setTextModelUrl(textResult.model_url);

    } catch (err) {
      console.error("Error during generation:", err);
      alert("Failed to generate one or both models.");
    }
  };

  return (
    <div className="canvas-app">
      <h1 className="title">Canvas-3D</h1>
      <div className='app'>
        <SketchCanvas
          ref={sketchRef}
          setImageBlob={setImageBlob}
          description={description}
          setDescription={setDescription}
        />
        <div className='generate-button'>
          <button onClick={handleGenerate}>Generate 3D Model</button>
        </div>
        <div className="model-viewers">
          {sketchModelUrl && (
            <div>
              <h3>Model from Sketch</h3>
              <ModelViewer url={sketchModelUrl} />
            </div>
          )}
          {textModelUrl && (
            <div>
              <h3>Model from Text</h3>
              <ModelViewer url={textModelUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
