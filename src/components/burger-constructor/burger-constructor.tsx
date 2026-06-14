import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  getBunIngredientsBasket,
  getId,
  getIngredientsBasket
} from '../../services/slices/basketSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearBurgerOrder,
  orderBurgerThunk,
  getBurgerOrder,
  getIsLoading
} from '../../services/slices/orderSlice';
import { getIsAuth } from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = {
    bun: useSelector(getBunIngredientsBasket),
    ingredients: useSelector(getIngredientsBasket)
  };
  const idIngredients = useSelector(getId);
  const dispatch = useDispatch();
  const isAuth = useSelector(getIsAuth);
  const orderRequest = useSelector(getIsLoading);
  const orderModalData = useSelector(getBurgerOrder);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    isAuth ? dispatch(orderBurgerThunk(idIngredients)) : navigate('/login');
  };
  const closeOrderModal = () => {
    dispatch(clearBurgerOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
