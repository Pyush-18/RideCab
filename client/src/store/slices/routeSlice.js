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

// Fetch all routes
export const fetchRoutes = createAsyncThunk(
  "routes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "routes"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const routes = [];

      querySnapshot.forEach((doc) => {
        routes.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return routes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch active routes only (for user-side)
export const fetchActiveRoutes = createAsyncThunk(
  "routes/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "routes"),
        where("active", "==", true),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const routes = [];

      querySnapshot.forEach((doc) => {
        routes.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return routes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create new route
export const createRoute = createAsyncThunk(
  "routes/create",
  async (routeData, { rejectWithValue }) => {
    try {
      const route = {
        ...routeData,
        trips: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "routes"), route);

      return {
        id: docRef.id,
        ...route,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update route
export const updateRoute = createAsyncThunk(
  "routes/update",
  async ({ routeId, updates }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "routes", routeId);

      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(docRef, updateData);

      return { routeId, updates: updateData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete route
export const deleteRoute = createAsyncThunk(
  "routes/delete",
  async (routeId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "routes", routeId));
      return routeId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Toggle route status
export const toggleRouteStatus = createAsyncThunk(
  "routes/toggleStatus",
  async ({ routeId, active }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "routes", routeId);
      await updateDoc(docRef, {
        active: !active,
        updatedAt: new Date().toISOString(),
      });

      return { routeId, active: !active };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch route by ID
export const fetchRouteById = createAsyncThunk(
  "routes/fetchById",
  async (routeId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "routes", routeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        throw new Error("Route not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const routesSlice = createSlice({
  name: "routes",
  initialState: {
    routes: [],
    currentRoute: null,
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
    setCurrentRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
    setRoutes: (state, action) => {
      state.routes = action.payload;
      state.loading = false;
    },
    clearCurrentRoute: (state) => {
      state.currentRoute = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all routes
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload;
        state.error = null;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch active routes
      .addCase(fetchActiveRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create route
      .addCase(createRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.error = null;
      })
      .addCase(createRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })

      // Update route
      .addCase(updateRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoute.fulfilled, (state, action) => {
        state.loading = false;
        const { routeId, updates } = action.payload;
        if (state.currentRoute?.id === routeId) {
          state.currentRoute = { ...state.currentRoute, ...updates };
        }
        state.error = null;
      })
      .addCase(updateRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete route
      .addCase(deleteRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoute.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentRoute?.id === action.payload) {
          state.currentRoute = null;
        }
        state.error = null;
      })
      .addCase(deleteRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle status
      .addCase(toggleRouteStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleRouteStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(toggleRouteStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchRouteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRouteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoute = action.payload;
        state.error = null;
      })
      .addCase(fetchRouteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCreateSuccess,
  setCurrentRoute,
  clearCurrentRoute,
  setRoutes,
} = routesSlice.actions;
export default routesSlice.reducer;
