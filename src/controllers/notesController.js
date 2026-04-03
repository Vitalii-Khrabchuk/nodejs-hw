import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export async function getAllNotes(req, res) {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  const filter = { userId: req.user._id };

  if (tag) {
    filter.tag = tag;
  }
  if (search) {
    filter.$text = { $search: search };
  }

  const notesQuery = Note.find(filter);

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    notesQuery.skip(skip).limit(Number(perPage)).exec(),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
}

export async function getNoteById(req, res) {
  const { noteId } = req.params;

  const note = await Note.findOne({ _id: noteId, userId: req.user._id });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
}

export async function createNote(req, res) {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
}

export async function deleteNote(req, res) {
  const { noteId } = req.params;

  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(204).send();
}

export async function updateNote(req, res) {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    { returnDocument: 'after' },
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
}
