import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { getUserName } from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(getUserName);
  return <AppHeaderUI userName={userName ?? ''} />;
};
