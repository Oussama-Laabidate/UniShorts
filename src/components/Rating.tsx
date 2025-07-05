import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showError, showSuccess } from '@/utils/toast';

interface RatingProps {
  filmId: string;
}

export const Rating = ({ filmId }: RatingProps) => {
  const { user } = useAuth();
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      // Fetch average rating
      const { data: avgData, error: avgError } = await supabase
        .from('ratings')
        .select('score')
        .eq('film_id', filmId);
      
      if (avgData && avgData.length > 0) {
        const total = avgData.reduce((acc, item) => acc + item.score, 0);
        setAverageRating(total / avgData.length);
        setTotalRatings(avgData.length);
      }

      // Fetch user's rating
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('ratings')
          .select('score')
          .eq('film_id', filmId)
          .eq('user_id', user.id)
          .single();
        if (userData) {
          setUserRating(userData.score);
        }
      }
    };

    fetchRatings();
  }, [filmId, user]);

  const handleSetRating = async (rating: number) => {
    if (!user) {
      showError('You must be logged in to rate a film.');
      return;
    }

    const { error } = await supabase
      .from('ratings')
      .upsert({ film_id: filmId, user_id: user.id, score: rating }, { onConflict: 'film_id,user_id' });

    if (error) {
      showError('Failed to submit your rating.');
    } else {
      showSuccess(`You rated this film ${rating} stars.`);
      setUserRating(rating);
      // Ideally, re-fetch average rating here or update it client-side
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-6 h-6 cursor-pointer transition-colors',
              user ? 'text-gray-400 hover:text-primary' : 'text-gray-600',
              (hoverRating || userRating || averageRating) >= star ? 'text-primary fill-primary' : ''
            )}
            onMouseEnter={() => user && setHoverRating(star)}
            onMouseLeave={() => user && setHoverRating(0)}
            onClick={() => user && handleSetRating(star)}
          />
        ))}
        <span className="ml-2 text-muted-foreground text-sm">
          {averageRating.toFixed(1)} ({totalRatings} ratings)
        </span>
      </div>
      {userRating > 0 && <p className="text-sm text-primary mt-2">Your rating: {userRating} stars</p>}
    </div>
  );
};