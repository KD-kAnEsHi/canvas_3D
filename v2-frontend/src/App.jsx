import { useState } from 'react'
import Canvas from './component/Canvas.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='canvas_page'>
        <h1>Sketch to 3D Canvas</h1>
        <Canvas />
      </div>
      
      <div className='description'>

      </div>
    </>
  )
}
export default App