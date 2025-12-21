import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Scale, Shield, FileText, X } from "lucide-react";

const Legal = () => {
  const [activeTab, setActiveTab] = useState("aviso");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="min-w-[44px] min-h-[44px]"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 bg-gradient-primary bg-clip-text text-transparent">
          Información Legal
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8">
            <TabsTrigger value="aviso" className="text-xs sm:text-sm">
              <Scale className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Aviso Legal
            </TabsTrigger>
            <TabsTrigger value="privacidad" className="text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Privacidad
            </TabsTrigger>
            <TabsTrigger value="contenido" className="text-xs sm:text-sm">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Uso de Contenido
            </TabsTrigger>
          </TabsList>

          {/* AVISO LEGAL */}
          <TabsContent value="aviso">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Aviso Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">1. Datos Identificativos</h3>
                  <p className="mb-2">En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los siguientes datos:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Titular:</strong> Juega y Calla</li>
                    <li><strong>Domicilio:</strong> España</li>
                    <li><strong>Email de contacto:</strong> juegaycalla.reviews@gmail.com</li>
                    <li><strong>Actividad:</strong> Plataforma de reseñas y análisis de videojuegos</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">2. Objeto</h3>
                  <p>El presente Aviso Legal regula el uso del sitio web Juega y Calla (en adelante, "el Sitio"), accesible a través de la URL proporcionada.</p>
                  <p className="mt-2">El acceso y uso del Sitio atribuye la condición de usuario, que acepta, desde dicho acceso y/o uso, las presentes condiciones legales.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">3. Condiciones de Uso</h3>
                  <p className="mb-2">El acceso y navegación por el Sitio supone aceptar y conocer las advertencias legales, condiciones y términos de uso contenidas en él.</p>
                  <p className="mb-2"><strong>El Titular se reserva el derecho a:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Modificar en cualquier momento la presentación, configuración y contenidos del Sitio.</li>
                    <li>Suspender, interrumpir o dejar de operar el Sitio en cualquier momento.</li>
                    <li>Eliminar, limitar o impedir el acceso a usuarios que incumplan estas condiciones.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">4. Responsabilidad</h3>
                  <p className="mb-2">El Titular no se hace responsable de:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Las opiniones y contenidos expresados por usuarios en comentarios.</li>
                    <li>Los daños que pueda sufrir el equipo informático del usuario durante el acceso al Sitio.</li>
                    <li>La disponibilidad y continuidad del funcionamiento del Sitio.</li>
                    <li>Enlaces externos a sitios web de terceros sobre los que no tiene control.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">5. Propiedad Intelectual</h3>
                  <p className="mb-2">Todos los contenidos del Sitio (textos, diseño gráfico, código fuente, logotipos, marcas) son propiedad de Juega y Calla o se utilizan bajo licencia, salvo que se indique lo contrario.</p>
                  <p>Queda prohibida la reproducción, distribución o modificación de los contenidos sin autorización expresa del Titular.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">6. Legislación Aplicable</h3>
                  <p>Las presentes condiciones se rigen por la legislación española. Para cualquier controversia será competente la jurisdicción española.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* POLÍTICA DE PRIVACIDAD */}
          <TabsContent value="privacidad">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Política de Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">1. Responsable del Tratamiento</h3>
                  <p className="mb-2">En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), se informa:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Responsable:</strong> Juega y Calla</li>
                    <li><strong>Email de contacto:</strong> juegaycalla.reviews@gmail.com</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">2. Datos que Recopilamos</h3>
                  <p className="mb-2"><strong>Actualmente NO recopilamos datos personales identificables.</strong> El Sitio funciona mediante almacenamiento local en el navegador del usuario (localStorage) para:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>ID de usuario anónimo:</strong> Generado automáticamente para gestionar likes/dislikes y prevenir spam.</li>
                    <li><strong>Preferencias de usuario:</strong> Cooldowns de votación, estado de spoilers.</li>
                    <li><strong>Comentarios:</strong> Alias elegido por el usuario (no vinculado a identidad real), texto del comentario y fecha.</li>
                  </ul>
                  <p className="mt-3"><strong>Importante:</strong> Estos datos se almacenan únicamente en tu navegador. No se envían a servidores externos ni se comparten con terceros. Puedes eliminar estos datos en cualquier momento borrando el almacenamiento local de tu navegador.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">3. Base Legal del Tratamiento</h3>
                  <p>Los datos anónimos y pseudónimos (alias) se procesan bajo las siguientes bases legales:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Interés legítimo:</strong> Prevención de spam y abuso en sistema de votación.</li>
                    <li><strong>Consentimiento implícito:</strong> Al elegir un alias y publicar un comentario, aceptas que sea visible públicamente.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">4. Finalidad del Tratamiento</h3>
                  <p className="mb-2">Los datos se utilizan exclusivamente para:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Gestionar el sistema de likes/dislikes en reseñas.</li>
                    <li>Implementar cooldowns para evitar votos duplicados.</li>
                    <li>Mostrar comentarios públicos con alias.</li>
                    <li>Mejorar la experiencia de usuario (recordar preferencias).</li>
                  </ul>
                  <p className="mt-3"><strong>NO utilizamos estos datos con fines comerciales, publicitarios ni los compartimos con terceros.</strong></p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">5. Derechos del Usuario</h3>
                  <p className="mb-2">De acuerdo con el RGPD, tienes derecho a:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Acceso:</strong> Conocer qué datos almacenamos (en tu caso, localStorage de tu navegador).</li>
                    <li><strong>Rectificación:</strong> Modificar tu alias o contenido de comentarios.</li>
                    <li><strong>Supresión:</strong> Solicitar la eliminación de tus comentarios contactando con nosotros.</li>
                    <li><strong>Oposición:</strong> Dejar de usar el Sitio o borrar el localStorage de tu navegador.</li>
                    <li><strong>Portabilidad:</strong> Obtener una copia de tus comentarios (disponible bajo solicitud).</li>
                  </ul>
                  <p className="mt-3">Para ejercer estos derechos, contacta con: <strong>juegaycalla.reviews@gmail.com</strong></p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">6. Cookies y Tecnologías Similares</h3>
                  <p className="mb-2"><strong>NO utilizamos cookies de terceros ni cookies de seguimiento.</strong></p>
                  <p className="mb-2">Únicamente usamos:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>LocalStorage:</strong> Almacenamiento local en el navegador (no es una cookie).</li>
                    <li><strong>Sin seguimiento:</strong> No empleamos Google Analytics, Facebook Pixel ni herramientas similares.</li>
                  </ul>
                  <p className="mt-3">Por lo tanto, <strong>NO se requiere banner de consentimiento de cookies</strong> según la normativa vigente.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">7. Seguridad</h3>
                  <p>Implementamos medidas de seguridad técnicas y organizativas para proteger los datos contra acceso no autorizado, pérdida o alteración. Al almacenar datos localmente en el navegador, el usuario tiene control total sobre su información.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">8. Modificaciones</h3>
                  <p>Nos reservamos el derecho a modificar esta Política de Privacidad para adaptarla a cambios legislativos o en nuestros servicios. Los cambios serán publicados en esta página con fecha de actualización.</p>
                  <p className="mt-2"><strong>Última actualización:</strong> 18 de diciembre de 2025</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* USO DE CONTENIDO */}
          <TabsContent value="contenido">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Uso de Contenido de Terceros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">1. Naturaleza del Contenido</h3>
                  <p className="mb-2">Juega y Calla es una plataforma de <strong>análisis crítico y reseñas de videojuegos</strong>. En el ejercicio de esta actividad, utilizamos:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Capturas de pantalla</strong> de videojuegos.</li>
                    <li><strong>Imágenes promocionales</strong> de press kits oficiales.</li>
                    <li><strong>Videos embebidos</strong> de plataformas como YouTube.</li>
                    <li><strong>Logos y marcas</strong> de plataformas de videojuegos (PlayStation, Xbox, Nintendo, PC).</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">2. Base Legal: Derecho de Cita Crítica</h3>
                  <p className="mb-2">El uso de este contenido está amparado por el <strong>derecho de cita con fines críticos y educativos</strong>, reconocido en:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Artículo 32 de la Ley de Propiedad Intelectual (España):</strong> Permite la reproducción de obras con fines de cita, crítica, reseña o enseñanza.</li>
                    <li><strong>Directiva 2001/29/CE (Unión Europea):</strong> Excepciones al derecho de autor para crítica y reseña.</li>
                    <li><strong>Fair Use Doctrine (Internacional):</strong> Reconocido en tratados internacionales para contenido transformativo y crítico.</li>
                  </ul>
                  <p className="mt-3"><strong>Nuestro uso cumple los requisitos legales:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Finalidad crítica/educativa (reseñas y análisis).</li>
                    <li>Contenido transformativo (no reproducimos el juego completo).</li>
                    <li>No sustituimos la obra original (las capturas no reemplazan jugar el juego).</li>
                    <li>Atribución clara del material a sus propietarios.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">3. Press Kits y Material Promocional</h3>
                  <p className="mb-2">Las imágenes promocionales utilizadas provienen de:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Press kits oficiales:</strong> Material proporcionado por desarrolladoras y distribuidoras específicamente para cobertura de prensa.</li>
                    <li><strong>Bases de datos autorizadas:</strong> IGDB (Internet Game Database) y similares, que distribuyen contenido con acuerdos comerciales con la industria.</li>
                  </ul>
                  <p className="mt-3">Este material está diseñado para ser utilizado por medios de comunicación, críticos y creadores de contenido con fines informativos.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">4. Videos Embebidos</h3>
                  <p>Los videos de YouTube se insertan mediante <strong>iframe embed oficial</strong>, una función proporcionada por YouTube que:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>No aloja el video en nuestros servidores.</li>
                    <li>Respeta los derechos del creador original.</li>
                    <li>Está expresamente permitida por los Términos de Servicio de YouTube.</li>
                    <li>El propietario del video puede desactivar la incrustación en cualquier momento.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">5. Marcas Registradas</h3>
                  <p className="mb-2">Los logos y marcas de plataformas (PlayStation®, Xbox®, Nintendo Switch®, Steam®, etc.) se utilizan exclusivamente con fines informativos para indicar:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Plataformas en las que está disponible el juego reseñado.</li>
                    <li>Compatibilidad técnica.</li>
                  </ul>
                  <p className="mt-3"><strong>No existe intención de:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Sugerir afiliación, patrocinio o aprobación por parte de estas empresas.</li>
                    <li>Utilizar las marcas con fines comerciales directos.</li>
                    <li>Confundir al consumidor sobre la procedencia del servicio.</li>
                  </ul>
                  <p className="mt-3">Todas las marcas pertenecen a sus respectivos propietarios.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">6. Derechos de Autor</h3>
                  <p className="mb-2"><strong>Respetamos plenamente los derechos de propiedad intelectual.</strong></p>
                  <p className="mb-2">Cada reseña incluye:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Atribución clara del juego, desarrolladora y distribuidor.</li>
                    <li>Reconocimiento de que el material audiovisual pertenece a sus creadores.</li>
                    <li>Enlace al sitio oficial o tienda donde adquirir el juego.</li>
                  </ul>
                  <p className="mt-3"><strong>Declaración expresa:</strong> Juega y Calla no reclama propiedad sobre capturas, imágenes promocionales ni videos de videojuegos. Todo el material se utiliza bajo el amparo del derecho de cita crítica con fines informativos y educativos.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">7. Procedimiento DMCA / Reclamaciones</h3>
                  <p className="mb-2">Si eres propietario de derechos de autor y consideras que algún contenido infringe tus derechos, por favor contacta con nosotros:</p>
                  <p className="ml-4 mb-2"><strong>Email:</strong> juegaycalla.reviews@gmail.com</p>
                  <p className="mb-2">Tu solicitud debe incluir:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Identificación del material protegido por derechos de autor.</li>
                    <li>URL exacta donde aparece el contenido en nuestro sitio.</li>
                    <li>Datos de contacto (email válido).</li>
                    <li>Declaración de buena fe de que el uso no está autorizado.</li>
                  </ul>
                  <p className="mt-3"><strong>Compromiso:</strong> Atenderemos cualquier reclamación legítima en un plazo máximo de 48 horas, retirando el contenido si es necesario.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">8. Opiniones y Contenido Editorial</h3>
                  <p className="mb-2">Las reseñas, análisis y opiniones expresadas en este sitio son:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Independientes y personales:</strong> No representan a desarrolladoras, distribuidoras ni plataformas.</li>
                    <li><strong>Protegidas por la libertad de expresión:</strong> Artículo 20 de la Constitución Española.</li>
                    <li><strong>Basadas en experiencia real:</strong> Todas las reseñas se basan en jugar el juego completo.</li>
                  </ul>
                  <p className="mt-3">Respetamos la diversidad de opiniones y no pretendemos imponer una visión única sobre los videojuegos reseñados.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">9. Precedente Legal</h3>
                  <p>El modelo de negocio de crítica y reseñas de videojuegos está ampliamente establecido a nivel mundial (IGN, GameSpot, Eurogamer, Vandal, 3DJuegos) con jurisprudencia que respalda el uso de material audiovisual con fines críticos.</p>
                  <p className="mt-2">Este modelo ha sido validado durante más de 30 años sin conflictos legales significativos, siempre que se cumplan los requisitos de uso legítimo mencionados anteriormente.</p>
                </div>

                <div className="bg-muted/30 border border-muted rounded-lg p-4">
                  <p className="text-sm"><strong>Disclaimer final:</strong> Si tienes alguna duda sobre el uso de contenido específico, no dudes en contactarnos. Nuestro objetivo es promover la cultura del videojuego mediante análisis honestos y respetuosos con los derechos de sus creadores.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Legal;
