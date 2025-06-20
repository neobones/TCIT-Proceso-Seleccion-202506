import { Post, PostResponse } from '../../domain/entities/Post';

export class PostPresenter {
  static toResponse(post: Post): PostResponse {
    return {
      id: post.id,
      name: post.name,
      description: post.description,
      createdAt: post.createdAt.toISOString()
    };
  }

  static toResponseList(posts: Post[]): PostResponse[] {
    return posts.map(post => this.toResponse(post));
  }
} 