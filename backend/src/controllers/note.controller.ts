import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';  // Add this import
import Note from '../models/Note';
import { s3Client } from '../config/s3config';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';



const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'tritonscript-notes-bucket';

// Generate presigned URL for upload
// NOTE: need max file size check
export const getUploadUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileName, title, className, classNumber, instructorName, quarter } = req.body;
    
    // Use testuser as default for testing without auth
    const userId = 'testuser';
    
    // Validate required fields
    if (!fileName || !title || !className || !classNumber || !quarter) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    
    // Validate file extension
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      res.status(400).json({ message: 'Only PDF files are allowed' });
      return;
    }
    
    // Generate unique S3 key
    const fileId = uuidv4();
    const sanitizedQuarter = quarter.replace(/\s+/g, '-'); // "Fall 2025" -> "Fall-2025"
    const s3Key = `notes/${userId}/${sanitizedQuarter}/${fileId}.pdf`;
    
    // Generate presigned URL
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: 'application/pdf'
    });
    
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 minutes
    
    console.log(`Generated upload URL for testing (no auth)`);
    
    res.status(200).json({ 
      uploadUrl, 
      s3Key,
      expiresIn: 900,
      metadata: { title, className, classNumber, instructorName, quarter }
    });
  } catch (error) {
    console.error('Upload URL generation error:', error);
    res.status(500).json({ message: 'Failed to generate upload URL check note controller upload url' });
  }
};


// Save the note metadata into mongoDB after creating a url
export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, className, classNumber, instructorName, quarter, s3Key, fileSize } = req.body;
      
      // Use testuser as default for testing without auth
      const userId = 'testuser';
      
      // Validate required fields
      if (!title || !className || !classNumber || !quarter || !s3Key || !fileSize) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }
      
      // Skip ownership verification for testing
      
      const note = new Note({
        title,
        className,
        classNumber,
        instructorName,
        quarter,
        ownerId: userId, // Use string instead of ObjectId for testing
        s3Bucket: BUCKET_NAME,
        s3Key,
        fileSize
      });
      
      await note.save();
      
      console.log(`Note created (no auth), title: ${title}`);
      
      res.status(201).json({ 
        message: 'Note created successfully', 
        note 
      });
    } catch (error: any) {
      console.error('Create note error:', error);
      
      // Handle duplicate key error
      if (error.code === 11000) {
        res.status(409).json({ message: 'Note already exists' });
        return;
      }
      
      res.status(500).json({ message: 'Failed to create note' });
    }
  };

// Get all notes for logged-in user
export const getUserNotes = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Get all notes for testing (no auth)
      const notes = await Note.find({})
        .sort({ createdAt: -1 })
        .select('-__v');
      
      console.log(`Retrieved ${notes.length} notes (no auth)`);
      
      res.status(200).json({ 
        count: notes.length,
        notes 
      });
    } catch (error) {
      console.error('Get notes error:', error);
      res.status(500).json({ message: 'Failed to fetch notes' });
    }
  };

// Get single note by ID
export const getNoteById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { noteId } = req.params;
      const note = await Note.findById(noteId);
      
      if (!note) {
        res.status(404).json({ message: 'Note not found' });
        return;
      }
      
      // Skip ownership check for testing
      
      res.status(200).json({ note });
    } catch (error) {
      console.error('Get note error:', error);
      res.status(500).json({ message: 'Failed to fetch note' });
    }
  };

// Generate download URL
export const getDownloadUrl = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { noteId } = req.params;
      const note = await Note.findById(noteId);
      
      if (!note) {
        res.status(404).json({ message: 'Note not found' });
        return;
      }
      
      // Skip ownership check for testing
      
      // Generate presigned URL for download
      const command = new GetObjectCommand({
        Bucket: note.s3Bucket,
        Key: note.s3Key
      });
      
      const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
      
      console.log(`Generated download URL (no auth), note: ${note.title}`);
      
      res.status(200).json({ 
        downloadUrl,
        expiresIn: 3600,
        fileName: `${note.title}.pdf`
      });
    } catch (error) {
      console.error('Download URL error:', error);
      res.status(500).json({ message: 'Failed to generate download URL' });
    }
  };


  // Delete them notes
export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { noteId } = req.params;
      const note = await Note.findById(noteId);
      
      if (!note) {
        res.status(404).json({ message: 'Note not found' });
        return;
      }
      
      // Skip ownership check for testing
      
      // Delete from S3 FIRST (before MongoDB)
      // If S3 fails, we still have the DB record to retry later
      const deleteCommand = new DeleteObjectCommand({
        Bucket: note.s3Bucket,
        Key: note.s3Key
      });
      await s3Client.send(deleteCommand);
      
      // Only delete from MongoDB if S3 deletion succeeded
      await note.deleteOne();
      
      console.log(`Note deleted (no auth), title: ${note.title}`);


      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Delete note error:', error);
      res.status(500).json({ message: 'Failed to delete note' });
    }
  };