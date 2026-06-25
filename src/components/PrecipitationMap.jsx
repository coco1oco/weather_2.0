import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

async function fetchRainViewerTimestamp() {
  const resp = await fetch("https://api.rainviewer.com/public/weather-maps.json");
  if (!resp.ok) throw new Error("RainViewer unavailable");
  const data = await resp.json();
  // Get the most recent radar frame
  const frames = data.radar?.past;
  if (!frames || frames.length === 0) throw new Error("No radar frames");
  return frames[frames.length - 1].time;
}

export default function PrecipitationMap({ lat, lon }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const radarLayerRef = useRef(null);
  const [radarUpdatedAt, setRadarUpdatedAt] = useState(null);
  const [mapError, setMapError] = useState(null);

  // Initialize map once lat/lon are available
  useEffect(() => {
    if (!lat || !lon) return;

    let mounted = true;

    async function init() {
      if (!mounted || !mapRef.current) return;

      // Clean up previous instance if it exists (for StrictMode)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      
      // Ensure the container is empty and has no leaflet IDs
      const container = mapRef.current;
      container._leaflet_id = null;
      container.innerHTML = "";

      // Create map, strip all controls
      const map = L.map(container, {
        center: [lat, lon],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // CartoDB Positron base tiles — clean, near-white
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19 }
      ).addTo(map);

      // Load RainViewer radar
      try {
        const timestamp = await fetchRainViewerTimestamp();
        if (!mounted || !mapInstanceRef.current) return;

        const radarUrl = `https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/2/1_1.png`;
        const radarLayer = L.tileLayer(radarUrl, {
          opacity: 0.6,
          maxZoom: 15,
        });
        radarLayer.addTo(map);
        radarLayerRef.current = radarLayer;

        const date = new Date(timestamp * 1000);
        setRadarUpdatedAt(
          date.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })
        );
      } catch (err) {
        if (mounted) setMapError("Radar data unavailable");
      }
    }

    init();

    // Refresh radar every 10 minutes
    const interval = setInterval(async () => {
      if (!mapInstanceRef.current) return;
      try {
        const timestamp = await fetchRainViewerTimestamp();
        if (!mounted || !mapInstanceRef.current) return;

        if (radarLayerRef.current) {
          mapInstanceRef.current.removeLayer(radarLayerRef.current);
        }
        const radarUrl = `https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/2/1_1.png`;
        const radarLayer = L.tileLayer(radarUrl, {
          opacity: 0.6,
          maxZoom: 15,
        });
        radarLayer.addTo(mapInstanceRef.current);
        radarLayerRef.current = radarLayer;

        const date = new Date(timestamp * 1000);
        setRadarUpdatedAt(
          date.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })
        );
      } catch {
        // silent fail on refresh
      }
    }, 10 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon]);

  if (!lat || !lon) return null;

  return (
    <div className="precip-section">
      <div className="precip-map-container" ref={mapRef} />
      {mapError ? (
        <p className="precip-meta precip-meta--error">{mapError}</p>
      ) : (
        <div className="precip-legend-row">
          <div className="precip-legend">
            <span className="precip-legend__label">Light</span>
            <span className="precip-legend__ramp" />
            <span className="precip-legend__label">Heavy precipitation</span>
          </div>
          {radarUpdatedAt && (
            <span className="precip-meta">Radar updated {radarUpdatedAt}</span>
          )}
        </div>
      )}
    </div>
  );
}
