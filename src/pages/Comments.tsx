import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, ThumbsUp, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRealtimeComments } from "@/hooks/useRealtimeStats";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Comments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { comments, loading } = useRealtimeComments(id || '');

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !authorName.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Get review ID
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('id')
        .eq('slug', id)
        .single();

      if (!reviewData) {
        throw new Error('Review not found');
      }

      // Insert comment
      const { error } = await supabase
        .from('comments')
        .insert({
          review_id: reviewData.id,
          author_name: authorName.trim(),
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment("");
      setAuthorName("");
      toast({
        title: "¡Comentario publicado!",
        description: "Tu comentario ha sido añadido correctamente"
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "No se pudo publicar el comentario. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  // Get review title from the review titles map
  const reviewTitles: { [key: string]: string } = {
    "the-last-of-us-2": "The Last of Us Part II - Una obra maestra controversial",
    "clair-obscur-expedition-33": "Clair Obscur: Expedition 33 - Un RPG prometedor"
  };

  const reviewTitle = reviewTitles[id || ""] || "Reseña";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/review/${id}`)}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la Reseña
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Comentarios
            </h1>
            <p className="text-muted-foreground mt-1">
              {reviewTitle}
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Comment Form */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Escribe un comentario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-foreground mb-2">
                    Tu nombre
                  </label>
                  <input
                    id="authorName"
                    type="text"
                    placeholder="Escribe tu nombre..."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
                    Tu comentario
                  </label>
                  <Textarea
                    id="comment"
                    placeholder="Comparte tu opinión sobre esta reseña..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <Button 
                  onClick={handleSubmitComment}
                  disabled={submitting}
                  className="w-full"
                  variant="gaming"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {submitting ? "Publicando..." : "Publicar Comentario"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Comments List */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Comentarios de la comunidad
            </h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Cargando comentarios...</p>
              </div>
            ) : comments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No hay comentarios aún
                  </h3>
                  <p className="text-muted-foreground">
                    Sé el primero en compartir tu opinión sobre esta reseña
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {getInitials(comment.author_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{comment.author_name}</span>
                            <Calendar className="h-4 w-4 ml-2" />
                            <span>{new Date(comment.created_at).toLocaleDateString('es-ES')}</span>
                          </div>
                          <p className="text-foreground leading-relaxed">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {comment.likes_count || 0}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <Card className="border-border bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-bold text-foreground mb-4">
                ¿Te gustan nuestras reseñas?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Descubre más análisis detallados de los mejores juegos del momento
              </p>
              <Button 
                variant="gaming" 
                size="lg"
                onClick={() => navigate('/reviews')}
                className="font-semibold"
              >
                Ver Todas las Reviews
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