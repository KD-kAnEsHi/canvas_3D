# api.py  ──────────────────────────────────────────────────────────
# FastAPI wrapper around generate_cloud_point.py
# • Saves the uploaded sketch to  uploads/<uuid>.png
# • Runs generate_cloud_point.py  →  static/models/<uuid>.ply
# • Echoes *all* stdout / stderr from the child process
# • Returns {"model_url": "/static/models/<uuid>.ply"} on success
# • Returns HTTP-500 with the captured traceback on failure
# -----------------------------------------------------------------
import uuid
import subprocess
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# ─────────────────────────────── FastAPI + CORS
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # front-end dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────── folders  (created if missing)
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("static/models")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")


# ─────────────────────────────── main endpoint
@app.post("/generate")
async def generate_model(
    image: UploadFile = File(...),
    description: str = Form("")        # description is optional text
):
    # 1) persist incoming sketch
    image_id   = uuid.uuid4().hex
    image_path = UPLOAD_DIR  / f"{image_id}.png"
    model_path = OUTPUT_DIR / f"{image_id}.ply"
    model_url  = f"/static/models/{image_id}.ply"

    with image_path.open("wb") as f:
        f.write(await image.read())

    print(f"[backend] received sketch  → {image_path}")
    print(f"[backend] description      → “{description}”")

    # 2) launch Point-E generator and capture *everything*
    cmd = [
        "python3",
        "generate_cloud_point.py",  # make sure this file is alongside api.py
        str(image_path),
        str(model_path),
    ]
    result = subprocess.run(cmd, text=True, capture_output=True)

    # 3) forward the child process logs to our console
    print("\n[subprocess-stdout]\n", result.stdout)
    print("\n[subprocess-stderr]\n", result.stderr)

    # 4) non-zero exit → HTTP-500 (message goes back to React)
    if result.returncode != 0:
        raise HTTPException(
            status_code=500,
            detail=f"Model generation failed:\n{result.stderr}"
        )

    # 5) success → return the relative URL the front-end viewer can fetch
    return {"model_url": model_url}
