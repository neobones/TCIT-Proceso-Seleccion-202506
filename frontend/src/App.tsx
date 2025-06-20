import React from 'react';
import { PostsPage } from '@frameworks-drivers/ui/pages/PostsPage';
import { ErrorBoundary } from '@frameworks-drivers/ui/components/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <PostsPage />
      </div>
    </ErrorBoundary>
  );
};

export default App; 