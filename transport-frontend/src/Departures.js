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
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Next Departures</h2>
      {loading ? (
        <p className="text-lg text-gray-500">Loading...</p>
      ) : (
        <div className="w-full max-w-5xl grid grid-cols-2 gap-6">
          {/* LEFT COLUMN - COOGEE */}
          <div className="w-full">
            <h3 className="text-center text-lg font-semibold text-green-600 mb-2">Towards Coogee</h3>
            <div className="space-y-3">
              {departures.Coogee.map((departure, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-3 flex justify-between items-center border-l-4 border-green-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl md:text-4xl font-bold text-green-600">{getTimeDifference(departure.departureTime)}</span>
                    <span className="text-gray-500 text-sm">min</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">
                    {new Date(departure.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - BROADWAY */}
          <div className="w-full">
            <h3 className="text-center text-lg font-semibold text-blue-600 mb-2">Towards Broadway</h3>
            <div className="space-y-3">
              {departures.Broadway.map((departure, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-3 flex justify-between items-center border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl md:text-4xl font-bold text-blue-600">{getTimeDifference(departure.departureTime)}</span>
                    <span className="text-gray-500 text-sm">min</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">
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
