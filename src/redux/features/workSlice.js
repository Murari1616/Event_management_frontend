// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/appConstants";

const initialState = {
  works: [],
  isLoading: false,
  error: null,
  status: null,
};

export const createWork = createAsyncThunk("works/create", async (workData, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}inventory/work/createWork`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(workData),
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

export const getAllWorksByProductId = createAsyncThunk("works/getAllByProductId", async (productId, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}inventory/work/getAllWorksByProductId/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`,
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

export const getAllWorkByProductAndTypeId = createAsyncThunk(
  "works/getAllWorkByProductAndTypeId",
  async ({ productId, typeId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${BASE_URL}inventory/work/getAllWorkByProductAndTypeId/${productId}/${typeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        return data.data || [];
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);


export const deleteWorkById = createAsyncThunk("works/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}/work/deleteWorkById/${id}`, {
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

export const getWorkById = createAsyncThunk("works/get", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}inventory/work/getWorkById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

    });
    const data = await res.json();

    if (data.success) {
      return data.data;
    } else {
      return rejectWithValue(data.message);
    }
  } catch (error) {
    return rejectWithValue(error.message || "An error occurred");
  }
});

const worksSlice = createSlice({
  name: "works",
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
      .addCase(createWork.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createWork.fulfilled, (state, action) => {
        state.isLoading = false;
        state.works.push(action.payload.data);
      })
      .addCase(createWork.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getAllWorksByProductId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllWorksByProductId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.works = action.payload;
      })
      .addCase(getAllWorksByProductId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getAllWorkByProductAndTypeId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllWorkByProductAndTypeId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.works = action.payload;
      })
      .addCase(getAllWorkByProductAndTypeId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteWorkById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteWorkById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.works = state.works.filter((work) => work.id !== action.payload);
      })
      .addCase(deleteWorkById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getWorkById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorkById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.works = [action.payload];
      })
      .addCase(getWorkById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { emptyError, emptyStatus } = worksSlice.actions;
export default worksSlice.reducer;
