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


WITH 
  -- 1. Crear intervalos dinámicos usando percentiles
  intervalos AS (
    SELECT
      APPROX_QUANTILES(variablenumerica, 10) AS bucket_edges
    FROM `proyecto.dataset.x`
  ),

  -- 2. Asignar valores a intervalos
  datos_discretizados AS (
    SELECT
      t.periodo,
      t.variablenumerica,
      ARRAY_POSITION(i.bucket_edges, 
        (SELECT MAX(edge) FROM UNNEST(i.bucket_edges) AS edge WHERE edge <= t.variablenumerica)
      ) AS bucket_id
    FROM `proyecto.dataset.x` t
    CROSS JOIN intervalos i
  ),

  -- 3. Calcular distribuciones por periodo
  distribuciones AS (
    SELECT
      periodo,
      bucket_id,
      COUNT(*) AS conteo,
      COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY periodo) AS distribucion
    FROM datos_discretizados
    GROUP BY periodo, bucket_id
  ),

  -- 4. Crear pares de periodos consecutivos
  pares_periodos AS (
    SELECT 
      d1.periodo AS periodo_base,
      d2.periodo AS periodo_comparacion,
      d1.bucket_id
    FROM distribuciones d1
    JOIN distribuciones d2
      ON d2.periodo = DATE_ADD(d1.periodo, INTERVAL 1 MONTH)
      AND d1.bucket_id = d2.bucket_id
  ),

  -- 5. Calcular PSI para cada bucket
  psi_calculo AS (
    SELECT
      p.periodo_base,
      "variablenumerica" AS nombre_variable,
      COALESCE((d1.distribucion - d2.distribucion) * LOG(d1.distribucion / d2.distribucion), 0) AS psi_bucket
    FROM pares_periodos p
    JOIN distribuciones d1
      ON p.periodo_base = d1.periodo AND p.bucket_id = d1.bucket_id
    JOIN distribuciones d2
      ON p.periodo_comparacion = d2.periodo AND p.bucket_id = d2.bucket_id
  ),

  -- 6. Sumar PSI por periodo base
  psi_por_periodo AS (
    SELECT
      periodo_base AS periodo,
      nombre_variable,
      SUM(psi_bucket) AS psi
    FROM psi_calculo
    GROUP BY periodo_base, nombre_variable
  )

-- 7. Resultados finales
SELECT 
  periodo,
  nombre_variable,
  psi
FROM psi_por_periodo
ORDER BY periodo;
