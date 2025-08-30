import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { api, API_ENDPOINTS } from '../config/api';

export const useCurrentUser = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      syncUser();
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  }, [user]);

  const syncUser = async () => {
    try {
      console.log('Syncing user:', { uid: user.uid, email: user.email, name: user.displayName });
      
      const response = await api.post(API_ENDPOINTS.AUTH_SYNC, {
        uid: user.uid,
        email: user.email,
        name: user.displayName
      });
      
      console.log('User synced successfully:', response.data);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error syncing user:', error.response?.data || error.message);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { currentUser, loading };
};