import React, { useState, useEffect } from "react";
import { Bell, RefreshCw } from "lucide-react";
import api from "../../services/api";
import IncomingRequest from "./IncomingRequest";
import OutgoingRequest from "./OutgoingRequest";

const Notifications = ({ onRefresh }) => {
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/swap-requests");

      // Ensure data has the expected structure
      const incoming = Array.isArray(data?.incoming) ? data.incoming : [];
      const outgoing = Array.isArray(data?.outgoing) ? data.outgoing : [];

      setRequests({ incoming, outgoing });
    } catch (error) {
      console.error("Failed to load requests:", error);
      setRequests({ incoming: [], outgoing: [] });
      setError(error.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleRespond = async (requestId, accept) => {
    try {
      await api.post(`/swap-response/${requestId}`, { accept });
      await loadRequests();
      onRefresh();
      alert(
        accept
          ? "Swap accepted! Your calendars have been updated."
          : "Swap rejected."
      );
    } catch (error) {
      console.error("Failed to respond:", error);
      alert(
        error.response?.data?.message || "Failed to respond to swap request"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading notifications...</p>
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
          onClick={loadRequests}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Swap Requests</h2>

      {/* Incoming Requests */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Incoming Requests ({requests.incoming.length})
        </h3>

        {requests.incoming.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
            No incoming requests
          </div>
        ) : (
          <div className="space-y-4">
            {requests.incoming.map((request) => (
              <IncomingRequest
                key={request._id}
                request={request}
                onRespond={handleRespond}
              />
            ))}
          </div>
        )}
      </div>

      {/* Outgoing Requests */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Outgoing Requests ({requests.outgoing.length})
        </h3>

        {requests.outgoing.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
            No outgoing requests
          </div>
        ) : (
          <div className="space-y-4">
            {requests.outgoing.map((request) => (
              <OutgoingRequest key={request._id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
