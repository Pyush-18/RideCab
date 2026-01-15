import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth as firebaseAuth } from "../../firebase/config";

const API_URL = "http://localhost:5000/api";

const getAuthToken = async () => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  return await user.getIdToken();
};

export const initiatePayment = createAsyncThunk(
  "payment/initiate",
  async ({ bookingData, amount, tripType }, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingData,
          amount,
          tripType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create payment order");
      }

      return data;
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
      const { orderId, amount, key, bookingId, paymentId } = paymentData;

      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () =>
            reject(new Error("Failed to load Razorpay SDK"));
        });
      }

      return new Promise((resolve, reject) => {
        const options = {
          key: key,
          amount: amount,
          currency: "INR",
          name: "First Cab",
          description: "Cab Booking Payment",
          order_id: orderId,
          handler: async function (response) {
            try {
              const token = await getAuthToken();

              const verifyResponse = await fetch(`${API_URL}/payments/verify`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  paymentId: paymentId,
                  bookingId: bookingId,
                }),
              });

              const verifyData = await verifyResponse.json();

              if (!verifyResponse.ok) {
                throw new Error(
                  verifyData.message || "Payment verification failed"
                );
              }

              if (onSuccess) {
                onSuccess();
              }

              resolve({
                success: true,
                paymentId,
                bookingId,
                message: "Payment successful",
              });
            } catch (error) {
              console.error("Payment verification error:", error);
              reject(error);
            }
          },
          modal: {
            ondismiss: function () {
              reject(new Error("Payment cancelled by user"));
            },
          },
          theme: {
            color: "#f59e0b",
          },
          prefill: {
            email: firebaseAuth.currentUser?.email || "",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", function (response) {
          reject(new Error(response.error.description || "Payment failed"));
        });
        razorpay.open();
      });
    } catch (error) {
      console.error("Razorpay payment error:", error);
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
  async (_, { rejectWithValue }) => {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error("User must be authenticated");
      }

      const q = query(
        collection(db, "payments"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const payments = [];

      querySnapshot.forEach((doc) => {
        payments.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      payments.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB - dateA;
      });

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

export const refundPayment = createAsyncThunk(
  "payment/refund",
  async (bookingId, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/payments/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process refund");
      }

      return data;
    } catch (error) {
      console.error("Refund error:", error);
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
      // Fetch all payments
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })

      // Initiate payment
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

      // Process Razorpay payment
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

      // Fetch user payments
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

      // Fetch payment by ID
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
      .addCase(refundPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(refundPayment.rejected, (state, action) => {
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
