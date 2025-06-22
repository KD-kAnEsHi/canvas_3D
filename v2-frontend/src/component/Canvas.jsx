import { ReactSketchCanvas } from "react-sketch-canvas";
import React, { useRef, useState }  from "react";


export default function Canvas () {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [isErasing, setIsErase] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("#ffff");
    const [backgroundImage, setBackgroundImage] = useState(null);

    const [strokeWidth, setStrokeWidth] = useState(5);
    const [eraserWidth, setEraserWidth] = userState(10);

    const handleExport = async () => {
        const dataUrl = await canvasRef.current.exportImage("png");
        const blop = await (await fetch(dataUrl)).blob();
        setImageBlob(blop);
    }

    
}