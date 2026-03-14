import { useState } from 'react';
import { UserPlus, Bus } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RegisterData } from '../types/user';

interface RegisterFormProps {
  onRegister: (data: RegisterData) => void;
  onSwitchToLogin: () => void;
  error?: string;
}

export function RegisterForm({ onRegister, onSwitchToLogin, error }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    onRegister(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-600 rounded-xl mb-4">
            <Bus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold">BusTracker Pro</h1>
          <p className="text-slate-600 text-sm mt-1">Registro de Pasajero</p>
        </div>

        {(error || validationError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error || validationError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono (Opcional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Contraseña <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirmar Contraseña <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            <UserPlus className="w-4 h-4 mr-2" />
            Registrarse
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
