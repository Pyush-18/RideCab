import React, { useState, useRef, useEffect } from "react";
import { MapPin, X, Loader2, Navigation, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
};

const LocationMapSelector = ({
  value,
  onChange,
  placeholder = "Select location",
  cityName,
  radiusKm,
  onLocationSelect,
  className = "",
}) => {
  const [showMap, setShowMap] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const mapRef = useRef(null);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "YOUR_API_KEY_HERE") {
      loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
        .then(() => setScriptsLoaded(true))
        .catch((error) => console.error("Error loading Google Maps:", error));
    }
  }, [GOOGLE_MAPS_API_KEY]);

  const cityCenters = {
    Kharagpur: { lat: 22.346, lng: 87.232 },
    Kolkata: { lat: 22.5726, lng: 88.3639 },
  };

  useEffect(() => {
    if (showMap && mapRef.current && !map && scriptsLoaded) {
      initializeMap();
    }
  }, [showMap, scriptsLoaded]);

  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      setTimeout(initializeMap, 100);
      return;
    }

    const center =
      cityName && cityCenters[cityName]
        ? cityCenters[cityName]
        : { lat: 22.5726, lng: 88.3639 };

    const mapStyles = [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ];

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: center,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false, 
      styles: mapStyles,
      disableDefaultUI: true,
    });

    if (cityName && cityCenters[cityName] && radiusKm) {
      new google.maps.Circle({
        map: mapInstance,
        center: center,
        radius: radiusKm * 1000,
        fillColor: "#3B82F6",
        fillOpacity: 0.08,
        strokeColor: "#3B82F6",
        strokeOpacity: 0.3,
        strokeWeight: 1.5,
        clickable: false,
      });
    }

    const markerInstance = new google.maps.Marker({
      map: mapInstance,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    markerInstance.addListener("dragend", () => {
      const position = markerInstance.getPosition();
      reverseGeocode(position.lat(), position.lng());
    });

    mapInstance.addListener("click", (e) => {
      markerInstance.setPosition(e.latLng);
      markerInstance.setMap(mapInstance);
      reverseGeocode(e.latLng.lat(), e.latLng.lng());
    });

    setMap(mapInstance);
    setMarker(markerInstance);

    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const userLocation = new google.maps.LatLng(lat, lng);
          
          mapInstance.setCenter(userLocation);
          mapInstance.setZoom(15);
          markerInstance.setPosition(userLocation);
          markerInstance.setMap(mapInstance);
          reverseGeocode(lat, lng);
        },
        (error) => {
          setIsLoading(false);
        }
      );
    }
  };

  const reverseGeocode = async (lat, lng) => {
    setIsLoading(true);
    const geocoder = new google.maps.Geocoder();

    try {
      const result = await geocoder.geocode({ location: { lat, lng } });

      if (result.results[0]) {
        const place = result.results[0];
        const location = {
          lat: lat,
          lng: lng,
          address: place.formatted_address,
          name:
            place.address_components[0]?.long_name ||
            place.formatted_address.split(",")[0],
          placeId: place.place_id,
        };

        if (cityName && cityCenters[cityName]) {
          const distance = calculateDistance(
            cityCenters[cityName].lat,
            cityCenters[cityName].lng,
            lat,
            lng
          );

          if (distance > radiusKm) {
            alert(
              `Location is outside the service area (${cityName}). Please select within ${radiusKm}km.`
            );
            if (marker) marker.setMap(null);
            setSelectedPlace(null);
            setIsLoading(false);
            return;
          }
          location.distanceFromCenter = distance;
        }

        setSelectedPlace(location);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    setIsLoading(false);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value) => {
    return (value * Math.PI) / 180;
  };

  const handleConfirmLocation = () => {
    if (selectedPlace) {
      onChange(selectedPlace.address);
      if (onLocationSelect) {
        onLocationSelect(selectedPlace);
      }
      setShowMap(false);
    }
  };

  const handleOpenMap = () => {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_API_KEY_HERE") {
      alert("Google Maps configuration error.");
      return;
    }
    if (!scriptsLoaded) return;
    setShowMap(true);
  };

  return (
    <>
      <div 
        className={`relative group cursor-pointer ${className}`} 
        onClick={handleOpenMap}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors z-10">
          <MapPin size={18} />
        </div>
        
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          readOnly
          className="pl-11 pr-24 h-12 bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-300 focus:border-blue-500 rounded-xl transition-all shadow-sm cursor-pointer text-slate-700 font-medium truncate"
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
             <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 shadow-sm group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                Select
             </span>
        </div>
      </div>

      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full h-full sm:h-[85vh] sm:max-w-3xl bg-white sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            <div className="relative flex-1 bg-slate-100 w-full h-full">
             
                <button
                    onClick={() => setShowMap(false)}
                    className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-slate-100 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                {!scriptsLoaded || isLoading ? (
                    <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-[2px]">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                        <p className="text-sm font-medium text-slate-600 animate-pulse">
                            Locating...
                        </p>
                    </div>
                ) : null}

                <div 
                    ref={mapRef} 
                    className="w-full h-full outline-none"
                    style={{ minHeight: "100%" }}
                />

                {selectedPlace && (
                    <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-6 z-10">
                         <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-5 transform transition-all animate-in slide-in-from-bottom-10 duration-300">
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                               
                                <div className="flex gap-3.5 flex-1 min-w-0">
                                    <div className="mt-1 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <MapPin className="text-blue-600 fill-blue-600/20" size={20} />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 text-base mb-0.5 truncate">
                                            {selectedPlace.name}
                                        </h4>
                                        <p className="text-sm text-slate-500 leading-snug line-clamp-2">
                                            {selectedPlace.address}
                                        </p>
                                        
                                        {selectedPlace.distanceFromCenter && (
                                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-[10px] font-bold uppercase tracking-wide text-green-700">
                                                    Inside Service Area
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleConfirmLocation}
                                    className="w-full sm:w-auto h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    Confirm
                                    <Check size={16} strokeWidth={3} />
                                </Button>
                            </div>
                         </div>
                    </div>
                )}
                
                {!selectedPlace && !isLoading && (
                     <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg pointer-events-none whitespace-nowrap">
                        Tap on the map to pin location
                     </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationMapSelector;