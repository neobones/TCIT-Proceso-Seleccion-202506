import { Router } from 'express';
import { PostController } from '../../../interface-adapters/controllers/PostController';
import { CreatePostUseCase } from '../../../use-cases/CreatePost';
import { DeletePostUseCase } from '../../../use-cases/DeletePost';
import { ListPostsUseCase } from '../../../use-cases/ListPosts';
import { SqlitePostRepository } from '../../../interface-adapters/repositories/SqlitePostRepository';
import { UuidGenerator } from '../../../shared/utils/UuidGenerator';
import { DatabaseConfig } from '../../database/DatabaseConfig';
import { AuditService } from '../../../shared/services/AuditService';
import { CreateAuditLogUseCase } from '../../../use-cases/CreateAuditLog';
import { SqliteAuditLogRepository } from '../../../interface-adapters/repositories/SqliteAuditLogRepository';

export async function createPostRoutes(): Promise<Router> {
  const router = Router();

  // Dependency injection
  const database = await DatabaseConfig.getDatabase();
  const postRepository = new SqlitePostRepository(database);
  const auditLogRepository = new SqliteAuditLogRepository(database);
  const idGenerator = new UuidGenerator();

  // Use cases
  const createPostUseCase = new CreatePostUseCase(postRepository, idGenerator);
  const deletePostUseCase = new DeletePostUseCase(postRepository);
  const listPostsUseCase = new ListPostsUseCase(postRepository);
  const createAuditLogUseCase = new CreateAuditLogUseCase(auditLogRepository);

  // Services
  const auditService = new AuditService(createAuditLogUseCase);

  // Controller
  const postController = new PostController(
    createPostUseCase,
    deletePostUseCase,
    listPostsUseCase,
    auditService
  );

  // Routes
  router.post('/', postController.createPost);
  router.delete('/:id', postController.deletePost);
  router.get('/', postController.listPosts);

  return router;
} 