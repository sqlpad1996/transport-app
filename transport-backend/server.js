require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.TFNSW_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../transport-frontend/build")));

// Root Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../transport-frontend/build/index.html"));
});

// API Endpoint: Get Departures for Two Stops (Broadway & Coogee)
app.get("/api/departures", async (req, res) => {
  const stops = [
    { id: "10112223", name: "Broadway" },
    { id: "10112217", name: "Coogee" },
  ];

  try {
    const results = {};

    for (const stop of stops) {
      const response = await axios.get(
        "https://api.transport.nsw.gov.au/v1/tp/departure_mon",
        {
          params: {
            outputFormat: "rapidJSON",
            coordOutputFormat: "EPSG:4326",
            mode: "direct",
            type_dm: "stop",
            name_dm: stop.id,
            departureMonitorMacro: true,
            TfNSWDM: true,
            version: "10.2.1.42",
          },
          headers: {
            Authorization: `apikey ${API_KEY}`,
          },
        }
      );

      const stopEvents = response.data.stopEvents || [];
      results[stop.name] = stopEvents.slice(0, 10).map(event => ({
        departureTime: event.departureTimeEstimated || event.departureTimePlanned,
        destination: event.transportation.destination.name,
        route: event.transportation.number,
        operator: event.transportation.operator.name,
        platform: event.location.properties.platform || "N/A",
        wheelchairAccess: event.properties?.WheelchairAccess === "true" ? "Yes" : "No"
      }));
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching departures:", error.message);
    res.status(500).json({ error: "Failed to fetch departures" });
  }
});

// Handle all other routes for frontend (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../transport-frontend/build/index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
