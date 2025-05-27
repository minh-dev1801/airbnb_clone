import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/client/store/slices/userSlice';

const useInitializeUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);
};

export default useInitializeUser;
