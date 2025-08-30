import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import { db } from '../config/firebase';
import { doc, getDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const TaskDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    fetchTask();
    fetchSubmission();
  }, [id]);

  const fetchTask = async () => {
    try {
      const docRef = doc(db, 'tasks', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const taskData = { id: docSnap.id, ...docSnap.data() };
        
        // Fetch bids for this task
        const bidsQuery = query(collection(db, 'bids'), where('taskId', '==', id));
        const bidsSnapshot = await getDocs(bidsQuery);
        const bidsData = bidsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        taskData.bids = bidsData;
        setTask(taskData);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const fetchSubmission = async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.SUBMISSIONS}/task/${id}`);
      setSubmission(response.data);
    } catch (error) {
      console.error('Error fetching submission:', error);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to submit a bid');
      return;
    }
    
    try {
      await addDoc(collection(db, 'bids'), {
        taskId: id,
        amount: parseInt(bidAmount),
        proposal: bidProposal,
        bidderId: user.uid,
        bidderName: user.displayName || user.email,
        status: 'PENDING',
        createdAt: new Date()
      });
      setBidAmount('');
      setBidProposal('');
      fetchTask();
      alert('Bid submitted successfully!');
    } catch (error) {
      alert('Error submitting bid');
    }
  };

  const handleBidAction = async (bidId, status) => {
    try {
      await api.put(`${API_ENDPOINTS.BIDS}/${bidId}/status`, { status });
      fetchTask();
      alert(`Bid ${status.toLowerCase()} successfully!`);
    } catch (error) {
      alert('Error updating bid status');
    }
  };

  const isOwner = task?.posterId === user?.uid;
  const acceptedBid = task?.bids?.find(bid => bid.status === 'ACCEPTED');

  if (!task) return <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center"><div className="text-gray-900 dark:text-white">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">← Back to Dashboard</Link>
        
        <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{task.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{task.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="font-medium">Budget: </span>
              <span className="text-green-600">₹{task.budgetMin} - ₹{task.budgetMax}</span>
            </div>
            <div>
              <span className="font-medium">Deadline: </span>
              <span>{new Date(task.deadline).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium">Category: </span>
              <span>{task.category}</span>
            </div>
            <div>
              <span className="font-medium">Posted by: </span>
              <span>{task.posterName}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Current Bids ({task.bids?.length || 0})</h3>
            {task.bids?.map((bid) => (
              <div key={bid.id} className="border dark:border-gray-600 p-4 rounded mb-2 bg-gray-50 dark:bg-dark-bg">
                <div className="flex justify-between items-start">
                  <div>
                    <Link 
                      to={`/profile/${bid.bidderId}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {bid.bidderName || 'Anonymous'}
                    </Link>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      bid.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      bid.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bid.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-bold text-lg">₹{bid.amount}</span>
                    {isOwner && bid.status === 'PENDING' && (
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => handleBidAction(bid.id, 'ACCEPTED')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleBidAction(bid.id, 'REJECTED')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{bid.proposal}</p>
              </div>
            ))}
          </div>
        </div>

        {acceptedBid && !submission && (
          <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-100">
              {isOwner ? 'Waiting for Submission' : 'Submit Your Work'}
            </h3>
            <p className="text-blue-700 dark:text-blue-200">
              Bid accepted by {acceptedBid.bidderName} for ₹{acceptedBid.amount}
            </p>
            {!isOwner && acceptedBid.bidderId === user?.uid && (
              <Link
                to={`/submit/${id}`}
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Submit Work
              </Link>
            )}
          </div>
        )}

        {submission && (
          <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 text-green-900 dark:text-green-100">Work Submitted</h3>
            
            <div className="bg-white dark:bg-dark-card p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Submission Details</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{submission.description}</p>
              
              {submission.linkUrl && (
                <div className="mb-2">
                  <span className="font-medium">Project Link: </span>
                  <a 
                    href={submission.linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {submission.linkUrl}
                  </a>
                </div>
              )}
              
              {submission.fileUrl && (
                <div className="mb-2">
                  <span className="font-medium">File: </span>
                  <a 
                    href={submission.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Download/View File
                  </a>
                </div>
              )}
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Submitted by {submission.submitter?.name} on {new Date(submission.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            {isOwner && (
              <div className="flex space-x-4">
                <Link
                  to={`/payment/${id}`}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  Pay ₹{acceptedBid?.amount}
                </Link>
                <button className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
                  Request Changes
                </button>
              </div>
            )}
            
            {!isOwner && submission.submitterId === user?.uid && (
              <div className="text-green-700 dark:text-green-200">
                ✓ Your work has been submitted. Waiting for payment from the task owner.
              </div>
            )}
          </div>
        )}

        {!isOwner && !acceptedBid && !submission && (
          <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Place Your Bid</h3>
            <form onSubmit={handleBidSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Bid Amount (₹)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded dark:bg-dark-bg dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Proposal</label>
                <textarea
                  value={bidProposal}
                  onChange={(e) => setBidProposal(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded dark:bg-dark-bg dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Submit Bid
              </button>
            </form>
          </div>
        )}

        {isOwner && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              You cannot bid on your own task. Review the bids above and accept the best one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;