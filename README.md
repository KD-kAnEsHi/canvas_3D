generative sketch to 3d application, where user can draw anything and have a 3d object of the highest quality generated. Bring your ideas to life

canvas3D-v1:
    This folder contains the first implementation of the project in which, user can sketch a drawing on a canvas and the program makes use of the OpenAI CLIP embedding model to identify the 3D object which best fits that sketch, text description and the selected style

canvas3D-v2: current iteration
    Makes use of a pretrained generative model, to generate a 3D object that best fit the user sketch, text description, and selected style. 
        - Make use of the pretrainied Magic3DSketch model
        - retrained the model on a new dataset "______" in other to increase range of the range of the model and its quality    
        - Improve quality during inferencing


# React-FastAPI-Flask

install:
node.js

npm


How to use:
cd. v2-frontend
command: npm run dev


pip install git+https://github.com/openai/point-e
pip install fastapi uvicorn python-multipart pillow torch trimesh
