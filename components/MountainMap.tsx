
import React, { useEffect, useRef } from 'react';
import { HikeRecord, HikeStatus } from '../types';

interface MapProps {
  records: HikeRecord[];
  onMarkerClick: (record: HikeRecord) => void;
}

// Leaflet uses external JS/CSS, we need to handle its initialization carefully.
const MountainMap: React.FC<MapProps> = ({ records, onMarkerClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Load Leaflet Script if not present
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      const L = (window as any).L;
      if (!L || mapInstanceRef.current) return;

      mapInstanceRef.current = L.map(mapContainerRef.current).setView([36.5, 127.8], 7);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new markers
    records.forEach(record => {
      const color = record.status === HikeStatus.COMPLETED ? '#10b981' : '#fb923c';
      const markerHtml = `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });

      const marker = L.marker([record.coords.lat, record.coords.lng], { icon })
        .addTo(mapInstanceRef.current)
        .on('click', () => onMarkerClick(record));
      
      markersRef.current.push(marker);
    });
  }, [records, onMarkerClick]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default MountainMap;
