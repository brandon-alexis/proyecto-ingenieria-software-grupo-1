import { Bus, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Bus as BusType } from '../types/bus';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface BusCardProps {
  bus: BusType;
  onClick: () => void;
}

export function BusCard({ bus, onClick }: BusCardProps) {
  const occupancyPercentage = (bus.currentOccupancy / bus.capacity) * 100;
  
  const getOccupancyColor = () => {
    if (occupancyPercentage >= 90) return 'text-red-600';
    if (occupancyPercentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    switch (bus.status) {
      case 'on-time':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'arriving':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusColor = () => {
    switch (bus.status) {
      case 'on-time':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'arriving':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTypeColor = () => {
    switch (bus.type) {
      case 'express':
        return 'bg-blue-100 text-blue-800';
      case 'local':
        return 'bg-purple-100 text-purple-800';
      case 'shuttle':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">Bus {bus.number}</span>
              <Badge className={getTypeColor()}>
                {bus.type.charAt(0).toUpperCase() + bus.type.slice(1)}
              </Badge>
            </div>
            <div className="text-sm text-slate-600">ID: {bus.id}</div>
          </div>
        </div>
        <Badge className={getStatusColor()}>
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span className="capitalize">{bus.status}</span>
          </div>
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span>Next stop in</span>
          </div>
          <span className="font-semibold">{bus.estimatedArrival}</span>
        </div>

        <div className="bg-slate-50 rounded-lg p-2 text-sm">
          <div className="text-slate-600 mb-1">Next Stop</div>
          <div className="font-semibold">{bus.nextStop}</div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-4 h-4" />
              <span>Capacity</span>
            </div>
            <span className={`font-semibold ${getOccupancyColor()}`}>
              {bus.currentOccupancy} / {bus.capacity}
            </span>
          </div>
          <Progress value={occupancyPercentage} className="h-2" />
          <div className="text-xs text-slate-500 mt-1">
            {Math.round(occupancyPercentage)}% occupied
          </div>
        </div>
      </div>
    </Card>
  );
}
