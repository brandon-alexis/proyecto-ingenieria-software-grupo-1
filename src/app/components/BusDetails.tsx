import { X, Bus as BusIcon, Users, Clock, MapPin, TrendingUp } from 'lucide-react';
import { Bus } from '../types/bus';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface BusDetailsProps {
  bus: Bus;
  onClose: () => void;
}

export function BusDetails({ bus, onClose }: BusDetailsProps) {
  const occupancyPercentage = (bus.currentOccupancy / bus.capacity) * 100;

  const getOccupancyStatus = () => {
    if (occupancyPercentage >= 90) return { text: 'Almost Full', color: 'text-red-600' };
    if (occupancyPercentage >= 70) return { text: 'Filling Up', color: 'text-yellow-600' };
    if (occupancyPercentage >= 40) return { text: 'Moderate', color: 'text-blue-600' };
    return { text: 'Plenty of Space', color: 'text-green-600' };
  };

  const occupancyStatus = getOccupancyStatus();

  const getStatusColor = () => {
    switch (bus.status) {
      case 'on-time':
        return 'from-green-500 to-green-600';
      case 'delayed':
        return 'from-red-500 to-red-600';
      case 'arriving':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
      <div className={`bg-gradient-to-r ${getStatusColor()} text-white p-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <BusIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Bus {bus.number}</h3>
              <div className="text-sm opacity-90 mt-1">
                {bus.type.charAt(0).toUpperCase() + bus.type.slice(1)} Service
              </div>
              <Badge className="bg-white/20 text-white border-white/30 mt-2 capitalize">
                {bus.status}
              </Badge>
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
        {/* Next Stop */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="font-semibold">Next Stop</span>
          </div>
          <div className="text-lg font-semibold text-slate-900">{bus.nextStop}</div>
          <div className="flex items-center gap-2 mt-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span>Arriving in {bus.estimatedArrival}</span>
          </div>
        </div>

        {/* Capacity Information */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-700" />
              <span className="font-semibold">Passenger Capacity</span>
            </div>
            <span className={`font-semibold ${occupancyStatus.color}`}>
              {occupancyStatus.text}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Current Occupancy</span>
              <span className="font-semibold">
                {bus.currentOccupancy} / {bus.capacity} passengers
              </span>
            </div>
            <Progress value={occupancyPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0%</span>
              <span className="font-semibold">{Math.round(occupancyPercentage)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Capacity breakdown */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-600 mb-1">Seated</div>
              <div className="text-lg font-semibold">
                {Math.floor(bus.currentOccupancy * 0.7)}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-600 mb-1">Standing</div>
              <div className="text-lg font-semibold">
                {Math.ceil(bus.currentOccupancy * 0.3)}
              </div>
            </div>
          </div>
        </div>

        {/* Current Location */}
        <div>
          <h4 className="font-semibold mb-2">Current Location</h4>
          <div className="bg-slate-50 rounded-lg p-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>
                {bus.currentLocation.lat.toFixed(4)}, {bus.currentLocation.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="text-xs text-slate-600">ID</div>
            <div className="font-semibold text-sm">{bus.id}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-600">Type</div>
            <div className="font-semibold text-sm capitalize">{bus.type}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-600">Status</div>
            <div className="font-semibold text-sm capitalize">{bus.status}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Track This Bus
          </button>
        </div>
      </div>
    </div>
  );
}
