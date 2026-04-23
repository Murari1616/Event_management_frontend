// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/appConstants";
import { useToast } from "@/hooks/use-toast";

const initialState = {
    products: [],
    isLoading: false,
    error: null,
    status: null,
};

// Create Product
export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}inventory/product/createProduct`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(productData),
            });
            const data = await res.json();
            if (data.success) {

                return data;
            }
            return rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message || "An error occurred");
        }
    }
);


// Get All Products
export const getAllProducts = createAsyncThunk("products/getAll", async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(`${BASE_URL}inventory/product/getAllProducts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();
        if (data.success) return data;
        return rejectWithValue(data.message);
    } catch (error) {
        return rejectWithValue(error.message || "An error occurred");
    }
});

// Delete Product
export const deleteProductById = createAsyncThunk("products/delete", async (id, { rejectWithValue }) => {
    try {
        const res = await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (data.success) return id;
        return rejectWithValue(data.message);
    } catch (error) {
        return rejectWithValue(error.message || "An error occurred");
    }
});

// Products Slice
const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        emptyError: (state) => { state.error = null; },
        emptyStatus: (state) => { state.status = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => { state.isLoading = true; state.status = null; })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = "success";
                state.products.push(action.payload.data);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.status = "fail";
            })
            .addCase(getAllProducts.fulfilled, (state, action) => { state.products = action.payload.data; })
            .addCase(deleteProductById.fulfilled, (state, action) => { state.products = state.products.filter((p) => p.id !== action.payload); });
    },
});

export const { emptyError, emptyStatus } = productsSlice.actions;
export default productsSlice.reducer;
