export interface Rating {
  id: string;
  userId: string;
  busId?: string;
  driverId?: string;
  routeId?: string;
  rating: number; // 1-5
  comment?: string;
  timestamp: string;
  type: 'bus' | 'driver' | 'route' | 'service';
}

export interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: { [key: number]: number }; // 1-5 stars count
  recentRatings: Rating[];
}

// Simulated rating service
export const ratingService = {
  // Get all ratings
  getAllRatings: (): Rating[] => {
    const ratings = localStorage.getItem('bus_tracker_ratings');
    return ratings ? JSON.parse(ratings) : [];
  },

  // Get rating by ID
  getRatingById: (id: string): Rating | null => {
    const ratings = ratingService.getAllRatings();
    return ratings.find(rating => rating.id === id) || null;
  },

  // Submit new rating
  submitRating: (rating: Omit<Rating, 'id' | 'timestamp'>): Rating => {
    const ratings = ratingService.getAllRatings();

    // Validate rating
    if (rating.rating < 1 || rating.rating > 5) {
      throw new Error('La calificación debe estar entre 1 y 5');
    }

    const newRating: Rating = {
      id: `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...rating,
    };

    ratings.push(newRating);
    localStorage.setItem('bus_tracker_ratings', JSON.stringify(ratings));

    return newRating;
  },

  // Get ratings by type and ID
  getRatingsByTarget: (type: Rating['type'], targetId: string): Rating[] => {
    const ratings = ratingService.getAllRatings();
    const idField = type === 'bus' ? 'busId' : type === 'driver' ? 'driverId' : 'routeId';
    return ratings.filter(rating => rating.type === type && rating[idField] === targetId);
  },

  // Get ratings by user
  getRatingsByUser: (userId: string): Rating[] => {
    const ratings = ratingService.getAllRatings();
    return ratings.filter(rating => rating.userId === userId);
  },

  // Get rating summary
  getRatingSummary: (type: Rating['type'], targetId: string): RatingSummary => {
    const ratings = ratingService.getRatingsByTarget(type, targetId);

    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recentRatings: [],
      };
    }

    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const average = total / ratings.length;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => {
      distribution[r.rating as keyof typeof distribution]++;
    });

    const recentRatings = ratings
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return {
      averageRating: Math.round(average * 10) / 10,
      totalRatings: ratings.length,
      ratingDistribution: distribution,
      recentRatings,
    };
  },

  // Check if user already rated
  hasUserRated: (userId: string, type: Rating['type'], targetId: string): boolean => {
    const ratings = ratingService.getAllRatings();
    const idField = type === 'bus' ? 'busId' : type === 'driver' ? 'driverId' : 'routeId';
    return ratings.some(rating =>
      rating.userId === userId &&
      rating.type === type &&
      rating[idField] === targetId
    );
  },

  // Update rating
  updateRating: (ratingId: string, updates: Partial<Pick<Rating, 'rating' | 'comment'>>): Rating | null => {
    const ratings = ratingService.getAllRatings();
    const ratingIndex = ratings.findIndex(r => r.id === ratingId);

    if (ratingIndex === -1) return null;

    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
      throw new Error('La calificación debe estar entre 1 y 5');
    }

    ratings[ratingIndex] = { ...ratings[ratingIndex], ...updates };
    localStorage.setItem('bus_tracker_ratings', JSON.stringify(ratings));

    return ratings[ratingIndex];
  },

  // Delete rating
  deleteRating: (ratingId: string): boolean => {
    const ratings = ratingService.getAllRatings();
    const filteredRatings = ratings.filter(r => r.id !== ratingId);

    if (filteredRatings.length < ratings.length) {
      localStorage.setItem('bus_tracker_ratings', JSON.stringify(filteredRatings));
      return true;
    }

    return false;
  },

  // Get top rated items
  getTopRated: (type: Rating['type'], limit: number = 10): Array<{ id: string; summary: RatingSummary }> => {
    // This would require knowing all items of that type
    // For simplicity, return empty array - would need integration with other services
    return [];
  },
};