import { Router } from 'express';
import { celebrate } from 'celebrate';

router.get('/goods', celebrate(getAllNotesSchema), getAllNotes);
router.get('/goods/:goodId', celebrate(noteIdSchema), getNoteById);
