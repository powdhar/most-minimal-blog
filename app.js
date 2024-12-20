const API_KEY = window.ENV.API_KEY;
const BIN_ID = window.ENV.BIN_ID;
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let data = [];

// Fetch entries from JSONbin
async function fetchEntries() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'X-Master-Key': API_KEY
            }
        });
        const result = await response.json();
        data = result.record || [];
        displayEntries();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Save entries to JSONbin
async function saveEntries() {
    try {
        document.body.classList.add('loading');
        await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error saving data:', error);
    } finally {
        document.body.classList.remove('loading');
    }
}

// Display entries
function displayEntries() {
    const entriesDiv = document.getElementById('entries');
    entriesDiv.innerHTML = data.map(entry => `
        <div class="entry">
            <h3>${entry.title}</h3>
            <p>${entry.content}</p>
        </div>
    `).join('');
}

// Add new entry
document.getElementById('entryForm').onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    data.push({ title, content });
    await saveEntries();
    displayEntries();
    e.target.reset();
};

// Initial load
fetchEntries();