import { useState } from "react";
import {
  Download,
  Printer,
  X,
  CheckCircle,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { PaymentResult } from "../services/paymentService";
import { User } from "../types/user";

interface PaymentReceiptProps {
  payment: PaymentResult;
  user: User;
  busNumber?: string;
  route?: string;
  onClose?: () => void;
}

export function PaymentReceipt({
  payment,
  user,
  busNumber,
  route,
  onClose,
}: PaymentReceiptProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getPaymentMethodLabel = (method?: string) => {
    const methods: { [key: string]: string } = {
      card: "Tarjeta de Crédito/Débito",
      cash: "Efectivo",
      wallet: "Billetera Digital",
      transfer: "Transferencia Bancaria",
    };
    return methods[method || "card"] || "Desconocido";
  };

  const downloadAsHTML = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const htmlContent = generateHTMLReceipt();
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/html;charset=utf-8," + encodeURIComponent(htmlContent),
      );
      element.setAttribute(
        "download",
        `comprobante_${payment.transactionId.substring(0, 12)}_${Date.now()}.html`,
      );
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsGenerating(false);
    }, 500);
  };

  const downloadAsText = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const textContent = generateTextReceipt();
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(textContent),
      );
      element.setAttribute(
        "download",
        `comprobante_${payment.transactionId.substring(0, 12)}_${Date.now()}.txt`,
      );
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsGenerating(false);
    }, 500);
  };

  const handlePrint = () => {
    const printContent = generateHTMLReceipt();
    const printWindow = window.open("", "", "height=800,width=800");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const generateTextReceipt = () => {
    return `
=====================================
        COMPROBANTE DE PAGO
=====================================

INFORMACIÓN DEL PASAJERO:
Nombre: ${user.name}
Email: ${user.email}
Teléfono: ${user.phone || "N/A"}

DETALLES DE LA TRANSACCIÓN:
ID Transacción: ${payment.transactionId}
Fecha y Hora: ${formatDate(payment.timestamp)}
Estado: ${payment.success ? "EXITOSO" : "FALLIDO"}

INFORMACIÓN DEL VIAJE:
Autobús: ${busNumber || "N/A"}
Ruta: ${route || "N/A"}

DETALLES DEL PAGO:
Monto: $${payment.amount.toFixed(2)} ${payment.currency || "USD"}
Método de Pago: ${getPaymentMethodLabel(payment.method)}

NOTAS:
${payment.message}

=====================================
Gracias por usar BusTracker Pro
=====================================
Generado: ${new Date().toLocaleString("es-ES")}
    `;
  };

  const generateHTMLReceipt = () => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprobante de Pago</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #1e40af;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .status {
      text-align: center;
      margin-bottom: 30px;
      padding: 15px;
      background: #dcfce7;
      border: 1px solid #86efac;
      border-radius: 6px;
      color: #166534;
      font-weight: 600;
    }
    .status.failed {
      background: #fee2e2;
      border-color: #fca5a5;
      color: #991b1b;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-weight: 700;
      color: #1e40af;
      font-size: 14px;
      text-transform: uppercase;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #333;
    }
    .info-label {
      font-weight: 500;
      color: #666;
    }
    .info-value {
      font-weight: 600;
      text-align: right;
    }
    .amount-highlight {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      background: #f0f9ff;
      border-radius: 6px;
      border-left: 4px solid #2563eb;
      margin: 15px 0;
    }
    .amount-highlight .info-label {
      color: #1e40af;
    }
    .amount-highlight .info-value {
      color: #2563eb;
      font-size: 18px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #999;
    }
    .transaction-id {
      text-align: center;
      background: #f9fafb;
      padding: 12px;
      border-radius: 6px;
      margin: 15px 0;
      font-family: monospace;
      font-size: 12px;
      word-break: break-all;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚌 BusTracker Pro</h1>
      <p>Comprobante de Pago</p>
    </div>

    <div class="status ${!payment.success ? "failed" : ""}">
      ${payment.success ? "✓ PAGO EXITOSO" : "✗ PAGO FALLIDO"}
    </div>

    <div class="section">
      <div class="section-title">Información del Pasajero</div>
      <div class="info-row">
        <span class="info-label">Nombre:</span>
        <span class="info-value">${user.name}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${user.email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Teléfono:</span>
        <span class="info-value">${user.phone || "N/A"}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Detalles de la Transacción</div>
      <div class="transaction-id">${payment.transactionId}</div>
      <div class="info-row">
        <span class="info-label">Fecha y Hora:</span>
        <span class="info-value">${formatDate(payment.timestamp)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Estado:</span>
        <span class="info-value" style="color: ${
          payment.success ? "#16a34a" : "#dc2626"
        }">
          ${payment.success ? "Exitoso" : "Fallido"}
        </span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Información del Viaje</div>
      <div class="info-row">
        <span class="info-label">Autobús:</span>
        <span class="info-value">${busNumber || "N/A"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Ruta:</span>
        <span class="info-value">${route || "N/A"}</span>
      </div>
    </div>

    <div class="section">
      <div class="amount-highlight">
        <span class="info-label">Monto Total:</span>
        <span class="info-value">$${payment.amount.toFixed(2)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Moneda:</span>
        <span class="info-value">${payment.currency || "USD"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Método de Pago:</span>
        <span class="info-value">${getPaymentMethodLabel(payment.method)}</span>
      </div>
    </div>

    <div class="footer">
      <p>Comprobante generado: ${new Date().toLocaleString("es-ES")}</p>
      <p>Gracias por usar BusTracker Pro</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-green-200 bg-green-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-green-200">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-green-900">
              ¡Pago Exitoso!
            </h2>
            <p className="text-sm text-green-700">Tu comprobante de pago</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-green-700" />
          </button>
        )}
      </div>

      {/* Receipt Content */}
      <div className="space-y-6">
        {/* Payment Details */}
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Detalles del Pago
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">ID de Transacción:</span>
              <span className="font-mono text-sm font-semibold text-gray-900">
                {payment.transactionId.substring(0, 12)}...
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">Fecha y Hora:</span>
              <span className="font-semibold text-gray-900">
                {formatDate(payment.timestamp)}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">Método de Pago:</span>
              <span className="font-semibold text-gray-900">
                {getPaymentMethodLabel(payment.method)}
              </span>
            </div>

            {busNumber && (
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Autobús:</span>
                <span className="font-semibold text-gray-900">{busNumber}</span>
              </div>
            )}

            {route && (
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Ruta:</span>
                <span className="font-semibold text-gray-900">{route}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-gray-900">
                Monto Total:
              </span>
              <span className="text-3xl font-bold text-green-600">
                ${payment.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-gray-900 mb-4">
            Información del Pasajero
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre:</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-semibold text-sm">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex justify-between">
                <span className="text-gray-600">Teléfono:</span>
                <span className="font-semibold">{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Transaction ID Box */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 mb-2">
            ID de Transacción Completo:
          </p>
          <p className="font-mono text-xs font-semibold text-blue-900 break-all">
            {payment.transactionId}
          </p>
        </div>

        {/* Download Options */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Descargar Comprobante:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              onClick={downloadAsHTML}
              disabled={isGenerating}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs sm:text-sm">HTML</span>
            </Button>
            <Button
              onClick={downloadAsText}
              disabled={isGenerating}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Texto</span>
            </Button>
            <Button
              onClick={handlePrint}
              disabled={isGenerating}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Imprimir</span>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {onClose && (
            <Button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Continuar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
