export type PaymentMethod = 'card' | 'cash' | 'wallet' | 'transfer';

export interface PaymentData {
  amount: number;
  method: PaymentMethod;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  walletId?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
  amount: number;
  timestamp: string;
}

export interface TripFare {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  total: number;
  currency: string;
}

// Simulated payment service
export const paymentService = {
  // Calculate trip fare
  calculateFare: (distanceKm: number, durationMin: number, busType: 'express' | 'local' | 'shuttle' = 'local'): TripFare => {
    const baseFare = 2.50; // Base fare in USD
    const perKmRate = busType === 'express' ? 0.8 : busType === 'local' ? 0.5 : 0.3;
    const perMinRate = 0.1;

    const distanceFare = distanceKm * perKmRate;
    const timeFare = durationMin * perMinRate;
    const total = baseFare + distanceFare + timeFare;

    return {
      baseFare,
      distanceFare,
      timeFare,
      total: Math.round(total * 100) / 100, // Round to 2 decimals
      currency: 'USD',
    };
  },

  // Process payment
  processPayment: (paymentData: PaymentData): Promise<PaymentResult> => {
    return new Promise((resolve) => {
      // Simulate payment processing delay
      setTimeout(() => {
        // Simulate success/failure (90% success rate)
        const success = Math.random() > 0.1;

        if (success) {
          resolve({
            success: true,
            transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message: 'Payment processed successfully',
            amount: paymentData.amount,
            timestamp: new Date().toISOString(),
          });
        } else {
          resolve({
            success: false,
            transactionId: '',
            message: 'Payment failed. Please try again.',
            amount: paymentData.amount,
            timestamp: new Date().toISOString(),
          });
        }
      }, 2000); // 2 second delay
    });
  },

  // Validate payment data
  validatePaymentData: (paymentData: PaymentData): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (paymentData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (paymentData.method === 'card') {
      if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
        errors.push('Valid card number is required');
      }
      if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        errors.push('Valid expiry date (MM/YY) is required');
      }
      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        errors.push('Valid CVV is required');
      }
    }

    if (paymentData.method === 'wallet' && !paymentData.walletId) {
      errors.push('Wallet ID is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Get payment history (simulated)
  getPaymentHistory: (userId: string): PaymentResult[] => {
    const history = localStorage.getItem(`payment_history_${userId}`);
    return history ? JSON.parse(history) : [];
  },

  // Save payment to history
  savePaymentToHistory: (userId: string, payment: PaymentResult): void => {
    const history = paymentService.getPaymentHistory(userId);
    history.push(payment);
    localStorage.setItem(`payment_history_${userId}`, JSON.stringify(history));
  },

  // Refund payment
  processRefund: (transactionId: string, amount: number): Promise<PaymentResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `refund_${transactionId}`,
          message: 'Refund processed successfully',
          amount,
          timestamp: new Date().toISOString(),
        });
      }, 1500);
    });
  },
};