// Firebase configuration (replace with your own configuration)
const firebaseConfig = {
   apiKey: "AIzaSyBc6pUBOCM_pJCn9cdCwc5QMWYl7RWt7Rs",
  authDomain: "b3-13588.firebaseapp.com",
  projectId: "b3-13588",
  storageBucket: "b3-13588.appspot.com",
  messagingSenderId: "562739727033",
  appId: "1:562739727033:web:c01dff8d26f6d1e9356968",
  measurementId: "G-94FYQ0CF0F"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Add a new note
async function addNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    if (title.trim() === '' || content.trim() === '') {
        alert('Please enter both title and content.');
        return;
    }

    try {
        await db.collection('notes').add({
            title: title,
            content: content,
            left: '0px',
            top: '0px'
        });
        loadNotes();
    } catch (error) {
        console.error('Error adding note: ', error);
    }
}

// Load notes from Firestore
async function loadNotes() {
    const notesContainer = document.getElementById('noteContainer');
    notesContainer.innerHTML = ''; // Clear existing notes

    try {
        const snapshot = await db.collection('notes').get();
        snapshot.forEach(doc => {
            const note = doc.data();
            const noteElement = createNoteElement(note.title, note.content);
            noteElement.style.left = note.left;
            noteElement.style.top = note.top;
            notesContainer.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error loading notes: ', error);
    }
}

// Create a note element
function createNoteElement(title, content) {
    const note = document.createElement('div');
    note.classList.add('note');
    
    const noteTitle = document.createElement('h3');
    noteTitle.textContent = title;
    
    const noteContent = document.createElement('p');
    noteContent.textContent = content;
    
    note.appendChild(noteTitle);
    note.appendChild(noteContent);
    
    note.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
    note.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
    
    makeDraggable(note);
    
    return note;
}

// Make a note draggable
function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;
    
    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
            updateNotePositionInFirestore(element);
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Update note position in Firestore
async function updateNotePositionInFirestore(element) {
    // Logic to update note position in Firestore
}
