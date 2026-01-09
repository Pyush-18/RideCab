import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth as firebaseAuth } from "../../firebase/config";
import {
  loadRazorpayScript,
  razorpayConfig,
  formatAmountForRazorpay,
} from "../../services/razerpayConfig";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const initiatePayment = createAsyncThunk(
  "payment/initiate",
  async ({ bookingData, amount, tripType }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Parse amount - remove ₹ symbol and convert to number
      const numericAmount =
        typeof amount === "string"
          ? parseFloat(amount.replace(/[₹,]/g, ""))
          : amount;

      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error("Invalid amount");
      }

      // Convert to paisa (Razorpay expects amount in smallest currency unit)
      const amountInPaisa = Math.round(numericAmount * 100);

      // Create booking document first
      const bookingDoc = {
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        carName: bookingData.carName,
        carModel: bookingData.carModel,
        capacity: bookingData.capacity,
        luggage: bookingData.luggage,
        mobileNumber: bookingData.mobileNumber,
        from: bookingData.from,
        to: bookingData.to,
        route: bookingData.route,
        tripType: bookingData.tripType,
        selectedPickupDate: bookingData.selectedPickupDate,
        selectedPickupTime: bookingData.selectedPickupTime,
        selectedReturnDate: bookingData.selectedReturnDate || null,
        pricePerKm: bookingData.pricePerKm || null,
        minKm: bookingData.minKm || null,
        pricingId: bookingData.pricingId || null,
        amount: numericAmount,
        status: "pending",
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const bookingRef = await addDoc(collection(db, "bookings"), bookingDoc);
      const bookingId = bookingRef.id;
      
      // Create payment document
      const paymentDoc = {
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        bookingId: bookingId,
        amount: amountInPaisa,
        currency: "INR",
        status: "created",
        tripType: tripType,
        bookingDetails: {
          carName: bookingData.carName,
          carModel: bookingData.carModel,
          from: bookingData.from,
          to: bookingData.to,
          route: bookingData.route,
          capacity: bookingData.capacity,
          luggage: bookingData.luggage,
          tripType: bookingData.tripType,
          mobileNumber: bookingData.mobileNumber,
          selectedPickupDate: bookingData.selectedPickupDate,
          selectedPickupTime: bookingData.selectedPickupTime,
          selectedReturnDate: bookingData.selectedReturnDate || null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const paymentRef = await addDoc(collection(db, "payments"), paymentDoc);
      const paymentId = paymentRef.id;

      // FOR TESTING: Generate mock payment ID
      const mockRazorpayPaymentId = `pay_test_${Date.now()}`;

      return {
        paymentId,
        bookingId,
        amount: amountInPaisa,
        currency: "INR",
        bookingDetails: bookingData,
        // Mock Razorpay response for testing
        razorpayOrderId: `order_test_${Date.now()}`,
        razorpayPaymentId: mockRazorpayPaymentId,
        isMockPayment: true, // Flag to identify test payments
      };
    } catch (error) {
      console.error("Payment initiation error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const processRazorpayPayment = createAsyncThunk(
  "payment/processRazorpay",
  async ({ paymentData, onSuccess }, { rejectWithValue }) => {
    try {
      const { paymentId, bookingId, amount, isMockPayment } = paymentData;

      // FOR TESTING: If it's a mock payment, simulate success immediately
      if (isMockPayment) {
        // Simulate a small delay for realistic feel
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Update payment document
        const paymentRef = doc(db, "payments", paymentId);
        await updateDoc(paymentRef, {
          status: "success",
          razorpayPaymentId: paymentData.razorpayPaymentId,
          razorpayOrderId: paymentData.razorpayOrderId,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Update booking document
        const bookingRef = doc(db, "bookings", bookingId);
        await updateDoc(bookingRef, {
          status: "confirmed",
          paymentStatus: "completed",
          paymentId: paymentId,
          razorpayPaymentId: paymentData.razorpayPaymentId,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        if (onSuccess) {
          onSuccess();
        }

        return {
          success: true,
          paymentId,
          bookingId,
          message: "Payment successful (Test Mode)",
        };
      }

      // PRODUCTION CODE: Will be used when you add real Razorpay integration
      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: "INR",
        name: "Your Company Name",
        description: "Cab Booking Payment",
        order_id: paymentData.razorpayOrderId,
        handler: async function (response) {
          try {
            const paymentRef = doc(db, "payments", paymentId);
            await updateDoc(paymentRef, {
              status: "success",
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            const bookingRef = doc(db, "bookings", bookingId);
            await updateDoc(bookingRef, {
              status: "confirmed",
              paymentStatus: "completed",
              paymentId: paymentId,
              razorpayPaymentId: response.razorpay_payment_id,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            if (onSuccess) {
              onSuccess();
            }
          } catch (error) {
            console.error("Error updating payment:", error);
            throw error;
          }
        },
        modal: {
          ondismiss: function () {
            throw new Error("Payment cancelled by user");
          },
        },
        theme: {
          color: "#f59e0b",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      return {
        success: true,
        paymentId,
        bookingId,
      };
    } catch (error) {
      console.error("Razorpay payment error:", error);

      if (paymentData.paymentId) {
        const paymentRef = doc(db, "payments", paymentData.paymentId);
        await updateDoc(paymentRef, {
          status: "failed",
          error: error.message,
          updatedAt: new Date().toISOString(),
        });
      }

      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllPayments = createAsyncThunk(
  "payment/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(collection(db, "payments"));
      const payments = [];

      snapshot.forEach((doc) => {
        payments.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return payments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserPayments = createAsyncThunk(
  "payment/fetchUserPayments",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();

      if (!auth.user) {
        throw new Error("User must be authenticated");
      }

      const q = query(
        collection(db, "payments"),
        where("userId", "==", auth.user.uid)
      );

      const querySnapshot = await getDocs(q);
      const payments = [];

      querySnapshot.forEach((doc) => {
        payments.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return payments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  "payment/fetchById",
  async (paymentId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "payments", paymentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        throw new Error("Payment not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyPaymentStatus = createAsyncThunk(
  "payment/verifyStatus",
  async (paymentId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "payments", paymentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const paymentData = docSnap.data();
        return {
          id: docSnap.id,
          status: paymentData.status,
          ...paymentData,
        };
      } else {
        throw new Error("Payment not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    currentPayment: null,
    payments: [],
    loading: false,
    error: null,
    paymentSuccess: false,
    processingPayment: false,
  },
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearPaymentSuccess: (state) => {
      state.paymentSuccess = false;
    },
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    resetPaymentState: (state) => {
      state.currentPayment = null;
      state.error = null;
      state.paymentSuccess = false;
      state.processingPayment = false;
    },
    setPayments: (state, action) => {
      state.payments = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })

      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentSuccess = false;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        state.error = null;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(processRazorpayPayment.pending, (state) => {
        state.processingPayment = true;
        state.error = null;
      })
      .addCase(processRazorpayPayment.fulfilled, (state, action) => {
        state.processingPayment = false;
        state.paymentSuccess = true;
        state.currentPayment = {
          ...state.currentPayment,
          ...action.payload,
        };
        state.error = null;
      })
      .addCase(processRazorpayPayment.rejected, (state, action) => {
        state.processingPayment = false;
        state.error = action.payload;
        state.paymentSuccess = false;
      })

      .addCase(fetchUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyPaymentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPayment?.id === action.payload.id) {
          state.currentPayment = action.payload;
        }
      })
      .addCase(verifyPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearPaymentError,
  clearPaymentSuccess,
  setCurrentPayment,
  clearCurrentPayment,
  resetPaymentState,
  setPayments,
} = paymentSlice.actions;

export default paymentSlice.reducer;
