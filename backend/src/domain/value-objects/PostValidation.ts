import { CreatePostRequest } from '../entities/Post';

export class PostValidation {
  constructor(
    public readonly isValid: boolean,
    public readonly errors: string[]
  ) {}

  static validate(data: CreatePostRequest): PostValidation {
    const errors: string[] = [];
    
    if (!data.name?.trim()) {
      errors.push('El nombre es requerido y no puede estar vacío');
    } else if (data.name.length > 100) {
      errors.push('El nombre no puede exceder 100 caracteres');
    }
    
    if (!data.description?.trim()) {
      errors.push('La descripción es requerida y no puede estar vacía');
    } else if (data.description.length > 500) {
      errors.push('La descripción no puede exceder 500 caracteres');
    }
    
    return new PostValidation(errors.length === 0, errors);
  }

  static validateId(id: string): PostValidation {
    const errors: string[] = [];
    
    if (!id?.trim()) {
      errors.push('El ID es requerido');
    }
    
    return new PostValidation(errors.length === 0, errors);
  }
} 