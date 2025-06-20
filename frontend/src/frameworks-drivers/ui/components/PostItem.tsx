import React, { useState } from 'react';
import { Post } from '@domain/entities/Post';

interface PostItemProps {
  post: Post;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export const PostItem: React.FC<PostItemProps> = ({ 
  post, 
  onDelete, 
  disabled = false 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (disabled || isDeleting) return;
    
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el post "${post.name}"?`
    );
    
    if (confirmed) {
      setIsDeleting(true);
      try {
        await onDelete(post.id);
      } catch (error) {
        // Error handling is done at a higher level
        console.error('Error al eliminar el post:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-item">
      <div className="post-header">
        <h3 className="post-name">{post.name}</h3>
        <div className="post-date">
          {formatDate(post.createdAt)}
        </div>
      </div>
      
      <div className="post-description">
        {post.description}
      </div>
      
      <div className="post-actions">
        <button
          onClick={handleDelete}
          disabled={disabled || isDeleting}
          className="delete-button"
          title={`Eliminar post "${post.name}"`}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
}; 