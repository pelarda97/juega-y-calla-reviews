import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, User, Calendar, MessageCircle, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data para comentarios
const commentsData = {
  "the-last-of-us-2": [
    {
      id: 1,
      author: "PlayerOne",
      content: "Excelente reseña! Me ayudó mucho a decidirme por el juego. La sección de gameplay está muy detallada.",
      date: "2 días",
      likes: 5
    },
    {
      id: 2,
      author: "GamerGirl23",
      content: "Coincido totalmente con la valoración. El apartado emocional del juego es increíble.",
      date: "1 semana",
      likes: 3
    },
    {
      id: 3,
      author: "RetroFan",
      content: "Me encanta cómo describes las mecánicas. ¿Tienes pensado hacer una reseña de la primera parte?",
      date: "2 semanas",
      likes: 7
    }
  ],
  "clair-obscur-expedition-33": [
    {
      id: 1,
      author: "RPGLover",
      content: "Gran análisis de este RPG. Me ha convencido para probarlo.",
      date: "3 días",
      likes: 4
    }
  ]
};

const reviewTitles = {
  "the-last-of-us-2": "The Last of Us Part II",
  "clair-obscur-expedition-33": "Clair Obscur: Expedition 33"
};

const Comments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(commentsData[id as keyof typeof commentsData] || []);

  const reviewTitle = reviewTitles[id as keyof typeof reviewTitles] || "Reseña";

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Tú",
        content: newComment,
        date: "Ahora",
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

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
          Volver a la Reseña
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Comentarios
          </h1>
          <p className="text-lg text-muted-foreground">
            Reseña de: <span className="text-foreground font-semibold">{reviewTitle}</span>
          </p>
        </div>

        {/* Write Comment Section */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageCircle className="h-5 w-5 text-primary" />
              Escribe tu comentario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Comparte tu opinión sobre esta reseña..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <div className="flex justify-end">
              <Button 
                variant="gaming" 
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Publicar Comentario
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Comentarios ({comments.length})
            </h2>
          </div>

          {comments.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aún no hay comentarios. ¡Sé el primero en compartir tu opinión!
                </p>
              </CardContent>
            </Card>
          ) : (
            comments.map((comment, index) => (
              <Card key={comment.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(comment.author)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-foreground">{comment.author}</span>
                        <Badge variant="secondary" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {comment.date}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3 leading-relaxed">
                        {comment.content}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Heart className="h-4 w-4 mr-1" />
                          {comment.likes} me gusta
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                {index < comments.length - 1 && <Separator className="mx-6" />}
              </Card>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="border-border bg-gradient-to-r from-card/50 to-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                ¿Te resultó útil esta reseña?
              </h3>
              <p className="text-muted-foreground mb-6">
                Explora más análisis detallados de otros juegos
              </p>
              <Button 
                variant="gaming" 
                size="lg"
                onClick={() => navigate('/reviews')}
              >
                Ver Más Reseñas
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Comments;