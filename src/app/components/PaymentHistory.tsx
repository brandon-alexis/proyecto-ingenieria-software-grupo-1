import { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  DollarSign,
  Download,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  paymentService,
  PaymentResult,
  PaymentMethod,
} from "../services/paymentService";

interface PaymentHistoryEntry extends PaymentResult {
  method?: PaymentMethod;
  busNumber?: string;
  route?: string;
}

interface PaymentHistoryProps {
  userId: string;
  onClose?: () => void;
}

export function PaymentHistory({ userId, onClose }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<PaymentHistoryEntry[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<
    PaymentHistoryEntry[]
  >([]);
  const [filter, setFilter] = useState<{
    status: "all" | "success" | "failed";
    method: "all" | PaymentMethod;
    searchTerm: string;
  }>({
    status: "all",
    method: "all",
    searchTerm: "",
  });
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  // Load payment history on component mount
  useEffect(() => {
    const loadPayments = () => {
      setLoading(true);
      const history = paymentService.getPaymentHistory(userId);
      setPayments(history as PaymentHistoryEntry[]);

      // Calculate total spent (successful payments only)
      const total = history
        .filter((p) => (p as PaymentHistoryEntry).success)
        .reduce((sum, p) => sum + (p as PaymentHistoryEntry).amount, 0);
      setTotalSpent(total);

      setLoading(false);
    };

    loadPayments();
  }, [userId]);

  // Apply filters
  useEffect(() => {
    let filtered = [...payments];

    // Filter by status
    if (filter.status !== "all") {
      filtered = filtered.filter((p) =>
        filter.status === "success" ? p.success : !p.success,
      );
    }

    // Filter by method
    if (filter.method !== "all") {
      filtered = filtered.filter((p) => p.method === filter.method);
    }

    // Filter by search term
    if (filter.searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.transactionId
            .toLowerCase()
            .includes(filter.searchTerm.toLowerCase()) ||
          p.busNumber
            ?.toLowerCase()
            .includes(filter.searchTerm.toLowerCase()) ||
          p.route?.toLowerCase().includes(filter.searchTerm.toLowerCase()),
      );
    }

    setFilteredPayments(filtered);
  }, [payments, filter]);

  const handleExportData = () => {
    const csvContent = [
      [
        "ID de Transacción",
        "Fecha",
        "Monto",
        "Método de Pago",
        "Estado",
        "Autobús",
        "Ruta",
      ],
      ...payments.map((p) => [
        p.transactionId,
        new Date(p.timestamp).toLocaleString("es-ES"),
        `$${p.amount.toFixed(2)}`,
        p.method || "N/A",
        p.success ? "Exitoso" : "Fallido",
        p.busNumber || "N/A",
        p.route || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent),
    );
    element.setAttribute(
      "download",
      `historial_pagos_${userId}_${Date.now()}.csv`,
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setFilter({
      status: "all",
      method: "all",
      searchTerm: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Historial de Pagos</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Gastado</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${totalSpent.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-blue-300" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pagos Exitosos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {payments.filter((p) => p.success).length}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-300" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pagos Fallidos</p>
                  <p className="text-3xl font-bold text-red-600">
                    {payments.filter((p) => !p.success).length}
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-red-300" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold">Filtros</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <Select
                  value={filter.status}
                  onValueChange={(value: any) =>
                    setFilter({ ...filter, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="success">Exitosos</SelectItem>
                    <SelectItem value="failed">Fallidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <Select
                  value={filter.method}
                  onValueChange={(value: any) =>
                    setFilter({ ...filter, method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="wallet">Billetera Digital</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <Input
                  placeholder="ID, autobús o ruta..."
                  value={filter.searchTerm}
                  onChange={(e) =>
                    setFilter({ ...filter, searchTerm: e.target.value })
                  }
                />
              </div>

              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  Restablecer
                </Button>
              </div>
            </div>
          </Card>

          {/* Payments Table */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <Card className="p-8 text-center border border-gray-200">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {payments.length === 0
                  ? "No hay historial de pagos aún"
                  : "No se encontraron pagos que coincidan con los filtros"}
              </p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      ID Transacción
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Monto
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Método
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Autobús
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Ruta
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">
                        {payment.transactionId.substring(0, 12)}...
                      </td>
                      <td className="px-4 py-3 flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(payment.timestamp).toLocaleString("es-ES")}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">
                          {payment.method || "N/A"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {payment.busNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {payment.route || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {payment.success ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            Exitoso
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            Fallido
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex items-center gap-2"
              disabled={payments.length === 0}
            >
              <Download className="w-4 h-4" />
              Descargar CSV
            </Button>
            {onClose && (
              <Button onClick={onClose} className="ml-auto">
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
