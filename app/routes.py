import os
import json
import base64
import requests
from flask import Blueprint, request, jsonify, render_template, current_app

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part in the request"})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"})
    
    if file:
        filename = file.filename
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"status": "success", "filename": filename})

@main.route('/add_flashcards', methods=['POST'])
def add_flashcards():
    data = request.json
    deck_name = data['deck_name']
    flashcards = data['flashcards']
    
    results = []
    for card in flashcards:
        result = add_flashcard(
            deck_name,
            card['Question'],
            card['Option1'],
            card['Option2'],
            card['Option3'],
            card['Option4'],
            card['Answer'],
            card['Explanation'],
            card.get('Image', ''),
            card['Tags']
        )
        results.append(result)
    
    return jsonify(results)

@main.route('/get_default_info')
def get_default_info():
    try:
        with open(os.path.join(current_app.static_folder, 'default_info.json')) as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@main.route('/update_default_info', methods=['POST'])
def update_default_info():
    try:
        data = request.json
        with open(os.path.join(current_app.static_folder, 'default_info.json'), 'w') as f:
            json.dump(data, f, indent=4)
        return jsonify({"status": "success", "message": "Default information updated successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

def add_flashcard(deck_name, question, option1, option2, option3, option4, answer, explanation, image_filename, tags):
    url = 'http://localhost:8765'
    headers = {'Content-Type': 'application/json'}

    encoded_image = None
    if image_filename:
        image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], image_filename)
        if os.path.exists(image_path):
            with open(image_path, "rb") as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

            store_media_payload = {
                "action": "storeMediaFile",
                "version": 6,
                "params": {
                    "filename": image_filename,
                    "data": encoded_image
                }
            }
            response = requests.post(url, headers=headers, data=json.dumps(store_media_payload))
            if response.status_code != 200 or response.json().get('error') is not None:
                return {"status": "error", "message": f"Error al subir la imagen: {response.json()}"}
        else:
            return {"status": "error", "message": f"Error: la imagen {image_path} no existe."}

    create_deck_payload = {
        'action': 'createDeck',
        'version': 6,
        'params': {
            'deck': deck_name
        }
    }
    response = requests.post(url, headers=headers, data=json.dumps(create_deck_payload))
    if response.status_code != 200 or response.json().get('error') is not None:
        return {"status": "error", "message": f"Error al crear la baraja: {response.json()}"}

    front_html = f"""
    <b>Pregunta:</b><br>
    {question}<br><br>
    <b>Opciones:</b><br>
    <ul>
        <li>A: {option1}</li>
        <li>B: {option2}</li>
        <li>C: {option3}</li>
        <li>D: {option4}</li>
    </ul>
    """
    back_html = f"""
    <b>Pregunta:</b><br>
    {question}<br><br>
    <b>Opciones:</b><br>
    <ul>
        <li>A: {option1}</li>
        <li>B: {option2}</li>
        <li>C: {option3}</li>
        <li>D: {option4}</li>
    </ul>
    <br>
    <b>Respuesta Correcta:</b> {answer}<br><br>
    <b>Explicación:</b> {explanation}
    """
    if image_filename:
        back_html += f"<br><br><img src='{image_filename}'>"

    add_note_payload = {
        'action': 'addNote',
        'version': 6,
        'params': {
            'note': {
                'deckName': deck_name,
                'modelName': 'Basic',
                'fields': {
                    'Front': front_html,
                    'Back': back_html
                },
                'options': {
                    'allowDuplicate': False
                },
                'tags': tags
            }
        }
    }
    response = requests.post(url, headers=headers, data=json.dumps(add_note_payload))
    if response.status_code != 200 or response.json().get('error') is not None:
        error_message = response.json().get('error')
        if 'cannot create note because it is a duplicate' in error_message:
            return {"status": "duplicate", "message": f"Flashcard already exists: {question}"}
        return {"status": "error", "message": f"Error al agregar la flashcard: {response.json()}"}
    
    return {"status": "success", "message": "Flashcard agregada con éxito"}
