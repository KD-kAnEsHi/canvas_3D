from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Form
from pathlib import Path
import uuid

app = FastAPI()

# CORS configuration - moved right after app creation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend link
    allow_credentials=True,  # Added this line
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/generate")
async def generate_model(image: UploadFile = File(...), description: str = Form(...)):
    image_id = uuid.uuid4().hex
    image_path = UPLOAD_DIR / f"{image_id}.png"
    
    with image_path.open("wb") as f:
        f.write(await image.read())
    
    print(f"Received sketch: {image_path}")
    print(f"Received the description: {description}")
    
    # TODO: Generate model and return the model url
    return {"model_url": "/sample-models/sample_model.stl"}