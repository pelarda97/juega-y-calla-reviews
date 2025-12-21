import { Star, TrendingUp, Crown, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Recommendations = () => {
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

  const featuredRecommendations = [
    {
      title: "Los Mejores RPGs de 2024",
      description: "Descubre los juegos de rol más destacados del año",
      games: ["Baldur's Gate 3", "Starfield", "Cyberpunk 2077: Phantom Liberty"],
      rating: 5,
      category: "RPG"
    },
    {
      title: "Indies Imprescindibles",
      description: "Joyas ocultas del panorama independiente",
      games: ["Pizza Tower", "Blasphemous 2", "Sea of Stars"],
      rating: 4,
      category: "Indie"
    },
    {
      title: "Acción y Aventura",
      description: "Los títulos más emocionantes para los amantes de la acción",
      games: ["Spider-Man 2", "Alan Wake 2", "Assassin's Creed Mirage"],
      rating: 4,
      category: "Acción"
    }
  ];

  const topPicks = [
    {
      title: "Game of the Year 2024",
      game: "Baldur's Gate 3",
      reason: "Una experiencia de RPG perfecta con narrativa excepcional",
      rating: 5
    },
    {
      title: "Mejor Indie",
      game: "Pizza Tower",
      reason: "Creatividad y diversión en estado puro",
      rating: 5
    },
    {
      title: "Mejor Narrativa",
      game: "Alan Wake 2",
      reason: "Una historia que te mantendrá en vilo hasta el final",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3 sm:mb-4">
            Recomendaciones
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Las mejores selecciones curadas por nuestro equipo para que no te pierdas ninguna joya
          </p>
        </div>

        {/* Top Picks */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-accent flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Nuestras Selecciones</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {topPicks.map((pick, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs sm:text-sm">{pick.title}</Badge>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {renderStars(pick.rating)}
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">{pick.game}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">{pick.reason}</p>
                  <Button variant="outline" className="w-full min-h-[44px] touch-manipulation text-sm sm:text-base">
                    Ver Reseña
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Recommendations */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Listas Destacadas</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {featuredRecommendations.map((recommendation, index) => (
              <Card key={index} className="border-border">
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs sm:text-sm">{recommendation.category}</Badge>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {renderStars(recommendation.rating)}
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">
                    {recommendation.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    {recommendation.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {recommendation.games.map((game, gameIndex) => (
                      <div key={gameIndex} className="flex items-center gap-2 p-2 sm:p-3 bg-secondary/50 rounded">
                        <Gamepad2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-foreground">{game}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="gaming" className="w-full min-h-[44px] touch-manipulation text-sm sm:text-base">
                    Ver Lista Completa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-border bg-gradient-to-r from-card/50 to-card">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                ¿Buscas algo específico?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
                Explora todas nuestras reseñas para encontrar tu próximo juego favorito
              </p>
              <Button variant="gaming" size="lg" className="min-h-[48px] touch-manipulation text-sm sm:text-base">
                Ver Todas las Reseñas
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Recommendations;