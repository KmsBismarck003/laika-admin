import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  AuthProvider,
  ThemeProvider,
  NotificationProvider,
  SkeletonProvider
} from './context';
import { ErrorBoundary, ScrollToTop } from './components';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <SkeletonProvider minDuration={0}>
              <ErrorBoundary>
                <ScrollToTop />
                <AppRoutes />
              </ErrorBoundary>
            </SkeletonProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
