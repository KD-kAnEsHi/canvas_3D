import { useState } from 'react'
import Canvas from './component/Canvas.jsx'
//import ModelViewer from './component/ModelViewer.jsx'
import TextInput from './component/Description.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [description, setDescription] = useState("");
  const [imageBlob, setImageBlob] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);

  return (
    <div>
      <h1 className="Title">Canvas-3D</h1>

      <div className='app'>
        <Canvas setImageBlob={setImageBlob} />
        <TextInput value={description} setValue={setDescription} />
        <button onClick={() => {/* backend */ }} >
          Generate 3D Model 
        </button>

        {modelUrl && <ModelViewer url={modelUrl} />}
      </div>
    </div>
  )
}
export default App