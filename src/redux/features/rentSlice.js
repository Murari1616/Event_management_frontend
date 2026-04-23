// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/appConstants";

const initialState = {
    rents: [],
    unapprovedrents: [],
    isLoading: false,
    totalRecords: 0,
    currentPage: 1,
    totalPages: 0,
    error: null,
    status: null,
};

// Create Rent
export const createRent = createAsyncThunk(
    "rents/createRent",
    async (rentData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}rent/createRent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(rentData),
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

// Update Rent
export const updateRent = createAsyncThunk(
    "rents/updateRent",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            console.log("UPDATED", updatedData)
            const res = await fetch(`${BASE_URL}rent/updateRent/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(updatedData),
            });
            const data = await res.json();
            if (data.success) return { id, updatedData: data.data };
            return rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.message || "An error occurred");
        }
    }
);

// Get All Rents
export const getAllUnApprovedRents = createAsyncThunk("rents/getAllUnApprovedRents", async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(`${BASE_URL}rent/getAllUnApprovedRents`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        const data = await res.json();
        if (data.success) return data;
        return rejectWithValue(data.message);
    } catch (error) {
        return rejectWithValue(error.message || "An error occurred");
    }
});
export const getAllRentsByName = createAsyncThunk("rents/getAllRentsByName", async (name, { rejectWithValue }) => {
    try {
        const res = await fetch(`${BASE_URL}rent/getAllRentsByName?name=${encodeURIComponent(name)}`, {
            method: "GET",
            headers: {
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

export const getAllRents = createAsyncThunk(
    "rents/getAllRents",
    async ({ page = 1, limit = 20, search, date, days }, { rejectWithValue }) => {
        try {
            let url = `${BASE_URL}rent/getAllRents?page=${page}&limit=${limit}`;

            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            if (date) {
                url += `&date=${encodeURIComponent(date)}`;
            }

            if (days) {
                url += `&days=${encodeURIComponent(days)}`;
            }

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                return data;
            } else {
                const errorMsg =
                    data.error?.errors?.[0]?.message ||
                    data.message ||
                    "Failed to fetch rents";
                return rejectWithValue(errorMsg);
            }
        } catch (error) {
            const errorMsg =
                error instanceof Error ? error.message : "An error occurred";
            return rejectWithValue(errorMsg);
        }
    }
);


// Delete Rent
export const deleteRentById = createAsyncThunk("rents/delete", async (id, { rejectWithValue }) => {
    console.log("ID", id)
    try {
        const res = await fetch(`${BASE_URL}rent/deleteRent/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (data.success) return id;
        return rejectWithValue(data.message);
    } catch (error) {
        return rejectWithValue(error.message || "An error occurred");
    }
});

// Rents Slice
const rentsSlice = createSlice({
    name: "rents",
    initialState,
    reducers: {
        emptyError: (state) => { state.error = null; },
        emptyStatus: (state) => { state.status = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRent.pending, (state) => { state.isLoading = true; state.status = null; })
            .addCase(createRent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = "success";
                state.rents.push(action.payload.data);
            })
            .addCase(createRent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.status = "fail";
            })
            .addCase(updateRent.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(updateRent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = "success";
                const index = state.rents.findIndex((rent) => rent.id === action.payload.id);
                if (index !== -1) {
                    state.rents[index] = { ...state.rents[index], ...action.payload.updatedData };
                }
            })
            .addCase(updateRent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.status = "fail";
            })

        builder
            .addCase(getAllUnApprovedRents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUnApprovedRents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.unapprovedrents = action.payload.data;
            })
            .addCase(getAllUnApprovedRents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
        builder
            .addCase(getAllRentsByName.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllRentsByName.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rents = action.payload.data;
            })
            .addCase(getAllRentsByName.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // .addCase(getAllRents.fulfilled, (state, action) => { state.rents = action.payload.data; })
        // Get Appointment By ID
        builder
            .addCase(getAllRents.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(getAllRents.fulfilled, (state, action) => {
                if (action.payload.data) {
                    state.totalRecords = action.payload.data.totalRecords || 0;
                    state.rents = action.payload.data.data ?? [];
                    state.currentPage = action.payload.data.currentPage || 0;
                    state.totalPages = action.payload.data.totalPages || 0;
                    state.isLoading = false;
                }
            })

            .addCase(getAllRents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.status = "fail";
            })

            .addCase(deleteRentById.fulfilled, (state, action) => { state.rents = state.rents.filter((p) => p.id !== action.payload); });
    },
});

export const { emptyError, emptyStatus } = rentsSlice.actions;
export default rentsSlice.reducer;
