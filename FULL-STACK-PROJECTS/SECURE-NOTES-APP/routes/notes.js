const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const notesController = require('../controllers/notesController');

// GET /api/notes            -> get all notes
router.get('/', authMiddleware, notesController.getNotes);

// POST /api/notes           -> create note
router.post('/', authMiddleware, notesController.createNote);

// PUT /api/notes/:id        -> update note
router.put('/:id', authMiddleware, notesController.updateNote);

// DELETE /api/notes/:id     -> delete note
router.delete('/:id', authMiddleware, notesController.deleteNote);

module.exports = router;