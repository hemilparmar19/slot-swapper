import React, { useState } from "react";
import { Check, X } from "lucide-react";
import EventCard from "../calendar/EventCard";
import Button from "../common/Button";
import { formatDate } from "../../utils/dateFormatter";

const IncomingRequest = ({ request, onRespond }) => {
  const [responding, setResponding] = useState(false);

  const handleRespond = async (accept) => {
    setResponding(true);
    try {
      await onRespond(request._id, accept);
    } finally {
      setResponding(false);
    }
  };

  return (
    <div className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50">
      <div className="mb-3">
        <p className="font-semibold text-gray-800 mb-1">
          {request.requesterId?.name} wants to swap slots with you
        </p>
        <p className="text-sm text-gray-600">
          Requested on {formatDate(request.createdAt)}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">
            They're offering:
          </p>
          <EventCard event={request.requesterSlotId} showActions={false} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">
            For your slot:
          </p>
          <EventCard event={request.receiverSlotId} showActions={false} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="success"
          onClick={() => handleRespond(true)}
          disabled={responding}
          fullWidth
        >
          <Check className="w-5 h-5" />
          Accept
        </Button>
        <Button
          variant="danger"
          onClick={() => handleRespond(false)}
          disabled={responding}
          fullWidth
        >
          <X className="w-5 h-5" />
          Reject
        </Button>
      </div>
    </div>
  );
};

export default IncomingRequest;
