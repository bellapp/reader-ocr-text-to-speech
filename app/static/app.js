document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const processBtn = document.getElementById('processBtn');
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            processBtn.disabled = false;
            displayThumbnails(files);
        }
    });

    // Handle browse click
    document.querySelector('.browse-link').addEventListener('click', () => {
        fileInput.click();
    });

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        fileInput.files = files;
        if (files.length > 0) {
            processBtn.disabled = false;
            displayThumbnails(files);
        }
    });

    // Handle process button click
    processBtn.addEventListener('click', async () => {
        const files = fileInput.files;
        if (files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files[]', file);  // Changed to match Flask route's expected parameter
        });

        try {
            processBtn.disabled = true;
            processBtn.textContent = 'Processing...';

            const response = await fetch('/upload', {  // Changed to match your Flask route
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }

            showResults(result);

        } catch (error) {
            console.error('Error:', error);
            alert('Error processing images: ' + error.message);
        } finally {
            processBtn.disabled = false;
            processBtn.textContent = 'Process Images';
        }
    });

    function displayThumbnails(files) {
        thumbnailsContainer.innerHTML = '';
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.className = 'thumbnail';
                div.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <span>${file.name}</span>
                `;
                thumbnailsContainer.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    }

    function showResults(result) {
        const results = document.getElementById('results');
        const textContainer = document.getElementById('textContainer');
        const audioContainer = document.getElementById('audioContainer');

        results.style.display = 'block';

        // Display text
        if (result.text_file) {
            fetch(`/text/${result.text_file}`)
                .then(response => response.text())
                .then(text => {
                    textContainer.textContent = text;
                });
        }

        // Display audio
        if (result.audio_files && result.audio_files.length > 0) {
            audioContainer.innerHTML = result.audio_files.map(audioFile => `
                <div class="audio-item">
                    <audio controls>
                        <source src="/audio/${audioFile}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            `).join('');
        }
    }
});


// document.addEventListener('DOMContentLoaded', () => {
//     const dropZone = document.getElementById('dropZone');
//     const fileInput = document.getElementById('fileInput');
//     const processBtn = document.getElementById('processBtn');
//     const thumbnailsContainer = document.getElementById('thumbnailsContainer');
    
//     // Prevent default drag behaviors
//     ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//         dropZone.addEventListener(eventName, preventDefaults, false);
//         document.body.addEventListener(eventName, preventDefaults, false);
//     });

//     // Highlight drop zone when item is dragged over it
//     ['dragenter', 'dragover'].forEach(eventName => {
//         dropZone.addEventListener(eventName, highlight, false);
//     });

//     ['dragleave', 'drop'].forEach(eventName => {
//         dropZone.addEventListener(eventName, unhighlight, false);
//     });

//     // Handle dropped files
//     dropZone.addEventListener('drop', handleDrop, false);

//     // Handle browse button click
//     document.querySelector('.browse-link').addEventListener('click', () => {
//         fileInput.click();
//     });

//     // Handle files selected through file input
//     fileInput.addEventListener('change', (e) => {
//         handleFiles(e.target.files);
//     });

//     function preventDefaults(e) {
//         e.preventDefault();
//         e.stopPropagation();
//     }

//     function highlight(e) {
//         dropZone.classList.add('dragover');
//     }

//     function unhighlight(e) {
//         dropZone.classList.remove('dragover');
//     }

//     function handleDrop(e) {
//         const dt = e.dataTransfer;
//         const files = dt.files;
//         handleFiles(files);
//     }

//     function handleFiles(files) {
//         const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
//         const imageFiles = Array.from(files).filter(file => validImageTypes.includes(file.type));
        
//         if (imageFiles.length > 0) {
//             processBtn.disabled = false;
//             displayThumbnails(imageFiles);
//         }
//     }

//     function displayThumbnails(files) {
//         thumbnailsContainer.innerHTML = ''; // Clear existing thumbnails
        
//         files.forEach(file => {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const thumbnail = document.createElement('div');
//                 thumbnail.className = 'thumbnail';
//                 thumbnail.innerHTML = `
//                     <img src="${e.target.result}" alt="thumbnail">
//                     <span class="filename">${file.name}</span>
//                 `;
//                 thumbnailsContainer.appendChild(thumbnail);
//             };
//             reader.readAsDataURL(file);
//         });
//     }

//     // Handle process button click
//     processBtn.addEventListener('click', async () => {
//         const files = fileInput.files;
//         if (files.length === 0) return;

//         const formData = new FormData();
//         Array.from(files).forEach(file => {
//             formData.append('images', file);
//         });

//         try {
//             const response = await fetch('/process', {
//                 method: 'POST',
//                 body: formData
//             });
            
//             if (response.ok) {
//                 const result = await response.json();
//                 displayResults(result);
//             } else {
//                 console.error('Processing failed');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     });

//     function displayResults(result) {
//         const results = document.getElementById('results');
//         const textContainer = document.getElementById('textContainer');
//         const audioContainer = document.getElementById('audioContainer');

//         results.style.display = 'block';
//         textContainer.textContent = result.text;
        
//         if (result.audio) {
//             const audio = new Audio(result.audio);
//             const playButton = document.createElement('button');
//             playButton.textContent = 'Play Audio';
//             playButton.onclick = () => audio.play();
//             audioContainer.appendChild(playButton);
//         }
//     }
// });
// document.addEventListener('DOMContentLoaded', () => {
//     const processBtn = document.getElementById('processBtn');
//     const fileInput = document.getElementById('fileInput');
    
//     processBtn.addEventListener('click', async () => {
//         const files = fileInput.files;
//         if (files.length === 0) {
//             alert('Please select at least one image');
//             return;
//         }
    
//         const formData = new FormData();
//         for (let file of files) {
//             formData.append('images', file);
//         }
    
//         try {
//             processBtn.disabled = true;
//             processBtn.textContent = 'Processing...';
    
//             const response = await fetch('/process', {
//                 method: 'POST',
//                 body: formData
//             });
    
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
    
//             const result = await response.json();
            
//             if (result.error) {
//                 throw new Error(result.error);
//             }
    
//             displayResults(result);
    
//         } catch (error) {
//             console.error('Error:', error);
//             alert(error.message || 'Error processing images');
//         } finally {
//             processBtn.disabled = false;
//             processBtn.textContent = 'Process Images';
//         }
//     });

//     function displayResults(result) {
//         const results = document.getElementById('results');
//         const textContainer = document.getElementById('textContainer');
//         const audioContainer = document.getElementById('audioContainer');

//         // Display the results section
//         results.style.display = 'block';

//         // Show extracted text
//         textContainer.textContent = result.text || 'No text extracted';

//         // Handle audio if present
//         if (result.audio) {
//             audioContainer.innerHTML = '';
//             const audio = new Audio(result.audio);
//             const playButton = document.createElement('button');
//             playButton.textContent = 'Play Audio';
//             playButton.onclick = () => audio.play();
//             audioContainer.appendChild(playButton);
//         }
//     }

//     // Enable process button when files are selected
//     fileInput.addEventListener('change', () => {
//         processBtn.disabled = fileInput.files.length === 0;
//     });
// });