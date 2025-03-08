import { useDispatch } from 'react-redux';
import { addNotification } from '../features/notificationSlice';

const useNotification = () => {
  const dispatch = useDispatch();

  const showNotification = (notification) => {
    dispatch(addNotification(notification));
  };

  return showNotification;
};

export default useNotification;