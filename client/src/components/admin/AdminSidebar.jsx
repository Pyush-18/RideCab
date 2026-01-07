import React from "react";
import {
  LayoutDashboard,
  Route as RouteIcon,
  DollarSign,
  Receipt,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "@/store/slices/authSlice";

const AdminSidebar = ({
  darkMode,
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
}) => {
  const {user} = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "routes", label: "Routes & Trips", icon: RouteIcon },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const sidebarClasses = darkMode
    ? "bg-slate-950/90 border-slate-800 backdrop-blur-xl"
    : "bg-white/90 border-slate-200/60 backdrop-blur-xl";

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const loadingToast = toast.loading("Signing out...");
      await dispatch(logoutUser()).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Logged out successfully!");
      navigate("/", {replace: true});
    } catch (error) {
      toast.error(error || "Failed to logout");
    }
  };
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 border-r z-40 transition-transform duration-300 ease-in-out ${sidebarClasses} ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="mb-6 px-2">
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Menu
            </p>
          </div>

          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <div key={item.id} className="relative group">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1 bottom-1 w-1.5 bg-amber-500 rounded-r-full shadow-[0_0_12px_rgba(245,158,11,0.6)] z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                <button
                  onClick={() => handleSectionChange(item.id)}
                  className={`relative w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                    isActive
                      ? darkMode
                        ? "bg-linear-to-r from-amber-500/15 to-transparent text-amber-500 font-semibold"
                        : "bg-linear-to-r from-amber-50 to-transparent text-amber-600 font-semibold"
                      : darkMode
                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon
                      size={20}
                      className={`transition-colors duration-200 ${
                        isActive
                          ? "text-amber-500"
                          : "group-hover:text-slate-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="text-amber-500 opacity-100 relative z-10"
                    />
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        <div
          className={`p-4 m-4 rounded-2xl border ${
            darkMode
              ? "bg-slate-900/50 border-slate-800"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p
                className={`text-sm font-semibold truncate ${
                  darkMode ? "text-slate-200" : "text-slate-900"
                }`}
              >
                Admin {user?.displayName || "N/A"}
              </p>
              <p
                className={`text-xs truncate ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                {user?.email || "N/A"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 h-10 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
