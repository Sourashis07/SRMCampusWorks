import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'assignment',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    fileLink: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to create a task');
      return;
    }
    
    try {
      const taskData = {
        ...formData,
        budgetMin: parseInt(formData.budgetMin),
        budgetMax: parseInt(formData.budgetMax),
        posterId: user.uid,
        posterName: user.displayName || user.email,
        status: 'OPEN',
        createdAt: new Date(),
        bids: []
      };
      
      await addDoc(collection(db, 'tasks'), taskData);
      
      alert('Task created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Task creation error:', error);
      alert('Error creating task');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-gray-900 dark:text-white">Please log in to create a task.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-14 h-14 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2.5s'}}></div>
      </div>
      
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8 relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Post a New Task</h1>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card p-8 rounded-lg shadow">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-bg dark:text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="assignment">Assignment</option>
              <option value="presentation">Presentation</option>
              <option value="project">Project</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Budget (₹)
              </label>
              <input
                type="number"
                name="budgetMin"
                value={formData.budgetMin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Budget (₹)
              </label>
              <input
                type="number"
                name="budgetMax"
                value={formData.budgetMax}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File Link (Optional)
            </label>
            <input
              type="url"
              name="fileLink"
              value={formData.fileLink}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-bg dark:text-white"
              placeholder="https://drive.google.com/... or any file sharing link"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Upload files to Google Drive/Dropbox and paste the link here if needed
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Post Task
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-600 dark:text-gray-400 relative z-10">
        <p>&copy; 2025 Campus Works. Built for students, by students.</p>
      </footer>
    </div>
  );
};

export default TaskForm;