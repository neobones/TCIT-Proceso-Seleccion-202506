import { configureStore } from '@reduxjs/toolkit';
import postReducer from '@interface-adapters/state/postSlice';
import { CreatePostUseCase } from '@use-cases/CreatePost';
import { DeletePostUseCase } from '@use-cases/DeletePost';
import { ListPostsUseCase } from '@use-cases/ListPosts';
import { FilterPostsUseCase } from '@use-cases/FilterPosts';
import { ApiPostRepository } from '@interface-adapters/repositories/ApiPostRepository';
import { HttpClient } from '@frameworks-drivers/http/HttpClient';

// Dependency injection setup
const getApiBaseUrl = (): string => {
  // Detección inteligente del entorno
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Si hay una URL explícita, usarla
  if (envUrl && envUrl !== '') {
    return envUrl;
  }
  
  // Auto-detección basada en la URL actual
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    
    // Si estamos en localhost (Docker o desarrollo), usar localhost:3001
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//localhost:3001`;
    }
    
    // Si estamos en otra IP, asumir que el backend está en el mismo host
    return `${protocol}//${hostname}:3001`;
  }
  
  // Fallback para SSR o casos especiales
  return 'http://localhost:3001';
};

const apiBaseUrl = getApiBaseUrl();
console.log('🔗 API Base URL configurada:', apiBaseUrl);

const httpClient = new HttpClient({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

const postRepository = new ApiPostRepository(httpClient);

// Use cases
const useCases = {
  createPostUseCase: new CreatePostUseCase(postRepository),
  deletePostUseCase: new DeletePostUseCase(postRepository),
  listPostsUseCase: new ListPostsUseCase(postRepository),
  filterPostsUseCase: new FilterPostsUseCase(),
};

export const store = configureStore({
  reducer: {
    posts: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: useCases,
      },
      serializableCheck: {
        // Ignorar estas acciones porque contienen fechas
        ignoredActions: [
          'posts/fetchPosts/fulfilled',
          'posts/createPost/fulfilled',
          'posts/deletePost/fulfilled',
        ],
        // Ignorar estos paths en el estado porque contienen fechas
        ignoredPaths: [
          'posts.posts',
          'posts.filteredPosts',
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export de tipos para uso en hooks tipados
export type { RootState, AppDispatch }; 