# generate_cloud_point.py
# ------------------------------------------------------------
# End-to-end: PNG sketch  → Point-E (300M + upsample) → PLY mesh
# ------------------------------------------------------------
import os, sys, torch, numpy as np, trimesh
from PIL import Image
from point_e.diffusion.configs  import DIFFUSION_CONFIGS, diffusion_from_config
from point_e.models.configs     import MODEL_CONFIGS,  model_from_config
from point_e.models.download    import load_checkpoint
from point_e.diffusion.sampler  import PointCloudSampler
from trimesh.points             import PointCloud as TrimeshPointCloud


def generate(sketch_path: str, out_path: str, *, device=None) -> None:
    # 0) choose device ------------------------------------------------------------------
    device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Point-E] using device: {device}")

    # 1) load the two models ------------------------------------------------------------
    base_name, upsampler_name = "base300M", "upsample"
    print("[Point-E] loading checkpoints …")
    base_model = model_from_config(MODEL_CONFIGS[base_name], device)
    base_model.load_state_dict(load_checkpoint(base_name, device)); base_model.eval()

    upsampler_model = model_from_config(MODEL_CONFIGS[upsampler_name], device)
    upsampler_model.load_state_dict(load_checkpoint(upsampler_name, device)); upsampler_model.eval()

    # 2) corresponding diffusion processes ---------------------------------------------
    base_diffusion      = diffusion_from_config(DIFFUSION_CONFIGS[base_name])
    upsampler_diffusion = diffusion_from_config(DIFFUSION_CONFIGS[upsampler_name])

    # 3) unified sampler (first 1024 coarse pts, then +3072 fine pts) -------------------
    sampler = PointCloudSampler(
        device=device,
        models=[base_model, upsampler_model],
        diffusions=[base_diffusion, upsampler_diffusion],
        num_points=[1024, 4096 - 1024],
        aux_channels=["R", "G", "B"],
        guidance_scale=[3.0, 0.0],            # strong image guidance only on first pass
    )

    # 4) read the user’s PNG/JPG sketch -------------------------------------------------
    if not os.path.exists(sketch_path):
        raise FileNotFoundError(f"Sketch not found: {sketch_path}")
    img = Image.open(sketch_path).convert("RGB")

    # 5) progressive sampling -----------------------------------------------------------
    print("[Point-E] sampling …")
    samples = None
    for s in sampler.sample_batch_progressive(
        batch_size=1,
        model_kwargs=[{"images": [img]}, {}],   # only the base needs the image
    ):
        samples = s
    if samples is None:
        raise RuntimeError("Point-E produced no samples")

    pc = sampler.output_to_point_clouds(samples)[0]   # (N ≈ 4096) points

    # 6) convert to trimesh.PLY ---------------------------------------------------------
    vertices = np.asarray(pc.coords)                 # (N,3) float32
    if all(k in pc.channels for k in ("R", "G", "B")):
        colors = np.stack([pc.channels["R"],
                           pc.channels["G"],
                           pc.channels["B"]], axis=1)         # (N,3) float32
        colors = (colors * 255).astype(np.uint8)
        cloud  = TrimeshPointCloud(vertices=vertices, colors=colors)
    else:
        cloud  = TrimeshPointCloud(vertices=vertices)

    tmp_ply = os.path.join(os.path.dirname(out_path), "_tmp_point_e.ply")
    cloud.export(tmp_ply, file_type="ply")           # ASCII PLY

    # 7) (optional) convex hull → watertight mesh ---------------------------------------
    print("[Trimesh] building convex hull …")
    mesh = trimesh.load(tmp_ply).convex_hull
    mesh.export(out_path)
    os.remove(tmp_ply)
    print(f"[✓] generated mesh written to {out_path}")


# --------------------------------------------------------------------- CLI entry point
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_cloud_point.py <sketch_path> <output_path>")
        sys.exit(1)

    sketch, output = sys.argv[1], sys.argv[2]
    os.makedirs(os.path.dirname(output), exist_ok=True)

    try:
        generate(sketch, output)
    except Exception as exc:
        print(f"Generation failed: {exc}")
        sys.exit(1)
