import { Post } from '@domain/entities/Post';
import { PostValidation } from '@domain/value-objects/PostValidation';
import { ValidationError } from '@shared/errors/DomainErrors';

export class FilterPostsUseCase {
  execute(posts: Post[], filterTerm: string): Post[] {
    // 1. Validación del término de filtro
    const validation = PostValidation.validateFilter(filterTerm);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }

    // 2. Si no hay término de filtro, devolver todos los posts
    if (!filterTerm.trim()) {
      return posts;
    }

    // 3. Filtrar posts usando el método de la entidad
    return posts.filter(post => post.matchesFilter(filterTerm));
  }
} 