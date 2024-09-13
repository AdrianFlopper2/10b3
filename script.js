//a
console.log('script.js is loaded');
// Supabase configuration
const SUPABASE_URL = 'https://muwvctyohbujxdficifd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d3ZjdHlvaGJ1anhkZmljaWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyMjE3MzksImV4cCI6MjA0MTc5NzczOX0.i-DWQbwI2C5kdXyzJ_kKyPoEc63-En6kICAvKwuzOXg'; // Replace with your Supabase anon key

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Add a new note
async function addNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    if (title.trim() === '' || content.trim() === '') {
        alert('Please enter both title and content.');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('notes')
            .insert([{ title, content, left: '0px', top: '0px' }]);

        if (error) throw error;
        loadNotes();
    } catch (error) {
        console.error('Error adding note: ', error.message);
    }
}

// Load notes from Supabase
async function loadNotes() {
    const notesContainer = document.getElementById('noteContainer');
    notesContainer.innerHTML = ''; // Clear existing notes

    try {
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*');

        if (error) throw error;
        notes.forEach(note => {
            const noteElement = createNoteElement(note.title, note.content);
            noteElement.style.left = note.left;
            noteElement.style.top = note.top;
            noteElement.dataset.id = note.id; // Store note ID in the element
            notesContainer.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error loading notes: ', error.message);
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
            updateNotePositionInSupabase(element);
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Update note position in Supabase
async function updateNotePositionInSupabase(element) {
    const id = element.dataset.id;
    const left = element.style.left;
    const top = element.style.top;

    try {
        const { error } = await supabase
            .from('notes')
            .update({ left, top })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating note position: ', error.message);
    }
}

// Initial call to load notes
loadNotes();
