import express from 'express';
import { 
  getUploadUrl, 
  createNote, 
  getUserNotes, 
  getNoteById,
  getDownloadUrl,
  deleteNote 
} from '../controllers/note.controller';
import { auth } from '../middleware/auth'; // Use your auth middleware

const router = express.Router();

// All routes require authentication
router.post('/get-upload-url', getUploadUrl); // removed auth
router.post('/create', createNote);
router.get('/', getUserNotes);
router.get('/:noteId/download', getDownloadUrl);
router.get('/:noteId', getNoteById);
router.delete('/:noteId', deleteNote);

export default router;
