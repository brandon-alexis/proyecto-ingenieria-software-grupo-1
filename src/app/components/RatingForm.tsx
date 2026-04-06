import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { ratingService, Rating } from '../services/ratingService';
import { authService } from '../services/authService';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { sileo } from 'sileo';

interface RatingFormProps {
  type: Rating['type'];
  targetId: string;
  targetName: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function RatingForm({ type, targetId, targetName, onSubmit, onCancel }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = authService.getCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      sileo.error({
        title: 'Inicio de Sesión Requerido',
        description: 'Debe iniciar sesión para calificar',
      });
      return;
    }

    if (rating === 0) {
      sileo.error({
        title: 'Calificación Requerida',
        description: 'Por favor seleccione una calificación',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user already rated
      if (ratingService.hasUserRated(currentUser.id, type, targetId)) {
        sileo.error({
          title: 'Calificación Duplicada',
          description: 'Ya ha calificado este elemento',
        });
        return;
      }

      const newRating = ratingService.submitRating({
        userId: currentUser.id,
        [type === 'bus' ? 'busId' : type === 'driver' ? 'driverId' : 'routeId']: targetId,
        rating,
        comment: comment.trim() || undefined,
        type,
      });

      sileo.success({
        title: 'Calificación Enviada',
        description: 'Su calificación ha sido enviada exitosamente',
      });

      // Reset form
      setRating(0);
      setHoverRating(0);
      setComment('');

      onSubmit?.();
    } catch (error) {
      sileo.error({
        title: 'Error al Enviar',
        description: error instanceof Error ? error.message : 'Error al enviar calificación',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'bus':
        return 'autobús';
      case 'driver':
        return 'conductor';
      case 'route':
        return 'ruta';
      case 'service':
        return 'servicio';
      default:
        return 'elemento';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Star className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">Calificar {getTypeLabel()}</h2>
          <p className="text-sm text-slate-600">{targetName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="space-y-2">
          <Label>Calificación</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-slate-600">
              {rating} estrella{rating !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment">Comentario (opcional)</Label>
          <Textarea
            id="comment"
            placeholder="Comparte tu experiencia..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting || rating === 0} className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}