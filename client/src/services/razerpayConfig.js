// src/razorpay/config.js

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Razorpay configuration
export const razorpayConfig = {
  key: 'rzp_test_RpYIvxpSlaLEgM', // Replace with your Razorpay Key ID
  currency: 'INR',
  name: 'Firstcab',
  description: 'Cab Booking Payment',
  theme: {
    color: '#F59E0B' // Amber-500
  }
};

// Helper function to format amount for Razorpay (in paise)
export const formatAmountForRazorpay = (amount) => {
  // Remove ₹ symbol and commas, convert to number, multiply by 100 for paise
  const numericAmount = parseFloat(amount.replace(/[₹,]/g, ''));
  return Math.round(numericAmount * 100);
};

// Helper function to display amount
export const displayAmount = (amountInPaise) => {
  return `₹${(amountInPaise / 100).toFixed(2)}`;
};