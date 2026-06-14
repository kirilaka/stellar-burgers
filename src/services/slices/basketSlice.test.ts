import basketReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from './basketSlice';
import { orderBurgerThunk } from './orderSlice';
import { TIngredient, TBunIngredient } from '@utils-types';

describe('basketSlice', () => {
  const initialState = {
    bun: undefined,
    ingredients: []
  };

  const mockBun: TIngredient = {
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
  };

  const mockMain: TIngredient = {
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
  };

  test('должен вернуть initial state при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN' };
    const state = basketReducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  test('addIngredient — добавляет булку в state.bun', () => {
    const state = basketReducer(initialState, addIngredient(mockBun));

    expect(state.bun).toMatchObject(mockBun);
    expect(state.bun?._id).toBeDefined();
    expect(state.ingredients).toHaveLength(0);
  });

  test('addIngredient — добавляет начинку в state.ingredients', () => {
    const state = basketReducer(initialState, addIngredient(mockMain));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mockMain);
    expect(state.ingredients[0].id).toBeDefined();
    expect(state.bun).toBeUndefined();
  });

  test('addIngredient — генерирует уникальные id для одинаковых ингредиентов', () => {
    let state = basketReducer(initialState, addIngredient(mockMain));
    state = basketReducer(state, addIngredient(mockMain));

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
  });

  test('removeIngredient — удаляет ингредиент по id', () => {
    let state = basketReducer(initialState, addIngredient(mockMain));
    const idToRemove = state.ingredients[0].id;

    state = basketReducer(state, removeIngredient(idToRemove));

    expect(state.ingredients).toHaveLength(0);
  });

  test('removeIngredient — не падает при попытке удалить несуществующий id', () => {
    const state = basketReducer(initialState, addIngredient(mockMain));

    const newState = basketReducer(state, removeIngredient('non-existent-id'));

    expect(newState.ingredients).toHaveLength(1);
  });

  test('moveIngredientUp — меняет местами ингредиенты при перемещении вверх', () => {
    let state = basketReducer(initialState, addIngredient(mockMain));
    state = basketReducer(state, addIngredient(mockBun));

    let testState = basketReducer(initialState, addIngredient(mockMain));
    testState = basketReducer(
      testState,
      addIngredient({
        ...mockMain,
        _id: 'second-id',
        name: 'Второй ингредиент'
      })
    );

    const firstId = testState.ingredients[0].id;
    const secondId = testState.ingredients[1].id;

    const movedState = basketReducer(testState, moveIngredientUp(1));

    expect(movedState.ingredients[0].id).toBe(secondId);
    expect(movedState.ingredients[1].id).toBe(firstId);
  });

  test('moveIngredientUp — ничего не делает при индексе 0', () => {
    let state = basketReducer(initialState, addIngredient(mockMain));
    state = basketReducer(
      state,
      addIngredient({
        ...mockMain,
        _id: 'second-id',
        name: 'Второй ингредиент'
      })
    );

    const newState = basketReducer(state, moveIngredientUp(0));

    expect(newState.ingredients).toEqual(state.ingredients);
  });

  test('moveIngredientDown — меняет местами ингредиенты при перемещении вниз', () => {
    let testState = basketReducer(initialState, addIngredient(mockMain));
    testState = basketReducer(
      testState,
      addIngredient({
        ...mockMain,
        _id: 'second-id',
        name: 'Второй ингредиент'
      })
    );

    const firstId = testState.ingredients[0].id;
    const secondId = testState.ingredients[1].id;

    const movedState = basketReducer(testState, moveIngredientDown(0));

    expect(movedState.ingredients[0].id).toBe(secondId);
    expect(movedState.ingredients[1].id).toBe(firstId);
  });

  test('moveIngredientDown — ничего не делает при индексе последнего элемента', () => {
    let state = basketReducer(initialState, addIngredient(mockMain));
    state = basketReducer(
      state,
      addIngredient({
        ...mockMain,
        _id: 'second-id',
        name: 'Второй ингредиент'
      })
    );

    const newState = basketReducer(state, moveIngredientDown(1));

    expect(newState.ingredients).toEqual(state.ingredients);
  });

  test('orderBurgerThunk.fulfilled — очищает корзину после успешного заказа', () => {
    let state = basketReducer(initialState, addIngredient(mockBun));
    state = basketReducer(state, addIngredient(mockMain));

    expect(state.bun).toBeDefined();
    expect(state.ingredients).toHaveLength(1);

    const action = { type: orderBurgerThunk.fulfilled.type, payload: {} };
    const newState = basketReducer(state, action);

    expect(newState.bun).toBeUndefined();
    expect(newState.ingredients).toHaveLength(0);
  });
});
