import { Post, CreatePostRequest } from '../entities/Post';

export interface PostRepository {
  save(post: CreatePostRequest): Promise<Post>;
  delete(id: string): Promise<Post>;
  findAll(): Promise<Post[]>;
} 