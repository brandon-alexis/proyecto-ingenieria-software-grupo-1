import { useState, useEffect } from 'react';
import { Bus as BusType } from '../types/bus';
import { User } from '../types/user';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { AlertCircle, CreditCard, DollarSign } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { sileo } from 'sileo';

interface BusBoardingProps {
  buses: BusType[];
  currentUser: User | null;
  onBoarding: (busId: string, paymentSuccess: boolean) => void;
  initialBus?: BusType;
}

export function BusBoarding({ buses, currentUser, onBoarding, initialBus }: BusBoardingProps) {
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

  // Auto-select initial bus if provided
  useEffect(() => {
    if (initialBus && !selectedBus) {
      handleBusSelect(initialBus);
    }
  }, [initialBus]);

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
        sileo.error({
          title: 'Error de Validación',
          description: 'Por favor completa todos los datos de la tarjeta',
        });
        return;
      }

      // Basic card validation
      if (cardData.cardNumber.length < 13 || cardData.cardNumber.length > 19) {
        setPaymentError('Número de tarjeta inválido');
        sileo.error({
          title: 'Error de Validación',
          description: 'Número de tarjeta inválido',
        });
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
        setPaymentError('Fecha de vencimiento inválida (formato: MM/AA)');
        sileo.error({
          title: 'Error de Validación',
          description: 'Fecha de vencimiento inválida (formato: MM/AA)',
        });
        return;
      }

      if (cardData.cvv.length !== 3) {
        setPaymentError('CVV debe tener 3 dígitos');
        sileo.error({
          title: 'Error de Validación',
          description: 'CVV debe tener 3 dígitos',
        });
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
        sileo.success({
          title: 'Pago Exitoso',
          description: `Has pagado $${fare.total.toFixed(2)} por el viaje en el bus ${selectedBus.number}`,
        });
      } else {
        setPaymentError(result.message);
        sileo.error({
          title: 'Error en el Pago',
          description: result.message,
        });
      }
    } catch (error) {
      setPaymentError('Error al procesar el pago. Intenta nuevamente.');
      sileo.error({
        title: 'Error en el Pago',
        description: 'Error al procesar el pago. Intenta nuevamente.',
      });
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
      <div className="space-y-4 px-2 sm:px-0">
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Resumen del Viaje</h3>
          <div className="space-y-2 sm:space-y-3 mb-4 pb-4 border-b">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-slate-600 sm:text-black">Bus:</span>
              <span className="font-semibold">{selectedBus.number}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-slate-600 sm:text-black">Tipo:</span>
              <span className="font-semibold capitalize">{selectedBus.type}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-slate-600 sm:text-black">Distancia estimada:</span>
              <span className="font-semibold">5 km</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-slate-600 sm:text-black">Duración estimada:</span>
              <span className="font-semibold">20 min</span>
            </div>
          </div>

          <div className="space-y-2 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
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
            <div className="flex justify-between font-semibold text-base sm:text-lg">
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm sm:text-base"
              >
                <option value="card">Tarjeta de Crédito</option>
                <option value="cash">Efectivo</option>
                <option value="wallet">Billetera Digital</option>
                <option value="transfer">Transferencia Bancaria</option>
              </select>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3 p-3 sm:p-4 bg-slate-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-sm sm:text-base">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    maxLength={19}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-sm sm:text-base">Vencimiento (MM/AA)</Label>
                    <Input
                      id="expiryDate"
                      placeholder="12/25"
                      value={cardData.expiryDate}
                      onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                      maxLength={5}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-sm sm:text-base">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      maxLength={3}
                      type="password"
                      className="text-sm sm:text-base"
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

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={() => setShowPayment(false)}
                variant="outline"
                className="flex-1 order-2 sm:order-1"
                disabled={processing}
              >
                Volver
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 order-1 sm:order-2"
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
      <div className="space-y-4 px-2 sm:px-0">
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Detalles del Bus</h3>
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div>
                <h4 className="text-base sm:text-lg font-semibold">Bus {selectedBus.number}</h4>
                <p className="text-sm text-slate-600">{selectedBus.licensePlate}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold self-start ${
                selectedBus.status === 'on-time' ? 'bg-green-100 text-green-700' :
                selectedBus.status === 'delayed' ? 'bg-red-100 text-red-700' :
                selectedBus.status === 'arriving' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {selectedBus.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex justify-between sm:block">
                <span className="text-slate-600 mr-2 sm:mr-0">Tipo:</span>
                <span className="font-semibold capitalize">{selectedBus.type}</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-slate-600 mr-2 sm:mr-0">Capacidad:</span>
                <span className="font-semibold">{selectedBus.currentOccupancy}/{selectedBus.capacity} pasajeros</span>
              </div>
              <div className="flex justify-between sm:block sm:col-span-2">
                <span className="text-slate-600 mr-2 sm:mr-0">Próxima parada:</span>
                <span className="font-semibold">{selectedBus.nextStop}</span>
              </div>
              <div className="flex justify-between sm:block sm:col-span-2">
                <span className="text-slate-600 mr-2 sm:mr-0">Llegada estimada:</span>
                <span className="font-semibold">{selectedBus.estimatedArrival}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <Button
                onClick={() => {
                  setSelectedBus(null);
                }}
                variant="outline"
                className="flex-1 order-2 sm:order-1"
              >
                Volver
              </Button>
              <Button onClick={() => setShowPayment(true)} className="flex-1 order-1 sm:order-2">
                <DollarSign className="w-4 h-4 mr-2" />
                Proceder al Pago
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-2 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">Buses Disponibles</h2>
      {availableBuses.length === 0 ? (
        <Card className="p-4 sm:p-6 text-center">
          <p className="text-slate-600 text-sm sm:text-base">No hay buses disponibles en este momento</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {availableBuses.map(bus => (
            <Card key={bus.id} className="p-3 sm:p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold truncate">Bus {bus.number}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 truncate">{bus.licensePlate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ml-2 flex-shrink-0 ${
                    bus.status === 'on-time' ? 'bg-green-100 text-green-700' :
                    bus.status === 'delayed' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {bus.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                  <div className="flex justify-between sm:block">
                    <span className="text-slate-600 mr-1 sm:mr-0">Tipo:</span>
                    <span className="font-semibold capitalize">{bus.type}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-slate-600 mr-1 sm:mr-0">Ocupación:</span>
                    <span className="font-semibold">{bus.currentOccupancy}/{bus.capacity}</span>
                  </div>
                  <div className="flex justify-between sm:block sm:col-span-2">
                    <span className="text-slate-600 mr-1 sm:mr-0">Próxima parada:</span>
                    <span className="font-semibold text-xs sm:text-sm truncate">{bus.nextStop}</span>
                  </div>
                  <div className="flex justify-between sm:block sm:col-span-2">
                    <span className="text-slate-600 mr-1 sm:mr-0">ETA:</span>
                    <span className="font-semibold text-xs sm:text-sm">{bus.estimatedArrival}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleBusSelect(bus)}
                  className="w-full text-sm sm:text-base py-2 sm:py-3"
                  size="sm"
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
