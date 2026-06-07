import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchFeedsApi,
  getIsLoading,
  getOrders
} from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeedsApi());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(getOrders);
  const isLoading = useSelector(getIsLoading);

  const handleGetFeeds = () => {
    dispatch(fetchFeedsApi());
  };

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
