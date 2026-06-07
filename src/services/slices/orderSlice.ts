import { getOrdersApi, orderBurgerApi, TNewOrder } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const orderBurgerThunk = createAsyncThunk(
  'orders/orderBurgerThunk',
  async (id: string[]) => {
    const data = await orderBurgerApi(id);
    return data;
  }
);

export const getOrdersThunk = createAsyncThunk(
  'orders/getOrdersThunk',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

type TOrderState = {
  orders: TOrder[];
  order: TNewOrder | null;
  name: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orders: [],
  order: null,
  name: null,
  isLoading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearBurgerOrder: (state) => {
      state.order = null;
      state.name = null;
    }
  },
  selectors: {
    getBurgerOrder: (state) => state.order,
    getprofileOrders: (state) => state.orders,
    getIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
        state.name = action.payload.name;
      })
      .addCase(orderBurgerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      })

      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export default orderSlice.reducer;

export const { getBurgerOrder, getprofileOrders, getIsLoading } =
  orderSlice.selectors;

export const { clearBurgerOrder } = orderSlice.actions;
