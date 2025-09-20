import { Mail } from "lucide-react";
import ElectricGamepadLogo from "./ElectricGamepadLogo";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ElectricGamepadLogo size={32} />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Juega y Calla
              </span>
            </div>
            <p className="text-muted-foreground">
              La plataforma definitiva para reseñas de videojuegos. 
              Análisis honestos de una comunidad apasionada.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:juegaycalla.reviews@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Explorar</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Reseñas Recientes</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Mejor Valoradas</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Próximos Lanzamientos</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Análisis en Profundidad</a></li>
            </ul>
          </div>

          {/* Genres */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Géneros</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">RPG</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Acción</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Estrategia</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Indie</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contacto</h3>
            <ul className="space-y-2">
              <li><a href="mailto:juegaycalla.reviews@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">juegaycalla.reviews@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © 2024 Juega y Calla. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacidad
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Términos
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;