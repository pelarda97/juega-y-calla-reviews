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
      
      // Función para detectar si una reseña es nueva (< 7 días)
      const isNewReview = (publishDate: string) => {
        try {
          const months: { [key: string]: number } = {
            'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
            'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
          };
          
          const dateParts = publishDate.toLowerCase().match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)/);
          if (dateParts) {
            const day = parseInt(dateParts[1]);
            const month = months[dateParts[2]];
            const year = parseInt(dateParts[3]);
            const reviewDate = new Date(year, month, day);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          }
          return false;
        } catch {
          return false;
        }
      };
      
      // Si USE_MOCK_DATA está activado, usar datos locales
      if (USE_MOCK_DATA) {
        // Calcular popularidad y separar nueva vs otras
        const reviewsWithPopularity = mockReviews.map(review => ({
          ...review,
          popularity: (review.views_count || 0) + (review.likes_count || 0) * 2,
          isNew: isNewReview(review.publish_date)
        }));
        
        // Separar reseña nueva y otras
        const newReview = reviewsWithPopularity.find(r => r.isNew);
        const otherReviews = reviewsWithPopularity.filter(r => !r.isNew);
        
        // Ordenar otras por popularidad
        otherReviews.sort((a, b) => b.popularity - a.popularity);
        
        // Construir array final: nueva primera, luego 2 más populares
        const finalReviews = newReview 
          ? [newReview, ...otherReviews.slice(0, 2)]
          : otherReviews.slice(0, 3);
        
        const reviewsData = finalReviews.map(review => {
          let excerptText = "";
          if (review.slug === "god-of-war-ragnarok" && review.argumento) {
            const afterFirstBreak = review.argumento.split("\n\n")[1] || review.argumento;
            excerptText = afterFirstBreak.substring(0, 150) + "...";
          } else {
            excerptText = review.argumento?.substring(0, 150) + "..." || review.introduccion?.substring(0, 150) + "..." || "";
          }
          
          return {
          id: review.slug,
          title: review.title,
          genre: review.genre || "Sin género",
          rating: review.rating,
          date: review.publish_date,
          author: review.author,
          excerpt: excerptText,
          image: review.image_url || "/placeholder.svg",
          comments: review.comments_count || 0,
          likes: review.likes_count || 0,
          dislikes: review.dislikes_count || 0,
          views: review.views_count || 0,
          featured: false
        };
        });
        
        setReviews(reviewsData);
        setLoading(false);
        return;
      }
      
      // Si no, intentar cargar desde Supabase
      // Optimización: Limitar a 10 reseñas más recientes para reducir egress
      const { data, error } = await supabase
        .from("reviews")
        .select("slug, title, genre, rating, publish_date, author, image_url, likes_count, dislikes_count, comments_count, views_count, argumento, introduccion")
        .order("publish_date", { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        // Calcular popularidad y separar nueva vs otras
        const reviewsWithPopularity = data.map(review => ({
          ...review,
          popularity: (review.views_count || 0) + (review.likes_count || 0) * 2,
          isNew: isNewReview(review.publish_date)
        }));
        
        // Separar reseña nueva y otras
        const newReview = reviewsWithPopularity.find(r => r.isNew);
        const otherReviews = reviewsWithPopularity.filter(r => !r.isNew);
        
        // Ordenar otras por popularidad
        otherReviews.sort((a, b) => b.popularity - a.popularity);
        
        // Construir array final: nueva primera, luego 2 más populares
        const finalReviews = newReview 
          ? [newReview, ...otherReviews.slice(0, 2)]
          : otherReviews.slice(0, 3);
        
        const reviewsData = finalReviews.map(review => {
          let excerptText = "";
          if (review.slug === "god-of-war-ragnarok" && review.argumento) {
            const afterFirstBreak = review.argumento.split("\n\n")[1] || review.argumento;
            excerptText = afterFirstBreak.substring(0, 150) + "...";
          } else {
            excerptText = review.argumento?.substring(0, 150) + "..." || review.introduccion?.substring(0, 150) + "..." || "";
          }
          
          return {
          id: review.slug,
          title: review.title,
          genre: review.genre || "Sin género",
          rating: review.rating,
          date: review.publish_date,
          author: review.author,
          excerpt: excerptText,
          image: review.image_url || "/placeholder.svg",
          comments: review.comments_count || 0,
          likes: review.likes_count || 0,
          dislikes: review.dislikes_count || 0,
          views: review.views_count || 0,
          featured: false
        };
        });
        
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