//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";

const Location = ({ onClose, onSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const [currentAddress, setCurrentAddress] = useState("Fetching address...");
  const [position, setPosition] = useState(null);

  const initMap = (lat, lng) => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 16,
    });

    geocoderRef.current = new window.google.maps.Geocoder();

    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      draggable: true,
    });

    markerRef.current = marker;

    setPosition({ lat, lng });
    geocodeLatLng(lat, lng);

    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      const newLat = pos.lat();
      const newLng = pos.lng();
      setPosition({ lat: newLat, lng: newLng });
      geocodeLatLng(newLat, newLng);
    });
  };

  const geocodeLatLng = (lat, lng) => {
    const latlng = { lat, lng };
    geocoderRef.current.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setCurrentAddress(results[0].formatted_address);
        } else {
          setCurrentAddress("No address found");
        }
      } else {
        setCurrentAddress("Failed to fetch address");
        console.error("Geocoder failed: " + status);
      }
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          initMap(latitude, longitude);
        },
        (err) => {
          alert("Failed to get location: " + err.message);
        }
      );
    } else {
      alert("Geolocation is not supported");
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-md w-full max-w-2xl h-[500px] relative">
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={onClose}
        >
          ❌
        </button>

        <h2 className="text-lg font-semibold mb-2">Select Your Location</h2>

        <div
          ref={mapRef}
          style={{ height: "300px", width: "100%", marginBottom: "10px" }}
        ></div>

        <div className="text-sm mb-4">
          <strong>Selected Address:</strong> {currentAddress}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSelect(currentAddress);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Use This Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default Location;
