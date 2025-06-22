import { ReactSketchCanvas } from "react-sketch-canvas";
import React, { useRef, useState }  from "react";
import '../component/Canvas.css'

export default function Canvas () {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [eraserMode, setEraser] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [backgroundImage, setBackgroundImage] = useState(null);

    const [strokeColor, setStrokeColor] = useState("#000000")
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [eraserWidth, setEraserWidth] = useState(10);

    /* const handleEraserMode(prop) {
            if 
    } */ 

    const handleExport = async () => {
        const dataUrl = await canvasRef.current.exportImage("png");
        const blop = await (await fetch(dataUrl)).blob();
        setImageBlob(blop);
    }

    const handlImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setBackgroundImage(url)
    }

    return (
        <div className="canvas-container">
            <div  className="controls">
                <div>
                    <label>Stroke Color: </label>
                    <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)}/>
                </div>
                <div>
                    <label>Stroke Width: </label>
                    <input type="range" min="1" max="40" value={strokeWidth} onChange={(e) => setStrokeWidth(parseInt(e.target.value))}/>
                </div>
                <div>
                    <label>Eraser Width: </label>
                    <input type="range" min="1" max="40" value={eraserWidth} onChange={(e) => setEraserWidth(parseInt(e.target.value))}/>
                </div>
                <div>
                    <label>Background Color: </label>
                    <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)}/>
                </div>
                <div>
                    <label>Backgroung Image: </label>
                    <input type="file" accept="image/*" onChange={handlImage}/>
                </div>
            </div>

            <div className="button-row">
                <button onClick={() => canvasRef.current.clearCanvas()}>
                    Clear
                </button>
                <button onClick={() => canvasRef.current.resetCanvas()}>
                    Reset
                </button>
                <button onClick={() => canvasRef.current.undo()}>
                    Undo
                </button>
                <button onClick={() => canvasRef.current.redo()}>
                    Redo
                </button>
                <button onClick={ToggleEvent}>
                    {eraserMode ? "Draw Mode" : "Eraser Mode"}
                </button>
            </div>

            <ReactSketchCanvas 
                className="canvas"
                ref={canvasRef}
                width="1000px"
                height="1000px"
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                eraserWidth={eraserWidth}
                canvasColor={backgroundColor}
                backgroundImage={backgroundImage}
                eraser={eraserMode}
            />
        </div>
    )
}