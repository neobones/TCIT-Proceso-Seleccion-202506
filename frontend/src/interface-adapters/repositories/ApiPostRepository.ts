import { Post, CreatePostRequest, PostApiResponse } from '@domain/entities/Post';
import { PostRepository } from '@domain/repositories/PostRepository';
import { ApiError, NetworkError, NotFoundError } from '@shared/errors/DomainErrors';
import { Logger } from '@shared/utils/logger';
import { HttpClient } from '@frameworks-drivers/http/HttpClient';

export class ApiPostRepository implements PostRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async save(request: CreatePostRequest): Promise<Post> {
    try {
      Logger.debug('Creando post', request);
      
      const response = await this.httpClient.post<PostApiResponse>('/api/posts', request);
      
      Logger.debug('Post creado exitosamente', response);
      return Post.fromApiResponse(response);
    } catch (error) {
      Logger.error('Error al crear el post', error as Error);
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<Post> {
    try {
      Logger.debug('Eliminando post', { id });
      
      const response = await this.httpClient.delete<PostApiResponse>(`/api/posts/${id}`);
      
      Logger.debug('Post eliminado exitosamente', response);
      return Post.fromApiResponse(response);
    } catch (error) {
      Logger.error('Error al eliminar el post', error as Error);
      throw this.handleError(error);
    }
  }

  async findAll(): Promise<Post[]> {
    try {
      Logger.debug('Obteniendo todos los posts');
      
      const response = await this.httpClient.get<PostApiResponse[]>('/api/posts');
      
      Logger.debug('Posts obtenidos exitosamente', { count: response.length });
      return response.map(postData => Post.fromApiResponse(postData));
    } catch (error) {
      Logger.error('Error al obtener los posts', error as Error);
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      // Error de red
      if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
        return new NetworkError('Error de conexión. Verifica tu conexión a internet.', error);
      }

      // Error de API específico
      if ('status' in error) {
        const statusCode = (error as any).status;
        
        if (statusCode === 404) {
          return new NotFoundError('El recurso solicitado no fue encontrado');
        }
        
        if (statusCode >= 400 && statusCode < 500) {
          return new ApiError('Error en la solicitud', statusCode, error);
        }
        
        if (statusCode >= 500) {
          return new ApiError('Error del servidor', statusCode, error);
        }
      }
      
      return new ApiError(error.message, undefined, error);
    }
    
    return new ApiError('Error desconocido');
  }
} 