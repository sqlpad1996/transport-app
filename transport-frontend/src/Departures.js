import React, { useState, useEffect } from "react";
import axios from "axios";

const Departures = () => {
  const [departures, setDepartures] = useState({ Broadway: [], Coogee: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartures();
    const interval = setInterval(fetchDepartures, 10000); // Refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  const fetchDepartures = async () => {
    try {
      const response = await axios.get("https://transport-app-i72g.onrender.com/api/departures");
      setDepartures(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching departures:", error);
      setLoading(false);
    }
  };

  const getTimeDifference = (departureTime) => {
    const now = new Date();
    const departure = new Date(departureTime);
    return Math.max(Math.round((departure - now) / 60000), 0); // Convert ms to minutes
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">🚍 Next Departures</h2>

      {loading ? (
        <p className="text-lg text-gray-500 animate-pulse">Fetching live departures...</p>
      ) : (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN - COOGEE */}
          <div className="w-full">
            <h3 className="text-center text-lg font-semibold text-green-700 mb-4 uppercase tracking-wider">➡️ Towards Coogee</h3>
            <div className="space-y-4">
              {departures.Coogee.map((departure, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center border-l-8 border-green-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-green-600">{getTimeDifference(departure.departureTime)}</span>
                    <span className="text-gray-500 text-sm">min</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {new Date(departure.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - BROADWAY */}
          <div className="w-full">
            <h3 className="text-center text-lg font-semibold text-blue-700 mb-4 uppercase tracking-wider">➡️ Towards Broadway</h3>
            <div className="space-y-4">
              {departures.Broadway.map((departure, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center border-l-8 border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-blue-600">{getTimeDifference(departure.departureTime)}</span>
                    <span className="text-gray-500 text-sm">min</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {new Date(departure.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departures;
