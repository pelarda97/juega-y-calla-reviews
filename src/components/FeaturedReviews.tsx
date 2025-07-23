import ReviewCard from "./ReviewCard";

// Mock data para las reseñas destacadas
const featuredReviews = [
  {
    title: "Cyberpunk 2077: Phantom Liberty",
    genre: "RPG/Acción",
    rating: 5,
    date: "15 Nov 2024",
    author: "GameReviewer",
    excerpt: "La expansión que Cyberpunk necesitaba. Una historia madura y gameplay refinado que eleva la experiencia a nuevas alturas.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=faces",
    comments: 47,
    featured: true
  },
  {
    title: "Baldur's Gate 3",
    genre: "RPG",
    rating: 5,
    date: "12 Nov 2024",
    author: "RPGMaster",
    excerpt: "Un RPG que redefine el género. Libertad narrativa, decisiones impactantes y un combate por turnos excepcional.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=faces",
    comments: 89,
    featured: true
  },
  {
    title: "Spider-Man 2",
    genre: "Acción/Aventura",
    rating: 4,
    date: "10 Nov 2024",
    author: "ActionGamer",
    excerpt: "Una secuela sólida que mejora la fórmula. El juego con dos Spider-Man abre nuevas posibilidades narrativas.",
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=300&fit=crop&crop=faces",
    comments: 32
  },
  {
    title: "Alan Wake 2",
    genre: "Terror/Thriller",
    rating: 4,
    date: "8 Nov 2024",
    author: "HorrorFan",
    excerpt: "Un thriller psicológico que combina terror atmosférico con una narrativa innovadora. Remedy vuelve por todo lo alto.",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop&crop=faces",
    comments: 56
  },
  {
    title: "Super Mario Bros. Wonder",
    genre: "Plataformas",
    rating: 5,
    date: "5 Nov 2024",
    author: "PlatformExpert",
    excerpt: "Nintendo reinventa su fórmula clásica con ideas frescas y sorprendentes. Un plataformas que no deja de asombrar.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=faces",
    comments: 73
  },
  {
    title: "Starfield",
    genre: "RPG/Espacial",
    rating: 3,
    date: "3 Nov 2024",
    author: "SpaceGamer",
    excerpt: "Una exploración espacial ambiciosa que no termina de despegar. Buenos momentos opacados por decisiones de diseño cuestionables.",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop&crop=faces",
    comments: 124
  }
];

const FeaturedReviews = () => {
  return (
    <section className="py-16 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Reseñas Destacadas
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Las mejores reseñas de los juegos más esperados y populares del momento
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
          <button className="bg-gradient-primary hover:shadow-glow-primary hover:scale-105 transition-all duration-300 text-primary-foreground font-semibold px-8 py-3 rounded-md">
            Ver Todas las Reseñas
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;