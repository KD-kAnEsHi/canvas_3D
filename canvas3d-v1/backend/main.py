# main.py

from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os, shutil

from clip_utils import get_image_embedding, get_text_embedding
from matching import load_embeddings, compute_combined_embedding, find_best_match, copy_stl_to_output

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/output", StaticFiles(directory="output"), name="output")

@app.post("/upload-sketch/")
async def upload_sketch(
    file: UploadFile,
    description: str = Form(...),
    style: str = Form(...)
):
    upload_dir = "upload"
    os.makedirs(upload_dir, exist_ok=True)
    sketch_path = os.path.join(upload_dir, file.filename)

    with open(sketch_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # compute embeddings
    image_emb = get_image_embedding(sketch_path)
    text_emb = get_text_embedding(description)
    style_emb = get_text_embedding(style)

    # combine and match
    combined_emb = compute_combined_embedding(image_emb, text_emb, style_emb)
    stl_embeddings = load_embeddings()
    best_match = find_best_match(combined_emb, stl_embeddings)

    if not best_match:
        return JSONResponse(content={"error": "No match found."}, status_code=500)

    output_name = copy_stl_to_output(best_match)
    return JSONResponse(content={"model_url": f"/output/{output_name}"})
