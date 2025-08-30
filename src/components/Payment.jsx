import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import Navbar from './Navbar';
import axios from 'axios';

const Payment = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTaskAndSubmission();
  }, [taskId]);

  const fetchTaskAndSubmission = async () => {
    try {
      const [taskResponse, submissionResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/tasks/${taskId}`),
        axios.get(`http://localhost:5000/api/submissions/task/${taskId}`)
      ]);
      
      setTask(taskResponse.data);
      setSubmission(submissionResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const acceptedBid = task.bids.find(bid => bid.status === 'ACCEPTED');
      
      // Create payment order
      const response = await axios.post('http://localhost:5000/api/payments/create-order', {
        taskId,
        amount: acceptedBid.amount,
        payerId: currentUser.id
      });

      // Simulate payment success (in real app, integrate with Razorpay)
      alert('Payment successful! Task completed.');
      
      // Update task status to completed
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/status`, {
        status: 'COMPLETED'
      });
      
      navigate(`/task/${taskId}`);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!task || !submission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  const acceptedBid = task.bids.find(bid => bid.status === 'ACCEPTED');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Payment</h1>
          
          <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Task Summary</h2>
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{task.description}</p>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span>Freelancer:</span>
                <span className="font-medium">{acceptedBid?.bidder?.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Agreed Amount:</span>
                <span className="font-bold text-green-600">₹{acceptedBid?.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Platform Fee (5%):</span>
                <span>₹{Math.round(acceptedBid?.amount * 0.05)}</span>
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span>₹{acceptedBid?.amount + Math.round(acceptedBid?.amount * 0.05)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Submitted Work</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{submission.description}</p>
            
            {submission.linkUrl && (
              <div className="mb-2">
                <span className="font-medium">Project Link: </span>
                <a 
                  href={submission.linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Project
                </a>
              </div>
            )}
            
            {submission.fileUrl && (
              <div className="mb-2">
                <span className="font-medium">Files: </span>
                <a 
                  href={submission.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Download Files
                </a>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay ₹${acceptedBid?.amount + Math.round(acceptedBid?.amount * 0.05)}`}
            </button>
            <button
              onClick={() => navigate(`/task/${taskId}`)}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;