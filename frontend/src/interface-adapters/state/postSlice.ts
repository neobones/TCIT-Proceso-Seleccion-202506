import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, CreatePostRequest } from '@domain/entities/Post';
import { CreatePostUseCase } from '@use-cases/CreatePost';
import { DeletePostUseCase } from '@use-cases/DeletePost';
import { ListPostsUseCase } from '@use-cases/ListPosts';
import { FilterPostsUseCase } from '@use-cases/FilterPosts';
import { Logger } from '@shared/utils/logger';

export interface PostState {
  posts: Post[];
  filteredPosts: Post[];
  filterTerm: string;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  filteredPosts: [],
  filterTerm: '',
  loading: false,
  error: null,
};

// Async thunks que coordinan con los casos de uso
export const fetchPostsAsync = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { extra }) => {
    const { listPostsUseCase } = extra as UseCases;
    return await listPostsUseCase.execute();
  }
);

export const createPostAsync = createAsyncThunk(
  'posts/createPost',
  async (request: CreatePostRequest, { extra }) => {
    const { createPostUseCase } = extra as UseCases;
    return await createPostUseCase.execute(request);
  }
);

export const deletePostAsync = createAsyncThunk(
  'posts/deletePost',
  async (id: string, { extra }) => {
    const { deletePostUseCase } = extra as UseCases;
    return await deletePostUseCase.execute(id);
  }
);

// Interface para dependency injection
interface UseCases {
  createPostUseCase: CreatePostUseCase;
  deletePostUseCase: DeletePostUseCase;
  listPostsUseCase: ListPostsUseCase;
  filterPostsUseCase: FilterPostsUseCase;
}

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilterTerm: (state, action: PayloadAction<string>) => {
      state.filterTerm = action.payload;
      state.error = null;
      
      try {
        // Usar el caso de uso para filtrar (sincrónico)
        const filterUseCase = new FilterPostsUseCase();
        state.filteredPosts = filterUseCase.execute(state.posts, action.payload);
              } catch (error) {
          Logger.error('Error al filtrar', error as Error);
          state.error = error instanceof Error ? error.message : 'Error al filtrar';
          state.filteredPosts = state.posts; // Fallback a mostrar todos
        }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPostsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        
        // Re-aplicar filtro después de cargar los posts
        try {
          const filterUseCase = new FilterPostsUseCase();
          state.filteredPosts = filterUseCase.execute(state.posts, state.filterTerm);
        } catch (error) {
          Logger.error('Error al filtrar después de cargar', error as Error);
          state.filteredPosts = state.posts;
        }
      })
      .addCase(fetchPostsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar los posts';
        Logger.error('Error al cargar los posts', new Error(action.error.message));
      })
      
      // Create post
      .addCase(createPostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.loading = false;
        
        // Agregar el nuevo post al inicio (más reciente primero)
        state.posts = [action.payload, ...state.posts];
        
        // Re-aplicar filtro
        try {
          const filterUseCase = new FilterPostsUseCase();
          state.filteredPosts = filterUseCase.execute(state.posts, state.filterTerm);
        } catch (error) {
          Logger.error('Error al filtrar después de crear', error as Error);
          state.filteredPosts = state.posts;
        }
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al crear el post';
        Logger.error('Error al crear el post', new Error(action.error.message));
      })
      
      // Delete post
      .addCase(deletePostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remover el post eliminado
        state.posts = state.posts.filter(post => post.id !== action.payload.id);
        
        // Re-aplicar filtro
        try {
          const filterUseCase = new FilterPostsUseCase();
          state.filteredPosts = filterUseCase.execute(state.posts, state.filterTerm);
        } catch (error) {
          Logger.error('Error al filtrar después de eliminar', error as Error);
          state.filteredPosts = state.posts;
        }
      })
      .addCase(deletePostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al eliminar el post';
        Logger.error('Error al eliminar el post', new Error(action.error.message));
      });
  },
});

export const { setFilterTerm, clearError, resetState } = postSlice.actions;

export default postSlice.reducer; 