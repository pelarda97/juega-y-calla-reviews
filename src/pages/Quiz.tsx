import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Quiz = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Cuestionario de Recomendaciones
            </h1>
            <p className="text-lg text-muted-foreground">
              Responde algunas preguntas para recibir recomendaciones personalizadas de juegos
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Preparando tu cuestionario personalizado...</CardTitle>
              <CardDescription>
                En un momento podrás responder preguntas que nos ayudarán a encontrar los juegos perfectos para ti.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
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