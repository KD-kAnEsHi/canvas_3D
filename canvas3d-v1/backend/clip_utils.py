# clip_utils.py

import torch
import clip
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, preprocess = clip.load("ViT-B/32", device=device)

def get_image_embedding(image_path):
    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
    with torch.no_grad():
        embedding = clip_model.encode_image(image)
    return embedding[0].cpu().numpy()

def get_text_embedding(text):
    token = clip.tokenize([text]).to(device)
    with torch.no_grad():
        embedding = clip_model.encode_text(token)
    return embedding[0].cpu().numpy()
