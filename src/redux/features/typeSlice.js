// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/appConstants";

const initialState = {
  types: [],
  isLoading: false,
  error: null,
  status: null,
};

export const createType = createAsyncThunk("types/create", async (typeData, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}inventory/type/createType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(typeData),
    });
    const data = await res.json();

    if (data.success) {
      return data;
    } else {
      return rejectWithValue(data.message);
    }
  } catch (error) {
    return rejectWithValue(error.message || "An error occurred");
  }
});

export const getAllTypesByProductId = createAsyncThunk("types/getAllByProductId", async (productId, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}inventory/type/getAllTypesByProductId/${productId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

    if (data.success) {
      return data.data || [];
    } else {
      return rejectWithValue(data.message);
    }
  } catch (error) {
    return rejectWithValue(error.message || "An error occurred");
  }
});

export const deleteTypeById = createAsyncThunk("types/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}/type/deleteTypeById/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

    if (data.success) {
      return id;
    } else {
      return rejectWithValue(data.message);
    }
  } catch (error) {
    return rejectWithValue(error.message || "An error occurred");
  }
});

const typesSlice = createSlice({
  name: "types",
  initialState,
  reducers: {
    emptyError: (state) => {
      state.error = null;
    },
    emptyStatus: (state) => {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.types.push(action.payload.data);
      })
      .addCase(createType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getAllTypesByProductId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTypesByProductId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.types = action.payload;
      })
      .addCase(getAllTypesByProductId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteTypeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTypeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.types = state.types.filter((type) => type.id !== action.payload);
      })
      .addCase(deleteTypeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { emptyError, emptyStatus } = typesSlice.actions;
export default typesSlice.reducer;
