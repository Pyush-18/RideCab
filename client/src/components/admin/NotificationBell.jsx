import React, { useState, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Loader,
  Car,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const NotificationBell = ({ darkMode, setActiveSection }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();

    const interval = setInterval(() => {
      fetchUnreadCount();
      if (open) {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [open]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/notifications/admin?limit=10`, { // Increased limit slightly
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleViewUserManagement = () => {
    setOpen(false);
    if (setActiveSection) {
      setActiveSection("users");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative rounded-xl transition-all ${
            darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
          }`}
        >
          <Bell
            size={20}
            className={`transition-colors ${
              unreadCount > 0
                ? "text-amber-500 animate-pulse"
                : darkMode
                ? "text-slate-300"
                : "text-slate-600"
            }`}
          />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold animate-pulse"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={`w-95 sm:w-105 p-0 shadow-xl ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
        align="end"
        sideOffset={8}
      >
        <div
          className={`px-4 py-3 border-b ${
            darkMode ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles
                size={18}
                className={darkMode ? "text-amber-400" : "text-amber-500"}
              />
              <h3 className="font-bold text-base">Notifications</h3>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2"
              >
                <CheckCheck size={14} className="mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-100 max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-amber-500" size={24} />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  darkMode ? "bg-slate-800" : "bg-slate-100"
                }`}
              >
                <Bell
                  size={24}
                  className={darkMode ? "text-slate-600" : "text-slate-400"}
                />
              </div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                No new notifications
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative px-4 py-4 transition-all cursor-pointer border-b last:border-b-0 ${
                    darkMode ? "border-slate-800" : "border-slate-100"
                  } ${
                    !notification.read
                      ? darkMode
                        ? "bg-amber-500/5 hover:bg-amber-500/10"
                        : "bg-amber-50/50 hover:bg-amber-50"
                      : darkMode
                      ? "hover:bg-slate-800/50"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  {!notification.read && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full" />
                  )}

                  <div className="flex gap-3 items-start">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        notification.priority === "high"
                          ? darkMode
                            ? "bg-red-500/10 ring-1 ring-red-500/20"
                            : "bg-red-50 ring-1 ring-red-100"
                          : darkMode
                          ? "bg-amber-500/10 ring-1 ring-amber-500/20"
                          : "bg-amber-50 ring-1 ring-amber-100"
                      }`}
                    >
                      <Car
                        size={18}
                        className={
                          notification.priority === "high"
                            ? darkMode
                              ? "text-red-400"
                              : "text-red-600"
                            : darkMode
                            ? "text-amber-400"
                            : "text-amber-600"
                        }
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4
                          className={`font-semibold text-sm leading-tight ${
                            !notification.read
                              ? darkMode
                                ? "text-white"
                                : "text-slate-900"
                              : darkMode
                              ? "text-slate-400"
                              : "text-slate-600"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>

                      <p
                        className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {notification.message}
                      </p>

                      {notification.booking && (
                        <div
                          className={`rounded-lg p-2.5 text-xs space-y-2 mb-3 ${
                            darkMode
                              ? "bg-slate-800/50 ring-1 ring-slate-700"
                              : "bg-slate-50 ring-1 ring-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <span
                              className={`shrink-0 ${
                                darkMode ? "text-slate-500" : "text-slate-500"
                              }`}
                            >
                              Route:
                            </span>
                            <span
                              className={`font-medium text-right truncate w-full ${
                                darkMode ? "text-slate-300" : "text-slate-700"
                              }`}
                            >
                              {notification.booking.route}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span
                              className={
                                darkMode ? "text-slate-500" : "text-slate-500"
                              }
                            >
                              Amount:
                            </span>
                            <span className="font-bold text-amber-600">
                              ₹{notification.booking.amount}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-[10px] sm:text-xs ${
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {formatTime(notification.createdAt)}
                        </span>
                        {notification.read && (
                          <div className="flex items-center text-[10px] text-slate-400 gap-1">
                            <span>Read</span>
                            <CheckCheck size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div
          className={`p-2 border-t ${
            darkMode ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <Button
            variant="ghost"
            onClick={handleViewUserManagement}
            className="w-full justify-center text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10 font-medium h-9 text-sm"
          >
            View User Management
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;