document.addEventListener('DOMContentLoaded', () => {
    fetch('/get_default_info')
        .then(response => response.json())
        .then(data => {
            document.getElementById('text-input').value = data.text_segment;
            document.getElementById('structure-input').value = JSON.stringify(data.flashcard_structure, null, 4);
            document.getElementById('instructions-input').value = data.instructions;
            document.getElementById('tags-input').value = data.tags_suggested;
            document.getElementById('image-path-input').value = data.image_path_format;
            document.getElementById('expected-output-input').value = JSON.stringify(data.expected_output_example, null, 4);
        })
        .catch(error => {
            console.error('Error loading default info:', error);
        });
});

function showSection(sectionId) {
    document.getElementById('prompt-section').style.display = 'none';
    document.getElementById('upload-section').style.display = 'none';

    document.getElementById(sectionId).style.display = 'block';
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    document.querySelector(`#${tabId}`).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');
}

function generatePrompt() {
    const text = document.getElementById('text-input').value;
    const structure = document.getElementById('structure-input').value;
    const instructions = document.getElementById('instructions-input').value;
    const tags = document.getElementById('tags-input').value;
    const imagePath = document.getElementById('image-path-input').value;
    const expectedOutput = document.getElementById('expected-output-input').value;
    const output = document.getElementById('output');

    const prompt = `
Please generate flashcards from the following text. Note that I am preparing for the Google Cloud Professional Machine Learning Engineer certification, so the flashcards should focus on key concepts relevant to this certification:

${text}

### Flashcard Structure
${structure}

### Instructions
${instructions}

### Tags Suggested
${tags}

### Image Path Format
${imagePath}

### Expected Output Example
${expectedOutput}
    `;

    output.innerHTML = `<pre>${prompt}</pre>`;
}

function copyToClipboard() {
    const output = document.getElementById('output').innerText;
    navigator.clipboard.writeText(output).then(function() {
        alert('Prompt copied to clipboard!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

let currentCardIndex = 0;
let flashcards = [];

function startProcessing() {
    const jsonInput = document.getElementById('json-input').value;
    const deckName = document.getElementById('deck-name').value;
    const output = document.getElementById('output-json');

    if (!jsonInput || !deckName) {
        output.innerHTML = '<div class="alert alert-danger">Please provide both JSON input and deck name.</div>';
        return;
    }

    try {
        flashcards = JSON.parse(jsonInput);
        currentCardIndex = 0;
        document.getElementById('output-json').innerHTML = '';
        document.getElementById('progress-bar').style.width = '0%';
        document.getElementById('progress-bar').innerText = '0%';
        processNextFlashcard(deckName);
    } catch (e) {
        output.innerHTML = `<div class="alert alert-danger">Invalid JSON: ${e.message}</div>`;
    }
}

function cancelProcessing() {
    currentCardIndex = flashcards.length;
    document.getElementById('flashcard-container').innerHTML = '';
    document.getElementById('output-json').innerHTML = '<div class="alert alert-warning">Processing cancelled.</div>';
}

function processNextFlashcard(deckName) {
    if (currentCardIndex >= flashcards.length) {
        document.getElementById('output-json').innerHTML += '<div class="alert alert-success">All flashcards processed successfully!</div>';
        document.getElementById('flashcard-container').innerHTML = '';
        return;
    }

    const card = flashcards[currentCardIndex];
    displayFlashcard(card, deckName);
}

function displayFlashcard(card, deckName) {
    const flashcardContainer = document.getElementById('flashcard-container');
    flashcardContainer.innerHTML = `
        <h2>Step 3: Upload Image for Flashcard ${currentCardIndex + 1}</h2>
        <div class="card mb-4">
            <div class="card-body preview-container">
                <div class="text-container">
                    <h5 class="card-title">Question</h5>
                    <p class="card-text">${card.Question}</p>
                    <h5 class="card-title">Options</h5>
                    <ul>
                        <li>A: ${card.Option1}</li>
                        <li>B: ${card.Option2}</li>
                        <li>C: ${card.Option3}</li>
                        <li>D: ${card.Option4}</li>
                    </ul>
                    <h5 class="card-title">Answer</h5>
                    <p class="card-text">${card.Answer}</p>
                    <h5 class="card-title">Explanation</h5>
                    <p class="card-text">${card.Explanation}</p>
                    <h5 class="card-title">Tags</h5>
                    <p class="card-text">${card.Tags.join(", ")}</p>
                </div>
                <div class="image-container">
                    <img id="image-preview" src="" alt="No image uploaded">
                </div>
            </div>
        </div>
        <div class="form-group">
            <h5 class="card-title">Upload Image</h5>
            <input type="file" class="form-control-file" id="image-input" accept="image/*" onchange="previewImage()">
            <button class="btn btn-danger mt-2" onclick="removeImage()">Remove Image</button>
            <button class="btn btn-success mt-2" onclick="uploadImage('${deckName}')">Create Flashcard</button>
        </div>
        <div class="instructions">Ensure the image is correct before creating the flashcard. You can remove and upload a new image if needed.</div>
    `;
}

function previewImage() {
    const imageInput = document.getElementById('image-input').files[0];
    const imagePreview = document.getElementById('image-preview');

    if (imageInput) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(imageInput);
    } else {
        imagePreview.src = "";
    }
}

function removeImage() {
    document.getElementById('image-input').value = "";
    document.getElementById('image-preview').src = "";
}

function uploadImage(deckName) {
    const imageInput = document.getElementById('image-input').files[0];
    if (!imageInput) {
        alert("Please select an image to upload.");
        return;
    }

    const formData = new FormData();
    formData.append('file', imageInput);

    fetch('/upload_image', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            flashcards[currentCardIndex].Image = data.filename;
            addFlashcard(deckName);
        } else {
            alert("Error uploading image: " + data.message);
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
    });
}

function addFlashcard(deckName) {
    const card = flashcards[currentCardIndex];
    fetch('/add_flashcards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            deck_name: deckName,
            flashcards: [card]
        })
    })
    .then(response => response.json())
    .then(data => {
        const output = document.getElementById('output-json');
        data.forEach(result => {
            const statusClass = result.status === 'success' ? 'alert-success' : (result.status === 'duplicate' ? 'alert-warning' : 'alert-danger');
            output.innerHTML += `<div class="alert ${statusClass}">${result.message} for card: ${card.Question}</div>`;
        });
        updateProgress();
        currentCardIndex++;
        processNextFlashcard(deckName);
    })
    .catch(error => {
        const output = document.getElementById('output-json');
        output.innerHTML += `<div class="alert alert-danger">Error: ${error.message} for card: ${card.Question}</div>`;
    });
}

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentCardIndex + 1) / flashcards.length) * 100;
    progressBar.style.width = progress + '%';
    progressBar.innerText = Math.round(progress) + '%';
}

function saveDefaultInfo() {
    const data = {
        text_segment: document.getElementById('text-input').value,
        flashcard_structure: JSON.parse(document.getElementById('structure-input').value),
        instructions: document.getElementById('instructions-input').value,
        tags_suggested: document.getElementById('tags-input').value,
        image_path_format: document.getElementById('image-path-input').value,
        expected_output_example: JSON.parse(document.getElementById('expected-output-input').value)
    };

    fetch('/update_default_info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Default information updated successfully!');
        } else {
            alert('Failed to update default information.');
        }
    })
    .catch(error => {
        console.error('Error updating default info:', error);
    });
}

document.addEventListener('paste', function(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function(e) {
                const imagePreview = document.getElementById('image-preview');
                imagePreview.src = e.target.result;
                const imageInput = new File([blob], `${generateTimestamp()}.png`, { type: blob.type });
                document.getElementById('image-input').files = createFileList(imageInput);
            };
            reader.readAsDataURL(blob);
        }
    }
});

function createFileList(file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
}

function generateTimestamp() {
    const now = new Date();
    return `${now.getFullYear()}${padZero(now.getMonth() + 1)}${padZero(now.getDate())}_${padZero(now.getHours())}${padZero(now.getMinutes())}${padZero(now.getSeconds())}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}
