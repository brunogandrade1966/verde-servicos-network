
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  totalReviews: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const RatingDisplay = ({ rating, totalReviews, size = 'md', showCount = true }: RatingDisplayProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (totalReviews === 0) {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} text-gray-300`}
          />
        ))}
        <span className={`${textSizeClasses[size]} text-gray-500 ml-1`}>
          Sem avaliações
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= Math.round(rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className={`${textSizeClasses[size]} text-gray-600 ml-1`}>
        ({rating.toFixed(1)})
      </span>
      {showCount && (
        <span className={`${textSizeClasses[size]} text-gray-500`}>
          • {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
