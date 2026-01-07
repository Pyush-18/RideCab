import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  MapPin,
  Calendar,
  Clock,
  Plus,
  Minus,
  ArrowRight,
  Plane,
  Car,
  Sun,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DateInput, SelectInput, TimeInput } from "../shared/FormInput";
import { fetchActiveRoutes } from "../../store/slices/routeSlice";
import { fetchAllPricing } from "../../store/slices/pricingSlice";

const RideBookingCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { routes } = useSelector((state) => state.routes);
  const { pricing } = useSelector((state) => state.pricing);

  const [activeTab, setActiveTab] = useState("airport");
  const [tripType, setTripType] = useState("oneway");
  const [airportType, setAirportType] = useState("pickup");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupDate, setPickupDate] = useState(() => new Date());
  const [returnDate, setReturnDate] = useState(() => new Date());
  const [pickupTime, setPickupTime] = useState("14:15");
  const [hours, setHours] = useState(8);
  const [kmIncluded, setKmIncluded] = useState(80);
  const [selectedAirport, setSelectedAirport] = useState("");
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    dispatch(fetchActiveRoutes());
    dispatch(fetchAllPricing());
  }, [dispatch]);

  const getAvailableLocations = () => {
    const locationsSet = new Set();
    routes.forEach((route) => {
      if (activeTab === "airport" && route.tripType === "airport") {
        if (route.from) locationsSet.add(route.from);
        if (route.to) locationsSet.add(route.to);
      } else if (
        activeTab === "outstation" &&
        route.tripType === "outstation"
      ) {
        if (route.from) locationsSet.add(route.from);
        if (route.to) locationsSet.add(route.to);
      } else if (activeTab === "daytrips" && route.tripType === "day-rental") {
        if (route.from) locationsSet.add(route.from);
        if (route.to) locationsSet.add(route.to);
      }
    });

    pricing.forEach((price) => {
      if (price.routeFrom) locationsSet.add(price.routeFrom);
      if (price.routeTo) locationsSet.add(price.routeTo);
    });

    return Array.from(locationsSet).sort();
  };

  const getAvailableAirports = () => {
    const airportsSet = new Set();

    routes.forEach((route) => {
      if (route.tripType === "airport" && route.airport) {
        airportsSet.add(route.airport);
      }
    });

    pricing.forEach((price) => {
      if (price.airport) airportsSet.add(price.airport);
    });

    return Array.from(airportsSet).sort();
  };

  const availableCities = getAvailableLocations();
  const availableAirports = getAvailableAirports();

  const airports =
    availableAirports.length > 0
      ? availableAirports : ["No available airports"];

  const cities =
    availableCities.length > 0
      ? availableCities
      : ["No available locations"];

  const tabs = [
    {
      id: "airport",
      label: "Airport Transfer",
      icon: Plane,
      image:
        "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop",
      tagline: "Never miss a flight",
      desc: "Reliable terminal pickups and drops with real-time tracking.",
    },
    {
      id: "outstation",
      label: "Outstation",
      icon: Car,
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
      tagline: "Explore the unknown",
      desc: "Premium sedans and SUVs for your long-distance getaways.",
    },
    // {
    //   id: "daytrips",
    //   label: "Day Rentals",
    //   icon: Sun,
    //   image:
    //     "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop",
    //   tagline: "Your city, your pace",
    //   desc: "Book a cab for the whole day. Multiple stops, one fare.",
    // },
  ];

  const timeSlots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      timeSlots.push(`${hour}:${minute}`);
    }
  }

  const activeTabData = tabs.find((t) => t.id === activeTab);
  const ActiveIcon = activeTabData.icon;

  const handleHoursChange = (increment) => {
    if (increment) {
      setHours((prev) => prev + 1);
      setKmIncluded((prev) => prev + 10);
    } else if (hours > 1) {
      setHours((prev) => prev - 1);
      setKmIncluded((prev) => prev - 10);
    }
  };

  const validateAndSearchPricing = () => {
    setSearchError("");

    const normalize = (val) => val?.toString().trim().toLowerCase();

    const formatDate = (date) => date.toLocaleDateString("en-CA");

    let searchParams = {
      bookingType: activeTab,
      pickupDate: formatDate(pickupDate),
      pickupTime,
    };

    let matchedPricing = [];

    if (activeTab === "airport") {
      if (!selectedAirport || !dropLocation) {
        setSearchError("Please select airport and destination");
        return null;
      }

      const normalizedAirport = normalize(selectedAirport);
      const normalizedDrop = normalize(dropLocation);

      searchParams = {
        ...searchParams,
        airport: selectedAirport,
        destination: dropLocation,
        airportType,
      };

      const matchingRoutes = routes.filter((route) => {
        if (route.tripType !== "airport") return false;
        if (normalize(route.airport) !== normalizedAirport) return false;

        return airportType === "pickup"
          ? normalize(route.to) === normalizedDrop
          : normalize(route.from) === normalizedDrop;
      });
      matchingRoutes.forEach((route) => {
        matchedPricing.push(...pricing.filter((p) => p.routeId === route.id));
      });

      if (matchedPricing.length === 0) {
        matchedPricing = pricing.filter((p) => {
          if (normalize(p.airport) !== normalizedAirport) return false;

          return airportType === "pickup"
            ? normalize(p.routeTo) === normalizedDrop
            : normalize(p.routeFrom) === normalizedDrop;
        });
      }
    } else if (activeTab === "outstation") {
      if (!pickupLocation || !dropLocation) {
        setSearchError("Please select pickup and drop locations");
        return null;
      }

      const normalizedPickup = normalize(pickupLocation);
      const normalizedDrop = normalize(dropLocation);

      const mappedTripType =
        tripType === "oneway"
          ? "one-way"
          : tripType === "round"
          ? "round-trip"
          : "multi-city";

      searchParams = {
        ...searchParams,
        tripType: mappedTripType,
        pickupLocation,
        dropLocation,
      };

      if (tripType === "round") {
        searchParams.returnDate = formatDate(returnDate);
      }

      const matchingRoutes = routes.filter(
        (r) =>
          r.tripType === "outstation" &&
          normalize(r.from) === normalizedPickup &&
          normalize(r.to) === normalizedDrop
      );

      matchingRoutes.forEach((route) => {
        matchedPricing.push(
          ...pricing.filter(
            (p) =>
              p.routeId === route.id &&
              normalize(p.tripType) === normalize(mappedTripType)
          )
        );
      });

      if (matchedPricing.length === 0) {
        matchedPricing = pricing.filter(
          (p) =>
            normalize(p.routeFrom) === normalizedPickup &&
            normalize(p.routeTo) === normalizedDrop
        );
      }
    } else if (activeTab === "daytrips") {
      if (!pickupLocation) {
        setSearchError("Please select pickup location");
        return null;
      }

      const normalizedPickup = normalize(pickupLocation);

      searchParams = {
        ...searchParams,
        pickupLocation,
        hours,
        kmIncluded,
      };

      const matchingRoutes = routes.filter((route) => {
        if (route.tripType !== "day-rental") return false;
        if (!route.from) return true;
        return normalize(route.from) === normalizedPickup;
      });

      matchingRoutes.forEach((route) => {
        matchedPricing.push(...pricing.filter((p) => p.routeId === route.id));
      });

      if (matchedPricing.length === 0) {
        matchedPricing = pricing.filter((p) => {
          const pTripType = normalize(p.tripType);

          if (!["day-rental", "dayrental", "local"].includes(pTripType))
            return false;

          if (p.routeFrom) {
            return normalize(p.routeFrom) === normalizedPickup;
          }

          return true;
        });
      }
    }

    if (matchedPricing.length === 0) {
      setSearchError(
        "No pricing available for this route. Please try different options."
      );
      return null;
    }

    return { searchParams, matchedPricing };
  };

  const handleSearch = () => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const result = validateAndSearchPricing();
    console.log("getting search result", result);

    if (result) {
      navigate("/pricing", {
        state: {
          searchParams: result.searchParams,
          matchedPricing: result.matchedPricing,
        },
      });
    }
  };

  const contentVariant = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const imageVariant = {
    initial: { scale: 1.1, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.7 } },
    exit: { opacity: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="min-h-screen py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-8 bg-[#F3F4F6] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-[30vh] sm:h-[40vh] md:h-[50vh] bg-linear-to-b from-slate-200 to-[#F3F4F6] -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 sm:w-96 sm:h-96 md:w-125 md:h-125 bg-orange-400/10 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 sm:w-96 sm:h-96 md:w-125 md:h-125 bg-blue-500/10 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl md:rounded-[2rem] shadow-xl sm:shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row"
      >
        <div className="lg:w-5/12 relative bg-slate-900 overflow-hidden flex flex-col justify-end p-6 sm:p-8 md:p-10 min-h-48 sm:min-h-64 md:min-h-75 lg:min-h-full group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={imageVariant}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 z-0"
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 sm:via-black/20 to-transparent z-10" />
              <img
                src={activeTabData.image}
                alt={activeTabData.label}
                className="w-full h-full object-cover opacity-90"
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-20 text-white mt-auto">
            <motion.div
              key={`${activeTab}-text`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-orange-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-2 sm:mb-3">
                <ActiveIcon size={12} className="sm:w-3.5 sm:h-3.5" />

                <span>{activeTabData.label}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
                {activeTabData.tagline}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
                {activeTabData.desc}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="lg:w-7/12 p-5 sm:p-6 md:p-8 lg:p-12 flex flex-col bg-white">
          <div className="flex p-1 sm:p-1.5 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 w-full overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 min-w-fit py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 z-10 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-slate-900 rounded-lg sm:rounded-xl -z-10 shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
                <span className="xs:hidden sm:hidden">
                  {tab.id === "airport"
                    ? "Airport"
                    : tab.id === "outstation"
                    ? "Outstation"
                    : "Day"}
                </span>
              </button>
            ))}
          </div>

          {searchError && (
            <Alert variant="destructive" className="mb-3 sm:mb-4">
              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                {searchError}
              </AlertDescription>
            </Alert>
          )}

          {routes.length === 0 && (
            <Alert className="mb-3 sm:mb-4 bg-blue-50 border-blue-200">
              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-xs sm:text-sm">
                Loading available routes...
              </AlertDescription>
            </Alert>
          )}

          <div className="grow relative">
            <AnimatePresence mode="wait">
              {activeTab === "airport" && (
                <motion.div
                  key="airport"
                  variants={contentVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4 sm:space-y-5 md:space-y-6"
                >
                  <RadioGroup
                    value={airportType}
                    onValueChange={setAirportType}
                    className="flex gap-2 sm:gap-3 md:gap-4 mb-2 overflow-x-auto no-scrollbar pb-1"
                  >
                    {["pickup", "dropoff"].map((type) => (
                      <div key={type}>
                        <RadioGroupItem
                          value={type}
                          id={type}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={type}
                          className={`cursor-pointer px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition-all inline-block whitespace-nowrap ${
                            airportType === type
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          {type === "pickup" ? "From Airport" : "To Airport"}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="space-y-4 sm:space-y-5">
                    <SelectInput
                      icon={Plane}
                      placeholder="Select Airport"
                      value={selectedAirport}
                      onValueChange={setSelectedAirport}
                      options={airports}
                    />
                    <SelectInput
                      icon={MapPin}
                      placeholder="Enter Destination"
                      value={dropLocation}
                      onValueChange={setDropLocation}
                      options={cities}
                    />
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                      <DateInput
                        icon={Calendar}
                        value={pickupDate}
                        onChange={(date) => date && setPickupDate(date)}
                        label="Date"
                      />
                      <TimeInput
                        icon={Clock}
                        value={pickupTime}
                        onChange={setPickupTime}
                        label="Time"
                        timeSlots={timeSlots}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "outstation" && (
                <motion.div
                  key="outstation"
                  variants={contentVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4 sm:space-y-5 md:space-y-6"
                >
                  <div className="flex gap-2 sm:gap-3 mb-2 overflow-x-auto no-scrollbar pb-1">
                    {["oneway", "round", "multi"].map((type) => (
                      <Badge
                        key={type}
                        variant={tripType === type ? "default" : "outline"}
                        onClick={() => setTripType(type)}
                        className={`cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                          tripType === type
                            ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {type === "multi"
                          ? "Multi-City"
                          : `${
                              type.charAt(0).toUpperCase() + type.slice(1)
                            } Way`}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 relative">
                      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-md border border-slate-100 items-center justify-center">
                        <ArrowRight size={14} className="text-slate-400" />
                      </div>
                      <SelectInput
                        icon={MapPin}
                        placeholder="From City"
                        value={pickupLocation}
                        onValueChange={setPickupLocation}
                        options={cities}
                      />
                      <SelectInput
                        icon={MapPin}
                        placeholder="To City"
                        value={dropLocation}
                        onValueChange={setDropLocation}
                        options={cities}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                      <DateInput
                        icon={Calendar}
                        value={pickupDate}
                        onChange={setPickupDate}
                        label="Departure"
                      />
                      {tripType === "round" ? (
                        <DateInput
                          icon={Calendar}
                          value={returnDate}
                          onChange={setReturnDate}
                          label="Return"
                        />
                      ) : (
                        <TimeInput
                          icon={Clock}
                          value={pickupTime}
                          onChange={setPickupTime}
                          label="Time"
                          timeSlots={timeSlots}
                        />
                      )}
                    </div>
                    {tripType === "round" && (
                      <TimeInput
                        icon={Clock}
                        value={pickupTime}
                        onChange={setPickupTime}
                        label="Pickup Time"
                        timeSlots={timeSlots}
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {/* {activeTab === "daytrips" && (
                <motion.div
                  key="daytrips"
                  variants={contentVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5 sm:space-y-6 md:space-y-8"
                >
                  <div className="space-y-4 sm:space-y-5">
                    <SelectInput
                      icon={MapPin}
                      placeholder="Pick-up Location"
                      value={pickupLocation}
                      onValueChange={setPickupLocation}
                      options={cities}
                    />
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                      <DateInput
                        icon={Calendar}
                        value={pickupDate}
                        onChange={setPickupDate}
                        label="Date"
                      />
                      <TimeInput
                        icon={Clock}
                        value={pickupTime}
                        onChange={setPickupTime}
                        label="Time"
                        timeSlots={timeSlots}
                      />
                    </div>
                  </div>

                  <Card className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                    <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Select Package
                      </span>
                      <Badge className="bg-green-500 hover:bg-green-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5">
                        MOST POPULAR
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        onClick={() => handleHoursChange(false)}
                        variant="outline"
                        size="icon"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 border-0"
                      >
                        <Minus size={16} className="sm:w-4.5 sm:h-4.5" />
                      </Button>

                      <div className="text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                            {hours}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-400">
                            hr
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full mt-1.5 sm:mt-2"
                        >
                          {kmIncluded} km included
                        </Badge>
                      </div>

                      <Button
                        onClick={() => handleHoursChange(true)}
                        size="icon"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-900 text-white hover:bg-slate-700 shadow-lg shadow-slate-900/20"
                      >
                        <Plus size={16} className="sm:w-4.5 sm:h-4.5" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )} */}
            </AnimatePresence>
          </div>

          <div className="mt-6 sm:mt-7 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-slate-100">
            <Button
              onClick={handleSearch}
              disabled={availableCities.length === 0}
              className="w-full py-4 sm:py-5 md:py-6 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg shadow-lg sm:shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
            >
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2"
              >
                <span>Search Available Rides</span>
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={18}
                />
              </motion.span>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RideBookingCard;
