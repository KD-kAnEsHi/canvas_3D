import sys 
from PIL import Image
from point_e.diffusion.configs import DIFFUSION_CONFIGS
from point_e.diffusion.sampler import PointCloudSampler
from point_e.models.download import load_checkpoint
import torch
import os
import trimesh

def generate(sketch_path, out_path):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    model = load_checkpoint('base40M', device)
    sampler = PointCloudSampler(
        model = model, 
        diffusions =  DIFFUSION_CONFIGS('base40M'),
        num_points = 2048, 
        aux_channels=['R', 'G', 'B'],
        guidance_scale=3.0,
        device=device
    )

    sketch = Image.open(sketch_path).conert("RGB")
    sample = sampler.sample_batch(texts=[""], images=[sketch], batch_size=2)
    pc = sampler.output_to_point_clouds(sample)[0]
    
    temp_ply = "temp_output.ply"
    pc.write_ply(temp_ply)

    point_cloud = trimesh.load(temp_ply)
    mesh = point_cloud.convex_hell
    mesh.export(out_path)
    os.remove(temp_ply)


if __name__ == "__main__":
    sketch_path = sys.argv[1]
    output_stl = sys.argv[2]
    os.makedirs(os.path.dirname(output_stl), exist_ok=True)
    generate(sketch_path, output_stl)




