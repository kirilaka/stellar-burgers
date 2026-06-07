import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOrders } from '../../services/slices/feedSlice';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { getprofileOrders } from '../../services/slices/orderSlice';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams();
  const feedOrders = useSelector(getOrders);
  const profileOrders = useSelector(getprofileOrders);
  const ingredients = useSelector(getIngredients);

  const [orderData, setOrderData] = useState(
    [...feedOrders, ...profileOrders].find(
      (item) => item.number === Number(number)
    )
  );

  useEffect(() => {
    if (!orderData) {
      getOrderByNumberApi(Number(number)).then((res) => {
        setOrderData(res.orders[0]);
      });
    }
  }, [number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
