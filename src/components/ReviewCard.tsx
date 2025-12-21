import { Calendar, User, MessageCircle, ThumbsUp, ThumbsDown, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GamepadIcon from "@/components/GamepadIcon";

interface ReviewCardProps {
  id: string;
  title: string;
  genre: string;
  rating: number;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  comments: number;
  likes?: number;
  dislikes?: number;
  views?: number;
  featured?: boolean;
}

const ReviewCard = ({ 
  id,
  title, 
  genre, 
  rating, 
  date, 
  author, 
  excerpt, 
  image, 
  comments,
  likes = 0,
  dislikes = 0,
  views = 0,
  featured = false 
}: ReviewCardProps) => {
  const navigate = useNavigate();
  const renderGamepads = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      const isFullyFilled = i < Math.floor(rating);
      const isHalfFilled = i === Math.floor(rating) && rating % 1 !== 0;
      
      return (
        <GamepadIcon
          key={i}
          filled={isFullyFilled}
          halfFilled={isHalfFilled}
          fillPercentage={isHalfFilled ? (rating % 1) * 100 : 0}
          className="h-4 w-4"
        />
      );
    });
  };

  return (
    <article 
      className={`group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-glow-primary transition-all duration-300 cursor-pointer touch-manipulation ${
        featured ? "ring-2 ring-accent shadow-glow-accent" : ""
      }`}
      onClick={() => navigate(`/review/${id}`)}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
          <Badge variant="default" className="bg-gradient-accent font-semibold text-xs sm:text-sm">
            Destacada
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden h-40 sm:h-48 bg-muted">
        <img 
          src={image} 
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="text-xs">
              {genre}
            </Badge>
            <div className="flex items-center gap-1 flex-shrink-0">
              {renderGamepads(rating)}
              <span className="text-xs sm:text-sm font-semibold ml-1 text-accent">
                {rating % 1 === 0 ? `${rating}.0` : rating.toFixed(1)}
              </span>
            </div>
          </div>
          
          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm line-clamp-2">
          {excerpt}
        </p>

        {/* Meta */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground gap-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="whitespace-nowrap">{date}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{views}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>0</span>
              </div>
            </div>
          </div>
          
          {/* Likes/Dislikes */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="h-3 w-3" />
              <span>{dislikes}</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <Button 
          variant="outline" 
          className="w-full group-hover:border-primary group-hover:text-primary transition-colors min-h-[44px] touch-manipulation text-sm sm:text-base"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/review/${id}`);
          }}
        >
          Leer Análisis Completo
        </Button>
      </div>
    </article>
  );
};

export default ReviewCard;