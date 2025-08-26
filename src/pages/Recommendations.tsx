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
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Recomendaciones
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Las mejores selecciones curadas por nuestro equipo para que no te pierdas ninguna joya
          </p>
        </div>

        {/* Top Picks */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Crown className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold text-foreground">Nuestras Selecciones</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {topPicks.map((pick, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{pick.title}</Badge>
                    <div className="flex items-center gap-1">
                      {renderStars(pick.rating)}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-foreground">{pick.game}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{pick.reason}</p>
                  <Button variant="outline" className="w-full">
                    Ver Reseña
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Recommendations */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Listas Destacadas</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredRecommendations.map((recommendation, index) => (
              <Card key={index} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{recommendation.category}</Badge>
                    <div className="flex items-center gap-1">
                      {renderStars(recommendation.rating)}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {recommendation.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {recommendation.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {recommendation.games.map((game, gameIndex) => (
                      <div key={gameIndex} className="flex items-center gap-2 p-2 bg-secondary/50 rounded">
                        <Gamepad2 className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">{game}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="gaming" className="w-full">
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
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                ¿Buscas algo específico?
              </h3>
              <p className="text-muted-foreground mb-6">
                Explora todas nuestras reseñas para encontrar tu próximo juego favorito
              </p>
              <Button variant="gaming" size="lg">
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