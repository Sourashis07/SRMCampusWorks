import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, showTabs = false }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const getUserName = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0];
    }
    return 'John';
  };

  return (
    <nav className="bg-white dark:bg-dark-nav shadow px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Campus Works
          </Link>
          {showTabs && (
            <div className="relative flex space-x-6">
              <button
                onClick={() => setActiveTab('browse')}
                className={`font-medium py-2 ${activeTab === 'browse' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Browse
              </button>
              <button
                onClick={() => setActiveTab('mytasks')}
                className={`font-medium py-2 ${activeTab === 'mytasks' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                My Tasks
              </button>
              <button
                onClick={() => setActiveTab('proposals')}
                className={`font-medium py-2 ${activeTab === 'proposals' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                My Proposals
              </button>
              <button
                onClick={() => setActiveTab('inprogress')}
                className={`font-medium py-2 ${activeTab === 'inprogress' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                In Progress
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`font-medium py-2 ${activeTab === 'completed' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Completed
              </button>
              
              {/* Sliding blue line indicator */}
              <div 
                className="absolute bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ease-in-out"
                style={{
                  width: activeTab === 'browse' ? '56px' :
                         activeTab === 'mytasks' ? '68px' :
                         activeTab === 'proposals' ? '96px' :
                         activeTab === 'inprogress' ? '84px' :
                         activeTab === 'completed' ? '80px' : '56px',
                  left: activeTab === 'browse' ? '0px' :
                        activeTab === 'mytasks' ? '80px' :
                        activeTab === 'proposals' ? '172px' :
                        activeTab === 'inprogress' ? '292px' :
                        activeTab === 'completed' ? '400px' : '0px'
                }}
              />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/create-task"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post Task
          </Link>
          <Link
            to="/profile"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
          >
            {getUserName()}
          </Link>
          <button
            onClick={logout}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;