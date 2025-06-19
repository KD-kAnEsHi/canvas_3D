from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import shutil
import os
import uuid

app = FastAPI()

# Allow React frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.mount("../", StaticFiles(directory="models"), name="models")

@app.post("/upload-sketch/")
async def upload_sketch(file: UploadFile, description: str = Form(...)):
    print("Received description:", description)

    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    sketch_path = os.path.join(uploads_dir, file.filename)

    with open(sketch_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # TODO: Replace this with real model generation
    dummy_model_filename = "32770.stl"
    model_path = f"../canvas_3D/data/Thingi10K/raw_meshes/{dummy_model_filename}"

    return JSONResponse(content={"model_url": model_path})
