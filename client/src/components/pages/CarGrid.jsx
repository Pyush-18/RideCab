import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ArrowRight, Users, Luggage, Fuel, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import { fetchActiveRoutes } from "../../store/slices/routeSlice";
import { fetchAllPricing } from "../../store/slices/pricingSlice";

export const CarGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { routes } = useSelector((state) => state.routes);
  const { pricing } = useSelector((state) => state.pricing);

  useEffect(() => {
    dispatch(fetchActiveRoutes());
    dispatch(fetchAllPricing());
  }, [dispatch]);

  const getCarImage = (carType, routeFrom, routeTo) => {
    const matchingRoute = routes.find(
      (r) => r.from === routeFrom && r.to === routeTo && r.imageUrl
    );

    if (matchingRoute?.imageUrl) {
      return matchingRoute.imageUrl;
    }

    const defaultImages = {
      Sedan:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      SUV: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
      Sports:
        "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
      Hatchback:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
      "Comfort Sedan":
        "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80",
      "Family SUV":
        "https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?w=800&q=80",
      "Premium SUV":
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      Alto: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
      Toyota:
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
    };

    return (
      defaultImages[carType] ||
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"
    );
  };

  const getFeaturedCars = () => {
    const uniqueCars = {};

    const formatRoute = (price) => {
      if (!price.routeFrom || !price.routeTo) return null;

      if (price.tripType === "round-trip") {
        return `${price.routeFrom} ⇄ ${price.routeTo}`;
      }

      return `${price.routeFrom} → ${price.routeTo}`;
    };

    pricing.forEach((price) => {
      const key = price.carType;

      if (!uniqueCars[key]) {
        let category = "One-Way Drop";

        if (price.tripType === "round-trip") {
          category = "Round Trip";
        } else if (price.tripType === "multi-city") {
          category = "Multi-City";
        }

        uniqueCars[key] = {
          name: price.carType,
          model: price.carModel || "Latest Model",
          category,
          price:
            price.tripType === "one-way"
              ? `₹${price.price}`
              : `₹${price.pricePerKm}/km`,
          capacity: price.capacity?.toString() || "4",
          luggage: price.luggage || "2 Bags",
          image: getCarImage(price.carType, price.routeFrom, price.routeTo),

          route: formatRoute(price),

          tripType: price.tripType,
          minKm: price.minKm,
        };
      }
    });

    return Object.values(uniqueCars).slice(0, 4);
  };

  const cars = getFeaturedCars();

  const handleBookNow = (car) => {
    navigate("/pricing");
  };

  const handleViewAll = () => {
    navigate("/pricing");
  };

  if (cars.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-6 relative z-10 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-14 gap-4"
        >
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Premium Fleet
            </h2>
            <p className="text-slate-500 text-lg max-w-xl">
              Experience the perfect blend of comfort and style. Choose from our
              meticulously maintained collection.
            </p>
          </div>
          <button
            onClick={handleViewAll}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-900 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            View All Cars <ArrowRight size={18} className="text-amber-600" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cars.splice(0,5).map((car, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 ease-out border border-slate-100"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm">
                    {car.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-20">
                  <div className="px-4 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-full text-white font-medium text-sm shadow-lg border border-white/10">
                    {car.price}
                    {car.tripType === "round-trip" && (
                      <span className="text-slate-400 text-xs ml-1">/km</span>
                    )}
                  </div>
                </div>

                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
              </div>

              <div className="p-6 relative">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                    {car.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium">
                      {car.model}
                    </p>
                    {car.tripType === "round-trip" && (
                      <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        Min {car.minKm}km
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <Users size={14} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700">
                      {car.capacity} Seats
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <Luggage size={14} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700">
                      {car.luggage}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <Gauge size={14} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700">
                      AC
                    </span>
                  </div>
                </div>

                {car.route && (
                  <div className="mb-6 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <p className="text-xs text-slate-700 font-medium truncate">
                      {car.route}
                      {car.tripType === "round-trip" && " (Round Trip)"}
                      {car.tripType === "multi-city" && " (Multi City)"}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleBookNow(car)}
                  className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-amber-600 active:scale-95 transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-amber-600/30 flex items-center justify-center gap-2 group/btn"
                >
                  Book Now
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center md:hidden"
        >
          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 text-slate-900 font-semibold border-b-2 border-amber-500 pb-1 hover:text-amber-600 transition-colors"
          >
            Explore All Cars <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
