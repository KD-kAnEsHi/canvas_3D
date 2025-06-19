# matching.py

import numpy as np
import pickle
import os
import shutil
import uuid
from config import IMAGE_WEIGHT, TEXT_WEIGHT, STYLE_WEIGHT

def load_embeddings(filepath="clip_embeddings.pkl"):
    with open(filepath, "rb") as f:
        return pickle.load(f)

def compute_combined_embedding(image_emb, text_emb, style_emb):
    return (
        IMAGE_WEIGHT * image_emb +
        TEXT_WEIGHT * text_emb +
        STYLE_WEIGHT * style_emb
    )

def find_best_match(combined_embedding, stl_embeddings):
    best_score = -1
    best_match = None

    for name, emb in stl_embeddings.items():
        score = np.dot(combined_embedding, emb) / (
            np.linalg.norm(combined_embedding) * np.linalg.norm(emb)
        )
        if score > best_score:
            best_score = score
            best_match = name

    return best_match

def copy_stl_to_output(best_match, source_dir="data", output_dir="output"):
    output_name = f"{uuid.uuid4().hex}.stl"
    os.makedirs(output_dir, exist_ok=True)
    shutil.copyfile(os.path.join(source_dir, best_match), os.path.join(output_dir, output_name))
    return output_name
