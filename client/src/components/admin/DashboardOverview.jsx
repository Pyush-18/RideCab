import React from "react";
import {
  Car,
  Download,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  MapPin,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  AreaChart,
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from "recharts";

const DashboardOverview = ({
  stats,
  revenueData,
  carTypeData,
  dailyBookings,
  transactions,
  darkMode,
}) => {
  
  const colors = {
    primary: "#f59e0b",
    secondary: "#10b981",
    accent: "#fcd34d",
    background: darkMode ? "#0f172a" : "#fdfbf7",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    textMain: darkMode ? "#f8fafc" : "#1e293b",
    textSub: darkMode ? "#94a3b8" : "#64748b",
    grid: darkMode ? "#334155" : "#f1f5f9",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-full shadow-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="font-medium">{`${label}: ${payload[0].value}`}</span>
        </div>
      );
    }
    return null;
  };

  const statsCards = [
    {
      label: "Total Routes",
      value: stats.totalRoutes ?? 0,
      change: stats.activeRoutes ?? 0,
      changeLabel: "active",
      trend: "neutral",
      icon: MapPin,
      bg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings ?? 0,
      change: stats.todayBookings ?? 0,
      changeLabel: "today",
      trend: "up",
      icon: Car,
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-500",
    },
    {
      label: "Total Revenue",
      value: `₹${(stats.totalRevenue ?? 0).toLocaleString()}`,
      change: `${(stats.todayRevenue ?? 0).toLocaleString()}`,
      changeLabel: "today",
      trend: "up",
      icon: TrendingUp,
      bg: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-500",
    },
    {
      label: "Pending",
      value: stats.pendingBookings ?? 0,
      change: stats.completedBookings ?? 0,
      changeLabel: "completed",
      trend: "down",
      icon: TrendingDown,
      bg: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div
      className={`space-y-6 min-h-screen rounded-xl p-4 ${
        darkMode ? "text-slate-100" : "text-slate-800"
      }`}
      style={{ backgroundColor: colors.background }}
    >
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-sm font-medium opacity-60 mt-1">
            Cars Management dashboard stats.
          </p>
        </div>
        <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-900 rounded-full px-6 shadow-lg shadow-amber-500/10 transition-all">
          <Download size={16} className="mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => (
          <Card
            key={idx}
            className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl p-6 relative overflow-hidden group"
            style={{ backgroundColor: colors.cardBg }}
          >
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={stat.iconColor} size={22} />
                </div>
                {stat.trend === "up" && (
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                    +12%
                  </span>
                )}
                {stat.trend === "down" && (
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">
                    -5%
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-3xl font-extrabold mb-1 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm opacity-60 font-medium">{stat.label}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium">
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }
                  >
                    {stat.trend === "up" ? "+" : ""}
                    {stat.change}
                  </span>
                  <span className="opacity-40">{stat.changeLabel}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2 border-none shadow-sm rounded-3xl p-6"
          style={{ backgroundColor: colors.cardBg }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Rental Statistics</h3>
              <div className="flex gap-4 mt-2 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>{" "}
                  Income
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>{" "}
                  Expenses
                </div>
              </div>
            </div>
          </div>

          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={colors.primary}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={colors.grid}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.textSub, fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.textSub, fontSize: 12 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: colors.primary,
                    strokeWidth: 1,
                    strokeDasharray: "5 5",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={colors.primary}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          className="border-none shadow-sm rounded-3xl p-6 flex flex-col justify-center items-center"
          style={{ backgroundColor: colors.cardBg }}
        >
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Booking Share</h3>
            <MoreHorizontal size={20} className="opacity-40 cursor-pointer" />
          </div>

          <div className="h-62.5 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={carTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {carTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      cornerRadius={10}
                    />
                  ))}
                  <Label
                    value={stats.totalBookings}
                    position="center"
                    className="text-3xl font-bold"
                    fill={colors.textMain}
                    dy={-5}
                  />
                  <Label
                    value="Total"
                    position="center"
                    className="text-xs font-medium opacity-50"
                    fill={colors.textMain}
                    dy={15}
                  />
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: colors.textMain, fontWeight: "bold" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 mt-4 w-full">
            {carTypeData.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-8 h-1 rounded-full mb-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs font-medium opacity-60">
                  {item.name}
                </span>
                <span className="text-sm font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="border-none shadow-sm rounded-3xl p-6"
          style={{ backgroundColor: colors.cardBg }}
        >
          <h3 className="text-xl font-bold mb-6">Weekly Activity</h3>
          <div className="h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyBookings}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={colors.grid}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.textSub, fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  cursor={{
                    fill: darkMode ? "#334155" : "#f1f5f9",
                    opacity: 0.4,
                  }}
                  contentStyle={{
                    backgroundColor: colors.background,
                    borderRadius: "8px",
                    border: "none",
                  }}
                />
                <Bar
                  dataKey="bookings"
                  fill={colors.primary}
                  radius={[20, 20, 20, 20]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          className="lg:col-span-2 border-none shadow-sm rounded-3xl p-6"
          style={{ backgroundColor: colors.cardBg }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Booking</h3>
            <span className="text-xs font-bold text-emerald-500 cursor-pointer hover:underline">
              + {stats.todayBookings} new bookings
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-4 text-xs font-semibold opacity-50 px-4 pb-2">
              <span>Customer</span>
              <span>Vehicle</span>
              <span className="text-right">Price</span>
              <span className="text-right">Status</span>
            </div>

            {transactions.slice(0, 3).map((txn) => (
              <div
                key={txn.id}
                className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${
                  darkMode
                    ? "bg-slate-800 hover:bg-slate-700"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="grid grid-cols-4 w-full items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        darkMode
                          ? "bg-slate-700 text-slate-300"
                          : "bg-white text-slate-600"
                      }`}
                    >
                      <Car size={18} />
                    </div>

                    <p className="font-bold text-sm">{txn.user}</p>
                  </div>

                  <p className="text-sm font-medium opacity-80">{txn.route}</p>

                  <p className="text-sm font-bold text-right">₹{txn.amount}</p>

                  <div className="text-right">
                    <Badge
                      className={`rounded-full px-3 py-1 font-normal text-xs ${
                        txn.status === "success"
                          ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-400"
                      }`}
                      variant="secondary"
                    >
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
