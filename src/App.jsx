import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import Profile from './components/Profile';
import SubmissionForm from './components/SubmissionForm';
import Payment from './components/Payment';
import Chat from './components/Chat';
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-4">Error: {this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  try {
    const { user, loading } = useAuth();

    if (loading) {
      return <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">Loading...</div>;
    }

    return (
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create-task" 
            element={user ? <TaskForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/task/:id" 
            element={user ? <TaskDetails /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile/:userId" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/submit/:taskId" 
            element={user ? <SubmissionForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/payment/:taskId" 
            element={user ? <Payment /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/chat/:taskId" 
            element={user ? <Chat /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    );
  } catch (error) {
    console.error('AppContent Error:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">App Error</h1>
          <p>Please check the console for details</p>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;