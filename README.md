generative sketch to 3d application, where user can draw anything and have a 3d object of the highest quality generated. Bring your ideas to life

canvas3D-v1:
    This folder contains the first implementation of the project in which, user can sketch a drawing on a canvas and the program makes use of the OpenAI CLIP embedding model to identify the 3D object which best fits that sketch, text description and the selected style

canvas3D-v2: current iteration
    Makes use of the Openai point-e model to generate a 3D object for both the text and sketch inputted by the user. This model was choosen due to the fact that it can generate 3D objects in less than 3mins and with incredibly low compute time
    
    - The 3D object is then rendered through blender to increase the image quality
    https://github.com/openai/point-e
canvas3D-v2: In-development
    Makes use of a pretrained generative model, to generate a 3D object that best fit the user sketch, text description, and selected style. 
        - Combine the text and image input using the openai CLIP mode 
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
