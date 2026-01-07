import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/70 backdrop-blur-lg border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-linear-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base">
                F
              </div>
              <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                Firstcab
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item?.path}
                  to={`${item?.path}`}
                  className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors"
                >
                  {item?.name}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/bookings"
                  className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors"
                >
                  My Bookings
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User size={16} className="text-slate-600" />
                    )}
                    <span className="text-sm font-medium text-slate-700">
                      {user?.displayName || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-amber-500/20 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-amber-500/20"
                >
                  Get Started
                </button>
              )}
            </div>

            <button
              className="md:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-4 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item?.path}
                    to={`${item?.path}`}
                    className="block text-slate-600 font-medium py-2 px-3 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item?.name}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    to="/bookings"
                    className="block text-slate-600 font-medium py-2 px-3 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}
                <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <User size={16} className="text-slate-600" />
                        )}
                        <span className="text-sm font-medium text-slate-700">
                          {user?.displayName || user?.email?.split('@')[0]}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all flex items-center gap-2 justify-center"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/auth");
                        setIsMenuOpen(false);
                      }}
                      className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-amber-500/20"
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className="h-16 md:h-20" />
    </>
  );
};