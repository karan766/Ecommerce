import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrder, fetchAllOrder, updateOrder } from "./orderAPI";

const initialState = {
  orders: [],
  status: "idle",
  currentOrder: null,
  totalOrders: 0,
};
//we may need more info of current order

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (order) => {
    const response = await createOrder(order);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async (order) => {
    const response = await updateOrder(order);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchAllOrderAsync = createAsyncThunk(
  "order/fetchAllOrders",
  async ({ sort, pagination }) => {
    const response = await fetchAllOrder(sort, pagination);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(fetchAllOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        let index;
        try {
          index = state.orders.findIndex(
            (order) => order.id === action.payload.id
          );
        } catch (error) {
         
        }
        state.orders[index] = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;

export const selectCurrentOrder = (state) => state.order.currentOrder;

export const selectOrders = (state) => state.order.orders;

export const selectTotalOrders = (state) => state.order.totalOrders;

export default orderSlice.reducer;