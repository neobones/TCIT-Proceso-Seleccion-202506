import { Post, CreatePostRequest } from '@domain/entities/Post';
import { PostRepository } from '@domain/repositories/PostRepository';
import { PostValidation } from '@domain/value-objects/PostValidation';
import { ValidationError } from '@shared/errors/DomainErrors';

export class CreatePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(request: CreatePostRequest): Promise<Post> {
    // 1. Validación del lado del cliente
    const validation = PostValidation.validate(request);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }

    // 2. Normalizar datos
    const normalizedRequest: CreatePostRequest = {
      name: request.name.trim(),
      description: request.description.trim()
    };

    // 3. Llamar al repositorio
    const createdPost = await this.postRepository.save(normalizedRequest);

    return createdPost;
  }
} 