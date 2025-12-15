import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import ElectricGamepadLogo from "./ElectricGamepadLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ElectricGamepadLogo size={32} />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Juega y Calla
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">
            Inicio
          </a>
          <a href="/reviews" className="text-foreground hover:text-primary transition-colors font-medium">
            Reseñas
          </a>
          <a href="/quiz" className="text-foreground hover:text-primary transition-colors font-medium">
            Recomendaciones
          </a>
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
              <a 
                href="/" 
                className="block py-3 px-2 text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </a>
              <a 
                href="/reviews" 
                className="block py-3 px-2 text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Reseñas
              </a>
              <a 
                href="/quiz" 
                className="block py-3 px-2 text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Recomendaciones
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;