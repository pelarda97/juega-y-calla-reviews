import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, User, Clock, Gamepad2, BookOpen, Settings, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data - en una app real vendría de una API
const reviewsData = {
  "the-last-of-us-2": {
    title: "The Last of Us Part II",
    genre: "Acción/Aventura",
    rating: 4,
    date: "15 Ene 2024",
    author: "Juega y Calla",
    image: "/placeholder.svg",
    argumento: "",
    gameplay: "",
    funciones: "",
    duracion: "",
    valoracionPersonal: ""
  },
  "clair-obscur-expedition-33": {
    title: "Clair Obscur: Expedition 33",
    genre: "RPG",
    rating: 4,
    date: "10 Ene 2024",
    author: "Juega y Calla",
    image: "/placeholder.svg",
    argumento: "",
    gameplay: "",
    funciones: "",
    duracion: "",
    valoracionPersonal: ""
  }
};

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const review = reviewsData[id as keyof typeof reviewsData];
  
  if (!review) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Reseña no encontrada</p>
    </div>;
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-accent fill-accent" : "text-muted-foreground"
        }`}
      />
    ));
  };

  const sections = [
    { title: "Argumento", content: review.argumento, icon: BookOpen },
    { title: "Gameplay", content: review.gameplay, icon: Gamepad2 },
    { title: "Funciones", content: review.funciones, icon: Settings },
    { title: "Duración", content: review.duracion, icon: Clock },
    { title: "Valoración Personal", content: review.valoracionPersonal, icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Reviews
        </Button>

        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="h-64 bg-muted flex items-center justify-center">
              <img 
                src={review.image} 
                alt={review.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{review.genre}</Badge>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold ml-1 text-accent">
                        {review.rating}.0/5
                      </span>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {review.title}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{review.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Sections */}
        <div className="grid gap-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.title} className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <IconComponent className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
                {index < sections.length - 1 && <Separator className="mx-6" />}
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="border-border bg-gradient-to-r from-card/50 to-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                ¿Te gustó esta review?
              </h3>
              <p className="text-muted-foreground mb-6">
                Descubre más análisis detallados antes de tu próxima compra
              </p>
              <Button 
                variant="gaming" 
                size="lg"
                onClick={() => navigate('/')}
              >
                Ver Más Reviews
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewDetail;