import React from "react";
import EventCard from "../calendar/EventCard";

const OutgoingRequest = ({ request }) => {
  const statusColors = {
    PENDING: "text-yellow-600",
    ACCEPTED: "text-green-600",
    REJECTED: "text-red-600",
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="mb-3">
        <p className="font-semibold text-gray-800 mb-1">
          Request to {request.receiverId?.name}
        </p>
        <p className="text-sm text-gray-600">
          Status:{" "}
          <span className={`font-medium ${statusColors[request.status]}`}>
            {request.status}
          </span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">You offered:</p>
          <EventCard event={request.requesterSlotId} showActions={false} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">
            For their slot:
          </p>
          <EventCard event={request.receiverSlotId} showActions={false} />
        </div>
      </div>
    </div>
  );
};

export default OutgoingRequest;
