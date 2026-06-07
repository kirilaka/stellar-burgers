import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TBunIngredient, TIngredient } from '@utils-types';
import { orderBurgerThunk } from './orderSlice';

type TbasketState = {
  bun: TBunIngredient | undefined;
  ingredients: TIngredient[];
};

const initialState: TbasketState = {
  bun: undefined,
  ingredients: []
};

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload as TBunIngredient;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<TIngredient>) => {
      const index = state.ingredients.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.ingredients.splice(index, 1);
      }
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      if (index <= 0) return;

      [state.ingredients[index - 1], state.ingredients[index]] = [
        state.ingredients[index],
        state.ingredients[index - 1]
      ];
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      if (index >= state.ingredients.length - 1) return;

      [state.ingredients[index], state.ingredients[index + 1]] = [
        state.ingredients[index + 1],
        state.ingredients[index]
      ];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurgerThunk.fulfilled, (state) => {
      state.bun = undefined;
      state.ingredients = [];
    });
  },
  selectors: {
    getIngredientsBasket: (state) => state.ingredients,
    getBunIngredientsBasket: (state) => state.bun,
    getId: (state) =>
      [
        state.bun?._id,
        ...state.ingredients.map((item) => item._id),
        state.bun?._id
      ].filter(Boolean) as string[]
  }
});

export default basketSlice.reducer;

export const { getIngredientsBasket, getBunIngredientsBasket, getId } =
  basketSlice.selectors;

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} = basketSlice.actions;
