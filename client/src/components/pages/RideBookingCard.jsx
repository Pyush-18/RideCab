import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Plane,
  Car,
  AlertCircle,
  Check,
  Shield,
  DollarSign,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { DateInput, SelectInput, TimeInput } from "../shared/FormInput";
import { fetchActiveRoutes } from "../../store/slices/routeSlice";
import { fetchAllPricing } from "../../store/slices/pricingSlice";
import { toast } from "sonner";
import LocationMapSelector from "../shared/LocationMapSelector";

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
  const [selectedAirport, setSelectedAirport] = useState("");
  const [searchError, setSearchError] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [pickupSubLocation, setPickupSubLocation] = useState("");
  const [dropSubLocation, setDropSubLocation] = useState("");
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDropMap, setShowDropMap] = useState(false);
  const [pickupLocationData, setPickupLocationData] = useState(null);
  const [dropLocationData, setDropLocationData] = useState(null);

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
      } else if (activeTab === "local" && route.tripType === "day-rental") {
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
      ? availableAirports
      : ["No available airports"];

  const cities =
    availableCities.length > 0 ? availableCities : ["No available locations"];

  const filteredCities = cities.filter((city) => {
    return (
      city.toLowerCase().includes(locationSearch.toLowerCase()) ||
      dropLocation.toLowerCase().includes(locationSearch.toLowerCase())
    );
  });

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
    {
      id: "local",
      label: "Local",
      icon: MapPin,
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop",
      tagline: "City rides made easy",
      desc: "Quick and convenient local trips within your city.",
    },
  ];

  const OUTSTATION_CITIES = ["Kharagpur", "Kolkata"];
  const CITY_RADIUS_KM = 25;

  const getLinkedCity = (selectedCity) => {
    if (selectedCity === "Kharagpur") return "Kolkata";
    if (selectedCity === "Kolkata") return "Kharagpur";
    return "";
  };

  const benefits = [
    {
      icon: Check,
      title: "One-Way & Round Trips",
      desc: "Pay only for what you need.",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      desc: "Upfront fares with no hidden charges.",
    },
    {
      icon: MapPin,
      title: "PAN-India Coverage",
      desc: "Available in 3,000+ towns & cities.",
    },
    {
      icon: Car,
      title: "Multiple Car Options",
      desc: "Hatchbacks to Tempo Travelers.",
    },
    {
      icon: Shield,
      title: "Verified Drivers",
      desc: "Trained and background checked professionals.",
    },
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

      // Additional validation for one-way trips
      if (tripType === "oneway") {
        if (!pickupSubLocation) {
          setSearchError(`Please enter pickup location in ${pickupLocation}`);
          return null;
        }
        if (!dropSubLocation) {
          setSearchError(`Please enter drop location in ${dropLocation}`);
          return null;
        }
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
        ...(tripType === "oneway" && {
          pickupSubLocation,
          dropSubLocation,
          radiusKm: CITY_RADIUS_KM,
          pickupCoordinates: pickupLocationData
            ? {
                lat: pickupLocationData.lat,
                lng: pickupLocationData.lng,
                placeId: pickupLocationData.placeId,
              }
            : null,
          dropCoordinates: dropLocationData
            ? {
                lat: dropLocationData.lat,
                lng: dropLocationData.lng,
                placeId: dropLocationData.placeId,
              }
            : null,
        }),
      };

      if (tripType === "round") {
        searchParams.returnDate = formatDate(returnDate);
      }

      // Rest of the validation logic remains the same...
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
    } else if (activeTab === "local") {
      if (!pickupLocation) {
        setSearchError("Please select a location");
        return null;
      }

      const normalizedPickup = normalize(pickupLocation);

      searchParams = {
        ...searchParams,
        tripType: "local",
        pickupLocation,
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
      navigate("/auth");
      return;
    }

    const result = validateAndSearchPricing();
    console.log("getting search result", result);

    if (result) {
      navigate("/pricing", {
        state: {
          searchParams: {
            ...result.searchParams,
            selectedDate: pickupDate.toISOString(),
            selectedTime: pickupTime,
            ...(tripType === "round" && activeTab === "outstation"
              ? {
                  returnDate: returnDate.toISOString(),
                }
              : {}),
          },
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

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 bg-white rounded-2xl sm:rounded-3xl md:rounded-[2rem] shadow-xl sm:shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row"
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
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <tab.icon size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline sm:inline">
                    {tab.label}
                  </span>
                  <span className="xs:hidden sm:hidden">
                    {tab.id === "airport"
                      ? "Airport"
                      : tab.id === "outstation"
                      ? "Outstation"
                      : "Local"}
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
                      {/* City Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 relative">
                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-md border border-slate-100 items-center justify-center">
                          <ArrowRight size={14} className="text-slate-400" />
                        </div>

                        <SelectInput
                          icon={MapPin}
                          placeholder="From City"
                          value={pickupLocation}
                          onValueChange={(value) => {
                            setPickupLocation(value);
                            setDropLocation(getLinkedCity(value));
                            setPickupSubLocation("");
                            setDropSubLocation("");
                            setShowPickupMap(false);
                            setShowDropMap(false);
                          }}
                          options={
                            tripType === "oneway" ? OUTSTATION_CITIES : cities
                          }
                        />

                        <SelectInput
                          icon={MapPin}
                          placeholder="To City"
                          value={dropLocation}
                          onValueChange={(value) => {
                            setDropLocation(value);
                            setDropSubLocation("");
                            setShowDropMap(false);
                          }}
                          options={
                            tripType === "oneway"
                              ? [
                                  getLinkedCity(pickupLocation) ||
                                    "Select From City First",
                                ]
                              : cities
                          }
                          disabled={tripType === "oneway"}
                        />
                      </div>

                      {tripType === "oneway" && pickupLocation && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">
                            Pickup Location in {pickupLocation} (within{" "}
                            {CITY_RADIUS_KM}km radius)
                          </Label>
                          <LocationMapSelector
                            value={pickupSubLocation}
                            onChange={setPickupSubLocation}
                            placeholder={`Search pickup address in ${pickupLocation}...`}
                            cityName={pickupLocation}
                            radiusKm={CITY_RADIUS_KM}
                            onLocationSelect={(locationData) => {
                              setPickupLocationData(locationData);
                              console.log(
                                "Pickup Location Selected:",
                                locationData
                              );
                            }}
                            className="w-full pl-10 pr-4 py-5 sm:py-6 border-2 border-slate-200 rounded-xl text-sm sm:text-base focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                          />
                        </div>
                      )}

                      {tripType === "oneway" && dropLocation && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">
                            Drop Location in {dropLocation} (within{" "}
                            {CITY_RADIUS_KM}km radius)
                          </Label>
                          <LocationMapSelector
                            value={dropSubLocation}
                            onChange={setDropSubLocation}
                            placeholder={`Search drop address in ${dropLocation}...`}
                            cityName={dropLocation}
                            radiusKm={CITY_RADIUS_KM}
                            onLocationSelect={(locationData) => {
                              setDropLocationData(locationData);
                              console.log(
                                "Drop Location Selected:",
                                locationData
                              );
                            }}
                            className="w-full pl-10 pr-4 py-5 sm:py-6 border-2 border-slate-200 rounded-xl text-sm sm:text-base focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                          />
                        </div>
                      )}

                      {/* Date and Time Selection */}
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

                {activeTab === "local" && (
                  <motion.div
                    key="local"
                    variants={contentVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4 sm:space-y-5 md:space-y-6"
                  >
                    <div className="space-y-4 sm:space-y-5">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                          <Search
                            size={18}
                            className="text-slate-400 sm:w-5 sm:h-5"
                          />
                        </div>
                        <Input
                          type="text"
                          placeholder="Search for a location..."
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-5 sm:py-6 border-2 border-slate-200 rounded-xl text-sm sm:text-base focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>

                      {locationSearch && (
                        <div className="max-h-48 overflow-y-auto border-2 border-slate-200 rounded-xl bg-white shadow-lg">
                          {filteredCities.map((city) => (
                            <div
                              key={city}
                              onClick={() => {
                                setPickupLocation(city);
                                setLocationSearch("");
                              }}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 flex items-center gap-3 transition-colors"
                            >
                              <MapPin size={18} className="text-blue-500" />
                              <span className="text-sm font-medium text-slate-700">
                                {city}
                              </span>
                            </div>
                          ))}
                          {filteredCities.length === 0 && (
                            <div className="px-4 py-6 text-center">
                              <p className="text-sm text-slate-500">
                                No locations found
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Try a different search term
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {pickupLocation && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl"
                        >
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <MapPin size={18} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                              Selected Location
                            </p>
                            <p className="text-sm text-blue-900 font-semibold">
                              {pickupLocation}
                            </p>
                          </div>
                          <button
                            onClick={() => setPickupLocation("")}
                            className="p-1.5 hover:bg-blue-200 rounded-lg transition-colors text-blue-600 hover:text-blue-800 font-bold text-lg"
                          >
                            ×
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
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
                  <span>Search Available Trips</span>
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </motion.span>
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full lg:w-80 bg-linear-to-br from-blue-50 to-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-100/50"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Long-Distance Travel,
              <br />
              Simplified
            </h3>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 group"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <benefit.icon size={16} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-0.5">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Trusted by 10M+ travelers</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RideBookingCard;
