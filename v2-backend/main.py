from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Form
from pathlib import Path
import uuid
from fastapi.staticfiles import StaticFiles
import subprocess


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend link
    #allow_credentials=True,  
    allow_methods=["*"],
    allow_headers=["*"],
)

# check if dir exits and creat new ones of not
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR = Path("static/models")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/generate")
async def generate_model(image: UploadFile = File(...), description: str = Form(...)):
    image_id = uuid.uuid4().hex
    image_path = UPLOAD_DIR / f"{image_id}.png"
    
    with image_path.open("wb") as f:
        f.write(await image.read())

    print(f"Received sketch: {image_path}")
    print(f"Received the description: {description}")
    
    model_path = OUTPUT_DIR / f"{image_id}.stl"
    model_url = f"/static/models/{image_id}.stl"
    subprocess.run(["python3", "generate_cloud_point.py", str(image_path), str(model_path)], check=True)

    return {"model_ul": model_url}
    
