from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pathlib import Path
import uuid
from fastapi.staticfiles import StaticFiles
import subprocess


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,  
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
    try:
        image_id = uuid.uuid4().hex
        image_path = UPLOAD_DIR / f"{image_id}.png"
        
        with image_path.open("wb") as f:
            f.write(await image.read())

        print(f"Received sketch: {image_path}")
        print(f"Received the description: {description}")
        
        model_path = OUTPUT_DIR / f"{image_id}.ply"
        model_url = f"/static/models/{image_id}.ply"
        
        result = subprocess.run(
            ["python3", "generate_cloud_point.py", str(image_path), str(model_path)], 
            check=True, 
            capture_output=True, 
            text=True
        )
        
        return {"model_url": model_url}
        
    except subprocess.CalledProcessError as e:
        print(f"Subprocess error: {e.stderr}")
        raise HTTPException(status_code=500, detail=f"Model generation failed: {e.stderr}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
