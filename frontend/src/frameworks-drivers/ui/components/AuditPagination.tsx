import React from 'react';

interface AuditPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const AuditPagination: React.FC<AuditPaginationProps> = ({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const buttonBaseStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    background: 'white',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    minWidth: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const buttonDisabledStyle = {
    ...buttonBaseStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
    background: '#f9fafb'
  };

  const buttonActiveStyle = {
    ...buttonBaseStyle,
    background: '#3b82f6',
    borderColor: '#3b82f6',
    color: 'white'
  };

  const buttonPrevNextStyle = {
    ...buttonBaseStyle,
    padding: '8px 16px',
    fontWeight: 500
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderTop: '1px solid #e5e7eb',
      marginTop: '20px',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <span>
          Mostrando {startItem.toLocaleString()} - {endItem.toLocaleString()} de {total.toLocaleString()} elementos
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={currentPage === 1 ? buttonDisabledStyle : buttonPrevNextStyle}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#9ca3af';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
        >
          ← Anterior
        </button>

        {/* Números de página */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span style={{
                  padding: '8px 4px',
                  color: '#9ca3af',
                  fontWeight: 'bold'
                }}>
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  style={currentPage === page ? buttonActiveStyle : { ...buttonBaseStyle, fontWeight: 500 }}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#9ca3af';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={currentPage === totalPages ? buttonDisabledStyle : buttonPrevNextStyle}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#9ca3af';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}; 