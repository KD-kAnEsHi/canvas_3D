import torch
import clip
import numpy as np
import pickle
from PIL import Image
import os

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def compute_clip_embedding(image_path):
    image = preprocess(Image.open(image_path()).unsqueeze(0).to(device))    # converted 3d structurees into img
    text =                                                 # Inputted description from user, and style 

# IMPORTANT    
# @TODO Wehn user chooses a style have the model choose a specifc training data not just add the style in the description


    with torch.no_grad():
        embedding = model.encode_image(image)
    return embedding[0].cpu().numpy()
