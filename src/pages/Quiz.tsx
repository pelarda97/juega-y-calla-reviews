import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Quiz = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
              Cuestionario de Recomendaciones
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Responde algunas preguntas para recibir recomendaciones personalizadas de juegos
            </p>
          </div>

          <Card>
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl">Preparando tu cuestionario personalizado...</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                En un momento podrás responder preguntas que nos ayudarán a encontrar los juegos perfectos para ti.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base text-muted-foreground">
                  El cuestionario estará disponible próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;