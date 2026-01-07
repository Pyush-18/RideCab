import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router'; 
import { motion } from 'motion/react';
import { 
  MapPin, 
  Car, 
  History, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { fetchUserBookings, cancelBooking } from '../../store/slices/bookingSlice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BookingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { bookings, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', className: 'bg-amber-100 text-amber-700 border-amber-200 icon:text-amber-600' };
      case 'confirmed':
        return { label: 'Confirmed', className: 'bg-emerald-100 text-emerald-700 border-emerald-200 icon:text-emerald-600' };
      case 'completed':
        return { label: 'Completed', className: 'bg-blue-100 text-blue-700 border-blue-200 icon:text-blue-600' };
      case 'cancelled':
        return { label: 'Cancelled', className: 'bg-rose-100 text-rose-700 border-rose-200 icon:text-rose-600' };
      default:
        return { label: status, className: 'bg-slate-100 text-slate-700 border-slate-200 icon:text-slate-500' };
    }
  };

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking(bookingId));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return { date: 'N/A', time: '' };
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { day: 'numeric' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.toLocaleDateString('en-US', { year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const formatAmount = (amount) => {
    return typeof amount === 'number' ? `₹${amount.toFixed(2)}` : (amount || 'N/A');
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 px-3 sm:px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Bookings</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">Manage your upcoming trips and view history</p>
          </div>
          
          <Button
            onClick={() => navigate('/payments')}
            className="group bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all duration-300 w-full sm:w-auto"
          >
            <History className="mr-2 h-4 w-4 text-orange-500 group-hover:rotate-12 transition-transform" />
            Payment History
          </Button>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 text-center border-dashed border-2 border-slate-200 bg-white/50">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Car className="text-orange-500 h-8 sm:h-10 w-8 sm:w-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">No bookings found</h3>
              <p className="text-sm sm:text-base text-slate-500 max-w-sm mt-2 mb-6 sm:mb-8 px-2">
                It looks like you haven't booked any rides yet. Ready to start your first journey?
              </p>
              <Button 
                onClick={() => navigate('/pricing')}
                className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 w-full sm:w-auto"
              >
                Book a Ride Now
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:gap-5 md:gap-6">
            {bookings.map((booking, index) => {
              const statusStyle = getStatusStyle(booking.status);
              const dateObj = formatDate(booking.bookingDate);

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white group">
                    <div className="flex flex-col md:flex-row">
                      
                      <div className="bg-slate-900 text-white p-4 sm:p-5 md:p-6 md:w-48 flex md:flex-col justify-between md:justify-center items-center md:text-center md:border-r rounded-t-lg md:rounded-l-lg md:rounded-tr-none border-dashed border-slate-700 relative">
                        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-50 rounded-full hidden md:block transform -translate-y-1/2"></div>
                        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-50 rounded-full hidden md:block transform -translate-y-1/2"></div>
                        
                        <div className="absolute -bottom-3 left-1/2 w-6 h-6 bg-slate-50 rounded-full md:hidden transform -translate-x-1/2"></div>
                        
                        <div className="flex md:flex-col items-center md:items-center gap-2 md:gap-0">
                          <span className="text-orange-400 font-bold text-xs sm:text-sm tracking-widest uppercase md:mb-1">
                            {dateObj.month}
                          </span>
                          <span className="text-3xl sm:text-4xl font-bold tracking-tighter md:mb-1">
                            {dateObj.day}
                          </span>
                          <span className="text-slate-400 text-xs sm:text-sm md:mb-4">
                            {dateObj.year}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium">
                          <Clock size={12} className="text-orange-400" />
                          <span className="text-xs sm:text-sm">{dateObj.time}</span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-3 sm:mb-4 gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="text-base sm:text-lg font-bold text-slate-800 truncate">
                                  {booking.carName || 'Premium Cab'}
                                </h3>
                                <Badge variant="outline" className={`capitalize font-normal text-xs ${statusStyle.className} shrink-0`}>
                                  {statusStyle.label}
                                </Badge>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600 font-medium">
                                  {booking.carModel}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="capitalize text-xs sm:text-sm">
                                  {booking.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}
                                </span>
                              </p>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <p className="text-xl sm:text-2xl font-bold text-slate-900 whitespace-nowrap">
                                {formatAmount(booking.amount)}
                              </p>
                              {booking.paymentStatus === 'paid' && (
                                <div className="flex items-center justify-end gap-1 text-xs text-emerald-600 font-medium mt-1">
                                  <ShieldCheck size={12} />
                                  <span className="hidden sm:inline">Paid Securely</span>
                                  <span className="sm:hidden">Paid</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-100 mb-3 sm:mb-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="mt-1 flex flex-col items-center gap-1 shrink-0">
                                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-orange-500 ring-2 sm:ring-4 ring-orange-100"></div>
                                <div className="w-0.5 h-6 sm:h-8 bg-slate-200"></div>
                                <MapPin size={12} className="text-slate-400 sm:w-3.5 sm:h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Route</p>
                                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed wrap-break-word">
                                  {booking.route || 'Destination details unavailable'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 pt-3 border-t border-slate-100">
                          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-slate-400">
                            {booking.luggage && (
                              <span className="flex items-center gap-1">
                                💼 <span>{booking.luggage} Luggage</span>
                              </span>
                            )}
                            {booking.capacity && (
                              <span className="flex items-center gap-1">
                                👥 <span>{booking.capacity} Seats</span>
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCancel(booking.id)}
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 w-full sm:w-auto text-sm"
                              >
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;