import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuditLog, AuditAction, AuditResource, AuditLevel } from '../../domain/entities/AuditLog';
import { AuditLogFilters, AuditStats } from '../../domain/repositories/AuditLogRepository';
import { ListAuditLogsUseCase } from '../../use-cases/ListAuditLogs';
import { GetAuditStatsUseCase } from '../../use-cases/GetAuditStats';
import { ApiAuditLogRepository } from '../repositories/ApiAuditLogRepository';
import { httpClient } from '../../frameworks-drivers/http/HttpClient';

// Crear instancias de los casos de uso
const auditLogRepository = new ApiAuditLogRepository();
const listAuditLogsUseCase = new ListAuditLogsUseCase(auditLogRepository);
const getAuditStatsUseCase = new GetAuditStatsUseCase(auditLogRepository);

// Estado de la aplicación para auditoría
interface AuditState {
  logs: AuditLog[];
  stats: AuditStats | null;
  filters: AuditLogFilters;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  loading: boolean;
  loadingStats: boolean;
  error: string | null;
}

const initialState: AuditState = {
  logs: [],
  stats: null,
  filters: {
    page: 1,
    limit: 25,
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 25,
    totalPages: 0,
  },
  loading: false,
  loadingStats: false,
  error: null,
};

// Thunks asíncronos
export const fetchAuditLogsAsync = createAsyncThunk(
  'audit/fetchLogs',
  async (filters: AuditLogFilters = {}) => {
    const response = await listAuditLogsUseCase.execute(filters);
    return response;
  }
);

export const fetchAuditStatsAsync = createAsyncThunk(
  'audit/fetchStats',
  async () => {
    const stats = await getAuditStatsUseCase.execute();
    return stats;
  }
);

// Slice
const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<AuditLogFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 25,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch audit logs
      .addCase(fetchAuditLogsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAuditLogsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar logs de auditoría';
      })
      // Fetch audit stats
      .addCase(fetchAuditStatsAsync.pending, (state) => {
        state.loadingStats = true;
      })
      .addCase(fetchAuditStatsAsync.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchAuditStatsAsync.rejected, (state, action) => {
        state.loadingStats = false;
        state.error = action.error.message || 'Error al cargar estadísticas de auditoría';
      });
  },
});

export const { setFilters, clearFilters, setPage, clearError } = auditSlice.actions;
export default auditSlice.reducer;

// Selectores
export const selectAuditLogs = (state: { audit: AuditState }) => state.audit.logs;
export const selectAuditStats = (state: { audit: AuditState }) => state.audit.stats;
export const selectAuditFilters = (state: { audit: AuditState }) => state.audit.filters;
export const selectAuditPagination = (state: { audit: AuditState }) => state.audit.pagination;
export const selectAuditLoading = (state: { audit: AuditState }) => state.audit.loading;
export const selectAuditLoadingStats = (state: { audit: AuditState }) => state.audit.loadingStats;
export const selectAuditError = (state: { audit: AuditState }) => state.audit.error; 