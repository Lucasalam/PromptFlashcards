import os
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    UPLOAD_FOLDER = os.path.join(app.static_folder, 'uploaded_images')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    
    with app.app_context():
        from app import routes
        app.register_blueprint(routes.main)
    
    return app
