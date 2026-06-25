import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

async function fetchRainViewerData() {
  const resp = await fetch("https://api.rainviewer.com/public/weather-maps.json");
  if (!resp.ok) throw new Error("RainViewer unavailable");
  const data = await resp.json();
  // Get the most recent radar frame
  const frames = data.radar?.past;
  if (!frames || frames.length === 0) throw new Error("No radar frames");
  const latestFrame = frames[frames.length - 1];
  return {
    time: latestFrame.time,
    path: latestFrame.path,
    host: data.host,
  };
}

export default function PrecipitationMap({ lat, lon, theme }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const radarLayerRef = useRef(null);
  const baseLayerRef = useRef(null);
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

      // CartoDB Positron base tiles — switch based on theme
      const baseMapStyle = theme === 'dark' ? 'dark_all' : 'light_all';
      const baseLayer = L.tileLayer(
        `https://{s}.basemaps.cartocdn.com/${baseMapStyle}/{z}/{x}/{y}{r}.png`,
        { subdomains: "abcd", maxZoom: 19 }
      );
      baseLayer.addTo(map);
      baseLayerRef.current = baseLayer;

      // Load RainViewer radar
      try {
        const radarData = await fetchRainViewerData();
        if (!mounted || !mapInstanceRef.current) return;

        const radarUrl = `${radarData.host}${radarData.path}/256/{z}/{x}/{y}/2/1_1.png`;
        const radarLayer = L.tileLayer(radarUrl, {
          opacity: 0.6,
          maxZoom: 15,
          maxNativeZoom: 6,
        });
        radarLayer.addTo(map);
        radarLayerRef.current = radarLayer;

        const date = new Date(radarData.time * 1000);
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
        const radarData = await fetchRainViewerData();
        if (!mounted || !mapInstanceRef.current) return;

        if (radarLayerRef.current) {
          mapInstanceRef.current.removeLayer(radarLayerRef.current);
        }
        const radarUrl = `${radarData.host}${radarData.path}/256/{z}/{x}/{y}/2/1_1.png`;
        const radarLayer = L.tileLayer(radarUrl, {
          opacity: 0.6,
          maxZoom: 15,
          maxNativeZoom: 6,
        });
        radarLayer.addTo(mapInstanceRef.current);
        radarLayerRef.current = radarLayer;

        const date = new Date(radarData.time * 1000);
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

    // Make map responsive to container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    
    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }

    return () => {
      mounted = false;
      clearInterval(interval);
      if (mapRef.current) {
        resizeObserver.unobserve(mapRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, theme]);

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
