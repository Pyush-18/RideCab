import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Car,
  History,
  Clock,
  ShieldCheck,
  Luggage,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  fetchUserBookings,
  cancelBooking,
} from "../../store/slices/bookingSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BookingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className:
            "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
        };
      case "confirmed":
        return {
          label: "Confirmed",
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
        };
      case "completed":
        return {
          label: "Completed",
          className: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-100",
        };
      default:
        return {
          label: status,
          className:
            "bg-slate-50 text-slate-700 border-slate-200 ring-slate-100",
        };
    }
  };

  const handleCancel = async (bookingId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this booking? The payment will be refunded within 5-7 business days."
      )
    ) {
      try {
        await dispatch(cancelBooking(bookingId)).unwrap();
        toast.success("Booking cancelled successfully. Refund initiated!");
        dispatch(fetchUserBookings());
      } catch (error) {
        toast.error(error || "Failed to cancel booking");
      }
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return { date: "N/A", time: "" };
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("en-US", { day: "numeric" }),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      year: date.toLocaleDateString("en-US", { year: "numeric" }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const formatAmount = (amount) => {
    return typeof amount === "number"
      ? `₹${amount.toLocaleString("en-IN")}`
      : amount || "N/A";
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-[3px] border-slate-200 border-t-slate-900 rounded-full"
        />
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          Loading your trips...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              My Bookings
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Track your upcoming journeys and history
            </p>
          </div>

          <Button
            onClick={() => navigate("/payments")}
            variant="outline"
            className="group bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm transition-all rounded-xl h-11 px-5 w-full sm:w-auto justify-between sm:justify-center"
          >
            <span className="flex items-center gap-2">
              <History className="h-4 w-4 text-orange-500 group-hover:rotate-12 transition-transform duration-300" />
              <span>Payment History</span>
            </span>
            <ArrowRight className="h-4 w-4 text-slate-400 sm:hidden" />
          </Button>
        </motion.div>

        {bookings.length === 0 ? (
          <EmptyState navigate={navigate} />
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <BookingTicket
                key={booking.id}
                booking={booking}
                index={index}
                statusStyle={getStatusStyle(booking.status)}
                formatDate={formatDate}
                formatAmount={formatAmount}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BookingTicket = ({
  booking,
  index,
  statusStyle,
  formatDate,
  formatAmount,
  onCancel,
}) => {
  const dateObj = formatDate(booking.selectedPickupDate || booking.bookingDate);
  const timeStr = booking.selectedPickupTime || dateObj.time;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
        <div className="relative md:w-52 bg-slate-900 text-white p-5 flex flex-row md:flex-col justify-between items-center md:items-center md:justify-center shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="flex flex-col md:items-center text-left md:text-center z-10">
            <span className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-0.5 md:mb-2">
              {dateObj.month} {dateObj.year}
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-none">
              {dateObj.day}
            </span>
            <span className="text-slate-400 font-medium text-sm mt-0.5">
              {dateObj.weekday}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 z-10 md:mt-6">
            <Clock size={14} className="text-orange-400" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              {timeStr}
            </span>
          </div>

          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#F8FAFC] rounded-full md:hidden"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#F8FAFC] rounded-full md:hidden"></div>

          <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#F8FAFC] rounded-full hidden md:block border-b border-l border-slate-100"></div>
          <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-[#F8FAFC] rounded-full hidden md:block border-t border-l border-slate-100"></div>

          <div className="absolute bottom-0 left-4 right-4 h-px border-t-2 border-dashed border-white/20 md:hidden"></div>
          <div className="absolute right-0 top-4 bottom-4 w-px border-r-2 border-dashed border-white/20 hidden md:block"></div>
        </div>

        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between relative">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {booking.carName || "Premium Cab"}
                </h3>
                <Badge
                  variant="outline"
                  className={`${statusStyle.className} rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border`}
                >
                  {statusStyle.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {booking.carModel}
                </span>
                <span>•</span>
                <span className="capitalize">
                  {booking.tripType?.replace(/([A-Z])/g, " $1").trim() ||
                    "One Way"}
                </span>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5 sm:hidden">
                Total Fare
              </span>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {formatAmount(booking.amount)}
                </p>
                {booking.paymentStatus === "completed" && (
                  <div className="flex items-center justify-end gap-1 text-[10px] sm:text-xs text-emerald-600 font-bold uppercase tracking-wide mt-1">
                    <ShieldCheck size={12} />
                    <span>Paid</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative pl-2 mb-6">
            <div className="absolute left-1.75 top-2 bottom-6 w-0.5 border-l-2 border-dashed border-slate-200"></div>

            <div className="space-y-5">
              <div className="relative flex items-start gap-4">
                <div className="relative z-10 w-4 h-4 rounded-full border-[3px] border-emerald-500 bg-white shadow-sm mt-1 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Pickup Location
                  </p>
                  <p className="text-sm text-slate-900 font-semibold leading-tight line-clamp-2">
                    {booking.route?.split(/[→-]/)[0] ||
                      booking.from ||
                      "Pickup Location"}
                  </p>
                  {booking.pickupSubLocation && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {booking.pickupSubLocation}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="relative z-10 w-4 h-4 rounded-full border-[3px] border-rose-500 bg-white shadow-sm mt-1 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Drop Location
                  </p>
                  <p className="text-sm text-slate-900 font-semibold leading-tight line-clamp-2">
                    {booking.route?.split(/[→-]/)[1] ||
                      booking.to ||
                      "Drop Location"}
                  </p>
                  {booking.dropSubLocation && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {booking.dropSubLocation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {(booking.luggage || booking.capacity) && (
                <div className="flex items-center gap-3">
                  {booking.capacity && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      <Users size={14} className="text-slate-400" />
                      {booking.capacity} Seats
                    </div>
                  )}
                  {booking.luggage && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      <Luggage size={14} className="text-slate-400" />
                      {booking.luggage} Bags
                    </div>
                  )}
                </div>
              )}
            </div>

            {booking.status === "pending" && (
              <Button
                variant="ghost"
                onClick={() => onCancel(booking.id)}
                className="w-full sm:w-auto h-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs sm:text-sm font-medium transition-colors"
              >
                Cancel Booking
              </Button>
            )}
            {booking.status === "completed" && (
              <Button
                variant="ghost"
                className="w-full sm:w-auto h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-medium transition-colors"
              >
                View Receipt
              </Button>
            )}
            
            {booking.paymentStatus === "refunded" && (
              <div className="flex items-center justify-end gap-1 text-[10px] sm:text-xs text-amber-600 font-bold uppercase tracking-wide mt-1">
                <AlertCircle size={12} />
                <span>Refunded</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ navigate }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 px-4"
  >
    <div
      className="relative mb-6 group cursor-pointer"
      onClick={() => navigate("/pricing")}
    >
      <div className="absolute inset-0 bg-orange-100 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
      <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-orange-100">
        <Car className="h-10 w-10 text-orange-500" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white border-4 border-white">
        <ArrowRight size={14} />
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings found</h3>
    <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
      Looks like you haven't planned any trips yet.
      <br className="hidden sm:block" /> Ready to hit the road?
    </p>
    <Button
      onClick={() => navigate("/pricing")}
      className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-2xl shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      Book Your First Ride
    </Button>
  </motion.div>
);

export default BookingsPage;
