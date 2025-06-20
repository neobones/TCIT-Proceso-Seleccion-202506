import { Post, CreatePostRequest, PostResponse } from '../domain/entities/Post';
import { PostRepository } from '../domain/repositories/PostRepository';
import { PostValidation } from '../domain/value-objects/PostValidation';
import { ValidationError } from '../shared/errors/DomainErrors';
import { IdGenerator } from '../shared/interfaces/IdGenerator';
import { PostPresenter } from '../interface-adapters/presenters/PostPresenter';

export class CreatePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly idGenerator: IdGenerator
  ) {}

  async execute(request: CreatePostRequest): Promise<PostResponse> {
    // 1. Validación de entrada
    const validation = PostValidation.validate(request);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }

    // 2. Creación de la entidad con reglas de negocio
    const post = new Post(
      this.idGenerator.generate(),
      request.name.trim(),
      request.description.trim()
    );

    // 3. Persistencia
    const savedPost = await this.postRepository.save(post);

    // 4. Presentación de la respuesta
    return PostPresenter.toResponse(savedPost);
  }
} 