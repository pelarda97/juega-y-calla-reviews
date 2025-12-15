import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, User, Clock, Gamepad2, BookOpen, Settings, ThumbsUp, ThumbsDown, MessageCircle, FileText, Timer, Heart, Camera, AlertTriangle, ChevronDown, Eye, X, ChevronLeft, ChevronRight, Play, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GamepadIcon from "@/components/GamepadIcon";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { useLikeDislike } from "@/hooks/useLikeDislike";
import { usePageViews } from "@/hooks/useRealtimeStats";
import { supabase } from "@/integrations/supabase/client";
import gamingHero from "@/assets/gaming-hero.jpg";
import { mockReviews, USE_MOCK_DATA } from "@/data/mockReviews";

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDirection, setImageDirection] = useState<'left' | 'right' | null>(null);
  const [openSpoilers, setOpenSpoilers] = useState<{ [key: string]: boolean }>({});
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const { stats } = useRealtimeStats(id || '');
  const { userVote, handleVote, loading: voteLoading } = useLikeDislike(id || '');
  const { recordPageView } = usePageViews();

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentImageIndex < galleryItems.length - 1) {
      // Swipe left = next image
      setImageDirection('right');
      setTimeout(() => {
        setCurrentImageIndex(prev => prev + 1);
        setImageDirection(null);
      }, 100);
    }
    
    if (isRightSwipe && currentImageIndex > 0) {
      // Swipe right = previous image
      setImageDirection('left');
      setTimeout(() => {
        setCurrentImageIndex(prev => prev - 1);
        setImageDirection(null);
      }, 100);
    }
  };

  // Fetch review data from database
  useEffect(() => {
    const fetchReview = async () => {
      if (!id) return;
      
      try {
        // Si USE_MOCK_DATA está activado, buscar en datos locales
        if (USE_MOCK_DATA) {
          const mockReview = mockReviews.find(r => r.slug === id);
          
          if (mockReview) {
            setReview({
              id: mockReview.slug,
              title: mockReview.title,
              gameTitle: mockReview.game_title,
              rating: mockReview.rating,
              author: mockReview.author,
              publishDate: new Date(mockReview.publish_date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }),
              readTime: "12 min",
              image: mockReview.image_url || gamingHero,
              introduccion: mockReview.introduccion,
              argumento: mockReview.argumento,
              gameplay: mockReview.gameplay,
              funciones: mockReview.funciones,
              duracion: mockReview.duracion,
              valoracion_personal: mockReview.valoracion_personal,
              imagenes: mockReview.imagenes || [],
              video_url: mockReview.video_url || null
            });
          }
          setLoading(false);
          return;
        }
        
        // Si no, intentar cargar desde Supabase
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('slug', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setReview({
            id: data.slug,
            title: data.title,
            gameTitle: data.game_title,
            rating: data.rating,
            author: data.author,
            publishDate: new Date(data.publish_date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            readTime: "12 min",
            image: data.image_url || gamingHero,
            introduccion: data.introduccion,
            argumento: data.argumento,
            gameplay: data.gameplay,
            funciones: data.funciones,
            duracion: data.duracion,
            valoracion_personal: data.valoracion_personal,
            imagenes: data.imagenes || [],
            video_url: (data as any).video_url || null
          });
          
          // Record page view
          recordPageView('review', id);
        }
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, recordPageView]);

  const renderGamepads = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      const currentValue = i + 1;
      const isFullGamepad = rating >= currentValue;
      const isHalfGamepad = rating >= currentValue - 0.5 && rating < currentValue;
      
      return (
        <GamepadIcon
          key={i}
          filled={isFullGamepad}
          halfFilled={isHalfGamepad}
          className="h-7 w-7"
        />
      );
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  // Helper functions for video detection and processing
  const getYouTubeVideoId = (url: string): string | null => {
    // Si ya es una URL embed, extraer el ID directamente
    if (url.includes('/embed/')) {
      const embedMatch = url.match(/\/embed\/([^?&]+)/);
      if (embedMatch) return embedMatch[1];
    }
    
    // Para otros formatos de YouTube
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const isDirectVideo = (url: string): boolean => {
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  const isYouTubeVideo = (url: string): boolean => {
    return /(?:youtube\.com|youtu\.be)/.test(url);
  };

  // Create gallery items array (images + videos if exist)
  const galleryItems = review ? [
    ...(review.imagenes || []).map((url: string) => ({ type: 'image' as const, url })),
    ...(review.video_url ? 
      (Array.isArray(review.video_url) 
        ? review.video_url.map((url: string) => ({ type: 'video' as const, url }))
        : [{ type: 'video' as const, url: review.video_url }]
      ) : [])
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando reseña...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Reseña no encontrada</h1>
            <Button 
              onClick={() => navigate('/reviews')} 
              className="mt-4"
              variant="outline"
            >
              Volver a Reseñas
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sections = [
    { title: "Introducción", content: review.introduccion, icon: FileText },
    { title: "Argumento", content: review.argumento, icon: BookOpen },
    { title: "Gameplay", content: review.gameplay, icon: Gamepad2 },
    { title: "Funciones", content: review.funciones, icon: Settings },
    { title: "Duración", content: review.duracion, icon: Timer },
    { title: "Valoración Personal", content: review.valoracion_personal, icon: Heart }
  ];

  // Añadir Galería a la navegación si hay imágenes
  const navSections = review?.imagenes && review.imagenes.length > 0 
    ? [...sections, { title: "Galería", content: null, icon: Camera }]
    : sections;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Reviews
        </Button>

        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="h-64 bg-muted flex items-center justify-center">
              <img 
                src={review.image} 
                alt={review.title}
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Reseña</Badge>
                      <div className="flex items-center gap-1">
                        {renderGamepads(review.rating)}
                        <span className="text-sm font-semibold ml-1 text-accent">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {review.title}
                  </h1>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{review.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{review.publishDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{review.readTime} de lectura</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{stats.views_count} visitas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar for Sections */}
        <div className="mb-8 sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-y border-border py-4">
          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {navSections.map((section) => (
              <a
                key={section.title}
                href={`#${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-primary hover:text-accent transition-colors font-medium text-sm md:text-base flex items-center gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(section.title.toLowerCase().replace(/\s+/g, '-'));
                  if (element) {
                    const offset = 140; // Offset for sticky header + spacing
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                      top: elementPosition - offset,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Review Sections */}
        <div className="grid gap-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            const isSpoilerSection = section.title === "Argumento" || section.title === "Valoración Personal";
            const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
            
            if (isSpoilerSection) {
              // Dividir el contenido usando el separador de spoilers
              const spoilerSeparator = '--- A PARTIR DE AQUÍ: SPOILERS ---';
              const hasSpoilers = section.content?.includes(spoilerSeparator);
              
              let initialText = '';
              let spoilerText = '';
              
              if (hasSpoilers && section.content) {
                const parts = section.content.split(spoilerSeparator);
                initialText = parts[0].trim();
                spoilerText = parts[1]?.trim() || '';
              } else {
                // Si no hay separador, mostrar todo el contenido sin sección de spoilers
                initialText = section.content || '';
              }
              
              return (
                <Card key={section.title} id={sectionId} className="border-border scroll-mt-32">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <IconComponent className="h-5 w-5 text-primary" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Texto inicial sin spoilers */}
                    {initialText && (
                      <div className="text-muted-foreground whitespace-pre-line mb-6">
                        {initialText}
                      </div>
                    )}
                    
                    {/* Sección de spoilers */}
                    {spoilerText && (
                      <Collapsible 
                        open={openSpoilers[section.title]} 
                        onOpenChange={(open) => setOpenSpoilers(prev => ({ ...prev, [section.title]: open }))}
                      >
                        <div className="bg-muted/30 border border-muted rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Contenido con spoilers</span>
                          </div>
                          <p className="text-muted-foreground text-xs mb-3">
                            Esta sección contiene detalles de la trama.
                          </p>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground">
                              <ChevronDown className={`h-3 w-3 mr-1 transition-transform ${openSpoilers[section.title] ? 'rotate-180' : ''}`} />
                              {openSpoilers[section.title] ? 'Ocultar spoilers' : 'Mostrar spoilers'}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        
                        <CollapsibleContent className="space-y-4">
                          <div className="text-muted-foreground whitespace-pre-line">
                            {spoilerText}
                          </div>
                          
                          {/* Aviso persistente de spoilers cuando está abierto */}
                          <div className="bg-muted/20 border border-muted rounded-lg p-2 mt-4">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Contenido con spoilers mostrado</span>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </CardContent>
                </Card>
              );
            }
            
            return (
              <Card key={section.title} id={sectionId} className="border-border scroll-mt-32">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <IconComponent className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Gallery (Images + Video) */}
        {galleryItems.length > 0 && (
          <Card id="galería" className="border-border mt-8 scroll-mt-32">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Camera className="h-5 w-5 text-primary" />
                Galería
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(galleryExpanded ? galleryItems : galleryItems.slice(0, 2)).map((item, index) => (
                  <div 
                    key={index} 
                    className="relative group overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    {item.type === 'image' ? (
                      <>
                        <img 
                          src={item.url} 
                          alt={`Captura del juego ${index + 1}`}
                          loading="lazy"
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full h-48 bg-muted flex items-center justify-center relative">
                          {isYouTubeVideo(item.url) && getYouTubeVideoId(item.url) ? (
                            <img 
                              src={`https://img.youtube.com/vi/${getYouTubeVideoId(item.url)}/hqdefault.jpg`}
                              alt="Video thumbnail"
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Video className="h-16 w-16 text-muted-foreground" />
                          )}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="bg-primary/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                              <Play className="h-8 w-8 text-white fill-white" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {!galleryExpanded && galleryItems.length > 2 && (
                  <div 
                    className="relative group overflow-hidden rounded-lg cursor-pointer h-48 bg-muted/50 backdrop-blur-sm flex items-center justify-center"
                    onClick={() => setGalleryExpanded(true)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 flex flex-col items-center justify-center gap-3 text-white">
                      <Eye className="h-12 w-12" />
                      <p className="text-xl font-semibold">Ver más</p>
                      <p className="text-sm text-muted-foreground">+{galleryItems.length - 2} elementos</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lightbox Modal */}
        {lightboxOpen && galleryItems.length > 0 && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-accent transition-colors z-50 p-2 touch-manipulation"
              aria-label="Cerrar"
            >
              <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

            {/* Previous Button - Hidden on mobile, use swipe instead */}
            {currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageDirection('left');
                  setTimeout(() => {
                    setCurrentImageIndex(prev => prev - 1);
                    setImageDirection(null);
                  }, 100);
                }}
                className="hidden sm:block absolute left-2 sm:left-4 text-white hover:text-accent transition-colors z-50 p-2 touch-manipulation"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-8 w-8 sm:h-12 sm:w-12" />
              </button>
            )}

            {/* Next Button - Hidden on mobile, use swipe instead */}
            {currentImageIndex < galleryItems.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageDirection('right');
                  setTimeout(() => {
                    setCurrentImageIndex(prev => prev + 1);
                    setImageDirection(null);
                  }, 100);
                }}
                className="hidden sm:block absolute right-2 sm:right-4 text-white hover:text-accent transition-colors z-50 p-2 touch-manipulation"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-8 w-8 sm:h-12 sm:w-12" />
              </button>
            )}

            {/* Media Container with Slide Animation and Touch Support */}
            <div 
              className="max-w-7xl max-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden p-2 sm:p-4"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {!galleryItems[currentImageIndex] ? (
                <div className="text-white text-center p-8 rounded-lg">
                  <p className="text-xl">No hay contenido disponible</p>
                </div>
              ) : galleryItems[currentImageIndex].type === 'image' ? (
                <img
                  key={currentImageIndex}
                  src={galleryItems[currentImageIndex].url}
                  alt={`Captura del juego ${currentImageIndex + 1}`}
                  className={`max-w-full max-h-[90vh] object-contain rounded-lg transition-all duration-500 ${
                    imageDirection === 'right' 
                      ? 'animate-slide-in-right' 
                      : imageDirection === 'left' 
                      ? 'animate-slide-in-left'
                      : ''
                  }`}
                />
              ) : galleryItems[currentImageIndex].type === 'video' ? (
                <div className={`w-full max-w-3xl sm:max-w-5xl transition-all duration-500 ${
                  imageDirection === 'right' 
                    ? 'animate-slide-in-right' 
                    : imageDirection === 'left' 
                    ? 'animate-slide-in-left'
                    : ''
                }`}>
                  {(() => {
                    const videoUrl = galleryItems[currentImageIndex].url;
                    const videoId = getYouTubeVideoId(videoUrl);
                    
                    if (videoId) {
                      // Es un video de YouTube
                      return (
                        <div className="relative w-full bg-black rounded-lg" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            key={currentImageIndex}
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      );
                    } else {
                      // Es un video directo
                      return (
                        <video
                          key={currentImageIndex}
                          controls
                          playsInline
                          className="w-full max-h-[70vh] sm:max-h-[90vh] rounded-lg"
                        >
                          <source src={videoUrl} type="video/mp4" />
                          Tu navegador no soporta la reproducción de videos.
                        </video>
                      );
                    }
                  })()}
                </div>
              ) : (
                <div className="text-white text-center p-8 rounded-lg">
                  <p className="text-xl">Tipo de contenido no soportado</p>
                </div>
              )}
            </div>

            {/* Media Counter */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs sm:text-sm bg-black/70 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
              {currentImageIndex + 1} / {galleryItems.length}
            </div>

            {/* Swipe Indicator (only on mobile) */}
            <div className="sm:hidden absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white/60 text-xs text-center">
              ← Desliza para navegar →
            </div>
          </div>
        )}

        {/* Interaction Section */}
        <div className="mt-12">
          <Card className="border-border">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                ¿Te gustó esta review?
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Like/Dislike Section */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-foreground">Valora esta reseña</h4>
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <Button
                      variant={userVote === true ? "gaming" : "outline"}
                      size="lg"
                      onClick={() => handleVote(true)}
                      disabled={voteLoading}
                      className="flex items-center justify-center gap-2 w-full"
                    >
                      <ThumbsUp className="h-5 w-5" />
                      Me gusta ({stats.likes_count})
                    </Button>
                    <Button
                      variant={userVote === false ? "destructive" : "outline"}
                      size="lg"
                      onClick={() => handleVote(false)}
                      disabled={voteLoading}
                      className="flex items-center justify-center gap-2 w-full"
                    >
                      <ThumbsDown className="h-5 w-5" />
                      No me gusta ({stats.dislikes_count})
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-foreground text-center">Deja tu opinión o cualquier sugerencia sobre la reseña o el juego.</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/review/${id}/comments`)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Ver Comentarios ({stats.comments_count})
                    </Button>
                  </div>
                </div>

                {/* More Reviews Section */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-foreground">Descubre más</h4>
                  <div className="text-center space-y-3">
                    <p className="text-muted-foreground text-sm">
                      Explora más análisis detallados
                    </p>
                    <Button 
                      variant="gaming" 
                      size="lg"
                      onClick={() => navigate('/reviews')}
                      className="flex items-center gap-2"
                    >
                      <Gamepad2 className="h-5 w-5" />
                      Ver Más Reviews
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewDetail;