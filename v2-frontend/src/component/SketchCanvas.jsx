import { ReactSketchCanvas } from "react-sketch-canvas";
import React, { useRef, useState }  from "react";
import TextInput from "./Description";
import '../component/SketchCanvas.css'

export default function SketchCanvas ({setImageBlob, description, setDescription}) {
    const canvasRef = useRef();
    const [eraserMode, setEraser] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [backgroundImage, setBackgroundImage] = useState(null);

    const [strokeColor, setStrokeColor] = useState("#000000")
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [eraserWidth, setEraserWidth] = useState(10);

    const toggleEraserMode = () => {
        if (backgroundImage) {
            alert("Eraser doesn't work with background images. Please remove the background image first.");
            return;
        }
        const nextMode = !eraserMode;
        setEraser(nextMode);
        canvasRef.current.eraseMode(nextMode);
    };

    const handleExport = async () => {
        const dataUrl = await canvasRef.current.exportImage("png");
        const blop = await (await fetch(dataUrl)).blob();
        setImageBlob(blop);
    };

    const handlImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setBackgroundImage(url)
    };

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
                    <label>Image: </label>
                    <input type="file" accept="image/*" onChange={handlImage}/>
                </div>
            </div>

            <div className="button-row">
                <button onClick={() => canvasRef.current.clearCanvas()}>
                    Clear
                </button>

                <button onClick={() => {
                    canvasRef.current.resetCanvas();
                    setBackgroundImage(null);
                    setBackgroundColor("#ffffff");
                }}>
                    Reset
                </button>

                <button onClick={() => canvasRef.current.undo()}>
                    Undo
                </button>

                <button onClick={() => canvasRef.current.redo()}>
                    Redo
                </button>

                <button onClick={toggleEraserMode}>
                    {eraserMode ? "Switch to Draw" : "Switch to Erase"}
                </button>

                <button onClick={() =>{
                    setBackgroundImage(null);
                    setBackgroundColor("#ffffff");
                }} >
                    Remove Background Image
                </button>
            </div>

            <ReactSketchCanvas 
                className="canvas"
                ref={canvasRef}
                width="100%"
                height="800px"
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                eraserWidth={eraserWidth}
                canvasColor={backgroundColor}
                backgroundImage={backgroundImage}
                eraser={eraserMode}
            />

            <TextInput value={description} setValue={setDescription} />
        </div>
    );
}
