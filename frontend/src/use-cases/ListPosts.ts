import { Post } from '@domain/entities/Post';
import { PostRepository } from '@domain/repositories/PostRepository';

export class ListPostsUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(): Promise<Post[]> {
    // Obtener todos los posts del repositorio
    const posts = await this.postRepository.findAll();

    // Los posts ya vienen ordenados del servidor (más recientes primero)
    return posts;
  }
} 