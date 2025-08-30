import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import { db } from '../config/firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';

const SubmissionForm = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    linkUrl: '',
    fileUrl: ''
  });

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const docRef = doc(db, 'tasks', taskId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setTask({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to submit work');
      return;
    }
    
    try {
      await addDoc(collection(db, 'submissions'), {
        ...formData,
        taskId,
        submitterId: user.uid,
        submitterName: user.displayName || user.email,
        createdAt: new Date(),
        status: 'SUBMITTED'
      });
      
      alert('Submission uploaded successfully!');
      navigate(`/task/${taskId}`);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error uploading submission');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!task) return <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center"><div className="text-gray-900 dark:text-white">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Submit Your Work</h1>
          
          <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{task.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>
            <div className="text-green-600 font-bold">Budget: ₹{task.budgetMin} - ₹{task.budgetMax}</div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card p-8 rounded-lg shadow">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-bg dark:text-white"
                placeholder="Describe your work and approach..."
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Link
              </label>
              <input
                type="url"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-bg dark:text-white"
                placeholder="https://github.com/yourproject or live demo link"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                File Upload URL
              </label>
              <input
                type="url"
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-bg dark:text-white"
                placeholder="Google Drive, Dropbox, or other file sharing link"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload your files to Google Drive/Dropbox and paste the shareable link here
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Submit Work
              </button>
              <button
                type="button"
                onClick={() => navigate(`/task/${taskId}`)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmissionForm;