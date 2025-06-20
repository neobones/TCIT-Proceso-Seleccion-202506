import { PostResponse } from '../domain/entities/Post';
import { PostRepository } from '../domain/repositories/PostRepository';
import { PostPresenter } from '../interface-adapters/presenters/PostPresenter';

export class ListPostsUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(): Promise<PostResponse[]> {
    // 1. Obtener todos los posts del repositorio
    const posts = await this.postRepository.findAll();

    // 2. Presentar la respuesta (ordenados por fecha de creación, más recientes primero)
    const sortedPosts = posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return sortedPosts.map(post => PostPresenter.toResponse(post));
  }
} 