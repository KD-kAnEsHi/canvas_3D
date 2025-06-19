import os
import pyrender
import trimesh
import matplotlib.pyplot as plt
import numpy as np


def render_mesh_img(input_path, output_path):
    mesh = trimesh.load(input_path)
    scene = pyrender.Scene()
    mesh_node = pyrender.Mesh.from_trimesh(mesh)
    scene.add(mesh_node)

    light = pyrender.DirectionalLight(color=np.ones(3), intensity=3.0)
    scene.add(light)

    camera = pyrender.PerspectiveCamera(yfov=np.pi / 3.0)
    camera_pose = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, -0.1],
        [0, 0, 1, 1.5],
        [0, 0, 0, 1],
    ])
    scene.add(camera, pose=camera_pose)

    r = pyrender.OffscreenRenderer(viewport_height=520, viewport_width=520)
    color, _ = r.render(scene)
    r.delete()

    plt.imsave(output_path, color)


def render(data_dir="data/Thingi10K/raw_meshes", output_dir="rendered"):
    os.makedirs(output_dir, exist_ok=True)

    for file in os.listdir(data_dir):
        if file.endswith(".stl"):
            input_path = os.path.join(data_dir, file)
            output_path = os.path.join(output_dir, file.replace(".stl", ".png"))

            print(f"Rendering file: {file}")
            render_mesh_img(input_path, output_path)


if __name__ == "__main__":
    render()
