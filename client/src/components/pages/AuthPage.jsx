import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Chrome, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { registerUser, loginUser, loginWithGoogle, clearError } from "../../store/slices/authSlice";

const VisualSide = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-orange-50 flex flex-col justify-between p-8 md:p-12">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-64 h-64 md:w-96 md:h-96 bg-orange-300 rounded-full blur-3xl opacity-40"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], x: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-20 w-56 h-56 md:w-80 md:h-80 bg-amber-200 rounded-full blur-3xl opacity-40"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], y: [0, -100, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 left-1/2 w-64 h-64 md:w-96 md:h-96 bg-orange-200 rounded-full blur-3xl opacity-40"
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6 md:mb-8">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base">
            F
          </div>
          <span className="font-bold text-lg md:text-xl text-slate-900">Firstcab.</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight"
        >
          Redefining <br />
          <span className="text-orange-600">Urban Mobility.</span>
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/70 backdrop-blur-md rounded-xl md:rounded-2xl border shadow-sm w-fit"
      >
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`https://i.pravatar.cc/100?img=${i + 10}`}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white"
              alt="user"
            />
          ))}
        </div>
        <div className="text-xs md:text-sm">
          <p className="font-bold text-slate-900">10k+ Riders</p>
          <p className="text-slate-500">Joined this week</p>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ icon: Icon, type = "text", placeholder, value, onChange, error }) => (
  <div className="relative group">
    <Icon className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-slate-400'}`} size={18} />
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 text-sm md:text-base bg-slate-50 rounded-xl md:rounded-2xl focus:ring-2 outline-none transition-all ${
        error ? 'ring-2 ring-red-500/20 focus:ring-red-500/20' : 'focus:ring-orange-500/20'
      }`}
      placeholder={placeholder}
    />
    {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
  </div>
);

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    setFormErrors({});
    dispatch(clearError());
  }, [isSignUp, dispatch]);

  const validateForm = () => {
    const errors = {};

    if (isSignUp) {
      if (!formData.firstName.trim()) {
        errors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        errors.lastName = "Last name is required";
      }
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isSignUp) {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      dispatch(registerUser({
        email: formData.email.trim(),
        password: formData.password,
        name: fullName
      }));
    } else {
      dispatch(loginUser({
        email: formData.email.trim(),
        password: formData.password
      }));
    }
  };

  const handleGoogleSignIn = () => {
    dispatch(loginWithGoogle());
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    setFormErrors({});
    dispatch(clearError());
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full
          max-w-6xl
          bg-white
          rounded-2xl
          md:rounded-3xl
          lg:rounded-[2.5rem]
          shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]
          border border-slate-100
          overflow-hidden
          grid lg:grid-cols-2
        "
      >
        <div className="hidden lg:block border-r border-slate-100">
          <VisualSide />
        </div>

        <div className="flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 py-8 md:py-10 lg:py-12">
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-slate-500 text-xs md:text-sm mt-1">
                  {isSignUp
                    ? "Enter your details to sign up"
                    : "Please enter your details to sign in"}
                </p>
              </div>
              <div className="lg:hidden w-9 h-9 md:w-10 md:h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm">
                F
              </div>
            </div>

            <div className="lg:hidden mb-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      alt="user"
                    />
                  ))}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">10k+ Riders</p>
                  <p className="text-slate-500">Joined this week</p>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-xl md:rounded-2xl flex items-start gap-2 md:gap-3"
              >
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                  <p className="text-xs md:text-sm text-red-800 font-medium">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? "signup" : "login"}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="space-y-4 md:space-y-5"
                >
                  {isSignUp && (
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <InputField
                        icon={User}
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        error={formErrors.firstName}
                      />
                      <InputField
                        icon={User}
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        error={formErrors.lastName}
                      />
                    </div>
                  )}

                  <InputField
                    icon={Mail}
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    error={formErrors.email}
                  />

                  <div className="space-y-1">
                    <div className="relative group">
                      <Lock className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 ${formErrors.password ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className={`w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 text-sm md:text-base bg-slate-50 rounded-xl md:rounded-2xl focus:ring-2 outline-none transition-all ${
                          formErrors.password ? 'ring-2 ring-red-500/20 focus:ring-red-500/20' : 'focus:ring-orange-500/20'
                        }`}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-xs text-red-500 ml-1">{formErrors.password}</p>
                    )}
                  </div>

                  <motion.button
                    onClick={handleSubmit}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                    className="w-full py-3 md:py-4 text-sm md:text-base bg-slate-900 text-white rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:bg-slate-800"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isSignUp ? "Creating Account..." : "Signing In..."}</span>
                      </>
                    ) : (
                      <>
                        {isSignUp ? "Sign Up" : "Sign In"}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative my-5 md:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs md:text-sm">
                <span className="px-4 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full py-3 md:py-4 text-sm md:text-base bg-white border-2 border-slate-200 rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 md:gap-3 hover:bg-slate-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Chrome size={18} />
              <span>Google</span>
            </motion.button>

            <p className="mt-6 md:mt-8 text-xs md:text-sm text-center text-slate-500">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                disabled={loading}
                className="ml-2 font-bold text-slate-900 hover:text-orange-600 transition-colors disabled:opacity-70"
              >
                {isSignUp ? "Log in" : "Create account"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}