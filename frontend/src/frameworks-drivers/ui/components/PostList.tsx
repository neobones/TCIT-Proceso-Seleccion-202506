import React from 'react';
import { Post } from '@domain/entities/Post';
import { PostItem } from './PostItem';

interface PostListProps {
  posts: Post[];
  onDelete: (id: string) => void;
  loading?: boolean;
  filterTerm?: string;
}

export const PostList: React.FC<PostListProps> = ({ 
  posts, 
  onDelete, 
  loading = false,
  filterTerm = ''
}) => {
  if (loading) {
    return (
      <div className="post-list">
        <div className="loading-message">
          Cargando posts...
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="post-list">
        <div className="empty-message">
          {filterTerm 
            ? `No se encontraron posts que coincidan con "${filterTerm}"`
            : 'No hay posts disponibles. ¡Crea el primero!'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="post-list">
      <h2>
        Lista de Posts 
        {filterTerm && (
          <span className="filter-indicator">
            (filtrado por: "{filterTerm}")
          </span>
        )}
      </h2>
      
      <div className="posts-count">
        {posts.length} post{posts.length !== 1 ? 's' : ''}
        {filterTerm && ' encontrado' + (posts.length !== 1 ? 's' : '')}
      </div>

      <div className="posts-container">
        {posts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            onDelete={onDelete}
            disabled={loading}
          />
        ))}
      </div>
    </div>
  );
}; 