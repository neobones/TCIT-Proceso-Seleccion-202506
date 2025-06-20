import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux';
import {
  fetchAuditLogsAsync,
  fetchAuditStatsAsync,
  setFilters,
  clearFilters,
  setPage,
  selectAuditLogs,
  selectAuditStats,
  selectAuditFilters,
  selectAuditPagination,
  selectAuditLoading,
  selectAuditLoadingStats,
  selectAuditError,
} from '../../../interface-adapters/state/auditSlice';
import { AuditStats } from '../components/AuditStats';
import { AuditFilters } from '../components/AuditFilters';
import { AuditLogItem } from '../components/AuditLogItem';
import { AuditPagination } from '../components/AuditPagination';
import { AuditLogFilters as AuditLogFiltersType } from '../../../domain/repositories/AuditLogRepository';

export const AuditPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const logs = useAppSelector(selectAuditLogs);
  const stats = useAppSelector(selectAuditStats);
  const filters = useAppSelector(selectAuditFilters);
  const pagination = useAppSelector(selectAuditPagination);
  const loading = useAppSelector(selectAuditLoading);
  const loadingStats = useAppSelector(selectAuditLoadingStats);
  const error = useAppSelector(selectAuditError);

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(fetchAuditStatsAsync());
    dispatch(fetchAuditLogsAsync(filters));
  }, [dispatch]);

  // Recargar logs cuando cambian los filtros
  useEffect(() => {
    dispatch(fetchAuditLogsAsync(filters));
  }, [dispatch, filters]);

  const handleFiltersChange = (newFilters: AuditLogFiltersType) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleRefresh = () => {
    dispatch(fetchAuditStatsAsync());
    dispatch(fetchAuditLogsAsync(filters));
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      background: '#f9fafb',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        background: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h1 style={{
            margin: '0 0 8px 0',
            color: '#111827',
            fontSize: '28px',
            fontWeight: 700
          }}>
            🔍 Auditoría del Sistema
          </h1>
          <p style={{
            margin: 0,
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Monitoreo y seguimiento de todas las actividades del sistema
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: '12px 20px',
              background: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              fontSize: '14px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <span>{loading ? '⏳' : '🔄'}</span>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <AuditStats stats={stats} loading={loadingStats} />

      {/* Filtros */}
      <AuditFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Contenido */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f8fafc'
        }}>
          <h2 style={{
            margin: 0,
            color: '#374151',
            fontSize: '20px',
            fontWeight: 600
          }}>
            📋 Logs de Auditoría
          </h2>
          <span style={{
            fontSize: '14px',
            color: '#6b7280',
            background: '#e5e7eb',
            padding: '4px 12px',
            borderRadius: '12px'
          }}>
            {pagination.total.toLocaleString()} registros
          </span>
        </div>

        {error ? (
          <div style={{
            padding: '20px 24px',
            background: '#fef2f2',
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                fontSize: '20px',
                flexShrink: 0
              }}>
                ❌
              </span>
              <div style={{ flex: 1 }}>
                <strong style={{
                  color: '#dc2626',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Error al cargar los logs
                </strong>
                <p style={{
                  margin: 0,
                  color: '#7f1d1d',
                  fontSize: '14px'
                }}>
                  {error}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                style={{
                  padding: '6px 12px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginLeft: 'auto'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '16px'
            }}>
              ⏳
            </div>
            <p style={{ margin: 0 }}>Cargando logs de auditoría...</p>
          </div>
        ) : logs.length === 0 ? (
          <div style={{
            padding: '60px 20px'
          }}>
            <div style={{
              textAlign: 'center',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              <span style={{
                fontSize: '48px',
                display: 'block',
                marginBottom: '16px'
              }}>
                📝
              </span>
              <h3 style={{
                margin: '0 0 12px 0',
                color: '#374151',
                fontSize: '20px'
              }}>
                No hay logs disponibles
              </h3>
              <p style={{
                margin: '0 0 20px 0',
                color: '#6b7280',
                lineHeight: 1.5
              }}>
                No se encontraron registros de auditoría con los filtros aplicados.
                Prueba a ajustar los criterios de búsqueda.
              </p>
              <button
                onClick={handleClearFilters}
                style={{
                  padding: '12px 20px',
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#d97706'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f59e0b'}
              >
                🗑️ Limpiar filtros
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ padding: '24px' }}>
              {logs.map((log) => (
                <AuditLogItem key={log.id} log={log} />
              ))}
            </div>

            <AuditPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}; 