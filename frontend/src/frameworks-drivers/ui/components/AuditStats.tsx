import React from 'react';
import { AuditStats as AuditStatsType } from '../../../domain/repositories/AuditLogRepository';

interface AuditStatsProps {
  stats: AuditStatsType | null;
  loading: boolean;
}

export const AuditStats: React.FC<AuditStatsProps> = ({ stats, loading }) => {
  const containerStyle = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const titleStyle = {
    margin: 0,
    color: '#374151',
    fontSize: '18px',
    fontWeight: 600
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>📈 Estadísticas de Auditoría</h3>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#6b7280'
        }}>
          <div style={{
            fontSize: '24px',
            marginBottom: '12px'
          }}>
            ⏳
          </div>
          <p style={{ margin: 0 }}>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>📈 Estadísticas de Auditoría</h3>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#6b7280'
        }}>
          <p style={{ margin: 0 }}>⚠️ No se pudieron cargar las estadísticas</p>
        </div>
      </div>
    );
  }

  const getTotalErrors = () => stats.byLevel.error + stats.byLevel.critical;
  const getSuccessRate = () => {
    const total = stats.total;
    const errors = getTotalErrors();
    if (total === 0) return 100;
    return ((total - errors) / total * 100).toFixed(1);
  };

  const statCardStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const levelItemStyle = {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>📈 Estadísticas de Auditoría</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            background: '#10b981',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></span>
          En tiempo real
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Estadística principal */}
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '32px' }}>📊</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              lineHeight: 1
            }}>
              {stats.total.toLocaleString()}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Total de Eventos
            </div>
          </div>
        </div>

        {/* Últimas 24 horas */}
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '32px' }}>🕐</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              lineHeight: 1
            }}>
              {stats.last24Hours.toLocaleString()}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Últimas 24h
            </div>
          </div>
        </div>

        {/* Tasa de éxito */}
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '32px' }}>✅</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#059669',
              lineHeight: 1
            }}>
              {getSuccessRate()}%
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Tasa de Éxito
            </div>
          </div>
        </div>

        {/* Errores totales */}
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '32px' }}>🚨</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#dc2626',
              lineHeight: 1
            }}>
              {getTotalErrors().toLocaleString()}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Errores
            </div>
          </div>
        </div>
      </div>

      {/* Distribución por nivel */}
      <div>
        <h4 style={{
          margin: '0 0 16px 0',
          color: '#374151',
          fontSize: '16px',
          fontWeight: 600
        }}>
          📋 Distribución por Nivel
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px'
        }}>
          <div style={levelItemStyle}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>ℹ️</span>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151',
                textTransform: 'uppercase'
              }}>
                INFO
              </span>
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#2563eb'
            }}>
              {stats.byLevel.info.toLocaleString()}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {stats.total > 0 ? ((stats.byLevel.info / stats.total) * 100).toFixed(1) : 0}%
            </div>
          </div>

          <div style={levelItemStyle}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151',
                textTransform: 'uppercase'
              }}>
                WARNING
              </span>
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#d97706'
            }}>
              {stats.byLevel.warning.toLocaleString()}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {stats.total > 0 ? ((stats.byLevel.warning / stats.total) * 100).toFixed(1) : 0}%
            </div>
          </div>

          <div style={levelItemStyle}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>❌</span>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151',
                textTransform: 'uppercase'
              }}>
                ERROR
              </span>
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#dc2626'
            }}>
              {stats.byLevel.error.toLocaleString()}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {stats.total > 0 ? ((stats.byLevel.error / stats.total) * 100).toFixed(1) : 0}%
            </div>
          </div>

          <div style={levelItemStyle}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>🚨</span>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151',
                textTransform: 'uppercase'
              }}>
                CRITICAL
              </span>
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#991b1b'
            }}>
              {stats.byLevel.critical.toLocaleString()}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {stats.total > 0 ? ((stats.byLevel.critical / stats.total) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 