import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getIsAuth } from '../../services/slices/authSlice';
import { useSelector } from '../../services/store';

type Props = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: Props) => {
  const location = useLocation();
  const isAuth = useSelector(getIsAuth);

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
};
