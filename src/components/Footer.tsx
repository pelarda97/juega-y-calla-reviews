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

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Juega Y Calla. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;