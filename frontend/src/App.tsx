import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { AddExpense } from './pages/AddExpense';
import { Expenses } from './pages/Expenses';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Reports } from './pages/Reports';
import { AuthPage } from './pages/AuthPage';
import { Categories } from './pages/Categories';
import { Budgets } from './pages/Budgets';
import { CalendarPage } from './pages/CalendarPage';
import { Recurring } from './pages/Recurring';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { InstallPrompt } from './components/InstallPrompt';
import './index.css';

export type PageType =
  | 'dashboard'
  | 'expenses'
  | 'add-expense'
  | 'categories'
  | 'budgets'
  | 'reports'
  | 'calendar'
  | 'recurring'
  | 'goals'
  | 'settings';

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const { isAuthenticated, isLoading } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'add-expense':
        return <AddExpense onSaved={() => setCurrentPage('dashboard')} />;
      case 'expenses':
        return <Expenses />;
      case 'reports':
        return <Reports />;
      case 'categories':
        return <Categories />;
      case 'budgets':
        return <Budgets />;
      case 'calendar':
        return <CalendarPage />;
      case 'recurring':
        return <Recurring />;
      case 'goals':
        return <Goals />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="text-sm font-medium text-slate-600">Restoring your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <InstallPrompt />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="min-w-0 flex-1">{renderPage()}</div>
      <InstallPrompt />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
