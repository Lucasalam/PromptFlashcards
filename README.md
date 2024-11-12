# Flashcard Generator and Uploader

## Descripción
Esta aplicación web permite generar flashcards a partir de un prompt y subir flashcards desde un archivo JSON a Anki.

## Instalación
1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/flashcard_generator.git
    cd flashcard_generator
    ```

2. Crea un entorno virtual:
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
    ```

3. Instala las dependencias:
    ```bash
    pip install -r requirements.txt
    ```

4. Ejecuta la aplicación:
    ```bash
    python run.py
    ```

## Uso
- Visita `http://127.0.0.1:5000/` en tu navegador para acceder a la aplicación.
- Usa las funcionalidades de "Flashcard from Prompt" y "Subir from JSON".

## Estructura del Proyecto
- `app/`: Contiene la aplicación Flask.
  - `__init__.py`: Inicializa la aplicación Flask.
  - `routes.py`: Define las rutas y las vistas de la aplicación.
  - `static/`: Contiene archivos estáticos como CSS, JavaScript e imágenes.
  - `templates/`: Contiene las plantillas HTML.
- `tests/`: Contiene los tests de la aplicación.
- `uploaded_images/`: Carpeta para las imágenes subidas por el usuario.
- `.gitignore`: Define los archivos y directorios que Git debe ignorar.
- `README.md`: Archivo de documentación del proyecto.
- `requirements.txt`: Lista de dependencias del proyecto.
- `run.py`: Archivo principal para ejecutar la aplicación Flask.

## Contribución
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza los cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Crea un nuevo Pull Request.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.


