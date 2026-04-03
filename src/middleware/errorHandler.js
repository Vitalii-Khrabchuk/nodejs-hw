import 'dotenv/config';
import { HttpError } from 'http-errors';

export function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === 'production';

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message || err.name });
  }

  res.status(500).json({
    message: isProd ? 'Server error. Details on dev mode...' : err.message,
  });
}