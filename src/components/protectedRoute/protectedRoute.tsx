import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getIsAuth } from '../../services/slices/authSlice';
import { useSelector } from '../../services/store';

export const ProtectedRoute = () => {
  const location = useLocation();

  const isAuth = useSelector(getIsAuth);

  if (!isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
};
