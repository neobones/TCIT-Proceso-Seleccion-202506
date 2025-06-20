import { PostResponse } from '../domain/entities/Post';
import { PostRepository } from '../domain/repositories/PostRepository';
import { PostValidation } from '../domain/value-objects/PostValidation';
import { ValidationError, NotFoundError } from '../shared/errors/DomainErrors';
import { PostPresenter } from '../interface-adapters/presenters/PostPresenter';

export class DeletePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(id: string): Promise<PostResponse> {
    // 1. Validación del ID
    const validation = PostValidation.validateId(id);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }

    // 2. Verificar que el post existe
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new NotFoundError(`El post con ID ${id} no fue encontrado`);
    }

    // 3. Eliminar el post
    const deletedPost = await this.postRepository.delete(id);

    // 4. Presentación de la respuesta
    return PostPresenter.toResponse(deletedPost);
  }
} 