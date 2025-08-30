import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCurrentUser } from '../hooks/useCurrentUser';
import Navbar from './Navbar';
import { api, API_ENDPOINTS } from '../config/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [filters, setFilters] = useState({
    category: 'all',
    minBudget: '',
    maxBudget: '',
    duration: 'all',
    sortBy: 'newest'
  });
  const { user } = useAuth();
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.TASKS);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const getFilteredTasks = () => {
    let filtered = activeTab === 'mytasks' 
      ? tasks.filter(task => task.posterId === currentUser?.id)
      : tasks.filter(task => task.posterId !== currentUser?.id);

    // Apply filters
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    if (filters.minBudget) {
      filtered = filtered.filter(task => task.budgetMax >= parseInt(filters.minBudget));
    }

    if (filters.maxBudget) {
      filtered = filtered.filter(task => task.budgetMin <= parseInt(filters.maxBudget));
    }

    if (filters.duration !== 'all') {
      const now = new Date();
      filtered = filtered.filter(task => {
        const deadline = new Date(task.deadline);
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        
        switch (filters.duration) {
          case 'urgent': return daysLeft <= 3;
          case 'week': return daysLeft <= 7;
          case 'month': return daysLeft <= 30;
          default: return true;
        }
      });
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'budget-high': return b.budgetMax - a.budgetMax;
        case 'budget-low': return a.budgetMin - b.budgetMin;
        case 'deadline': return new Date(a.deadline) - new Date(b.deadline);
        default: return 0;
      }
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const groupTasksByCategory = (tasks) => {
    return tasks.reduce((groups, task) => {
      const category = task.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(task);
      return groups;
    }, {});
  };

  const tasksByCategory = activeTab === 'browse' && filters.category === 'all' 
    ? groupTasksByCategory(filteredTasks) 
    : { [filters.category || 'All Tasks']: filteredTasks };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} showTabs={true} />

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 bg-white dark:bg-dark-card p-6 rounded-lg shadow h-fit">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filters</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border rounded dark:bg-dark-bg dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="assignment">Assignment</option>
                <option value="presentation">Presentation</option>
                <option value="project">Project</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Budget Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minBudget}
                  onChange={(e) => setFilters({...filters, minBudget: e.target.value})}
                  className="w-full px-3 py-2 border rounded dark:bg-dark-bg dark:border-gray-600 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxBudget}
                  onChange={(e) => setFilters({...filters, maxBudget: e.target.value})}
                  className="w-full px-3 py-2 border rounded dark:bg-dark-bg dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Duration</label>
              <select
                value={filters.duration}
                onChange={(e) => setFilters({...filters, duration: e.target.value})}
                className="w-full px-3 py-2 border rounded dark:bg-dark-bg dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Durations</option>
                <option value="urgent">Urgent (≤3 days)</option>
                <option value="week">This Week (≤7 days)</option>
                <option value="month">This Month (≤30 days)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="w-full px-3 py-2 border rounded dark:bg-dark-bg dark:border-gray-600 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="budget-high">Highest Budget</option>
                <option value="budget-low">Lowest Budget</option>
                <option value="deadline">Deadline Soon</option>
              </select>
            </div>

            <button
              onClick={() => setFilters({ category: 'all', minBudget: '', maxBudget: '', duration: 'all', sortBy: 'newest' })}
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {activeTab === 'mytasks' ? 'My Posted Tasks' : 'Available Tasks'} ({filteredTasks.length})
            </h2>
            
            {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
              <div key={category} className="mb-8">
                {activeTab === 'browse' && filters.category === 'all' && (
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 capitalize">
                    {category} ({categoryTasks.length})
                  </h3>
                )}
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryTasks.map((task) => (
                    <div key={task.id} className="bg-white dark:bg-dark-card p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                          task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{task.description}</p>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-green-600 font-bold">
                          ₹{task.budgetMin} - ₹{task.budgetMax}
                        </span>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                          {task.category}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {(() => {
                            const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                            return daysLeft > 0 ? `${daysLeft} days left` : 'Expired';
                          })()} 
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {task.bids?.length || 0} bids
                        </span>
                        <Link
                          to={`/task/${task.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No tasks found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;