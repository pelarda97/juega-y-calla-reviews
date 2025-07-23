import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/gaming-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Gaming setup"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-dark opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Reseñas Gaming
            </span>
            <br />
            <span className="text-foreground">de Calidad</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Descubre los mejores videojuegos a través de reseñas detalladas, 
            análisis profundos y la opinión de una comunidad apasionada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button variant="gaming" size="lg" className="text-lg px-8 py-3">
              Explorar Reseñas
            </Button>
            <Button variant="accent" size="lg" className="text-lg px-8 py-3">
              Últimos Análisis
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-accent">
                <Star className="h-6 w-6" />
                <span className="text-2xl font-bold">500+</span>
              </div>
              <span className="text-muted-foreground">Juegos Reseñados</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-6 w-6" />
                <span className="text-2xl font-bold">98%</span>
              </div>
              <span className="text-muted-foreground">Precisión en Reviews</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-accent">
                <Users className="h-6 w-6" />
                <span className="text-2xl font-bold">25K+</span>
              </div>
              <span className="text-muted-foreground">Gamers Activos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;