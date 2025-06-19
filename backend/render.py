import os
os.environ["PYOPENGL_PLATFORM"] = "osmesa" 

import pyrender
import trimesh

import matplotlib.pyplot as plt
import numpy as np


def render_mesh_img(input_path, output_path):
    # loading the mesh, this will take some sicne we are loading the whole dataset
    mesh = trimesh.load(input_path)
    scene = pyrender.Scene()
    mesh_node = pyrender.Mesh.from_trimesh(mesh)
    scene.add(mesh_node)

    light = pyrender.DirectionalLight(color=np.ones(3), intensity=3.0)
    scene.add(light)

    camera = pyrender.PerspectiveCamera(yfov=np.pi / 3.0)
    scene.add(camera, pose=np.eye(4))

    r = pyrender.OffscreenRenderer(viewport_height=520, viewport_width=520)
    color, _ = r.render(scene)
    r.delete()

    plt.imsave(output_path, color)


def render(data_dir="/Users/kazangue/CS-Files/Projects-Personal/New-Project/canvas_3D/data/Thingi10K/raw_meshes", output_dr="rendered"):
    os.makedirs(output_dr, exist_ok=True)

    for file in os.listdir(data_dir):
        if file.endswith(".stl"):
            input_path = os.path.join(data_dir, file)
            output_path = os.path.join(output_dr, file.replace(".stl", ".png"))

            print(f"Rendering file " ) # my overwhelm the terminal
            render_mesh_img(input_path, output_path)


if __name__ == "__main__":
    render()