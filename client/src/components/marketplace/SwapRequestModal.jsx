import React, { useState } from "react";
import Modal from "../common/Modal";
import EventCard from "../calendar/EventCard";
import Button from "../common/Button";

const SwapRequestModal = ({
  isOpen,
  onClose,
  selectedSlot,
  mySwappableSlots,
  onRequestSwap,
}) => {
  const [requesting, setRequesting] = useState(false);

  const handleRequest = async (mySlotId) => {
    setRequesting(true);
    try {
      await onRequestSwap(mySlotId);
    } finally {
      setRequesting(false);
    }
  };

  if (!selectedSlot) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Your Slot to Offer"
      maxWidth="max-w-2xl"
    >
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">You want to swap for:</p>
        <EventCard event={selectedSlot} showActions={false} />
      </div>

      <p className="text-sm font-medium text-gray-700 mb-3">
        Choose one of your swappable slots:
      </p>

      {mySwappableSlots.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You don't have any swappable slots</p>
          <p className="text-sm text-gray-500 mt-2">
            Create an event and mark it as swappable first
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {mySwappableSlots.map((slot) => (
            <div key={slot._id}>
              <EventCard event={slot} showActions={false} />
              <Button
                variant="success"
                onClick={() => handleRequest(slot._id)}
                disabled={requesting}
                fullWidth
                className="mt-2"
              >
                {requesting ? "Sending..." : "Offer This Slot"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default SwapRequestModal;
