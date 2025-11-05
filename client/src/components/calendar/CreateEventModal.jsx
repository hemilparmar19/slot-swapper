import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

const CreateEventModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    startTime: null,
    endTime: null,
    status: "BUSY",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert dates to ISO strings for backend if needed
      const payload = {
        ...formData,
        startTime: formData.startTime?.toISOString(),
        endTime: formData.endTime?.toISOString(),
      };

      await onCreate(payload);
      setFormData({
        title: "",
        startTime: null,
        endTime: null,
        status: "BUSY",
      });
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const quickSetEndTime = (minutes) => {
    if (formData.startTime) {
      const newEnd = new Date(formData.startTime.getTime() + minutes * 60000);
      handleChange("endTime", newEnd);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Event">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />

        {/* Start Time Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <DatePicker
            selected={formData.startTime}
            onChange={(date) => handleChange("startTime", date)}
            showTimeSelect
            timeIntervals={15}
            timeFormat="HH:mm"
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select start time"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        {/* End Time Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <DatePicker
            selected={formData.endTime}
            onChange={(date) => handleChange("endTime", date)}
            showTimeSelect
            timeIntervals={15}
            timeFormat="HH:mm"
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select end time"
            minDate={formData.startTime}
            minTime={
              formData.startTime ? formData.startTime : new Date(0, 0, 0, 0, 0)
            }
            maxTime={new Date(0, 0, 0, 23, 59)}
            disabled={!formData.startTime}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
              !formData.startTime ? "bg-gray-100 cursor-not-allowed" : ""
            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
          />
          {formData.startTime && (
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => quickSetEndTime(30)}
              >
                +30 min
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => quickSetEndTime(60)}
              >
                +1 hour
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => quickSetEndTime(120)}
              >
                +2 hours
              </Button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            <option value="BUSY">Busy</option>
            <option value="SWAPPABLE">Swappable</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEventModal;
