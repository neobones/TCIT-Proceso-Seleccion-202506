import React, { useEffect } from 'react';
import { PostForm } from '../components/PostForm';
import { PostFilter } from '../components/PostFilter';
import { PostList } from '../components/PostList';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { 
  useAppDispatch, 
  useAppSelector 
} from '@shared/hooks/redux';
import {
  fetchPostsAsync,
  createPostAsync,
  deletePostAsync,
  setFilterTerm,
  clearError
} from '@interface-adapters/state/postSlice';
import { CreatePostRequest } from '@domain/entities/Post';
import { Logger } from '@shared/utils/logger';

export const PostsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    filteredPosts, 
    filterTerm, 
    loading, 
    error 
  } = useAppSelector(state => state.posts);

  // Cargar posts al montar el componente (solo una vez)
  useEffect(() => {
    Logger.info('Cargando página de posts');
    dispatch(fetchPostsAsync());
  }, [dispatch]);

  const handleCreatePost = async (data: CreatePostRequest) => {
    try {
      await dispatch(createPostAsync(data)).unwrap();
      Logger.info('Post creado exitosamente', data);
    } catch (error) {
      Logger.error('Error al crear el post', error as Error);
      // Error handling is done in the slice
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await dispatch(deletePostAsync(id)).unwrap();
      Logger.info('Post eliminado exitosamente', { id });
    } catch (error) {
      Logger.error('Error al eliminar el post', error as Error);
      // Error handling is done in the slice
    }
  };

  const handleFilterChange = (term: string) => {
    dispatch(setFilterTerm(term));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="posts-page">
      <header className="page-header">
        <h1>Posts Manager</h1>
        <p>Gestiona tus posts con una arquitectura limpia y escalable</p>
      </header>

      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-text">{error}</span>
            <button 
              onClick={handleClearError}
              className="error-close-button"
              title="Cerrar error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main className="page-content">
        <div className="content-grid">
          <section className="form-section">
            <ErrorBoundary>
              <PostForm 
                onSubmit={handleCreatePost}
                loading={loading}
              />
            </ErrorBoundary>
          </section>

          <section className="list-section">
            <ErrorBoundary>
              <PostFilter
                value={filterTerm}
                onChange={handleFilterChange}
                disabled={loading}
              />
              
              <PostList
                posts={filteredPosts}
                onDelete={handleDeletePost}
                loading={loading}
                filterTerm={filterTerm}
              />
            </ErrorBoundary>
          </section>
        </div>
      </main>
    </div>
  );
}; 