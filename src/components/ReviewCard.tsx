import { Star, Calendar, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReviewCardProps {
  title: string;
  genre: string;
  rating: number;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  comments: number;
  featured?: boolean;
}

const ReviewCard = ({ 
  title, 
  genre, 
  rating, 
  date, 
  author, 
  excerpt, 
  image, 
  comments,
  featured = false 
}: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-accent fill-accent" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <article 
      className={`group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-glow-primary transition-all duration-300 ${
        featured ? "ring-2 ring-accent shadow-glow-accent" : ""
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="default" className="bg-gradient-accent font-semibold">
            Destacada
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-muted">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {genre}
            </Badge>
            <div className="flex items-center gap-1">
              {renderStars(rating)}
              <span className="text-sm font-semibold ml-1 text-accent">
                {rating}.0
              </span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm line-clamp-2">
          {excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>{comments}</span>
          </div>
        </div>

        {/* Action */}
        <Button 
          variant="outline" 
          className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
        >
          Leer Reseña Completa
        </Button>
      </div>
    </article>
  );
};

export default ReviewCard;