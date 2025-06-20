import React, { useState } from 'react';
import { PostsPage } from '@frameworks-drivers/ui/pages/PostsPage';
import { AuditPage } from '@frameworks-drivers/ui/pages/AuditPage';
import { ErrorBoundary } from '@frameworks-drivers/ui/components/ErrorBoundary';
import './App.css';

type CurrentPage = 'posts' | 'audit';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('posts');

  const navLinkBaseStyle = {
    padding: '10px 20px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e5e7eb',
    borderRadius: '8px',
    background: 'white',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const navLinkActiveStyle = {
    ...navLinkBaseStyle,
    background: '#3b82f6',
    borderColor: '#3b82f6',
    color: 'white'
  };

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh' }}>
        <nav style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '70px'
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '24px',
                color: '#111827',
                fontWeight: 700
              }}>
                📝 Posts Manager
              </h1>
              <span style={{
                display: 'block',
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '2px'
              }}>
                Sistema de Gestión con Clean Architecture
              </span>
            </div>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button 
                style={currentPage === 'posts' ? navLinkActiveStyle : navLinkBaseStyle}
                onClick={() => setCurrentPage('posts')}
                onMouseEnter={(e) => {
                  if (currentPage !== 'posts') {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 'posts') {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                📝 Posts
              </button>
              <button 
                style={currentPage === 'audit' ? navLinkActiveStyle : navLinkBaseStyle}
                onClick={() => setCurrentPage('audit')}
                onMouseEnter={(e) => {
                  if (currentPage !== 'audit') {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 'audit') {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                🔍 Auditoría
              </button>
            </div>
          </div>
        </nav>

        <main style={{
          minHeight: 'calc(100vh - 70px)'
        }}>
          {currentPage === 'posts' && <PostsPage />}
          {currentPage === 'audit' && <AuditPage />}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App; 