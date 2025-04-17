"use client";

import React, { useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddressAutocomplete({ formData, setFormData }) {
  const [address, setAddress] = useState(formData.streetAddress || "");

  const handleChangeAddress = (newAddress) => {
    setAddress(newAddress);
  };

  const handleSelectAddress = (newAddress) => {
    setAddress(newAddress);
    geocodeByAddress(newAddress)
      .then((results) => {
        const addressComponents = results[0].address_components;

        // Helper to find a component by type
        const getComponent = (type) =>
          addressComponents.find((comp) => comp.types.includes(type))?.long_name || "";

        // Parse out just the street number + route for "streetAddress"
        const streetNumber = getComponent("street_number");
        const route = getComponent("route");
        const shortStreetAddress = streetNumber && route ? `${streetNumber} ${route}` : results[0].formatted_address;

        return Promise.all([results, getLatLng(results[0]), shortStreetAddress]);
      })
      .then(([results, latLng, shortStreetAddress]) => {
        setFormData((prev) => ({
          ...prev,
          streetAddress: shortStreetAddress,
          city:
            results[0].address_components.find((comp) =>
              comp.types.includes("locality")
            )?.long_name || "",
          county:
            results[0].address_components.find((comp) =>
              comp.types.includes("administrative_area_level_2")
            )?.long_name || "",
          state:
            results[0].address_components.find((comp) =>
              comp.types.includes("administrative_area_level_1")
            )?.long_name || "",
          zip:
            results[0].address_components.find((comp) =>
              comp.types.includes("postal_code")
            )?.long_name || "",
          latitude: latLng.lat,
          longitude: latLng.lng,
        }));
      })
      .catch((error) =>
        console.error("Error fetching address details:", error)
      );
  };

  return (
    <div>
      <Label htmlFor="streetAddress" className="text-sm font-semibold text-gray-700">
        Search Property 
      </Label>
      <PlacesAutocomplete
        value={address}
        onChange={handleChangeAddress}
        onSelect={handleSelectAddress}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <Input
              {...getInputProps({
                placeholder: "Search for property by address...",
                id: "streetAddress",
              })}
              className="w-full"
            />
            <div className="autocomplete-dropdown-container border border-gray-300 rounded-md mt-1">
              {loading && <div className="p-2">Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "bg-gray-200 p-2 cursor-pointer"
                  : "bg-white p-2 cursor-pointer";
                return (
                  <div
                    key={suggestion.placeId}
                    {...getSuggestionItemProps(suggestion, { className })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
}
