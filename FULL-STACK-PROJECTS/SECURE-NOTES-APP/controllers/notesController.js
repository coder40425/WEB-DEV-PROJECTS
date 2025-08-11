const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Get notes error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });

    const note = new Note({ title, content, user: req.user._id });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error("Create note error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;

    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();
    res.json(note);
  } catch (err) {
    console.error("Update note error:", err.message);
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findOneAndDelete({ _id: noteId, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted', note });
  } catch (err) {
    console.error("Delete note error:", err.message);
    res.status(500).json({ message: "Delete failed" });
  }
};