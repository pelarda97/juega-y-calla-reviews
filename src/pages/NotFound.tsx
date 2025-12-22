import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-4 sm:mb-6 text-foreground">🎮</h1>
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-foreground">404</h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">Página no encontrada</p>
        <a href="/">
          <button className="bg-gradient-primary hover:shadow-glow-primary hover:scale-105 transition-all duration-300 text-primary-foreground font-semibold px-6 sm:px-8 py-3 rounded-md min-h-[48px] touch-manipulation text-sm sm:text-base">
            Volver al Inicio
          </button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
