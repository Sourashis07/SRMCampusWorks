import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy, where, doc, deleteDoc } from 'firebase/firestore';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    minBudget: '',
    maxBudget: '',
    duration: 'all',
    sortBy: 'newest'
  });
  const { user } = useAuth();

  useEffect(() => {
    loadTasks();
    if (user) {
      loadProposals();
      loadSubmissions();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        deadline: doc.data().deadline
      }));
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadProposals = async () => {
    try {
      const q = query(collection(db, 'proposals'), where('bidderId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const proposalsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProposals(proposalsData);
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  const loadSubmissions = async () => {
    try {
      const q = query(collection(db, 'submissions'), where('submitterId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const submissionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
        loadTasks();
        alert('Task deleted successfully!');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task');
      }
    }
  };

  const getFilteredTasks = () => {
    let filtered;
    const proposalTaskIds = proposals.map(p => p.taskId);
    const acceptedProposals = proposals.filter(p => p.status === 'ACCEPTED');
    const acceptedTaskIds = acceptedProposals.map(p => p.taskId);
    const submittedTaskIds = submissions.map(s => s.taskId);
    
    if (activeTab === 'mytasks') {
      filtered = tasks.filter(task => task.posterId === user?.uid);
    } else if (activeTab === 'proposals') {
      // Show tasks where user has submitted proposals but not accepted yet
      filtered = tasks.filter(task => 
        proposalTaskIds.includes(task.id) && !acceptedTaskIds.includes(task.id)
      );
    } else if (activeTab === 'inprogress') {
      // Show tasks where user's proposal was accepted but not submitted yet
      filtered = tasks.filter(task => 
        acceptedTaskIds.includes(task.id) && !submittedTaskIds.includes(task.id)
      );
    } else if (activeTab === 'completed') {
      // Show tasks where user has submitted work
      filtered = tasks.filter(task => submittedTaskIds.includes(task.id));
    } else {
      // Browse: exclude own tasks and tasks user has proposals for
      filtered = tasks.filter(task => 
        task.posterId !== user?.uid && !proposalTaskIds.includes(task.id)
      );
    }

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

    // Apply search filter for browse tab
    if (activeTab === 'browse' && searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
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
              {activeTab === 'mytasks' ? 'My Posted Tasks' : 
               activeTab === 'proposals' ? 'My Proposals' : 
               activeTab === 'inprogress' ? 'In Progress Tasks' :
               activeTab === 'completed' ? 'Completed Tasks' : 'Available Tasks'} ({filteredTasks.length})
            </h2>
            
            {activeTab === 'browse' && (
              <div className="mb-8">
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tasks by title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-full shadow-lg focus:outline-none focus:border-blue-500 dark:bg-dark-bg dark:text-white transition-all duration-200"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
                        <div className="flex flex-col">
                          {activeTab === 'proposals' && (() => {
                            const userProposal = proposals.find(p => p.taskId === task.id);
                            return userProposal ? (
                              <span className={`text-xs px-2 py-1 rounded ${
                                userProposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                userProposal.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {userProposal.status}
                              </span>
                            ) : null;
                          })()}
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/task/${task.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                          >
                            View Details
                          </Link>
                          {activeTab === 'mytasks' && (
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </div>
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