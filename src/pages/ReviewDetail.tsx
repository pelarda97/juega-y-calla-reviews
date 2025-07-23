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
  "cyberpunk-2077": {
    title: "Cyberpunk 2077",
    genre: "RPG/Acción",
    rating: 4,
    date: "15 Dic 2024",
    author: "GameMaster",
    image: "/placeholder.svg",
    argumento: "Night City te espera en esta épica aventura cyberpunk donde encarnas a V, un mercenario en busca de un implante único que otorga la inmortalidad. La historia se entrelaza con la leyenda del rock Johnny Silverhand, interpretado magistralmente por Keanu Reeves. El argumento explora temas profundos como la identidad, la mortalidad y el precio del progreso tecnológico en una sociedad distópica.",
    gameplay: "El gameplay combina elementos de RPG con acción en primera persona. Puedes personalizar tu estilo de juego eligiendo entre sigilo, hackeo o combate directo. El sistema de progresión permite especializar a V en diferentes áreas como NetRunner, Solo o Techie. Los diálogos múltiples afectan significativamente el desarrollo de la historia.",
    funciones: "• Sistema de crafting avanzado para armas y ciberware\n• Múltiples finales basados en tus decisiones\n• Exploración libre de Night City\n• Sistema de reputación con diferentes facciones\n• Personalización completa del personaje\n• Modo foto integrado",
    duracion: "La campaña principal dura aproximadamente 25-30 horas, pero completar todo el contenido secundario puede extenderse hasta 80-100 horas. Las misiones secundarias son especialmente ricas en narrativa y vale la pena explorarlas todas.",
    valoracionPersonal: "Después de las mejoras post-lanzamiento, Cyberpunk 2077 se ha convertido en una experiencia realmente memorable. Night City es impresionante visualmente y la historia de V es cautivadora. Aunque aún tiene algunos bugs menores, la experiencia general es altamente recomendable para los fanáticos del género."
  },
  "the-witcher-3": {
    title: "The Witcher 3: Wild Hunt",
    genre: "RPG",
    rating: 5,
    date: "10 Dic 2024",
    author: "RPGExpert",
    image: "/placeholder.svg",
    argumento: "Geralt de Rivia regresa en su aventura más épica. Como cazador de monstruos, debes encontrar a Ciri, tu hija adoptiva, antes de que la Cacería Salvaje la capture. La narrativa es profundamente madura, explorando temas de paternidad, guerra y sacrificio en un mundo donde las decisiones morales no son simplemente blanco o negro.",
    gameplay: "Combate táctico que requiere preparación: estudiar enemigos, crear pociones, y usar los signos de Geralt estratégicamente. El sistema de exploración es orgánico, con descubrimientos genuinos en cada rincón. Las misiones secundarias tienen la calidad narrativa de misiones principales.",
    funciones: "• Mundo abierto masivo con tres regiones principales\n• Sistema de alquimia profundo\n• Gwent: juego de cartas integrado\n• Múltiples finales para personajes principales\n• DLCs que añaden 50+ horas de contenido\n• Sistema de mutaciones avanzado",
    duracion: "Campaña principal: 50-60 horas. Con contenido secundario: 120-150 horas. Los DLCs añaden otras 40 horas de contenido premium. Un juego que puede mantenerte ocupado durante meses.",
    valoracionPersonal: "Simplemente una obra maestra. The Witcher 3 establece el estándar de oro para los RPGs de mundo abierto. Cada quest cuenta una historia memorable, los personajes son inolvidables, y el mundo se siente vivo y auténtico. Imprescindible para cualquier gamer."
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