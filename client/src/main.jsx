import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import CarRentalHome from "./components/CarRentalHome.jsx";
import PricingAndFAQ from "./components/PricingAndFAQ.jsx";
import Contact from "./components/pages/Contact";
import ScrollToTop from "./components/shared/ScrollToTop";
import AuthPage from "./components/pages/AuthPage";
import About from "./components/pages/About";
import { store } from "./store/store";
import { checkAuthState } from "./store/slices/authSlice";
import BookingsPage from "./components/pages/BookingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentHistory from "./components/ui/PaymentHistory";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminRoute from "./components/admin/AdminRoute";
import UserRoute from "./components/pages/UserRoute";
import UserLayout from "./components/pages/UserLayout";
import AdminLayout from "./components/admin/AdminLayout";
import NotificationBell from "./components/admin/NotificationBell";
import { Toaster } from "sonner";
import { FloatingContactWidget } from "./components";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  return children;
};

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          element={
            <UserRoute>
              <UserLayout />
              
      <FloatingContactWidget />
            </UserRoute>
          }
        >
          <Route path="/" element={<CarRentalHome />} />
          <Route path="/pricing" element={<PricingAndFAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/notifications" element={<NotificationBell />} />
        </Route>

        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthInitializer>
          <AppRoutes />
          <Toaster />
        </AuthInitializer>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
