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
  async ({ bookingData, amount, tripType }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();

      if (!auth.user) {
        throw new Error("User must be authenticated to make payment");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
      }

      const paymentData = {
        userId: auth.user.uid,
        userEmail: auth.user.email,
        userName: auth.user.displayName,
        amount: formatAmountForRazorpay(amount),
        currency: razorpayConfig.currency,
        bookingDetails: bookingData,
        tripType,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const paymentDocRef = await addDoc(
        collection(db, "payments"),
        paymentData
      );

      return {
        paymentId: paymentDocRef.id,
        ...paymentData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const processRazorpayPayment = createAsyncThunk(
  "payment/processRazorpay",
  async ({ paymentData, onSuccess }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();

      return new Promise((resolve, reject) => {
        const options = {
          key: razorpayConfig.key,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: razorpayConfig.name,
          description: razorpayConfig.description,
          image: razorpayConfig.image,
          handler: async function (response) {
            try {
              const successData = {
                razorpayPaymentId: response.razorpay_payment_id,
                paymentId: paymentData.paymentId,
                status: "success",
              };

              await updateDoc(doc(db, "payments", paymentData.paymentId), {
                status: "success",
                razorpayPaymentId: response.razorpay_payment_id,
                completedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });

              const bookingData = {
                ...paymentData.bookingDetails,
                userId: auth.user.uid,
                userEmail: auth.user.email,
                userName: auth.user.displayName,
                paymentId: paymentData.paymentId,
                razorpayPaymentId: response.razorpay_payment_id,
                amount: paymentData.amount / 100,
                status: "confirmed",
                paymentStatus: "paid",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              const bookingDocRef = await addDoc(
                collection(db, "bookings"),
                bookingData
              );

              await updateDoc(doc(db, "payments", paymentData.paymentId), {
                bookingId: bookingDocRef.id,
                updatedAt: new Date().toISOString(),
              });

              try {
                const currentUser = firebaseAuth.currentUser;
                if (currentUser) {
                  const token = await currentUser.getIdToken();
                  console.log(token);
                  await axios.post(
                    `${API_URL}/notifications/booking-created`,
                    {
                      bookingId: bookingDocRef.id,
                      bookingData: {
                        id: bookingDocRef.id,
                        ...bookingData,
                      },
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                }
              } catch (notificationError) {
                console.error(
                  "Failed to send notification:",
                  notificationError
                );
              }

              if (onSuccess) onSuccess();
              resolve({ ...successData, bookingId: bookingDocRef.id });
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: auth.user.displayName || "",
            email: auth.user.email || "",
          },
          theme: razorpayConfig.theme,
          modal: {
            ondismiss: function () {
              reject(new Error("Payment cancelled by user"));
            },
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", async function (response) {
          await updateDoc(doc(db, "payments", paymentData.paymentId), {
            status: "failed",
            failureReason: response.error.description,
            razorpayPaymentId: response.error.metadata?.payment_id,
            updatedAt: new Date().toISOString(),
          });

          reject(new Error(response.error.description));
        });

        razorpay.open();
      });
    } catch (error) {
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
