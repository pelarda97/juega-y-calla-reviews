import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, Eye } from "lucide-react";
import heroImage from "@/assets/gaming-hero.jpg";
import { useGlobalStats } from "@/hooks/useGlobalStats";

const HeroSection = () => {
  const { stats, loading } = useGlobalStats();
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Gaming setup"
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-dark opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Juega y Calla
            </span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto px-4">
            Análisis completos y honestos para que tomes la mejor decisión antes de probar un videojuego.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50 px-2">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-2 text-accent">
                <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xl sm:text-2xl font-bold">
                  {loading ? "..." : stats.totalReviews}
                </span>
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm">Reseñas</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-2 text-primary">
                <ThumbsUp className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xl sm:text-2xl font-bold">
                  {loading ? "..." : stats.totalLikes}
                </span>
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm">Me Gusta</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-2 text-accent">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xl sm:text-2xl font-bold">
                  {loading ? "..." : stats.totalViews}
                </span>
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm">Visitas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;