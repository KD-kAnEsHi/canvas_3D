import { useState } from 'react';
import SketchCanvas from './component/SketchCanvas.jsx';
import ModelViewer from './component/ModelViewer.jsx';
import './App.css'



function App() {
  const [description, setDescription] = useState("");
  const [imageBlob, setImageBlob] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);

  const handleGenerate = async () => {
    if (!imageBlob || !description.trim()) {
      alert("Please sketch and type a description before generating.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageBlob, "sketch.png");
    formData.append("description", description)

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setModelUrl(result.model_url);
    } catch (err) {
      console.log("Error: ", err);
      alert("failed to generate model.")
    }
  };


  return (
    <div className="canvas-app">
      <h1 className="title">Canvas-3D</h1>
       
      <div className='app'>
        <SketchCanvas 
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