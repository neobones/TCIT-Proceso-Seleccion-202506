import { Post } from '../entities/Post';

export interface PostRepository {
  save(post: Post): Promise<Post>;
  delete(id: string): Promise<Post>;
  findAll(): Promise<Post[]>;
  findById(id: string): Promise<Post | null>;
} 