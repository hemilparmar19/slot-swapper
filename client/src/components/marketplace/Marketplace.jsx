import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import api from "../../services/api";
import EventCard from "../calendar/EventCard";
import SwapRequestModal from "./SwapRequestModal";
import Button from "../common/Button";

const Marketplace = ({ onRefresh }) => {
  const [slots, setSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [swappableResponse, myEventsResponse] = await Promise.all([
        api.get("/swappable-slots"),
        api.get("/events"),
      ]);

      // Ensure data is arrays
      const swappableData = Array.isArray(swappableResponse.data)
        ? swappableResponse.data
        : [];
      const myEventsData = Array.isArray(myEventsResponse.data)
        ? myEventsResponse.data
        : [];

      setSlots(swappableData);
      setMySwappableSlots(myEventsData.filter((e) => e.status === "SWAPPABLE"));
    } catch (error) {
      console.error("Failed to load marketplace:", error);
      setSlots([]);
      setMySwappableSlots([]);
      setError(
        error.response?.data?.message || "Failed to load marketplace data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequestSwap = async (mySlotId) => {
    try {
      await api.post("/swap-request", {
        mySlotId,
        theirSlotId: selectedSlot._id,
      });
      alert("Swap request sent successfully!");
      setSelectedSlot(null);
      await loadData();
      onRefresh();
    } catch (error) {
      console.error("Swap request failed:", error);
      alert(error.response?.data?.message || "Failed to send swap request");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading marketplace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={loadData}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Slots</h2>

      {slots.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            No swappable slots available right now
          </p>
          <p className="text-sm text-gray-500 mt-2">Check back later!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <div key={slot._id}>
              <EventCard event={slot} showActions={false} />
              <Button
                onClick={() => setSelectedSlot(slot)}
                fullWidth
                className="mt-2"
              >
                Request Swap
              </Button>
            </div>
          ))}
        </div>
      )}

      <SwapRequestModal
        isOpen={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
        selectedSlot={selectedSlot}
        mySwappableSlots={mySwappableSlots}
        onRequestSwap={handleRequestSwap}
      />
    </div>
  );
};

export default Marketplace;
