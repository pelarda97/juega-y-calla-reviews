import { useState } from "react";
import { Gamepad2, User, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            GameReviews
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#reviews" className="text-foreground hover:text-primary transition-colors">
            Reseñas
          </a>
          <a href="#genres" className="text-foreground hover:text-primary transition-colors">
            Géneros
          </a>
          <a href="#latest" className="text-foreground hover:text-primary transition-colors">
            Últimas
          </a>
          <a href="#top-rated" className="text-foreground hover:text-primary transition-colors">
            Mejor Valoradas
          </a>
        </nav>

        {/* Search and Login */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar juegos..." 
              className="w-48 bg-secondary border-border"
            />
          </div>
          
          <Button 
            variant="gaming" 
            size="sm"
            onClick={() => setIsLoginOpen(true)}
            className="hidden sm:flex"
          >
            <User className="h-4 w-4" />
            Iniciar Sesión
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar juegos..." className="bg-secondary border-border" />
            </div>
            
            <nav className="space-y-2">
              <a href="#reviews" className="block py-2 text-foreground hover:text-primary transition-colors">
                Reseñas
              </a>
              <a href="#genres" className="block py-2 text-foreground hover:text-primary transition-colors">
                Géneros
              </a>
              <a href="#latest" className="block py-2 text-foreground hover:text-primary transition-colors">
                Últimas
              </a>
              <a href="#top-rated" className="block py-2 text-foreground hover:text-primary transition-colors">
                Mejor Valoradas
              </a>
            </nav>
            
            <Button variant="gaming" className="w-full mt-4">
              <User className="h-4 w-4" />
              Iniciar Sesión
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;