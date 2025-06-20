import { Post } from '@domain/entities/Post';
import { PostRepository } from '@domain/repositories/PostRepository';
import { ValidationError } from '@shared/errors/DomainErrors';

export class DeletePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(id: string): Promise<Post> {
    // 1. Validación básica
    if (!id?.trim()) {
      throw new ValidationError(['El ID del post es requerido']);
    }

    // 2. Eliminar el post
    const deletedPost = await this.postRepository.delete(id);

    return deletedPost;
  }
} 