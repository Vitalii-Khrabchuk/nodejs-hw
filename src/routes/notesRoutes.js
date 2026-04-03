import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';

import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

router.use(authenticate);

router.get('/', celebrate(getAllNotesSchema), getAllNotes);
router.post('/', celebrate(createNoteSchema), createNote);

router.get('/:noteId', celebrate(noteIdSchema), getNoteById);
router.patch(
  '/:noteId',
  celebrate({
    params: noteIdSchema.params,
    body: updateNoteSchema.body,
  }),
  updateNote,
);
router.delete('/:noteId', celebrate(noteIdSchema), deleteNote);

export default router;
