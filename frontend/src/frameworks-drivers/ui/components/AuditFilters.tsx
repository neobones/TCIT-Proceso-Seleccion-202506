import React, { useState } from 'react';
import { AuditAction, AuditResource, AuditLevel } from '../../../domain/entities/AuditLog';
import { AuditLogFilters } from '../../../domain/repositories/AuditLogRepository';

interface AuditFiltersProps {
  filters: AuditLogFilters;
  onFiltersChange: (filters: AuditLogFilters) => void;
  onClearFilters: () => void;
}

export const AuditFilters: React.FC<AuditFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof AuditLogFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
      page: 1, // Reset página al cambiar filtros
    });
  };

  const formatDateForInput = (date?: Date): string => {
    if (!date) return '';
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  const parseInputDate = (value: string): Date | undefined => {
    if (!value) return undefined;
    return new Date(value);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'page' && key !== 'limit' && value !== undefined && value !== ''
  );

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: 0,
          color: '#111827',
          fontSize: '18px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🔍</span>
          Filtros de Auditoría
        </h3>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            <span>🗑️</span>
            Limpiar filtros
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Acción
          </label>
          <select
            value={filters.action || ''}
            onChange={(e) => handleFilterChange('action', e.target.value as AuditAction | '')}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#111827'
            }}
          >
            <option value="">Todas las acciones</option>
            <option value={AuditAction.CREATE}>Crear</option>
            <option value={AuditAction.READ}>Leer</option>
            <option value={AuditAction.UPDATE}>Actualizar</option>
            <option value={AuditAction.DELETE}>Eliminar</option>
            <option value={AuditAction.LOGIN}>Iniciar sesión</option>
            <option value={AuditAction.LOGOUT}>Cerrar sesión</option>
            <option value={AuditAction.ERROR}>Error</option>
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Recurso
          </label>
          <select
            value={filters.resource || ''}
            onChange={(e) => handleFilterChange('resource', e.target.value as AuditResource | '')}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#111827'
            }}
          >
            <option value="">Todos los recursos</option>
            <option value={AuditResource.POST}>Posts</option>
            <option value={AuditResource.USER}>Usuarios</option>
            <option value={AuditResource.AUTH}>Autenticación</option>
            <option value={AuditResource.SYSTEM}>Sistema</option>
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Nivel
          </label>
          <select
            value={filters.level || ''}
            onChange={(e) => handleFilterChange('level', e.target.value as AuditLevel | '')}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#111827'
            }}
          >
            <option value="">Todos los niveles</option>
            <option value={AuditLevel.INFO}>Info</option>
            <option value={AuditLevel.WARNING}>Warning</option>
            <option value={AuditLevel.ERROR}>Error</option>
            <option value={AuditLevel.CRITICAL}>Critical</option>
          </select>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 200px 200px',
        gap: '16px',
        alignItems: 'end'
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Buscar en mensaje
          </label>
          <input
            type="text"
            placeholder="Buscar..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Fecha desde
          </label>
          <input
            type="date"
            value={formatDateForInput(filters.fromDate)}
            onChange={(e) => handleFilterChange('fromDate', parseInputDate(e.target.value))}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '6px'
          }}>
            Fecha hasta
          </label>
          <input
            type="date"
            value={formatDateForInput(filters.toDate)}
            onChange={(e) => handleFilterChange('toDate', parseInputDate(e.target.value))}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>ℹ️</span>
          Se encontraron filtros activos. Los resultados están filtrados.
        </div>
      )}
    </div>
  );
}; 