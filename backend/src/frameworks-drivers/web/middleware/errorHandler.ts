import { Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError, DatabaseError } from '../../../shared/errors/DomainErrors';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Global error handler:', error);

  if (error instanceof ValidationError) {
    res.status(400).json({
      error: 'Error de validación',
      details: error.errors
    });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({
      error: error.message
    });
    return;
  }

  if (error instanceof DatabaseError) {
    res.status(500).json({
      error: 'Error en la base de datos'
    });
    return;
  }

  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor'
  });
} 