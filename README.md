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

 # Retail Collections Case Study Presentation

## Slide 1: Use Case: Contexto
"Hola a todos. Hoy les voy a presentar un estudio de caso sobre la optimización de las cobranzas en retail con un enfoque personalizado. El principal desafío que enfrentaba la empresa era la falta de eficiencia en el proceso de cobranza. No contaban con una segmentación adecuada de sus clientes, lo que hacía difícil aplicar estrategias personalizadas y, en consecuencia, afectaba la recuperación de la deuda.

Para resolver este problema, desarrollamos un modelo que combina información de Equifax con los datos transaccionales de la empresa. Con esto, logramos segmentar a los clientes de manera más precisa y definir estrategias de cobranza mucho más efectivas."

## Slide 2: Classifying Customer Payment Behavior
"Para construir el modelo, lo primero fue clasificar el comportamiento de pago de los clientes. Los dividimos en dos categorías principales: 'Paga' y 'No paga'. Esta clasificación se basa en su evolución en los días de atraso.

La categoría 'No paga' incluye a clientes que pasan a una mayor cantidad de días de atraso en el siguiente mes. 'Paga' incluye a aquellos que no aumentan su rango de días de atraso. También identificamos otros dos grupos: 'Indeterminado', que se refiere a los clientes que mantienen el mismo número de días de atraso, y 'Sin información', para aquellos sin cambios en su estatus.

Para el modelado, solo usamos las categorías 'Paga' y 'No paga', ya que simplifican el análisis y son las más relevantes para determinar acciones de cobranza."

## Slide 3: Custom Attribute Generation Process
"Con la base de datos proporcionada por el cliente, generamos más de 100 atributos en distintas temporalidades. Estos atributos están diseñados para explicar el comportamiento del cliente dentro de la institución.

La generación de estos atributos fue crucial porque nos permitió capturar patrones de comportamiento específicos y enriquecer el modelo. En otras palabras, esto nos da una visión más detallada del cliente y ayuda a personalizar las acciones de cobranza."

## Slide 4: Segments
"Basándonos en los días de atraso, segmentamos la cartera en cuatro grupos:

- **Current**: Clientes sin días vencidos.
- **Early Stage Delinquency**: Clientes con entre 1 y 30 días de atraso.
- **Mid-Stage Delinquency**: Clientes con entre 31 y 90 días de atraso.
- **Late Stage Delinquency**: Clientes con más de 90 días de atraso.

El segmento 'Current' es el más grande, concentrando el 93% de la población, con una tasa de pago del 88.7%. Estos segmentos nos permitieron identificar patrones de comportamiento y definir necesidades específicas en cada grupo."

## Slide 5: Strategy
"Para abordar la cobranza, implementamos dos estrategias de modelado:

1. En la primera estrategia, aplicamos un modelo de regresión logística para cada segmento.
2. En la segunda estrategia, utilizamos Machine Learning con el algoritmo LGBM, que incluyó la variable de segmentación y todas las características de la primera estrategia en un solo modelo.

Observamos que la segunda estrategia, el modelo de ML, mostró un mejor rendimiento en términos de lift en todos los segmentos. Esto significa que logramos una mayor precisión en la clasificación de los clientes según su probabilidad de pago."

## Slide 6: Custom Collection
"Para evaluar el impacto de los modelos personalizados frente a los genéricos, obtuvimos un lift del 25.4% en la cobranza al usar modelos personalizados.

Esta solución le permite a la empresa tener una visión más general de la probabilidad de pago en el mercado y dentro de la institución, aprovechando las características personalizadas. Esto es importante porque los modelos personalizados se adaptan mejor a las características específicas de cada cliente, maximizando las posibilidades de recuperación."

## Slide 7: Results
"Al analizar el impacto del modelo, observamos que en el segmento 'Current' logramos un lift del 5.4%, es decir, aumentamos en un 5.4% la cantidad de clientes que pagan a tiempo. Además, logramos disminuir el porcentaje de clientes en mora en los otros segmentos.

En resumen, este enfoque personalizado nos permitió obtener una visión más precisa del comportamiento de pago de los clientes, optimizar las estrategias de cobranza y mejorar la rentabilidad de la empresa."

## Slide 8: Conclusión
"Para concluir, la personalización es clave para optimizar la cobranza en el sector retail. Este caso de estudio demuestra que un enfoque basado en datos y en análisis predictivo puede generar resultados significativos.

Muchas gracias por su atención. Ahora, estoy abierto a responder cualquier pregunta o escuchar sus comentarios."

---

## English Version

## Slide 1: Use Case: Context
"Hello everyone. Today I’m going to present a case study on optimizing retail collections with a tailored approach. The main challenge the company faced was a lack of efficiency in the collection process. They didn’t have an adequate customer segmentation, which made it difficult to apply personalized strategies, affecting debt recovery.

To solve this problem, we developed a model that combines information from Equifax with the company’s transaction data. This allowed us to segment customers more precisely and define more effective collection strategies."

## Slide 2: Classifying Customer Payment Behavior
"To build the model, the first step was to classify customer payment behavior. We divided customers into two main categories: 'Pays' and 'Does Not Pay,' based on their evolution in days past due.

The 'Does Not Pay' category includes customers who move to a higher number of days past due in the following month. 'Pays' includes those who don’t increase their days past due. We also identified two other groups: 'Undetermined,' for customers who maintain the same number of days past due, and 'No Information,' for those with no changes in their status.

For modeling, we only used 'Pays' and 'Does Not Pay' as they simplify the analysis and are most relevant for determining collection actions."

## Slide 3: Custom Attribute Generation Process
"Using the data provided by the client, we generated over 100 attributes across different time periods. These attributes were designed to explain customer behavior within the institution.

Creating these attributes was crucial because it allowed us to capture specific behavior patterns and enrich the model. In other words, this gives us a more detailed view of each customer and helps to personalize collection actions."

## Slide 4: Segments
"Based on days past due, we segmented the portfolio into four groups:

- **Current**: Customers with no past due days.
- **Early Stage Delinquency**: Customers with 1 to 30 days past due.
- **Mid-Stage Delinquency**: Customers with 31 to 90 days past due.
- **Late Stage Delinquency**: Customers with more than 90 days past due.

The 'Current' segment is the largest, with 93% of the population, and a payment rate of 88.7%. These segments allowed us to identify behavior patterns and define specific needs for each group."

## Slide 5: Strategy
"To approach collections, we implemented two modeling strategies:

1. In the first strategy, we used a logistic regression model for each segment.
2. In the second strategy, we used Machine Learning with the LGBM algorithm, which included the segmentation variable and all features from the first strategy in a single model.

We observed that the second strategy, the ML model, performed better in terms of lift across all segments. This means we achieved a higher accuracy in classifying customers based on their payment probability."

## Slide 6: Custom Collection
"To evaluate the impact of personalized models versus generic models, we achieved a 25.4% lift in collections with personalized models.

This solution allows the company to have a more general view of the probability of payment in the market and within the institution, taking advantage of the personalized features. This is important because personalized models better adapt to the specific characteristics of each customer, maximizing the chances of recovery."

## Slide 7: Results
"When analyzing the model’s impact, we observed that in the 'Current' segment, we achieved a lift of 5.4%, meaning that 5.4% more customers paid on time. Additionally, we reduced the percentage of customers in default in the other segments.

In summary, this tailored approach allowed us to get a more accurate view of customer payment behavior, optimize collection strategies, and improve the company’s profitability."

## Slide 8: Conclusion
"To conclude, personalization is key to optimizing collections in the retail sector. This case study shows that a data-driven and predictive analysis approach can generate significant results.

Thank you very much for your attention. Now, I’m open to answer any questions or hear your comments."

