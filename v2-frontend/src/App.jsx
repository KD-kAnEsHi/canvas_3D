import { useState, useRef} from 'react';
import SketchCanvas from './component/SketchCanvas.jsx';
import ModelViewer from './component/ModelViewer.jsx';
import './App.css'

function App() {
  const [description, setDescription] = useState("");
  const [imageBlob, setImageBlob] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const sketchRef = useRef();

  const handleGenerate = async () => {
    if (!sketchRef.current) return;
    
    const blob = await sketchRef.current.exportSketch();
    setImageBlob(blob);
    
    if (!description.trim() || !blob) {
      alert("Please sketch and type a description before generating.");
      return;
    }
    
    const formData = new FormData();
    formData.append("image", blob, "sketch.png");
    formData.append("description", description);
    
    try {
      const res = await fetch("http://localhost:8000/generate", { // CHANGED FROM 5000 TO 8000
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setModelUrl(result.model_url);
      console.log(result.model_url);
    } catch (err) {
      console.log("Error: ", err);
      alert("failed to generate model.");
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
          <button onClick={handleGenerate} > Generate 3D Model </button>
        </div>
        {modelUrl || true ? <ModelViewer url={modelUrl} /> : null}
      </div>
    </div>
  )
}

export default App