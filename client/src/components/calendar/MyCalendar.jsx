import React, { useState, useEffect } from "react";
import { Calendar, Plus } from "lucide-react";
import api from "../../services/api";
import EventCard from "./EventCard";
import CreateEventModal from "./CreateEventModal";
import Button from "../common/Button";

const MyCalendar = ({ onRefresh = () => {} }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/events");
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error("Expected array but got:", data);
        setEvents([]);
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Failed to load events:", err);
      setEvents([]);
      setError(err.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async (eventData) => {
    try {
      await api.post("/events", eventData);
      await loadEvents();
      onRefresh();
    } catch (err) {
      console.error("Failed to create event:", err);
      throw err;
    }
  };

  const handleMakeSwappable = async (eventId) => {
    try {
      await api.put(`/events/${eventId}`, { status: "SWAPPABLE" });
      await loadEvents();
      onRefresh();
    } catch (err) {
      console.error("Failed to update event:", err);
      alert(err.response?.data?.message || "Failed to update event");
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${eventId}`);
        await loadEvents();
        onRefresh();
      } catch (err) {
        console.error("Failed to delete event:", err);
        alert(err.response?.data?.message || "Failed to delete event");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your calendar...</p>
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
          onClick={loadEvents}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Calendar</h2>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-5 h-5" />
          New Event
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            No events yet. Create your first event!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onMakeSwappable={handleMakeSwappable}
              onDelete={handleDelete}
              showActions={true}
            />
          ))}
        </div>
      )}

      <CreateEventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default MyCalendar;
