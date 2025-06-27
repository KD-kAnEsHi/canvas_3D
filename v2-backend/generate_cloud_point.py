import sys 
from PIL import Image
from point_e.diffusion.configs import DIFFUSION_CONFIGS, diffusion_from_config
from point_e.diffusion.sampler import PointCloudSampler
from point_e.models.download import load_checkpoint
from point_e.models.configs import MODEL_CONFIGS, model_from_config
import torch
import os
import trimesh

def generate(sketch_path, out_path):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Use the base40M-textvec model which is designed for image conditioning
    base_name = "base40M"
    model = model_from_config(MODEL_CONFIGS[base_name], device)
    model.eval()
    model.load_state_dict(load_checkpoint(base_name, device))
    
    # Create diffusion config
    diffusion = diffusion_from_config(DIFFUSION_CONFIGS[base_name])
    
    # Initialize sampler with consistent list formats
    sampler = PointCloudSampler(
        device=device,
        models=[model],
        diffusions=[diffusion],
        num_points=[512],
        aux_channels=['R', 'G', 'B'],
        guidance_scale=[3.0],
        use_karras=[True],
        karras_steps=[64],
        sigma_min=[0.0001],
        sigma_max=[1.0],
        s_churn=[3.0],
    )
    
    # Resize image to expected size
    sketch = Image.open(sketch_path).convert("RGB")
    sketch = sketch.resize((224, 224))
    
    # Generate point cloud samples
    samples = None
    for x in sampler.sample_batch_progressive(
        batch_size=1, 
        model_kwargs=dict(images=[sketch])
    ):
        samples = x
    
    pc = sampler.output_to_point_clouds(samples)[0]
    
    temp_ply = "temp_output.ply"
    
    # FIX: Open the file and pass the file handle, not the filename string
    with open(temp_ply, 'wb') as f:
        pc.write_ply(f)
    
    point_cloud = trimesh.load(temp_ply)
    mesh = point_cloud.convex_hull
    
    mesh.export(out_path)
    os.remove(temp_ply)

if __name__ == "__main__":
    sketch_path = sys.argv[1]
    output_stl = sys.argv[2]
    os.makedirs(os.path.dirname(output_stl), exist_ok=True)
    generate(sketch_path, output_stl)
