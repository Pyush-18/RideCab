import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { refundPayment } from "./paymentSlice";

export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();

      if (!auth.user) {
        throw new Error("User must be authenticated to create a booking");
      }

      const booking = {
        ...bookingData,
        userId: auth.user.uid,
        userEmail: auth.user.email,
        userName: auth.user.displayName,
        mobileNumber: bookingData.mobileNumber,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "bookings"), booking);

      return {
        id: docRef.id,
        ...booking,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  "booking/fetchUserBookings",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();

      if (!auth.user) {
        throw new Error("User must be authenticated");
      }

      const q = query(
        collection(db, "bookings"),
        where("userId", "==", auth.user.uid)
      );

      const querySnapshot = await getDocs(q);
      const bookings = [];

      querySnapshot.forEach((doc) => {
        bookings.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return bookings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllBookings = createAsyncThunk(
  "booking/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(collection(db, "bookings"));
      const bookings = [];

      snapshot.forEach((doc) => {
        bookings.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return bookings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  "booking/fetchById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "bookings", bookingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        throw new Error("Booking not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "booking/updateStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "bookings", bookingId);

      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString(),
      });

      return { bookingId, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (bookingId, { rejectWithValue, dispatch }) => {
    try {
      const refundResult = await dispatch(refundPayment(bookingId)).unwrap();
      return { bookingId, refundResult };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    currentBooking: null,
    bookings: [],
    loading: false,
    error: null,
    createSuccess: false,
  },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.createSuccess = true;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })

      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all bookings
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })

      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { bookingId, status } = action.payload;
        if (state.currentBooking?.id === bookingId) {
          state.currentBooking.status = status;
        }
        state.error = null;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const { bookingId } = action.payload;
        const bookingIndex = state.bookings.findIndex(
          (b) => b.id === bookingId
        );
        if (bookingIndex !== -1) {
          state.bookings[bookingIndex].status = "cancelled";
          state.bookings[bookingIndex].paymentStatus = "refunded";
        }

        if (state.currentBooking?.id === bookingId) {
          state.currentBooking.status = "cancelled";
          state.currentBooking.paymentStatus = "refunded";
        }

        state.error = null;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearBookingError,
  clearCreateSuccess,
  setCurrentBooking,
  clearCurrentBooking,
  setBookings,
} = bookingSlice.actions;
export default bookingSlice.reducer;
