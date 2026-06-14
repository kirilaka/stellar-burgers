import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];

  test('должен вернуть initial state при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN' };
    const state = ingredientsReducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  test('fetchIngredients.pending — устанавливает isLoading в true и сбрасывает error', () => {
    const startState = {
      ingredients: [],
      isLoading: false,
      error: 'Какая-то предыдущая ошибка'
    };

    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(startState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchIngredients.fulfilled — записывает ингредиенты и сбрасывает isLoading', () => {
    const startState = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(startState, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('fetchIngredients.rejected — записывает ошибку и сбрасывает isLoading', () => {
    const startState = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Network Error' }
    };
    const state = ingredientsReducer(startState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network Error');
  });

  test('fetchIngredients.rejected без сообщения — использует дефолтный текст ошибки', () => {
    const startState = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const action = {
      type: fetchIngredients.rejected.type,
      error: {}
    };
    const state = ingredientsReducer(startState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
