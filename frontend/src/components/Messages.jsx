import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { Send } from 'lucide-react';

const Messages = () => {
  const { taskId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [task, setTask] = useState(null);
  const [acceptedProposal, setAcceptedProposal] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTaskAndProposal();
  }, [taskId]);

  useEffect(() => {
    if (!task || !acceptedProposal) return;

    const messagesQuery = query(
      collection(db, 'messages'),
      where('taskId', '==', taskId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [taskId, task, acceptedProposal]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTaskAndProposal = async () => {
    try {
      // Fetch task
      const taskQuery = query(collection(db, 'tasks'), where('__name__', '==', taskId));
      const taskSnapshot = await getDocs(taskQuery);
      if (!taskSnapshot.empty) {
        setTask({ id: taskSnapshot.docs[0].id, ...taskSnapshot.docs[0].data() });
      }

      // Fetch accepted proposal
      const proposalsQuery = query(
        collection(db, 'proposals'),
        where('taskId', '==', taskId),
        where('status', '==', 'ACCEPTED')
      );
      const proposalsSnapshot = await getDocs(proposalsQuery);
      if (!proposalsSnapshot.empty) {
        setAcceptedProposal({ id: proposalsSnapshot.docs[0].id, ...proposalsSnapshot.docs[0].data() });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !task || !acceptedProposal) return;

    try {
      await addDoc(collection(db, 'messages'), {
        taskId,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        message: newMessage.trim(),
        createdAt: new Date()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const isOwner = task?.posterId === user?.uid;
  const canAccess = isOwner || acceptedProposal?.bidderId === user?.uid;

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <Navbar />
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            You can only access messages for tasks where you are the owner or accepted freelancer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg h-96 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-600">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Messages - {task?.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isOwner ? `Chatting with ${acceptedProposal?.bidderName}` : `Chatting with ${task?.posterName}`}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user.uid
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {message.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t dark:border-gray-600">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;