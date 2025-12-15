import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Star, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewCard from "@/components/ReviewCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { mockReviews, USE_MOCK_DATA } from "@/data/mockReviews";

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [genreFilter, setGenreFilter] = useState("all");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Si USE_MOCK_DATA está activado, usar datos locales
      if (USE_MOCK_DATA) {
        const reviewsWithExcerpt = mockReviews.map(review => ({
          id: review.slug,
          title: review.title,
          genre: review.genre || "Sin género",
          rating: review.rating,
          date: review.publish_date,
          author: review.author,
          excerpt: review.argumento?.substring(0, 150) + "..." || review.introduccion?.substring(0, 150) + "..." || "",
          image: review.image_url || "/placeholder.svg",
          comments: review.comments_count || 0,
          likes: review.likes_count || 0,
          dislikes: review.dislikes_count || 0,
          views: review.views_count || 0,
          featured: false
        }));
        
        setReviews(reviewsWithExcerpt);
        
        // Extraer géneros únicos
        const uniqueGenres = [...new Set(mockReviews.map(r => r.genre).filter(Boolean))];
        setGenres(uniqueGenres as string[]);
        setLoading(false);
        return;
      }
      
      // Si no, intentar cargar desde Supabase
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("publish_date", { ascending: false });

      if (error) throw error;

      if (data) {
        // Extraer los primeros 150 caracteres de argumento como excerpt
        const reviewsWithExcerpt = data.map(review => ({
          id: review.slug,
          title: review.title,
          genre: review.genre || "Sin género",
          rating: review.rating,
          date: review.publish_date,
          author: review.author,
          excerpt: review.argumento?.substring(0, 150) + "..." || review.introduccion?.substring(0, 150) + "..." || "",
          image: review.image_url || "/placeholder.svg",
          comments: review.comments_count || 0,
          likes: review.likes_count || 0,
          dislikes: review.dislikes_count || 0,
          views: review.views_count || 0,
          featured: false
        }));
        
        setReviews(reviewsWithExcerpt);

        // Extraer géneros únicos para el filtro
        const uniqueGenres = [...new Set(data.map(r => r.genre).filter(Boolean))];
        setGenres(uniqueGenres as string[]);
      }
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === "all" || review.genre.toLowerCase().includes(genreFilter.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "rating":
        return b.rating - a.rating;
      case "popularity":
        return b.comments - a.comments;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary/20 to-accent/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Todas las Reseñas
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Encuentra la información que necesitas antes de tu próxima compra
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-accent">{reviews.length}</div>
                <div className="text-sm text-muted-foreground">Reseñas Totales</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-accent">{genres.length}</div>
                <div className="text-sm text-muted-foreground">Géneros</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-accent">
                  {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                </div>
                <div className="text-sm text-muted-foreground">Puntuación Media</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-accent">
                  {(() => {
                    const totalLikes = reviews.reduce((sum, r) => sum + (r.likes || 0), 0);
                    const totalDislikes = reviews.reduce((sum, r) => sum + (r.dislikes || 0), 0);
                    const total = totalLikes + totalDislikes;
                    return total > 0 ? `${Math.round((totalLikes / total) * 100)}%` : "0%";
                  })()}
                </div>
                <div className="text-sm text-muted-foreground">Valoración Positiva</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título o género..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Genre Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Género</label>
                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los géneros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los géneros</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre.toLowerCase()}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Fecha
                      </div>
                    </SelectItem>
                    <SelectItem value="rating">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Puntuación
                      </div>
                    </SelectItem>
                    <SelectItem value="popularity">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Popularidad
                      </div>
                    </SelectItem>
                    <SelectItem value="title">Título A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setGenreFilter("all");
                  setSortBy("date");
                }}
                className="h-10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>

            {/* Active Filters */}
            <div className="flex gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Búsqueda: {searchTerm}
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {genreFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Género: {genreFilter}
                  <button 
                    onClick={() => setGenreFilter("all")}
                    className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                <p className="text-muted-foreground mt-4">Cargando reseñas...</p>
              </div>
            ) : sortedReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedReviews.map((review) => (
                  <ReviewCard key={review.id} {...review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No se encontraron reseñas
                </h3>
                <p className="text-muted-foreground">
                  Intenta ajustar tus filtros de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reviews;