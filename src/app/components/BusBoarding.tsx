import { useState } from 'react';
import { Bus as BusType } from '../types/bus';
import { User } from '../types/user';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { AlertCircle, CreditCard, DollarSign } from 'lucide-react';
import { paymentService } from '../services/paymentService';

interface BusBoardingProps {
  buses: BusType[];
  currentUser: User | null;
  onBoarding: (busId: string, paymentSuccess: boolean) => void;
}

export function BusBoarding({ buses, currentUser, onBoarding }: BusBoardingProps) {
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'wallet' | 'transfer'>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const availableBuses = buses.filter(bus => bus.currentOccupancy < bus.capacity);

  const handleBusSelect = (bus: BusType) => {
    setSelectedBus(bus);
    setShowPayment(false);
    setPaymentError('');
    setPaymentSuccess(false);
  };

  const handlePayment = async () => {
    if (!selectedBus || !currentUser) return;

    // Validate card data if payment method is card
    if (paymentMethod === 'card') {
      if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
        setPaymentError('Por favor completa todos los datos de la tarjeta');
        return;
      }

      // Basic card validation
      if (cardData.cardNumber.length < 13 || cardData.cardNumber.length > 19) {
        setPaymentError('Número de tarjeta inválido');
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
        setPaymentError('Fecha de vencimiento inválida (formato: MM/AA)');
        return;
      }

      if (cardData.cvv.length !== 3) {
        setPaymentError('CVV debe tener 3 dígitos');
        return;
      }
    }

    try {
      setProcessing(true);
      setPaymentError('');

      // Calculate fare
      const fare = paymentService.calculateFare(5, 20, selectedBus.type);

      // Process payment
      const result = await paymentService.processPayment({
        amount: fare.total,
        method: paymentMethod,
        cardNumber: cardData.cardNumber,
        expiryDate: cardData.expiryDate,
        cvv: cardData.cvv,
      });

      if (result.success) {
        setPaymentSuccess(true);
        // Save to history
        paymentService.savePaymentToHistory(currentUser.id, result);
        // Trigger boarding in parent component
        onBoarding(selectedBus.id, true);
      } else {
        setPaymentError(result.message);
      }
    } catch (error) {
      setPaymentError('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess && selectedBus) {
    return (
      <div className="space-y-4">
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-4">
            <div className="text-green-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">¡Bienvenido a bordo!</h3>
              <p className="text-sm text-green-700 mt-1">
                Te has subido exitosamente al bus {selectedBus.number}
              </p>
              <p className="text-sm text-green-700">
                Próxima parada: {selectedBus.nextStop}
              </p>
              <Button 
                onClick={() => {
                  setSelectedBus(null);
                  setShowPayment(false);
                  setPaymentSuccess(false);
                  setCardData({ cardNumber: '', expiryDate: '', cvv: '' });
                }}
                className="mt-3 w-full"
              >
                Continuar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (showPayment && selectedBus) {
    const fare = paymentService.calculateFare(5, 20, selectedBus.type);

    return (
      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resumen del Viaje</h3>
          <div className="space-y-2 mb-4 pb-4 border-b">
            <div className="flex justify-between">
              <span>Bus:</span>
              <span className="font-semibold">{selectedBus.number}</span>
            </div>
            <div className="flex justify-between">
              <span>Tipo:</span>
              <span className="font-semibold">{selectedBus.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Distancia estimada:</span>
              <span className="font-semibold">5 km</span>
            </div>
            <div className="flex justify-between">
              <span>Duración estimada:</span>
              <span className="font-semibold">20 min</span>
            </div>
          </div>

          <div className="space-y-2 mb-6 pb-6 border-b">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tarifa base:</span>
              <span>${fare.baseFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tarifa por distancia:</span>
              <span>${fare.distanceFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tarifa por tiempo:</span>
              <span>${fare.timeFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-blue-600">${fare.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Método de Pago</Label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="card">Tarjeta de Crédito</option>
                <option value="cash">Efectivo</option>
                <option value="wallet">Billetera Digital</option>
                <option value="transfer">Transferencia Bancaria</option>
              </select>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Vencimiento (MM/AA)</Label>
                    <Input
                      id="expiryDate"
                      placeholder="12/25"
                      value={cardData.expiryDate}
                      onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      maxLength={3}
                      type="password"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{paymentError}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => setShowPayment(false)}
                variant="outline"
                className="flex-1"
                disabled={processing}
              >
                Volver
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1"
                disabled={processing}
              >
                {processing ? 'Procesando...' : 'Pagar'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (selectedBus && !showPayment) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detalles del Bus</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-600">Número:</span>
              <span className="font-semibold">{selectedBus.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Placa:</span>
              <span className="font-semibold">{selectedBus.licensePlate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tipo:</span>
              <span className="font-semibold capitalize">{selectedBus.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Capacidad:</span>
              <span className="font-semibold">{selectedBus.currentOccupancy}/{selectedBus.capacity} pasajeros</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Próxima parada:</span>
              <span className="font-semibold">{selectedBus.nextStop}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Llegada estimada:</span>
              <span className="font-semibold">{selectedBus.estimatedArrival}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Estado:</span>
              <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                selectedBus.status === 'on-time' ? 'bg-green-100 text-green-700' :
                selectedBus.status === 'delayed' ? 'bg-red-100 text-red-700' :
                selectedBus.status === 'arriving' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {selectedBus.status}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setSelectedBus(null);
              }}
              variant="outline"
              className="flex-1"
            >
              Volver
            </Button>
            <Button onClick={() => setShowPayment(true)} className="flex-1">
              <DollarSign className="w-4 h-4 mr-2" />
              Proceder al Pago
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Buses Disponibles</h2>
      {availableBuses.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-slate-600">No hay buses disponibles en este momento</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableBuses.map(bus => (
            <Card key={bus.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">Bus {bus.number}</h3>
                    <p className="text-sm text-slate-600">{bus.licensePlate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    bus.status === 'on-time' ? 'bg-green-100 text-green-700' :
                    bus.status === 'delayed' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {bus.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-slate-600">Tipo:</p>
                    <p className="font-semibold capitalize">{bus.type}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Ocupación:</p>
                    <p className="font-semibold">{bus.currentOccupancy}/{bus.capacity}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Próxima parada:</p>
                    <p className="font-semibold text-xs">{bus.nextStop}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">ETA:</p>
                    <p className="font-semibold text-xs">{bus.estimatedArrival}</p>
                  </div>
                </div>

                <Button
                  onClick={() => handleBusSelect(bus)}
                  className="w-full"
                >
                  Seleccionar Bus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
