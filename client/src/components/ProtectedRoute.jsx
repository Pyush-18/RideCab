import React from 'react';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialized, loading } = useSelector((state) => state.auth);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-orange-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;