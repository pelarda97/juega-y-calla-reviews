import { useState } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import ElectricGamepadLogo from "./ElectricGamepadLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <ElectricGamepadLogo size={32} />
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Juega y Calla
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-foreground hover:text-primary transition-colors">
            Inicio
          </a>
          <a href="/reviews" className="text-foreground hover:text-primary transition-colors">
            Reseñas
          </a>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Géneros
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Shooter</DropdownMenuItem>
              <DropdownMenuItem>RPG</DropdownMenuItem>
              <DropdownMenuItem>Acción</DropdownMenuItem>
              <DropdownMenuItem>Aventura</DropdownMenuItem>
              <DropdownMenuItem>Estrategia</DropdownMenuItem>
              <DropdownMenuItem>Simulación</DropdownMenuItem>
              <DropdownMenuItem>Deportes</DropdownMenuItem>
              <DropdownMenuItem>Racing</DropdownMenuItem>
              <DropdownMenuItem>Plataformas</DropdownMenuItem>
              <DropdownMenuItem>Terror</DropdownMenuItem>
              <DropdownMenuItem>Puzzle</DropdownMenuItem>
              <DropdownMenuItem>Indie</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <a href="/quiz" className="text-foreground hover:text-primary transition-colors">
            Recomendaciones
          </a>
        </nav>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar juegos..." 
              className="w-48 bg-secondary border-border"
            />
          </div>

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
              <a href="/" className="block py-2 text-foreground hover:text-primary transition-colors">
                Inicio
              </a>
              <a href="/reviews" className="block py-2 text-foreground hover:text-primary transition-colors">
                Reseñas
              </a>
              
              <div className="py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start p-0 text-foreground hover:text-primary">
                      Géneros
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Shooter</DropdownMenuItem>
                    <DropdownMenuItem>RPG</DropdownMenuItem>
                    <DropdownMenuItem>Acción</DropdownMenuItem>
                    <DropdownMenuItem>Aventura</DropdownMenuItem>
                    <DropdownMenuItem>Estrategia</DropdownMenuItem>
                    <DropdownMenuItem>Simulación</DropdownMenuItem>
                    <DropdownMenuItem>Deportes</DropdownMenuItem>
                    <DropdownMenuItem>Racing</DropdownMenuItem>
                    <DropdownMenuItem>Plataformas</DropdownMenuItem>
                    <DropdownMenuItem>Terror</DropdownMenuItem>
                    <DropdownMenuItem>Puzzle</DropdownMenuItem>
                    <DropdownMenuItem>Indie</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <a href="/quiz" className="block py-2 text-foreground hover:text-primary transition-colors">
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