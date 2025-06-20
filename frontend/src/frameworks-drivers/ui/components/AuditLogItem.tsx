import React, { useState } from 'react';
import { AuditLog } from '../../../domain/entities/AuditLog';

interface AuditLogItemProps {
  log: AuditLog;
}

export const AuditLogItem: React.FC<AuditLogItemProps> = ({ log }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      <div 
        style={{
          padding: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background-color 0.2s',
          backgroundColor: expanded ? '#f9fafb' : 'white'
        }}
        onClick={toggleExpanded}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = expanded ? '#f9fafb' : 'white'}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            minWidth: '40px'
          }}>
            <span style={{ fontSize: '18px' }} title={`Acción: ${log.action}`}>
              {log.getActionIcon()}
            </span>
            <span style={{ fontSize: '18px' }} title={`Recurso: ${log.resource}`}>
              {log.getResourceIcon()}
            </span>
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 500,
              color: '#111827',
              marginBottom: '4px'
            }}>
              {log.message}
            </div>
            <div style={{
              display: 'flex',
              gap: '16px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <span style={{ fontFamily: 'monospace' }}>
                {log.getFormattedTimestamp()}
              </span>
              {log.resourceId && (
                <span style={{ color: '#374151', fontFamily: 'monospace' }}>
                  ID: {log.resourceId}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              backgroundColor: log.getLevelColor()
            }}>
              {log.level}
            </span>
          </div>
        </div>

        <div style={{ marginLeft: '16px' }}>
          <span style={{
            transition: 'transform 0.2s',
            display: 'inline-block',
            color: '#9ca3af',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)'
          }}>
            ▶
          </span>
        </div>
      </div>

      {expanded && (
        <div style={{
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          padding: '16px'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{
              margin: '0 0 12px 0',
              color: '#374151',
              fontSize: '14px',
              fontWeight: 600
            }}>
              Información Técnica
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '8px'
            }}>
              <div style={{ fontSize: '14px', color: '#4b5563' }}>
                <strong style={{ color: '#374151' }}>ID:</strong> {log.id}
              </div>
              <div style={{ fontSize: '14px', color: '#4b5563' }}>
                <strong style={{ color: '#374151' }}>Acción:</strong> {log.action}
              </div>
              <div style={{ fontSize: '14px', color: '#4b5563' }}>
                <strong style={{ color: '#374151' }}>Recurso:</strong> {log.resource}
              </div>
              {log.resourceId && (
                <div style={{ fontSize: '14px', color: '#4b5563' }}>
                  <strong style={{ color: '#374151' }}>ID del Recurso:</strong> {log.resourceId}
                </div>
              )}
              <div style={{ fontSize: '14px', color: '#4b5563' }}>
                <strong style={{ color: '#374151' }}>Nivel:</strong> {log.level}
              </div>
              <div style={{ fontSize: '14px', color: '#4b5563' }}>
                <strong style={{ color: '#374151' }}>Timestamp:</strong> {log.timestamp.toISOString()}
              </div>
            </div>
          </div>

          {(log.userAgent || log.ipAddress) && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{
                margin: '0 0 12px 0',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 600
              }}>
                Información de Cliente
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '8px'
              }}>
                {log.ipAddress && (
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>
                    <strong style={{ color: '#374151' }}>IP:</strong> {log.ipAddress}
                  </div>
                )}
                {log.userAgent && (
                  <div style={{ fontSize: '14px', color: '#4b5563', gridColumn: '1 / -1' }}>
                    <strong style={{ color: '#374151' }}>User Agent:</strong>
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      background: '#f3f4f6',
                      padding: '4px',
                      borderRadius: '4px',
                      marginTop: '4px',
                      wordBreak: 'break-all'
                    }}>
                      {log.userAgent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {log.details && Object.keys(log.details).length > 0 && (
            <div>
              <h4 style={{
                margin: '0 0 12px 0',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 600
              }}>
                Detalles Adicionales
              </h4>
              <pre style={{
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                padding: '12px',
                fontSize: '12px',
                overflowX: 'auto',
                margin: 0
              }}>
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}


    </div>
  );
}; 