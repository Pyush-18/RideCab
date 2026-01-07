import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// Fetch all pricing
export const fetchAllPricing = createAsyncThunk(
  "pricing/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "pricing"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const pricing = [];

      querySnapshot.forEach((doc) => {
        pricing.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return pricing;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch pricing by route
export const fetchPricingByRoute = createAsyncThunk(
  "pricing/fetchByRoute",
  async (routeId, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "pricing"),
        where("routeId", "==", routeId)
      );
      const querySnapshot = await getDocs(q);
      const pricing = [];

      querySnapshot.forEach((doc) => {
        pricing.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return pricing;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch pricing by trip type
export const fetchPricingByTripType = createAsyncThunk(
  "pricing/fetchByTripType",
  async ({ routeId, tripType }, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "pricing"),
        where("routeId", "==", routeId),
        where("tripType", "==", tripType)
      );
      const querySnapshot = await getDocs(q);
      const pricing = [];

      querySnapshot.forEach((doc) => {
        pricing.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return pricing;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create new pricing
export const createPricing = createAsyncThunk(
  "pricing/create",
  async (pricingData, { rejectWithValue }) => {
    try {
      const pricing = {
        ...pricingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "pricing"), pricing);

      return {
        id: docRef.id,
        ...pricing,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update pricing
export const updatePricing = createAsyncThunk(
  "pricing/update",
  async ({ pricingId, updates }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "pricing", pricingId);

      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(docRef, updateData);

      return { pricingId, updates: updateData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete pricing
export const deletePricing = createAsyncThunk(
  "pricing/delete",
  async (pricingId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "pricing", pricingId));
      return pricingId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch pricing by ID
export const fetchPricingById = createAsyncThunk(
  "pricing/fetchById",
  async (pricingId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "pricing", pricingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        throw new Error("Pricing not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const pricingSlice = createSlice({
  name: "pricing",
  initialState: {
    pricing: [],
    currentPricing: null,
    loading: false,
    error: null,
    createSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    setCurrentPricing: (state, action) => {
      state.currentPricing = action.payload;
    },
    clearCurrentPricing: (state) => {
      state.currentPricing = null;
    },
    clearPricing: (state) => {
      state.pricing = [];
    },
    setPricing: (state, action) => {
      state.pricing = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all pricing
      .addCase(fetchAllPricing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPricing.fulfilled, (state, action) => {
        state.loading = false;
        state.pricing = action.payload;
        state.error = null;
      })
      .addCase(fetchAllPricing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by route
      .addCase(fetchPricingByRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPricingByRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.pricing = action.payload;
        state.error = null;
      })
      .addCase(fetchPricingByRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by trip type
      .addCase(fetchPricingByTripType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPricingByTripType.fulfilled, (state, action) => {
        state.loading = false;
        state.pricing = action.payload;
        state.error = null;
      })
      .addCase(fetchPricingByTripType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPricing.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createPricing.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.error = null;
      })
      .addCase(createPricing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })

      .addCase(updatePricing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePricing.fulfilled, (state, action) => {
        state.loading = false;
        const { pricingId, updates } = action.payload;
        if (state.currentPricing?.id === pricingId) {
          state.currentPricing = { ...state.currentPricing, ...updates };
        }
        state.error = null;
      })
      .addCase(updatePricing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePricing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePricing.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPricing?.id === action.payload) {
          state.currentPricing = null;
        }
        state.error = null;
      })
      .addCase(deletePricing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchPricingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPricingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPricing = action.payload;
        state.error = null;
      })
      .addCase(fetchPricingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCreateSuccess,
  setCurrentPricing,
  clearCurrentPricing,
  clearPricing,
  setPricing,
} = pricingSlice.actions;

export default pricingSlice.reducer;
