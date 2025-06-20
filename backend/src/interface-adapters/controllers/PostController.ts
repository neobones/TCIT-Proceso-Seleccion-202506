import { Request, Response } from 'express';
import { CreatePostUseCase } from '../../use-cases/CreatePost';
import { DeletePostUseCase } from '../../use-cases/DeletePost';
import { ListPostsUseCase } from '../../use-cases/ListPosts';
import { ValidationError, NotFoundError } from '../../shared/errors/DomainErrors';

export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly listPostsUseCase: ListPostsUseCase
  ) {}

  createPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description } = req.body;
      
      const post = await this.createPostUseCase.execute({ name, description });
      
      res.status(201).json(post);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const deletedPost = await this.deletePostUseCase.execute(id);
      
      res.json(deletedPost);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  listPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const posts = await this.listPostsUseCase.execute();
      
      res.json(posts);
    } catch (error) {
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