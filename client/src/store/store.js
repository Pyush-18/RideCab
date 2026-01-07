import { configureStore } from '@reduxjs/toolkit';
import { authReducer,bookingReducer, paymentReducer, pricingReducer, routeReducer, usersReducer } from '.';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    routes: routeReducer,
    pricing: pricingReducer,
    users: usersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
