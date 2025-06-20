import { Database } from 'sqlite';
import { Post } from '../../domain/entities/Post';
import { PostRepository } from '../../domain/repositories/PostRepository';
import { DatabaseError, NotFoundError } from '../../shared/errors/DomainErrors';

interface PostRow {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export class SqlitePostRepository implements PostRepository {
  constructor(private readonly database: Database) {}

  async save(post: Post): Promise<Post> {
    try {
      const query = `
        INSERT INTO posts (id, name, description, created_at) 
        VALUES (?, ?, ?, ?)
      `;
      
      await this.database.run(query, [
        post.id,
        post.name,
        post.description,
        post.createdAt.toISOString()
      ]);
      
      return post;
    } catch (error) {
      throw new DatabaseError(
        `Error al guardar el post: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async delete(id: string): Promise<Post> {
    try {
      // Primero obtenemos el post que vamos a eliminar
      const post = await this.findById(id);
      if (!post) {
        throw new NotFoundError(`El post con ID ${id} no fue encontrado`);
      }

      // Eliminamos el post
      const result = await this.database.run('DELETE FROM posts WHERE id = ?', [id]);
      
      if (result.changes === 0) {
        throw new NotFoundError(`El post con ID ${id} no fue encontrado`);
      }
      
      return post;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Error al eliminar el post: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async findAll(): Promise<Post[]> {
    try {
      const query = 'SELECT * FROM posts ORDER BY created_at DESC';
      const rows: PostRow[] = await this.database.all(query);
      
      return rows.map(this.mapRowToPost);
    } catch (error) {
      throw new DatabaseError(
        `Error al obtener los posts: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async findById(id: string): Promise<Post | null> {
    try {
      const query = 'SELECT * FROM posts WHERE id = ?';
      const row: PostRow | undefined = await this.database.get(query, [id]);
      
      return row ? this.mapRowToPost(row) : null;
    } catch (error) {
      throw new DatabaseError(
        `Error al buscar el post por ID: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  private mapRowToPost(row: PostRow): Post {
    return new Post(
      row.id,
      row.name,
      row.description,
      new Date(row.created_at)
    );
  }
} 