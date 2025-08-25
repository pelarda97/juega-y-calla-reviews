import ReviewCard from "./ReviewCard";

// Mock data para las reseñas destacadas
const featuredReviews = [
  {
    id: "the-last-of-us-2",
    title: "The Last of Us Part II",
    genre: "Acción/Aventura",
    rating: 4,
    date: "15 Ene 2024",
    author: "Juega y Calla",
    excerpt: "Una experiencia emocional intensa que desafía las expectativas y explora temas profundos sobre venganza y humanidad.",
    image: "/placeholder.svg",
    comments: 24,
    featured: true
  },
  {
    id: "clair-obscur-expedition-33",
    title: "Clair Obscur: Expedition 33",
    genre: "RPG",
    rating: 4,
    date: "10 Ene 2024",
    author: "Juega y Calla",
    excerpt: "Un RPG por turnos ambientado en un mundo surrealista con mecánicas innovadoras y una narrativa cautivadora.",
    image: "/placeholder.svg",
    comments: 18,
    featured: false
  }
];

const FeaturedReviews = () => {
  return (
    <section className="py-16 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Análisis Destacados
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Análisis completos para ayudarte a decidir antes de comprar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredReviews.map((review, index) => (
            <ReviewCard
              key={index}
              {...review}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/reviews">
            <button className="bg-gradient-primary hover:shadow-glow-primary hover:scale-105 transition-all duration-300 text-primary-foreground font-semibold px-8 py-3 rounded-md">
              Ver Todos los Análisis
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;