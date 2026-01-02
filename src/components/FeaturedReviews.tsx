import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { supabase } from "@/integrations/supabase/client";
import { mockReviews, USE_MOCK_DATA } from "@/data/mockReviews";

const FeaturedReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedReviews();
  }, []);

  const fetchFeaturedReviews = async () => {
    try {
      setLoading(true);
      
      // Si USE_MOCK_DATA está activado, usar datos locales
      if (USE_MOCK_DATA) {
        const reviewsData = mockReviews.slice(0, 3).map(review => ({
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
        
        setReviews(reviewsData);
        setLoading(false);
        return;
      }
      
      // Si no, intentar cargar desde Supabase
      // Optimizado: solo columnas necesarias para featured
      const { data, error } = await supabase
        .from("reviews")
        .select("slug, title, genre, rating, publish_date, author, image_url, likes_count, dislikes_count, comments_count, views_count, argumento, introduccion")
        .order("publish_date", { ascending: false })
        .limit(3);

      if (error) throw error;

      if (data) {
        const reviewsData = data.map(review => ({
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
        
        setReviews(reviewsData);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error al cargar reseñas destacadas:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="text-muted-foreground mt-4 text-sm sm:text-base">Cargando análisis...</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-12 sm:py-16 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Análisis Destacados
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              {...review}
            />
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <a href="/reviews">
            <button className="bg-gradient-primary hover:shadow-glow-primary hover:scale-105 transition-all duration-300 text-primary-foreground font-semibold px-6 sm:px-8 py-3 rounded-md min-h-[48px] touch-manipulation text-sm sm:text-base w-full sm:w-auto">
              Ver Todos los Análisis
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;