import ReviewCard from "./ReviewCard";

// Mock data para las reseñas destacadas
const featuredReviews = [
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    genre: "RPG/Acción",
    rating: 4,
    date: "15 Dic 2024",
    author: "GameMaster",
    excerpt: "Una experiencia cyberpunk inmersiva que finalmente cumple sus promesas tras las actualizaciones. Night City cobra vida con detalles impresionantes...",
    image: "/placeholder.svg",
    comments: 89,
    featured: true
  },
  {
    id: "the-witcher-3",
    title: "The Witcher 3: Wild Hunt",
    genre: "RPG",
    rating: 5,
    date: "10 Dic 2024",
    author: "RPGExpert",
    excerpt: "Una obra maestra que define el género RPG. Geralt regresa en una aventura épica llena de decisiones morales complejas y combates estratégicos...",
    image: "/placeholder.svg",
    comments: 156
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    genre: "RPG Táctico",
    rating: 5,
    date: "5 Dic 2024",
    author: "TacticalGamer",
    excerpt: "El RPG táctico definitivo que combina narrativa profunda con combate estratégico. Cada decisión importa en esta aventura D&D...",
    image: "/placeholder.svg",
    comments: 203
  },
  {
    id: "spider-man-2",
    title: "Spider-Man 2",
    genre: "Acción/Aventura",
    rating: 4,
    date: "1 Dic 2024",
    author: "WebSlinger",
    excerpt: "El dúo de Spider-Man ofrece una experiencia de superhéroes sin igual. Nueva York nunca se sintió tan viva y emocionante de explorar...",
    image: "/placeholder.svg",
    comments: 124
  },
  {
    id: "starfield",
    title: "Starfield",
    genre: "RPG/Espacial",
    rating: 3,
    date: "28 Nov 2024",
    author: "SpaceExplorer",
    excerpt: "Una ambiciosa aventura espacial con altibajos. Bethesda nos lleva a las estrellas con resultados mixtos pero momentos brillantes...",
    image: "/placeholder.svg",
    comments: 67
  },
  {
    id: "alan-wake-2",
    title: "Alan Wake 2",
    genre: "Survival Horror",
    rating: 4,
    date: "25 Nov 2024",
    author: "HorrorFan",
    excerpt: "Remedy regresa con una secuela que redefine el survival horror. Una experiencia psicológica intensa que desafía la percepción...",
    image: "/placeholder.svg",
    comments: 91
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
          <button className="bg-gradient-primary hover:shadow-glow-primary hover:scale-105 transition-all duration-300 text-primary-foreground font-semibold px-8 py-3 rounded-md">
            Ver Todos los Análisis
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;