import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Bus as BusType, BusStop, Route } from "../types/bus";
import { Bus as BusIcon, MapPin } from "lucide-react";
import React from "react";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface BusMapLeafletProps {
  buses: BusType[];
  stops: BusStop[];
  selectedRoutes: Route[];
  selectedBus: BusType | null;
  onStopClick: (stop: BusStop) => void;
  onBusClick: (bus: BusType) => void;
  showAllRoutes?: boolean;
  allStops?: BusStop[];
}

// Custom bus icon creator
const createBusIcon = (status: string) => {
  const color =
    status === "on-time"
      ? "#10B981"
      : status === "delayed"
        ? "#EF4444"
        : status === "arriving"
          ? "#F59E0B"
          : "#6B7280";

  return L.divIcon({
    className: "custom-bus-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M8 6v6"/>
          <path d="M15 6v6"/>
          <path d="M2 12h19.6"/>
          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
          <circle cx="7" cy="18" r="2"/>
          <path d="M9 18h5"/>
          <circle cx="16" cy="18" r="2"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Custom stop icon
const createStopIcon = (isHighlighted: boolean) => {
  const color = isHighlighted ? "#3B82F6" : "#64748B";

  return L.divIcon({
    className: "custom-stop-marker",
    html: `
      <div style="
        background-color: white;
        border: 3px solid ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${color}" stroke="none">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

export const BusMapLeaflet = React.memo(function BusMapLeaflet({
  buses,
  stops,
  selectedRoutes,
  selectedBus,
  onStopClick,
  onBusClick,
  showAllRoutes = false,
  allStops = [],
}: BusMapLeafletProps) {
  // Component to fit map bounds
  function MapBounds({ stops, buses }: { stops: BusStop[]; buses: BusType[] }) {
    const map = useMap();

    useEffect(() => {
      if (stops.length > 0 || buses.length > 0) {
        const allPoints: [number, number][] = [
          ...stops.map(
            (s) => [s.location.lat, s.location.lng] as [number, number],
          ),
          ...buses.map(
            (b) =>
              [b.currentLocation.lat, b.currentLocation.lng] as [
                number,
                number,
              ],
          ),
        ];

        if (allPoints.length > 0) {
          const bounds = L.latLngBounds(allPoints);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }, [stops, buses, map]);

    return null;
  }

  // Get route for selected bus
  const getBusRoute = (bus: BusType): BusStop[] => {
    if (!bus.assignedStops || bus.assignedStops.length === 0) return [];
    return bus.assignedStops
      .map((stopId) => allStops.find((s) => s.id === stopId))
      .filter(Boolean) as BusStop[];
  };

  // Calculate center
  const center: [number, number] =
    stops.length > 0
      ? [stops[0].location.lat, stops[0].location.lng]
      : [40.7128, -74.006];

  return (
    <div
      className="relative w-full h-full rounded-lg overflow-hidden border border-slate-200"
      style={{ height: "100%", width: "100%" }}
    >
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds stops={stops} buses={buses} />

        {/* Route lines for selected routes */}
        {selectedRoutes.map(route => route.stops.length > 1 && (
          <Polyline
            key={route.id}
            positions={route.stops.map(
              (s) => [s.location.lat, s.location.lng] as [number, number],
            )}
            color={route.color}
            weight={4}
            opacity={0.7}
            dashArray="10, 5"
          />
        ))}

        {/* Route lines for selected bus */}
        {selectedBus &&
          !selectedRoutes.length &&
          (() => {
            const busRoute = getBusRoute(selectedBus);
            if (busRoute.length > 1) {
              return (
                <Polyline
                  positions={busRoute.map(
                    (s) => [s.location.lat, s.location.lng] as [number, number],
                  )}
                  color="#3B82F6"
                  weight={4}
                  opacity={0.7}
                  dashArray="10, 5"
                />
              );
            }
            return null;
          })()}

        {/* Show all bus routes if enabled */}
        {showAllRoutes &&
          !selectedRoutes.length &&
          !selectedBus &&
          buses.map((bus, index) => {
            const busRoute = getBusRoute(bus);
            if (busRoute.length < 2) return null;

            const colors = [
              "#3B82F6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
            ];
            const color = colors[index % colors.length];

            return (
              <Polyline
                key={bus.id}
                positions={busRoute.map(
                  (s) => [s.location.lat, s.location.lng] as [number, number],
                )}
                color={color}
                weight={3}
                opacity={0.4}
                dashArray="8, 4"
              />
            );
          })}

        {/* Bus stops */}
        {stops.map((stop) => {
          const isOnSelectedRoute = selectedRoutes.some(route =>
            route.stops.some(s => s.id === stop.id)
          );

          return (
            <Marker
              key={stop.id}
              position={[stop.location.lat, stop.location.lng]}
              icon={createStopIcon(isOnSelectedRoute || false)}
              eventHandlers={{
                click: () => onStopClick(stop),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold mb-1">{stop.name}</div>
                  {stop.address && (
                    <div className="text-xs text-slate-600 mb-2">
                      {stop.address}
                    </div>
                  )}
                  {stop.amenities.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium">Amenities:</span>
                      <div className="mt-1">
                        {stop.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="inline-block bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded mr-1 mb-1"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Buses */}
        {buses.map((bus) => {
          const shouldShow =
            !selectedRoutes.length || selectedRoutes.some(route => route.number === bus.number);
          if (!shouldShow) return null;

          return (
            <Marker
              key={bus.id}
              position={[bus.currentLocation.lat, bus.currentLocation.lng]}
              icon={createBusIcon(bus.status)}
              eventHandlers={{
                click: () => onBusClick(bus),
              }}
            >
              <Popup>
                <div className="text-sm min-w-[200px]">
                  <div className="font-semibold text-base mb-2">
                    Bus {bus.number}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="font-medium">Placa:</span>{" "}
                      {bus.licensePlate}
                    </div>
                    <div>
                      <span className="font-medium">Ocupación:</span>{" "}
                      {bus.currentOccupancy}/{bus.capacity}
                    </div>
                    <div>
                      <span className="font-medium">Próxima parada:</span>{" "}
                      {bus.nextStop}
                    </div>
                    <div>
                      <span className="font-medium">Llegada estimada:</span>{" "}
                      {bus.estimatedArrival}
                    </div>
                    {bus.driver && (
                      <div>
                        <span className="font-medium">Conductor:</span>{" "}
                        {bus.driver.name}
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[1000]">
        <div className="font-semibold mb-2">Leyenda del Mapa</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>A Tiempo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span>Llegando</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Retrasado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border-2 border-slate-500 rounded-full" />
            <span>Parada de Bus</span>
          </div>
        </div>
      </div>
    </div>
  );
});
