import { Request, Response } from 'express';
import { CreatePostUseCase } from '../../use-cases/CreatePost';
import { DeletePostUseCase } from '../../use-cases/DeletePost';
import { ListPostsUseCase } from '../../use-cases/ListPosts';
import { ValidationError, NotFoundError } from '../../shared/errors/DomainErrors';
import { AuditService } from '../../shared/services/AuditService';

export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly auditService: AuditService
  ) {}

  createPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description } = req.body;
      
      const post = await this.createPostUseCase.execute({ name, description });
      
      // Auditar la creación del post
      await this.auditService.logPostCreated(post.id, post.name, {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress,
        details: { method: req.method, path: req.path }
      });
      
      res.status(201).json(post);
    } catch (error) {
      // Auditar el error
      await this.auditService.logSystemError(error as Error, {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress,
        details: { method: req.method, path: req.path, body: req.body }
      });
      
      this.handleError(error, res);
    }
  };

  deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const deletedPost = await this.deletePostUseCase.execute(id);
      
      // Auditar la eliminación del post
      await this.auditService.logPostDeleted(deletedPost.id, deletedPost.name, {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress,
        details: { method: req.method, path: req.path, postId: id }
      });
      
      res.json(deletedPost);
    } catch (error) {
      // Auditar el error
      await this.auditService.logSystemError(error as Error, {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress,
        details: { method: req.method, path: req.path, postId: req.params.id }
      });
      
      this.handleError(error, res);
    }
  };

  listPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const posts = await this.listPostsUseCase.execute();
      
      // Auditar la consulta de posts
      await this.auditService.logPostsListed(posts.length, {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress,
        details: { method: req.method, path: req.path }
      });
      
      res.json(posts);
    } catch (error) {
      // Auditar el error
      await this.auditService.logSystemError(error as Error, {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress,
        details: { method: req.method, path: req.path }
      });
      
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    console.error('Controller error:', error);

    if (error instanceof ValidationError) {
      res.status(400).json({ 
        error: 'Error de validación',
        details: error.errors 
      });
      return;
    }

    if (error instanceof NotFoundError) {
      res.status(404).json({ 
        error: error.message 
      });
      return;
    }

    // Error genérico del servidor
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
} 