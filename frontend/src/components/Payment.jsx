import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

const Payment = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [acceptedProposal, setAcceptedProposal] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskAndSubmission();
  }, [taskId]);

  const fetchTaskAndSubmission = async () => {
    try {
      // Fetch task
      const taskRef = doc(db, 'tasks', taskId);
      const taskSnap = await getDoc(taskRef);
      if (taskSnap.exists()) {
        setTask({ id: taskSnap.id, ...taskSnap.data() });
      }
      
      // Fetch submission
      const submissionsQuery = query(collection(db, 'submissions'), where('taskId', '==', taskId));
      const submissionsSnap = await getDocs(submissionsQuery);
      if (!submissionsSnap.empty) {
        setSubmission({ id: submissionsSnap.docs[0].id, ...submissionsSnap.docs[0].data() });
      }
      
      // Fetch accepted proposal
      const proposalsQuery = query(
        collection(db, 'proposals'), 
        where('taskId', '==', taskId),
        where('status', '==', 'ACCEPTED')
      );
      const proposalsSnap = await getDocs(proposalsQuery);
      if (!proposalsSnap.empty) {
        setAcceptedProposal({ id: proposalsSnap.docs[0].id, ...proposalsSnap.docs[0].data() });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQR = () => {
    if (!upiId || !acceptedProposal) return;
    
    const amount = acceptedProposal.amount;
    const platformFee = Math.round(amount * 0.05);
    const totalAmount = amount + platformFee;
    
    const upiUrl = `upi://pay?pa=${upiId}&pn=Campus Works&am=${totalAmount}&cu=INR&tn=Payment for ${task?.title}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    setQrCode(qrUrl);
  };

  const handlePaymentComplete = () => {
    alert('Payment completed! The freelancer will be notified.');
    navigate('/dashboard');
  };

  if (loading || !task || !submission || !acceptedProposal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  const amount = acceptedProposal.amount;
  const platformFee = Math.round(amount * 0.05);
  const totalAmount = amount + platformFee;

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
                <span className="font-medium">{acceptedProposal.bidderName}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Agreed Amount:</span>
                <span className="font-bold text-green-600">₹{amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Platform Fee (5%):</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span>₹{totalAmount}</span>
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

          <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Payment Method</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter UPI ID for Payment
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@paytm or 9876543210@ybl"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 dark:text-white"
                />
              </div>
              <button
                onClick={generateQR}
                disabled={!upiId}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400"
              >
                Generate QR Code
              </button>
              
              {qrCode && (
                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">Scan QR code to pay ₹{totalAmount}</p>
                  <img src={qrCode} alt="UPI QR Code" className="mx-auto border rounded-lg" />
                  <button
                    onClick={handlePaymentComplete}
                    className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700"
                  >
                    Mark as Paid
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => navigate(`/task/${taskId}`)}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400"
            >
              Back to Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;