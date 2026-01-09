import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";

import {
  AdminHeader,
  AdminSidebar,
  DashboardOverview,
  PricingManagement,
  RoutesManagement,
  SettingsPage,
  TransactionsManagement,
  UsersManagement,
} from "..";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

const getMonthName = (monthIndex) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthIndex];
};

const getDayName = (dayIndex) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayIndex];
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("adminDarkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const routes = useSelector((state) => state.routes?.routes ?? []);
  const pricing = useSelector((state) => state.pricing?.pricing ?? []);
  const bookings = useSelector((state) => state.booking?.bookings ?? []);
  const payments = useSelector((state) => state.payment?.payments ?? []);
  const users = useSelector((state) => state.users?.users ?? []);

  useEffect(() => {
    const unsubscribers = [];
    const routesUnsubscribe = onSnapshot(
      collection(db, "routes"),
      (snapshot) => {
        const routesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: "routes/setRoutes", payload: routesData });
      },
      (error) => {
        console.error("Error fetching routes:", error);
      }
    );
    unsubscribers.push(routesUnsubscribe);
    const pricingUnsubscribe = onSnapshot(
      collection(db, "pricing"),
      (snapshot) => {
        const pricingData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: "pricing/setPricing", payload: pricingData });
      },
      (error) => {
        console.error("Error fetching pricing:", error);
      }
    );
    unsubscribers.push(pricingUnsubscribe);
    const bookingsUnsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const bookingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: "booking/setBookings", payload: bookingsData });
      },
      (error) => {
        console.error("Error fetching bookings:", error);
      }
    );
    unsubscribers.push(bookingsUnsubscribe);

    const paymentsUnsubscribe = onSnapshot(
      collection(db, "payments"),
      (snapshot) => {
        const paymentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: "payment/setPayments", payload: paymentsData });
      },
      (error) => {
        console.error("Error fetching payments:", error);
      }
    );
    unsubscribers.push(paymentsUnsubscribe);
    const usersUnsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: "users/setUsers", payload: usersData });
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
    unsubscribers.push(usersUnsubscribe);

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(fetchRoutes());
  //   dispatch(fetchAllPricing());
  //   dispatch(fetchAllUsers());
  //   dispatch(fetchAllBookings());
  //   dispatch(fetchAllPayments());
  // }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("adminDarkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const themeClasses = darkMode
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-50/50 text-slate-900";
  const cardClasses = darkMode
    ? "bg-slate-900/50 border-slate-800 backdrop-blur-sm"
    : "bg-white/80 border-slate-200 backdrop-blur-sm";

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const stats = {
    totalRoutes: routes.length,
    activeRoutes: routes.filter((r) => r.active).length,

    totalBookings: bookings.length,
    todayBookings: bookings.filter((b) => isToday(b.createdAt)).length,

    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    completedBookings: bookings.filter((b) => b.status === "completed").length,

    totalRevenue: payments
      .filter((p) => p.status === "success" || p.status === "completed")
      .reduce((sum, p) => sum + (p.amount ? p.amount / 100 : 0), 0),

    todayRevenue: payments
      .filter(
        (p) =>
          isToday(p.createdAt) &&
          (p.status === "success" || p.status === "completed")
      )
      .reduce((sum, p) => sum + (p.amount ? p.amount / 100 : 0), 0),
  };

  const revenueData = (() => {
    const monthlyRevenue = {};
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyRevenue[monthKey] = {
        month: getMonthName(date.getMonth()),
        revenue: 0,
      };
    }

    payments
      .filter((p) => p.status === "success" || p.status === "completed")
      .forEach((payment) => {
        const paymentDate = new Date(payment.createdAt);
        const monthKey = `${paymentDate.getFullYear()}-${paymentDate.getMonth()}`;

        if (monthlyRevenue[monthKey]) {
          monthlyRevenue[monthKey].revenue += payment.amount / 100;
        }
      });

    return Object.values(monthlyRevenue);
  })();

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#14b8a6",
    "#e11d48",
  ];

  const carTypeData = (() => {
    const carTypeCounts = {};
    let totalBookings = 0;

    bookings.forEach((booking) => {
      const carType = booking.carName || booking.carType || "Other";
      carTypeCounts[carType] = (carTypeCounts[carType] || 0) + 1;
      totalBookings++;
    });

    const colorMap = {};
    let colorIndex = 0;

    return Object.entries(carTypeCounts).map(([name, count]) => {
      if (!colorMap[name]) {
        colorMap[name] = COLORS[colorIndex % COLORS.length];
        colorIndex++;
      }

      return {
        name,
        value:
          totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0,
        color: colorMap[name],
      };
    });
  })();

  const dailyBookings = (() => {
    const today = new Date();
    const currentDay = today.getDay();

    const weekData = {};
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - currentDay + i);
      const dayName = getDayName(i);
      weekData[dayName] = {
        day: dayName,
        bookings: 0,
        date: dayDate.toDateString(),
      };
    }
    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.createdAt);
      const bookingDay = getDayName(bookingDate.getDay());

      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - currentDay);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      if (bookingDate >= weekStart && bookingDate < weekEnd) {
        if (weekData[bookingDay]) {
          weekData[bookingDay].bookings++;
        }
      }
    });

    return Object.values(weekData);
  })();

  const transactions = payments
    .filter((p) => p.status === "success")
    .map((p) => {
      const bookingDetails = p.bookingDetails || {};
      return {
        id: p.id,
        user: p.userName || "N/A",
        email: p.userEmail || "N/A",
        mobileNumber: bookingDetails.mobileNumber || "N/A",
        route: bookingDetails.route || "N/A",
        carType: bookingDetails.carName || "N/A",
        carModel: bookingDetails.carModel || "N/A",
        amount: p.amount / 100,
        status: p.status,
        date: new Date(p.createdAt).toLocaleString(),
        paymentId: p.razorpayPaymentId || p.id,
        bookingId: p.bookingId,
        tripType: bookingDetails.tripType || p.tripType || "N/A",
        capacity: bookingDetails.capacity || "N/A",
        luggage: bookingDetails.luggage || "N/A",
        completedAt: p.completedAt,
        from: bookingDetails.from || "N/A",
        to: bookingDetails.to || "N/A",
      };
    });

  const enrichedUsers = users.map((user) => {
    const userBookings = bookings.filter((b) => b.userId === user.uid);
    const userPayments = payments.filter(
      (p) => p.userId === user.uid && p.status === "success"
    );
    const totalSpent = userPayments.reduce(
      (sum, p) => sum + (p.amount / 100 || 0),
      0
    );
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBookings = userBookings.filter(
      (b) => new Date(b.createdAt) > thirtyDaysAgo
    );
    const status = recentBookings.length > 0 ? "active" : "inactive";

    const enrichedBookings = userBookings.map((booking) => {
      const bookingPayment = userPayments.find(
        (p) => p.bookingId === booking.id
      );
      return {
        id: booking.id,
        from: booking.from || booking.pickupLocation || "N/A",
        to: booking.to || booking.dropLocation || "N/A",
        carName: booking.carName || booking.vehicleType || "N/A",
        carModel: booking.carModel || "N/A",
        tripType: booking.tripType || "N/A",
        capacity: booking.capacity || "N/A",
        luggage: booking.luggage || "N/A",
        status: booking.status,
        mobileNumber: booking.mobileNumber || "N/A",
        amount: bookingPayment ? bookingPayment.amount / 100 : 0,
        createdAt: booking.createdAt,
        completedAt: booking.completedAt,
        selectedPickupDate: booking.selectedPickupDate,
        selectedPickupTime: booking.selectedPickupTime,
        selectedReturnDate: booking.selectedReturnDate || null,
      };
    });

    const enrichedTransactions = userPayments.map((payment) => {
      const bookingDetails = payment.bookingDetails || {};
      return {
        id: payment.id,
        paymentId: payment.razorpayPaymentId || payment.id,
        bookingId: payment.bookingId,
        amount: payment.amount / 100,
        status: payment.status,
        date: payment.createdAt,
        route:
          bookingDetails.route ||
          `${bookingDetails.from || "N/A"} → ${bookingDetails.to || "N/A"}`,
        from: bookingDetails.from || "N/A",
        to: bookingDetails.to || "N/A",
        carType: bookingDetails.carName || "N/A",
        tripType: bookingDetails.tripType || "N/A",
      };
    });

    return {
      ...user,
      totalBookings: userBookings.length,
      totalSpent: totalSpent,
      status: status,
      joinedDate: new Date(user.createdAt).toLocaleDateString(),
      bookings: enrichedBookings,
      transactions: enrichedTransactions,
    };
  });

  return (
    <>
      <Toaster
        position="top-right"
        theme={darkMode ? "dark" : "light"}
        richColors
      />
      <div
        className={`min-h-screen ${themeClasses} transition-colors duration-300 relative`}
      >
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/20"></div>

        <AdminHeader
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          cardClasses={cardClasses}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          setActiveSection={setActiveSection}
        />

        <AdminSidebar
          darkMode={darkMode}
          cardClasses={cardClasses}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main
          className={`relative z-10 pt-24 pb-8 px-4 lg:px-8 min-h-screen transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === "dashboard" && (
                <DashboardOverview
                  stats={stats}
                  revenueData={revenueData}
                  carTypeData={carTypeData}
                  dailyBookings={dailyBookings}
                  transactions={transactions}
                  darkMode={darkMode}
                  cardClasses={cardClasses}
                />
              )}
              {activeSection === "routes" && (
                <RoutesManagement
                  darkMode={darkMode}
                  cardClasses={cardClasses}
                />
              )}
              {activeSection === "pricing" && (
                <PricingManagement
                  darkMode={darkMode}
                  cardClasses={cardClasses}
                />
              )}
              {activeSection === "transactions" && (
                <TransactionsManagement
                  transactions={transactions}
                  darkMode={darkMode}
                  cardClasses={cardClasses}
                />
              )}
              {activeSection === "users" && (
                <UsersManagement
                  users={enrichedUsers}
                  darkMode={darkMode}
                  cardClasses={cardClasses}
                />
              )}
              {activeSection === "settings" && (
                <SettingsPage
                  darkMode={darkMode}
                  toggleTheme={toggleTheme}
                  cardClasses={cardClasses}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
