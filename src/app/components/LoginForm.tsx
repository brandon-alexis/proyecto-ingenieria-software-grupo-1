import { useState } from 'react';
import { LogIn, Bus } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { LoginData } from '../types/user';
import { sileo } from 'sileo';

interface LoginFormProps {
  onLogin: (data: LoginData) => void;
  onSwitchToRegister: () => void;
  error?: string;
}

export function LoginForm({ onLogin, onSwitchToRegister, error }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onLogin(formData);
      sileo.success({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido de vuelta a BusTracker Pro',
        duration: 3000,
      });
    } catch (error) {
      sileo.error({
        title: 'Error al iniciar sesión',
        description: error instanceof Error ? error.message : 'Credenciales incorrectas',
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-600 rounded-xl mb-4">
            <Bus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold">BusTracker Pro</h1>
          <p className="text-slate-600 text-sm mt-1">Iniciar Sesión</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            <LogIn className="w-4 h-4 mr-2" />
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Regístrate aquí
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600 font-medium mb-2">Usuarios de prueba:</p>
          <div className="text-xs text-slate-500 space-y-1">
            <div>Admin: admin@bustrack.com / admin123</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
