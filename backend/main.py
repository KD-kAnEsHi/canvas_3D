# Using Fast API as the main API
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image 
import io
import os
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

os.makedirs("uploads", exist_ok=True)

@app.post("/upload-sketch/")
async def upload_sketch(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        filename = f"uploads/sketch-{timestamp}.png"
        image.save(filename)
        return {"message": f"sketch saved as {filename}"}

    except Exception as e:
        return { "error": str[e]}