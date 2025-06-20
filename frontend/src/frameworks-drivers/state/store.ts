import { configureStore } from '@reduxjs/toolkit';
import postReducer from '@interface-adapters/state/postSlice';
import auditReducer from '@interface-adapters/state/auditSlice';
import { CreatePostUseCase } from '@use-cases/CreatePost';
import { DeletePostUseCase } from '@use-cases/DeletePost';
import { ListPostsUseCase } from '@use-cases/ListPosts';
import { FilterPostsUseCase } from '@use-cases/FilterPosts';
import { ApiPostRepository } from '@interface-adapters/repositories/ApiPostRepository';

// Use cases para dependency injection
const postRepository = new ApiPostRepository();

const useCases = {
  createPostUseCase: new CreatePostUseCase(postRepository),
  deletePostUseCase: new DeletePostUseCase(postRepository),
  listPostsUseCase: new ListPostsUseCase(postRepository),
  filterPostsUseCase: new FilterPostsUseCase(),
};

export const store = configureStore({
  reducer: {
    posts: postReducer,
    audit: auditReducer,
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
          'audit/fetchLogs/fulfilled',
          'audit/fetchStats/fulfilled',
        ],
        // Ignorar estos paths en el estado porque contienen fechas
        ignoredPaths: [
          'posts.posts',
          'posts.filteredPosts',
          'audit.logs',
          'audit.stats',
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export de tipos para uso en hooks tipados
export type { RootState, AppDispatch }; 