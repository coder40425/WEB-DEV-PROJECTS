const token = localStorage.getItem("token");
if (!token) {
  alert("Unauthorized. Please login.");
  window.location.href = "login.html";
}

const apiBase = "http://localhost:5000/api/notes";

const notesContainer = document.getElementById("notesContainer");
const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const logoutBtn = document.getElementById("logoutBtn");

window.addEventListener('load', fetchNotes);

// Add new note
addNoteBtn.onclick = async () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) return alert("Both fields required.");

  try {
    const res = await fetch(apiBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (res.ok) {
      titleInput.value = "";
      contentInput.value = "";
      fetchNotes();
    } else {
      alert(data.message || "Failed to add note");
    }
  } catch (err) {
    console.error(err);
    alert("Server error while adding note");
  }
};

// Fetch notes
async function fetchNotes() {
  try {
    const res = await fetch(apiBase, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      renderNotes(data || []);
    } else {
      alert(data.message || "Error loading notes");
    }
  } catch (err) {
    console.error(err);
    alert("Error fetching notes");
  }
}

// Render notes
function renderNotes(notes) {
  notesContainer.innerHTML = "";
  if (!notes || notes.length === 0) {
    notesContainer.innerHTML = "<p>No notes found.</p>";
    return;
  }
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.content)}</p>
      <div class="actions">
        <button onclick="deleteNote('${note._id}')">Delete</button>
        <button onclick="editNotePrompt('${note._id}', '${escapeForJs(note.title)}', '${escapeForJs(note.content)}')">Edit</button>
      </div>
    `;
    notesContainer.appendChild(div);
  });
}

// Delete
async function deleteNote(id) {
  if (!confirm("Delete this note?")) return;
  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) fetchNotes();
    else alert(data.message || "Failed to delete note");
  } catch (err) {
    console.error(err);
    alert("Error deleting note");
  }
}

// Edit
async function editNotePrompt(id, oldTitle, oldContent) {
  const newTitle = prompt("Edit Title:", decodeURIComponent(oldTitle));
  const newContent = prompt("Edit Content:", decodeURIComponent(oldContent));
  if (newTitle === null || newContent === null) return;

  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });
    const data = await res.json();
    if (res.ok) fetchNotes();
    else alert(data.message || "Failed to update note");
  } catch (err) {
    console.error(err);
    alert("Error editing note");
  }
}

// Logout
logoutBtn.onclick = () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
};

// small helper functions to avoid breaking HTML / JS injection
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
}
// for safely passing strings into single-quoted onclick args
function escapeForJs(str) {
  if (!str) return "";
  return encodeURIComponent(str.replace(/'/g, "\\'"));
}