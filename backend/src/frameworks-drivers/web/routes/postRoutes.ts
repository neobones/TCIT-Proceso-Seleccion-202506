import { Router } from 'express';
import { PostController } from '../../../interface-adapters/controllers/PostController';
import { CreatePostUseCase } from '../../../use-cases/CreatePost';
import { DeletePostUseCase } from '../../../use-cases/DeletePost';
import { ListPostsUseCase } from '../../../use-cases/ListPosts';
import { SqlitePostRepository } from '../../../interface-adapters/repositories/SqlitePostRepository';
import { UuidGenerator } from '../../../shared/utils/UuidGenerator';
import { DatabaseConfig } from '../../database/DatabaseConfig';

export async function createPostRoutes(): Promise<Router> {
  const router = Router();

  // Dependency injection
  const database = await DatabaseConfig.getDatabase();
  const postRepository = new SqlitePostRepository(database);
  const idGenerator = new UuidGenerator();

  // Use cases
  const createPostUseCase = new CreatePostUseCase(postRepository, idGenerator);
  const deletePostUseCase = new DeletePostUseCase(postRepository);
  const listPostsUseCase = new ListPostsUseCase(postRepository);

  // Controller
  const postController = new PostController(
    createPostUseCase,
    deletePostUseCase,
    listPostsUseCase
  );

  // Routes
  router.post('/', postController.createPost);
  router.delete('/:id', postController.deletePost);
  router.get('/', postController.listPosts);

  return router;
} 