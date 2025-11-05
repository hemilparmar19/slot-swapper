import React from "react";
import { Clock } from "lucide-react";
import { formatDateTime, calculateDuration } from "../../utils/dateFormatter";
import Button from "../common/Button";

const EventCard = ({
  event,
  onMakeSwappable,
  onDelete,
  showActions = true,
}) => {
  if (!event) {
    return (
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-500 italic">
        Invalid event data
      </div>
    );
  }

  const statusColors = {
    BUSY: "bg-gray-100 text-gray-700 border-gray-300",
    SWAPPABLE: "bg-green-100 text-green-700 border-green-300",
    SWAP_PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  const colorClass =
    statusColors[event.status] || "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <div className={`border-2 rounded-lg p-4 ${colorClass}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">
          {event.title || "Untitled Event"}
        </h3>
        {event.userId?.name && (
          <span className="text-sm px-2 py-1 bg-white rounded">
            {event.userId.name}
          </span>
        )}
      </div>

      {event.startTime && (
        <div className="flex items-center text-sm mb-2">
          <Clock className="w-4 h-4 mr-1" />
          {formatDateTime(event.startTime)}
        </div>
      )}

      {event.startTime && event.endTime && (
        <div className="flex items-center text-sm mb-3">
          <span className="font-medium">Duration:</span>
          <span className="ml-1">
            {calculateDuration(event.startTime, event.endTime)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium px-2 py-1 bg-white rounded">
          {event.status ? event.status.replace("_", " ") : "UNKNOWN"}
        </span>

        {showActions && (
          <div className="flex gap-2">
            {event.status === "BUSY" && onMakeSwappable && (
              <Button
                size="sm"
                variant="success"
                onClick={() => onMakeSwappable(event._id)}
              >
                Make Swappable
              </Button>
            )}
            {onDelete && event.status !== "SWAP_PENDING" && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(event._id)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
