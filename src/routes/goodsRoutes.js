import { Router } from 'express';
import { celebrate } from 'celebrate';

router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);
