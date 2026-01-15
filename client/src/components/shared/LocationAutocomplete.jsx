import React, { useState, useRef, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const libraries = ["places"];

const LocationAutocomplete = ({
  value,
  onChange,
  placeholder,
  cityName,
  radiusKm,
  onLocationSelect,
  className = "",
}) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const inputRef = useRef(null);

  // Your Google Maps API Key - Get it from Google Cloud Console
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

  // City coordinates for restricting search
  const cityCenters = {
    Kharagpur: { lat: 22.346, lng: 87.232 },
    Kolkata: { lat: 22.5726, lng: 88.3639 },
  };

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);

    // Set restrictions based on city and radius
    if (cityName && cityCenters[cityName]) {
      const center = cityCenters[cityName];

      // Create bounds for the search area
      const bounds = {
        north: center.lat + radiusKm / 111, // ~111km per degree latitude
        south: center.lat - radiusKm / 111,
        east:
          center.lng +
          radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180)),
        west:
          center.lng -
          radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180)),
      };

      autocompleteInstance.setBounds(bounds);
      autocompleteInstance.setOptions({
        strictBounds: true,
        componentRestrictions: { country: "in" },
        fields: ["formatted_address", "geometry", "name", "place_id"],
      });
    }
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.error("No geometry found for this place");
        return;
      }

      const location = {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        placeId: place.place_id,
        name: place.name || place.formatted_address.split(",")[0],
      };
      if (cityName && cityCenters[cityName]) {
        const cityCenter = cityCenters[cityName];
        const distance = calculateDistance(
          cityCenter.lat,
          cityCenter.lng,
          location.lat,
          location.lng
        );

        if (distance > radiusKm) {
          alert(
            `Selected location is ${distance.toFixed(
              1
            )}km from ${cityName} center. Please select a location within ${radiusKm}km radius.`
          );

          onChange("");
          setSelectedPlace(null);
          return;
        }

        location.distanceFromCenter = distance;
      }

      setSelectedPlace(location);
      onChange(place.formatted_address);

      if (onLocationSelect) {
        onLocationSelect(location);
      }

      console.log("Location selected:", location);
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.arctan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value) => {
    return (value * Math.PI) / 180;
  };

  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_API_KEY_HERE") {
    return (
      <div className="space-y-2">
        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={className}
          />
        </div>
        <Alert variant="destructive">
          <AlertDescription className="text-xs">
            Google Maps API key not configured. Please add
            VITE_APP_GOOGLE_MAPS_API_KEY to your .env file.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading Maps...
        </div>
      }
    >
      <div className="space-y-2">
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            types: ["geocode", "establishment"],
            componentRestrictions: { country: "in" },
            fields: ["formatted_address", "geometry", "name", "place_id"],
          }}
        >
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`${className} pac-target-input`}
              autoComplete="off"
              style={{
                boxSizing: "border-box",
                width: "100%",
              }}
            />
          </div>
        </Autocomplete>

        {selectedPlace && (
          <Alert className="bg-green-50 border-green-200">
            <MapPin className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-xs">
              <div className="space-y-1">
                <p className="font-semibold">{selectedPlace.name}</p>
                <p>{selectedPlace.address}</p>
                {selectedPlace.distanceFromCenter && (
                  <p className="text-green-600">
                    📍 {selectedPlace.distanceFromCenter.toFixed(1)}km from{" "}
                    {cityName} center
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </LoadScript>
  );
};

export default LocationAutocomplete;
