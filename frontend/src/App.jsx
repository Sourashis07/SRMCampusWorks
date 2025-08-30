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
import Messages from './components/Messages';
import Chat from './components/Chat';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-white">Loading...</div>;
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
          path="/messages/:taskId" 
          element={user ? <Messages /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/chat/:taskId" 
          element={user ? <Chat /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;