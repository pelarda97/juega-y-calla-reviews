import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import ElectricGamepadLogoAnimated from "./ElectricGamepadLogoAnimated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollDirection } from "@/hooks/useScrollDirection";

interface HeaderProps {
  isNavigating?: boolean;
  allowAutoHide?: boolean;
}

const Header = ({ isNavigating = false, allowAutoHide = true }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const scrollDirection = useScrollDirection();

  return (
    <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-transform duration-300 ${
      scrollDirection === 'down' && !isMenuOpen && !isSearchOpen && !isNavigating && allowAutoHide ? '-translate-y-full' : 'translate-y-0'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ElectricGamepadLogoAnimated size={32} />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Juega y Calla
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-base lg:text-lg text-foreground hover:text-primary transition-colors font-medium">
            Inicio
          </Link>
          <Link to="/reviews" className="text-base lg:text-lg text-foreground hover:text-primary transition-colors font-medium">
            Reseñas
          </Link>
          <Link to="/quiz" className="text-base lg:text-lg text-foreground hover:text-primary transition-colors font-medium">
            Recomendaciones
          </Link>
        </nav>

        {/* Search & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar juegos..." 
              className="w-48 lg:w-64 bg-secondary border-border"
            />
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden min-w-[44px] min-h-[44px]"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden min-w-[44px] min-h-[44px]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Search Drawer */}
      {isSearchOpen && (
        <div className="md:hidden bg-background border-t border-border animate-in slide-in-from-top duration-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Input 
                placeholder="Buscar juegos..." 
                className="bg-secondary border-border"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-in slide-in-from-top duration-200">
          <div className="container mx-auto px-4 py-4">            
            <nav className="space-y-1">
              <Link 
                to="/" 
                className="block py-3 px-2 text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/reviews" 
                className="block py-3 px-2 text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Reseñas
              </Link>
              <Link 
                to="/quiz" 
                className="block py-3 px-2 text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Recomendaciones
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;