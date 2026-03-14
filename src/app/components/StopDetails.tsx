import { X, MapPin, Clock, Wifi, CreditCard, Home } from 'lucide-react';
import { BusStop, Bus } from '../types/bus';
import { Badge } from './ui/badge';

interface StopDetailsProps {
  stop: BusStop;
  buses: Bus[];
  onClose: () => void;
}

export function StopDetails({ stop, buses, onClose }: StopDetailsProps) {
  // Filter buses that have this stop as their next stop
  const incomingBuses = buses.filter(bus => bus.nextStop === stop.name);

  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (amenity.toLowerCase().includes('ticket')) return <CreditCard className="w-4 h-4" />;
    if (amenity.toLowerCase().includes('shelter')) return <Home className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{stop.name}</h3>
              <div className="text-sm text-blue-100 mt-1">
                Stop ID: {stop.id}
              </div>
              <div className="text-xs text-blue-100 mt-1">
                {stop.location.lat.toFixed(4)}, {stop.location.lng.toFixed(4)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Amenities */}
        <div>
          <h4 className="font-semibold mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {stop.amenities.map((amenity, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Incoming Buses */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Incoming Buses
          </h4>
          {incomingBuses.length > 0 ? (
            <div className="space-y-2">
              {incomingBuses.map(bus => (
                <div
                  key={bus.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold">Bus {bus.number}</div>
                    <div className="text-sm text-slate-600">
                      {bus.currentOccupancy}/{bus.capacity} passengers
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      {bus.estimatedArrival}
                    </div>
                    <Badge
                      className={
                        bus.status === 'on-time'
                          ? 'bg-green-100 text-green-800'
                          : bus.status === 'delayed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {bus.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500">
              No buses currently heading to this stop
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-2">
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
              Set as Favorite
            </button>
            <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium">
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
