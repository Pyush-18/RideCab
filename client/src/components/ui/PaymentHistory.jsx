import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  MapPin,
  Car,
  Receipt,
  Wallet,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";
import { fetchUserPayments } from "../../store/slices/paymentSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.payment);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserPayments());
  }, [dispatch]);

  const totalSpent = useMemo(() => {
    return payments
      .filter((p) => p.status === "success")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [payments]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "success":
        return {
          icon: <CheckCircle2 size={16} className="sm:w-4 sm:h-4" />,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-100",
          label: "Successful",
        };
      case "failed":
        return {
          icon: <XCircle size={16} className="sm:w-4 sm:h-4" />,
          color: "text-rose-600",
          bg: "bg-rose-50",
          border: "border-rose-100",
          label: "Failed",
        };
      case "pending":
        return {
          icon: <Clock size={16} className="sm:w-4 sm:h-4" />,
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100",
          label: "Processing",
        };
      default:
        return {
          icon: <Clock size={16} className="sm:w-4 sm:h-4" />,
          color: "text-slate-500",
          bg: "bg-slate-50",
          border: "border-slate-100",
          label: status,
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const formatAmount = (amountInPaise) => {
    return `₹${(amountInPaise / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;
  };

  const downloadReceipt = (payment) => {
    const bookingDetails = payment.bookingDetails || {};
    const scheduledPickup = bookingDetails.selectedPickupDate && bookingDetails.selectedPickupTime
      ? `\nScheduled Pickup: ${new Date(bookingDetails.selectedPickupDate).toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} at ${bookingDetails.selectedPickupTime}`
      : '';
    
    const returnDate = bookingDetails.selectedReturnDate
      ? `\nReturn Date: ${new Date(bookingDetails.selectedReturnDate).toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}`
      : '';

    const receiptText = `
FIRSTCAB - Payment Receipt
==========================
Payment ID: ${payment.razorpayPaymentId || payment.id}
Date: ${new Date(payment.createdAt).toLocaleString()}
Status: ${payment.status.toUpperCase()}
--------------------------
Booking: ${bookingDetails.carName || "Ride"} 
Model: ${bookingDetails.carModel || "N/A"}
Route: ${bookingDetails.route || "N/A"}
Trip Type: ${bookingDetails.tripType || "N/A"}${scheduledPickup}${returnDate}
--------------------------
Total: ${formatAmount(payment.amount)}

Thank you for riding with us!
    `.trim();

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt_${payment.razorpayPaymentId || "txn"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading && payments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-orange-500"
        >
          <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 px-3 sm:px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 sm:space-y-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Financial Overview
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Track your ride payments and download receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-6 bg-linear-to-br from-slate-900 to-slate-800 text-white border-none shadow-lg sm:shadow-xl">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm shrink-0">
                  <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 text-xs sm:text-sm font-medium">
                    Total Spent
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold truncate">
                    {formatAmount(totalSpent)}
                  </h3>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 bg-white border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-orange-50 rounded-lg sm:rounded-xl shrink-0">
                  <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs sm:text-sm font-medium">
                    Total Transactions
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {payments.length}
                  </h3>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
            Recent Transactions
          </h2>

          {payments.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="p-12 sm:p-16 text-center bg-white border-dashed border-2 border-slate-200 shadow-none">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CreditCard className="text-slate-300" size={24} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  No payment history
                </h3>
                <p className="text-sm sm:text-base text-slate-500 mt-1">
                  Book your first ride to see transactions here.
                </p>
              </Card>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {payments.map((payment, index) => {
                const status = getStatusConfig(payment.status);
                const { date, time } = formatDate(payment.createdAt);
                const bookingDetails = payment.bookingDetails || {};

                return (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 sm:p-5 hover:bg-slate-50/80 transition-colors group ${
                      index !== payments.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${status.bg} ${status.color}`}
                        >
                          {bookingDetails.carName ? (
                            <Car size={16} className="sm:w-4.5 sm:h-4.5" />
                          ) : (
                            <CreditCard size={16} className="sm:w-4.5 sm:h-4.5" />
                          )}
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="font-semibold text-slate-900 text-sm sm:text-base">
                              {bookingDetails.carName || "Cab Booking"}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              #{payment.razorpayPaymentId?.slice(-6) || "ID"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <CalendarDays size={11} className="sm:w-3 sm:h-3" /> {date}
                            </span>
                            {bookingDetails.route && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                                <span
                                  className="flex items-center gap-1 truncate max-w-50 sm:max-w-none"
                                  title={bookingDetails.route}
                                >
                                  <MapPin size={11} className="sm:w-3 sm:h-3 shrink-0" />
                                  <span className="truncate">{bookingDetails.route}</span>
                                </span>
                              </>
                            )}
                          </div>

                          {bookingDetails.selectedPickupDate && bookingDetails.selectedPickupTime && (
                            <div className="mt-2 pt-2 border-t border-slate-100">
                              <div className="flex items-center gap-2 text-xs">
                                <div className="flex items-center gap-1 text-blue-600 font-medium">
                                  <Clock size={11} className="sm:w-3 sm:h-3" />
                                  <span>Scheduled:</span>
                                </div>
                                <span className="text-slate-600">
                                  {new Date(bookingDetails.selectedPickupDate).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })} at {bookingDetails.selectedPickupTime}
                                </span>
                              </div>
                              {bookingDetails.selectedReturnDate && (
                                <div className="flex items-center gap-2 text-xs mt-1">
                                  <div className="flex items-center gap-1 text-amber-600 font-medium">
                                    <CalendarDays size={11} className="sm:w-3 sm:h-3" />
                                    <span>Return:</span>
                                  </div>
                                  <span className="text-slate-600">
                                    {new Date(bookingDetails.selectedReturnDate).toLocaleDateString('en-IN', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-12 sm:pl-0">
                        <div className="text-right">
                          <p className="font-bold text-slate-900 text-base sm:text-lg whitespace-nowrap">
                            {formatAmount(payment.amount)}
                          </p>
                          <div
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${status.bg} ${status.color}`}
                          >
                            {status.icon} <span>{status.label}</span>
                          </div>
                        </div>

                        {payment.status === "success" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => downloadReceipt(payment)}
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full h-8 w-8 shrink-0"
                            title="Download Receipt"
                          >
                            <Download size={14} className="sm:w-4 sm:h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {payment.status === "failed" && payment.failureReason && (
                      <div className="mt-2 ml-0 sm:ml-14 text-xs text-rose-600 bg-rose-50 p-2 rounded-md">
                        <span className="font-medium">Error:</span> {payment.failureReason}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;