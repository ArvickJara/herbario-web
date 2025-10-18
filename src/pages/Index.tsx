import { SearchBar } from "@/components/SearchBar";
import { PlantCard } from "@/components/PlantCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Search, BookOpen, Shield, ArrowRight, Users, Award, MessageCircle, Heart, Brain, Activity, Zap, Sparkles, Apple, Waves, Cpu, Palette, Pill, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImage from "@/assets/parque_0.jpg";

// Importaciones para la base de datos
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { desc } from "drizzle-orm";

// Definición de esquemas de base de datos
const plantsTable = sqliteTable("plants", {
  id: text("id").primaryKey(),
  commonName: text("commonName").notNull(),
  scientificName: text("scientificName"),
  description: text("description"),
  imageUrl: text("image_url"),
});

const benefitsTable = sqliteTable("benefits", {
  id: text("id").primaryKey(),
  tipo: text("tipo").notNull(),
  description: text("description").notNull(),
  plantId: text("plant_id").notNull(),
});

// Tipos para las plantas
type DatabasePlant = {
  id: string;
  commonName: string;
  scientificName: string | null;
  description: string | null;
  imageUrl: string | null;
};

type Benefit = {
  id: string;
  tipo: string;
  description: string;
  plantId: string;
};

type PlantWithBenefits = DatabasePlant & {
  benefits: Benefit[];
};

// Función para inicializar la base de datos
let db: ReturnType<typeof drizzle> | null = null;

function initDatabase() {
  const dbUrl = import.meta.env.VITE_TURSO_DATABASE_URL;
  const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error('Faltan variables de entorno para la base de datos');
    return null;
  }

  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  return drizzle(client);
}

// Función para obtener las últimas plantas
const getLatestPlants = async (): Promise<PlantWithBenefits[]> => {
  try {
    if (!db) {
      db = initDatabase();
    }

    if (!db) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Obtener las últimas 3 plantas
    const plants = await db.select().from(plantsTable).orderBy(desc(plantsTable.id)).limit(3);

    // Obtener beneficios para estas plantas
    const benefits = await db.select().from(benefitsTable);

    // Combinar datos
    const plantsWithBenefits = plants.map(plant => ({
      ...plant,
      benefits: benefits.filter(b => b.plantId === plant.id)
    }));

    return plantsWithBenefits;
  } catch (error) {
    console.error('Error al obtener plantas:', error);
    return [];
  }
};

const WhatsAppIcon = () => (
  <svg className="mr-2 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const Index = () => {
  // Estados para plantas reales de la base de datos
  const [featuredPlants, setFeaturedPlants] = useState<PlantWithBenefits[]>([]);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [plantsError, setPlantsError] = useState<string | null>(null);

  // Cargar plantas al montar el componente
  useEffect(() => {
    const loadPlants = async () => {
      try {
        setPlantsLoading(true);
        setPlantsError(null);
        const plants = await getLatestPlants();
        setFeaturedPlants(plants);
      } catch (error) {
        console.error('Error cargando plantas:', error);
        setPlantsError('Error al cargar las plantas destacadas');
      } finally {
        setPlantsLoading(false);
      }
    };

    loadPlants();
  }, []);

  // Mock data para categorías (esto se puede mantener estático por ahora)
  const ailmentCategories = [
    { name: "Digestivo", count: 45, icon: Apple, color: "text-orange-600", bgColor: "bg-orange-100" },
    { name: "Respiratorio", count: 32, icon: Waves, color: "text-blue-600", bgColor: "bg-blue-100" },
    { name: "Cardiovascular", count: 28, icon: Heart, color: "text-red-600", bgColor: "bg-red-100" },
    { name: "Nervioso", count: 23, icon: Brain, color: "text-purple-600", bgColor: "bg-purple-100" },
    { name: "Inmunológico", count: 19, icon: Shield, color: "text-emerald-600", bgColor: "bg-emerald-100" },
    { name: "Dermatológico", count: 15, icon: Sparkles, color: "text-pink-600", bgColor: "bg-pink-100" }
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(query)}`;
    }
  };

  // Función para transformar plantas de la BD al formato esperado por PlantCard
  const transformPlantForCard = (plant: PlantWithBenefits) => {
    return {
      id: plant.id,
      slug: plant.commonName.toLowerCase().replace(/\s+/g, '-'),
      commonName: plant.commonName,
      scientificName: plant.scientificName || 'No especificado',
      family: 'Amazónica', // Por defecto ya que no tenemos este campo en la BD
      summary: plant.description || 'Planta medicinal amazónica con propiedades terapéuticas tradicionales.',
      evidenceLevel: 'moderada' as const, // Por defecto, se puede mejorar basándose en respaldo científico
      hasInteractions: false, // Por defecto
      traditionalUses: plant.benefits.slice(0, 3).map(b => b.tipo), // Primeros 3 tipos de beneficios
      imageUrl: plant.imageUrl // ¡Agregamos la imagen!
    };
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-32 lg:py-48 bg-gradient-hero overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(20, 20, 20, 0.7), rgba(40, 40, 40, 0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">


            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Herbario Amazónico
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 leading-relaxed">
              Conocimiento tradicional de plantas medicinales amazónicas
              <br className="hidden md:block" />
              con respaldo científico y precauciones médicas
            </p>

            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar
                placeholder="Buscar por planta o dolencia (ej: digestivo, artritis)..."
                onSearch={handleSearch}
                className="shadow-botanical"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="accent" size="lg" className="font-semibold">
                <Link to="/buscar">
                  <Search className="mr-2 h-5 w-5" />
                  Explorar Plantas
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/acerca">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Acerca del Proyecto
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-20">
          {/* Hoja grande - vértice superior del triángulo */}
          <Leaf className="h-20 w-20 text-primary-foreground animate-leaf" />

          {/* Hoja pequeña - vértice inferior izquierdo */}
          <Leaf
            className="h-10 w-10 text-primary-foreground animate-leaf absolute top-18 -left-6"
            style={{ animationDelay: "0.5s" }}
          />

          {/* Hoja pequeña - vértice inferior derecho */}
          <Leaf
            className="h-12 w-12 text-primary-foreground animate-leaf absolute top-16 left-12"
            style={{ animationDelay: "1s" }}
          />
        </div>


        {/* Fade out gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      </section>

      {/* Categories Section */}


      {/* Featured Plants */}
      <section className="py-16 bg-ui">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Plantas Destacadas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Últimas plantas añadidas al herbario amazónico
            </p>
          </div>

          {/* Estado de carga */}
          {plantsLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Cargando plantas destacadas...</span>
            </div>
          )}

          {/* Estado de error */}
          {plantsError && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{plantsError}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Reintentar
              </Button>
            </div>
          )}

          {/* Plantas cargadas */}
          {!plantsLoading && !plantsError && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredPlants.length > 0 ? (
                  featuredPlants.map((plant) => (
                    <PlantCard key={plant.id} {...transformPlantForCard(plant)} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      Aún no hay plantas registradas en el herbario
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/admin">
                        Agregar Primera Planta
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {featuredPlants.length > 0 && (
                <div className="text-center">
                  <Button asChild variant="botanical" size="lg">
                    <Link to="/buscar">
                      Ver Todas las Plantas
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                Nuestra Misión
              </h2>
              <p className="text-lg text-muted-foreground">
                Preservamos y validamos el conocimiento ancestral amazónico con rigor científico
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6 bg-gradient-subtle border-border/50">
                <CardContent className="p-0 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-serif font-semibold text-lg">Educar</h3>
                  <p className="text-sm text-muted-foreground">
                    Proporcionar información confiable sobre usos tradicionales
                    y evidencia científica de plantas medicinales amazónicas
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 bg-gradient-subtle border-border/50">
                <CardContent className="p-0 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-secondary/10 rounded-full">
                      <Shield className="h-8 w-8 text-secondary" />
                    </div>
                  </div>
                  <h3 className="font-serif font-semibold text-lg">Prevenir</h3>
                  <p className="text-sm text-muted-foreground">
                    Alertar sobre interacciones medicamentosas y precauciones
                    para prevenir riesgos de automedicación
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 bg-gradient-subtle border-border/50">
                <CardContent className="p-0 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-accent/10 rounded-full">
                      <Users className="h-8 w-8 text-accent" />
                    </div>
                  </div>
                  <h3 className="font-serif font-semibold text-lg">Preservar</h3>
                  <p className="text-sm text-muted-foreground">
                    Documentar y conservar el conocimiento tradicional de
                    comunidades indígenas y locales amazónicas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de contacto rápido */}
      <section className="py-16">
        <div className="container">
          <div className="bg-secondary rounded-2xl p-8 md:p-12 text-center shadow-botanical">
            <div className="max-w-3xl mx-auto">

              <h3 className="text-2xl md:text-3xl font-serif font-bold text-secondary-foreground mb-4">
                ¿Tienes consultas sobre plantas medicinales?
              </h3>
              <p className="text-secondary-foreground/90 text-lg mb-8 leading-relaxed">
                Nuestro equipo está listo para asistirte con información adicional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-light text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-3000 font-semibold animate-bounce hover:animate-none"
                  onClick={() =>
                    window.open(
                      `https://wa.me/51927459843?text=Hola,%20tengo%20consultas%20sobre%20plantas%20medicinales%20amazónicas`,
                      '_blank'
                    )
                  }
                >
                  <WhatsAppIcon />
                  Consultar por WhatsApp
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
                >

                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
