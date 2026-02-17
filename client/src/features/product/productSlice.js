import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProducts,
  fetchProductsByFilters,
  fetchBrands,
  fetchCategories,
  fetchMakes,
  createMake,
  createBrand,
  createCategory,
  fetchProductById,
  createProduct,
  updateProduct,
} from "./productAPI";

const initialState = {
  products: [],
  brands: [],
  categories: [],
  makes: [],
  status: "idle",
  totalItems: 0,
  selectedProduct: null,
  error: null,
};



export const fetchProductByIdAsync = createAsyncThunk(
  "product/fetchProductById",
  async (id) => {
    const response = await fetchProductById(id);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchProductsByFiltersAsync = createAsyncThunk(
  "product/fetchProductsByFilters",
  async ({ filter, sort, pagination, admin }) => {
    const response = await fetchProductsByFilters(filter, sort, pagination,admin);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchBrandsAsync = createAsyncThunk(
  "product/fetchBrands",
  async () => {
    const response = await fetchBrands();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const fetchCategoriesAsync = createAsyncThunk(
  "product/fetchCategories",
  async () => {
    const response = await fetchCategories();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchMakesAsync = createAsyncThunk(
  "product/fetchMakes",
  async () => {
    const response = await fetchMakes();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const createMakeAsync = createAsyncThunk(
  "product/createMake",
  async (make) => {
    const response = await createMake(make);
    return response.data;
  }
);

export const createBrandAsync = createAsyncThunk(
  "product/createBrand",
  async (brand) => {
    const response = await createBrand(brand);
    return response.data;
  }
);

export const createCategoryAsync = createAsyncThunk(
  "product/createCategory",
  async (category) => {
    const response = await createCategory(category);
    return response.data;
  }
);

export const createProductAsync = createAsyncThunk(
  "product/create",
  async (product) => {
    const response = await createProduct(product);
    return response.data;
  }
);

export const updateProductAsync = createAsyncThunk(
  "product/update",
  async (update) => {
    const response = await updateProduct(update);
    return response.data;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    resetProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFiltersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = (action.payload.products)
            ? action.payload.products
            : [];
        state.totalItems = action.payload.totalItems 
    })
    
   
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands = action.payload;
      })
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories = action.payload;
      })
      .addCase(fetchMakesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMakesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.makes = action.payload;
      })
      .addCase(createMakeAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createMakeAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.makes.push(action.payload);
      })
      .addCase(createBrandAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createBrandAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands.push(action.payload);
      })
      .addCase(createCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories.push(action.payload);
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedProduct = action.payload;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        try{
          state.products.push(action.payload);
        }
        catch(error){
         
        }
        
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        let index;
        try {
           index = state.products.findIndex(
            (product) => product.id === action.payload.id
          );
        } catch (error) {
          
        }
        state.products[index] = action.payload;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductByIdAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error;
      })
  },
});

export const { clearSelectedProduct } = productSlice.actions;

export const selectAllProducts = (state) => state.product.products;

export const selectBrands = (state) => state.product.brands;

export const selectCategories = (state) => state.product.categories;

export const selectMakes = (state) => state.product.makes;

export const selectProductById = (state) => state.product.selectedProduct;

export const selectStatus = (state) => state.product.status;

export const selectTotalItems = (state) => state.product.totalItems;

export const selectError = (state) => state.product.error;
export const { resetProductError } = productSlice.actions;

export default productSlice.reducer;
