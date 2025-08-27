import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, User, Clock, Gamepad2, BookOpen, Settings, Heart, Images, ThumbsUp, ThumbsDown, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { useLikeDislike } from "@/hooks/useLikeDislike";
import { usePageViews } from "@/hooks/useRealtimeStats";
import { supabase } from "@/integrations/supabase/client";
import gamingHero from "@/assets/gaming-hero.jpg";

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { stats } = useRealtimeStats(id || '');
  const { userVote, handleVote, loading: voteLoading } = useLikeDislike(id || '');
  const { recordPageView } = usePageViews();

  // Fetch review data from database
  useEffect(() => {
    const fetchReview = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('slug', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setReview({
            id: data.slug,
            title: data.title,
            gameTitle: data.game_title,
            rating: data.rating,
            author: data.author,
            publishDate: new Date(data.publish_date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            readTime: "12 min",
            image: data.image_url || gamingHero,
            introduccion: data.introduccion,
            argumento: data.argumento,
            gameplay: data.gameplay,
            funciones: data.funciones,
            graficos: data.graficos,
            audio: data.audio,
            conclusion: data.conclusion,
            pros: data.pros || [],
            contras: data.contras || []
          });
          
          // Record page view
          recordPageView('review', id);
        }
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, recordPageView]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) ? "text-accent fill-accent" : "text-muted-foreground"
        }`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando reseña...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Reseña no encontrada</h1>
            <Button 
              onClick={() => navigate('/reviews')} 
              className="mt-4"
              variant="outline"
            >
              Volver a Reseñas
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sections = [
    { title: "Introducción", content: review.introduccion, icon: FileText },
    { title: "Argumento", content: review.argumento, icon: BookOpen },
    { title: "Gameplay", content: review.gameplay, icon: Gamepad2 },
    { title: "Funciones", content: review.funciones, icon: Settings },
    { title: "Gráficos", content: review.graficos, icon: Images },
    { title: "Audio", content: review.audio, icon: Heart },
    { title: "Conclusión", content: review.conclusion, icon: Clock }
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
                    <Badge variant="secondary">Reseña</Badge>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold ml-1 text-accent">
                        {review.rating}/10
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
                  <span>{review.publishDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{review.readTime} de lectura</span>
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
              </Card>
            );
          })}
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <ThumbsUp className="h-5 w-5" />
                Pros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {review.pros.map((pro: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{pro}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <ThumbsDown className="h-5 w-5" />
                Contras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {review.contras.map((contra: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{contra}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Interaction Section */}
        <div className="mt-12">
          <Card className="border-border">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                ¿Te gustó esta review?
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Like/Dislike Section */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-foreground">Valora esta reseña</h4>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                      variant={userVote === true ? "gaming" : "outline"}
                      size="sm"
                      onClick={() => handleVote(true)}
                      disabled={voteLoading}
                      className="flex items-center gap-2 flex-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Me gusta ({stats.likes_count})
                    </Button>
                    <Button
                      variant={userVote === false ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleVote(false)}
                      disabled={voteLoading}
                      className="flex items-center gap-2 flex-1"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      No me gusta ({stats.dislikes_count})
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-foreground">¿Te gustó esta review?</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/review/${id}/comments`)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Ver Comentarios ({stats.comments_count})
                    </Button>
                  </div>
                </div>

                {/* More Reviews Section */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-foreground">Descubre más</h4>
                  <div className="text-center space-y-3">
                    <p className="text-muted-foreground text-sm">
                      Explora más análisis detallados
                    </p>
                    <Button 
                      variant="gaming" 
                      size="lg"
                      onClick={() => navigate('/reviews')}
                      className="flex items-center gap-2"
                    >
                      <Gamepad2 className="h-5 w-5" />
                      Ver Más Reviews
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewDetail;