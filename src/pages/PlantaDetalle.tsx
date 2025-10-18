import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { InteractionAlert } from "@/components/InteractionAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Leaf,
  AlertTriangle,
  BookOpen,
  Microscope,
  Shield,
  Pill,
  ExternalLink,
  Loader2,
  MapPin,
  Calendar,
  Users,
  Heart,
  Star,
  Globe,
  Beaker,
  Zap,
  Award,
  Info,
  Home,
  Camera
} from "lucide-react";
import samplePlantImage from "@/assets/sample-plant.jpg";

// Importaciones para la base de datos
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";

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

const usageMethodsTable = sqliteTable("usage_methods", {
  id: text("id").primaryKey(),
  tipo: text("tipo").notNull(),
  description: text("description").notNull(),
  plantId: text("plant_id").notNull(),
});

const respaldoCientificoTable = sqliteTable("respaldo_cientifico", {
  id: text("id").primaryKey(),
  plantId: text("plant_id").notNull(),
  hallazgoCientifico: text("hallazgo_cientifico").notNull(),
  idioma: text("idioma"),
  anio: text("anio"),
  urlFuente: text("url_fuente"),
});

// Tipos
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

type UsageMethod = {
  id: string;
  tipo: string;
  description: string;
  plantId: string;
};

type RespaldoCientifico = {
  id: string;
  plantId: string;
  hallazgoCientifico: string;
  idioma: string | null;
  anio: string | null;
  urlFuente: string | null;
};

type PlantWithFullDetails = DatabasePlant & {
  benefits: Benefit[];
  usageMethods: UsageMethod[];
  respaldoCientifico: RespaldoCientifico[];
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

// Función para obtener una planta por slug
const getPlantBySlug = async (slug: string): Promise<PlantWithFullDetails | null> => {
  try {
    if (!db) {
      db = initDatabase();
    }

    if (!db) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Buscar planta por nombre común convertido a slug
    const plants = await db.select().from(plantsTable);
    const plant = plants.find(p =>
      p.commonName.toLowerCase().replace(/\s+/g, '-') === slug
    );

    if (!plant) {
      return null;
    }

    // Obtener detalles relacionados
    const benefits = await db.select().from(benefitsTable).where(eq(benefitsTable.plantId, plant.id));
    const usageMethods = await db.select().from(usageMethodsTable).where(eq(usageMethodsTable.plantId, plant.id));
    const respaldoCientifico = await db.select().from(respaldoCientificoTable).where(eq(respaldoCientificoTable.plantId, plant.id));

    return {
      ...plant,
      benefits,
      usageMethods,
      respaldoCientifico
    };
  } catch (error) {
    console.error('Error al obtener planta:', error);
    return null;
  }
};

const PlantaDetalle = () => {
  const { slug } = useParams();

  // Estados para la planta
  const [plantData, setPlantData] = useState<PlantWithFullDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de la planta
  useEffect(() => {
    const loadPlant = async () => {
      if (!slug) {
        setError('Slug de planta no válido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const plant = await getPlantBySlug(slug);

        if (!plant) {
          setError('Planta no encontrada');
        } else {
          setPlantData(plant);
        }
      } catch (err) {
        console.error('Error cargando planta:', err);
        setError('Error al cargar la información de la planta');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlant();
  }, [slug]);

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <Leaf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif font-semibold text-foreground">Cargando información</h3>
            <p className="text-muted-foreground">Obteniendo detalles de la planta...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !plantData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-destructive/5 flex items-center justify-center p-4">
        <Card className="max-w-md shadow-lg border-destructive/20">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2 text-foreground">
              {error === 'Planta no encontrada' ? 'Planta no encontrada' : 'Error'}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {error || 'No se encontró información sobre la planta solicitada.'}
            </p>
            <Button asChild className="w-full">
              <Link to="/buscar">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Explorar
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transformar datos de la BD al formato de la vista
  const plant = {
    id: plantData.id,
    slug: plantData.commonName.toLowerCase().replace(/\s+/g, '-'),
    commonName: plantData.commonName,
    scientificName: plantData.scientificName || 'No especificado',
    summary: plantData.description || "Planta medicinal amazónica con propiedades terapéuticas tradicionales.",
    description: plantData.description || "Planta medicinal amazónica con propiedades terapéuticas tradicionales.",
    imageUrl: plantData.imageUrl || samplePlantImage,
    evidenceLevel: "moderada" as const,
    hasInteractions: false,

    traditionalUses: plantData.benefits.map((benefit, index) => {
      // Buscar método de uso correspondiente
      const correspondingMethod = plantData.usageMethods.find(method =>
        method.tipo.toLowerCase().includes(benefit.tipo.toLowerCase()) ||
        benefit.tipo.toLowerCase().includes(method.tipo.toLowerCase())
      ) || plantData.usageMethods[index]; // fallback al método por índice

      return {
        ailment: benefit.tipo,
        partUsed: correspondingMethod?.tipo || "No especificado",
        preparation: correspondingMethod?.description || "No especificado",
        dosage: "Consultar con profesional de la salud",
        notes: benefit.description
      };
    }),

    scientificEvidence: plantData.respaldoCientifico.map(respaldo => ({
      claim: `Respaldo científico ${respaldo.anio ? `(${respaldo.anio})` : ''}`,
      evidenceLevel: "moderada" as const,
      citation: respaldo.urlFuente || "Ver referencias científicas",
      summary: respaldo.hallazgoCientifico
    })),

    precautions: [
      "Consultar con un profesional de la salud antes de usar",
      "No usar durante el embarazo sin supervisión médica",
      "Suspender si presenta reacciones adversas",
      "Mantener fuera del alcance de los niños"
    ],

    interactions: []
  };

  const highSeverityInteractions = plant.interactions.filter(i => i.severity === "alta");
  const moderateSeverityInteractions = plant.interactions.filter(i => i.severity === "moderada");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5">
      {/* Header */}
      <section className="bg-gradient-to-r from-ui via-secondary/10 to-primary/10 border-b border-border/50 py-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 transform rotate-12">
            <Leaf className="h-24 w-24 text-primary" />
          </div>
          <div className="absolute bottom-4 left-4 transform -rotate-12">
            <Microscope className="h-20 w-20 text-primary" />
          </div>
        </div>

        <div className="container relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild className="shadow-sm hover:shadow-md transition-shadow">
              <Link to="/buscar">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Explorar
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>/</span>
              <span>Herbario</span>
              <span>/</span>
              <span className="text-primary font-medium">{plant.commonName}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plant Image */}
            <div className="lg:col-span-1">
              <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
                <img
                  src={plant.imageUrl}
                  alt={`${plant.commonName} - ${plant.scientificName}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm">
                    <Camera className="h-3 w-3 mr-1" />
                    Ver imagen completa
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Card className="p-3 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Usos</p>
                      <p className="font-semibold">{plant.traditionalUses.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3 bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Beaker className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Evidencias</p>
                      <p className="font-semibold">{plant.scientificEvidence.length}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Plant Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">
                        {plant.commonName}
                      </h1>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xl text-muted-foreground italic">
                        {plant.scientificName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">

                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>Región Amazónica</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <EvidenceBadge level={plant.evidenceLevel} size="lg" />
                    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Verificado</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 p-6 rounded-xl border border-primary/10">
                  <p className="text-lg text-foreground/90 leading-relaxed font-medium">
                    {plant.summary}
                  </p>
                </div>

                {/* Key Benefits Preview */}
                <div className="mt-6">
                  <h3 className="text-lg font-serif font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Beneficios principales
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {plant.traditionalUses.slice(0, 4).map((use, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:from-primary/20 hover:to-secondary/20 transition-colors cursor-pointer"
                      >
                        <Heart className="h-3 w-3 mr-1" />
                        {use.ailment}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interaction Alert */}
              {(highSeverityInteractions.length > 0 || moderateSeverityInteractions.length > 0) && (
                <div className="space-y-4">
                  {highSeverityInteractions.length > 0 && (
                    <InteractionAlert
                      severity="alta"
                      interactions={highSeverityInteractions}
                    />
                  )}
                  {moderateSeverityInteractions.length > 0 && (
                    <InteractionAlert
                      severity="moderada"
                      interactions={moderateSeverityInteractions}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="resumen" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-3xl grid-cols-2 md:grid-cols-5 bg-gradient-to-r from-ui/80 to-secondary/10 backdrop-blur-sm border border-border/50 shadow-lg">
                <TabsTrigger value="resumen" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Resumen</span>
                </TabsTrigger>
                <TabsTrigger value="usos" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                  <Leaf className="h-4 w-4" />
                  <span className="hidden sm:inline">Usos</span>
                </TabsTrigger>
                <TabsTrigger value="evidencia" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                  <Microscope className="h-4 w-4" />
                  <span className="hidden sm:inline">Evidencia</span>
                </TabsTrigger>
                <TabsTrigger value="precauciones" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Precauciones</span>
                </TabsTrigger>
                <TabsTrigger value="interacciones" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                  <Pill className="h-4 w-4" />
                  <span className="hidden sm:inline">Interacciones</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="resumen" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Descripción Principal */}
                <div className="lg:col-span-2">
                  <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-background to-primary/5">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        Descripción General
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-foreground/80 leading-relaxed text-lg">
                        {plant.description}
                      </p>

                      {/* Additional Info Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">Origen</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Cuenca Amazónica</p>
                        </div>
                        <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-secondary" />
                            <span className="font-semibold text-sm">Uso tradicional</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Medicina ancestral</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Panel lateral con información botánica */}
                <div className="space-y-6">
                  <Card className="shadow-lg border-secondary/20 bg-gradient-to-br from-background to-secondary/5">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Leaf className="h-5 w-5 text-secondary" />
                        Información Botánica
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-ui rounded">
                          <span className="font-medium text-sm">Nombre común:</span>
                          <span className="text-sm font-semibold text-primary">{plant.commonName}</span>
                        </div>
                        <Separator className="opacity-50" />
                        <div className="flex justify-between items-center p-2">
                          <span className="font-medium text-sm">Nombre científico:</span>
                          <span className="text-sm italic text-muted-foreground">{plant.scientificName}</span>
                        </div>
                        <Separator className="opacity-50" />

                        <Separator className="opacity-50" />
                        <div className="flex justify-between items-center p-2">
                          <span className="font-medium text-sm">Evidencia:</span>
                          <EvidenceBadge level={plant.evidenceLevel} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-accent/20 bg-gradient-to-br from-background to-accent/5">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Zap className="h-5 w-5 text-accent" />
                        Usos Principales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {plant.traditionalUses.slice(0, 4).map((use, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 hover:bg-accent/5 rounded transition-colors">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <Badge variant="outline" className="text-xs border-accent/30">
                              {use.ailment}
                            </Badge>
                          </div>
                        ))}
                        {plant.traditionalUses.length > 4 && (
                          <p className="text-xs text-muted-foreground text-center pt-2">
                            +{plant.traditionalUses.length - 4} usos más
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usos" className="space-y-6">
              <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-background to-primary/5">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    Usos Tradicionales
                    <Badge variant="secondary" className="ml-auto">
                      {plant.traditionalUses.length} usos documentados
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {plant.traditionalUses.map((use, index) => (
                      <div key={index} className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent rounded-full"></div>
                        <div className="pl-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <h4 className="font-serif font-semibold text-xl text-primary flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Heart className="h-4 w-4 text-primary" />
                              </div>
                              {use.ailment}
                            </h4>
                            <Badge variant="outline" className="bg-primary/5 border-primary/20">
                              Uso #{index + 1}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-gradient-to-br from-ui to-primary/5 rounded-lg border border-primary/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Leaf className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-sm">Parte usada</span>
                              </div>
                              <p className="text-sm text-foreground">{use.partUsed}</p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-ui to-secondary/5 rounded-lg border border-secondary/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Beaker className="h-4 w-4 text-secondary" />
                                <span className="font-semibold text-sm">Preparación</span>
                              </div>
                              <p className="text-sm text-foreground">{use.preparation}</p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-ui to-accent/5 rounded-lg border border-accent/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Pill className="h-4 w-4 text-accent" />
                                <span className="font-semibold text-sm">Dosificación</span>
                              </div>
                              <p className="text-sm text-foreground">{use.dosage}</p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-ui to-muted/5 rounded-lg border border-muted/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Info className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold text-sm">Notas</span>
                              </div>
                              <p className="text-sm text-foreground">{use.notes}</p>
                            </div>
                          </div>
                        </div>

                        {index < plant.traditionalUses.length - 1 && (
                          <Separator className="mt-6 opacity-30" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-amber-800 mb-1">Importante</h5>
                        <p className="text-sm text-amber-700">
                          Los usos tradicionales aquí descritos provienen del conocimiento ancestral amazónico.
                          Siempre consulte con un profesional de la salud antes de usar cualquier planta medicinal.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evidencia" className="space-y-6">
              <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-background to-primary/5">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Microscope className="h-5 w-5 text-primary" />
                    </div>
                    Evidencia Científica
                    <Badge variant="secondary" className="ml-auto">
                      {plant.scientificEvidence.length} estudios
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {plant.scientificEvidence.map((evidence, index) => (
                      <div key={index} className="relative group">
                        <div className="p-6 border border-border/50 rounded-xl bg-gradient-to-br from-background to-secondary/5 hover:to-secondary/10 transition-all duration-300 hover:shadow-lg">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                                <Award className="h-5 w-5 text-secondary" />
                              </div>
                              <div>
                                <h4 className="font-serif font-semibold text-lg text-foreground mb-1">
                                  {evidence.claim}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <EvidenceBadge level={evidence.evidenceLevel} />
                                  <span className="text-xs text-muted-foreground">
                                    Estudio {index + 1} de {plant.scientificEvidence.length}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4 p-4 bg-gradient-to-r from-ui/50 to-transparent rounded-lg border-l-4 border-secondary">
                            <p className="text-foreground/80 leading-relaxed">
                              {evidence.summary}
                            </p>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-muted/30">
                            <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center flex-shrink-0">
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-foreground">Fuente científica:</span>
                                <Badge variant="outline" className="text-xs py-0.5 px-2">Referencia</Badge>
                              </div>
                              {evidence.citation && evidence.citation !== "Ver referencias científicas" ? (
                                <a
                                  href={evidence.citation}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 underline transition-colors group/link"
                                >
                                  <span className="italic text-sm">{evidence.citation}</span>
                                  <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                </a>
                              ) : (
                                <span className="italic text-sm text-muted-foreground">{evidence.citation}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {index < plant.scientificEvidence.length - 1 && (
                          <div className="flex justify-center my-6">
                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Microscope className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-blue-800 mb-2">Sobre la evidencia científica</h5>
                        <p className="text-sm text-blue-700 leading-relaxed">
                          La evidencia presentada proviene de estudios científicos publicados y revisados por pares.
                          El nivel de evidencia se clasifica según los estándares internacionales de investigación médica.
                          Para consultas específicas sobre tratamientos, consulte con un profesional de la salud.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="precauciones" className="space-y-6">
              <Card className="shadow-lg border-accent/20 bg-gradient-to-br from-background to-accent/5">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>
                    Precauciones y Contraindicaciones
                    <Badge variant="outline" className="ml-auto bg-accent/10 border-accent/30">
                      Seguridad
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    {plant.precautions.map((precaution, index) => (
                      <div key={index} className="group">
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 border border-accent/20 rounded-lg hover:border-accent/30 transition-all duration-200 hover:shadow-md">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                            <AlertTriangle className="h-4 w-4 text-accent" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <span className="font-medium text-sm text-accent">Precaución {index + 1}</span>
                              <Badge variant="outline" className="text-xs py-0.5 px-2">
                                Importante
                              </Badge>
                            </div>
                            <p className="text-foreground/80 leading-relaxed">{precaution}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Advertencia especial */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-destructive/10 to-destructive/5"></div>
                    <div className="relative p-6 border border-destructive/30 rounded-xl bg-gradient-to-br from-destructive/5 to-transparent">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif font-bold text-lg text-destructive mb-3 flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Advertencia Importante
                          </h4>
                          <div className="space-y-3 text-sm text-foreground/80">
                            <p className="leading-relaxed">
                              <strong className="text-destructive">Esta información no sustituye el consejo médico profesional.</strong>
                              Siempre consulte con un profesional de la salud antes de usar plantas medicinales,
                              especialmente si tiene condiciones médicas preexistentes o está tomando medicamentos.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                              <div className="flex items-center gap-2 p-2 bg-destructive/5 rounded">
                                <Users className="h-4 w-4 text-destructive" />
                                <span className="text-xs">Consulte un profesional</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-destructive/5 rounded">
                                <Calendar className="h-4 w-4 text-destructive" />
                                <span className="text-xs">Control médico regular</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional de seguridad */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <Users className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-orange-800 mb-1">Grupos vulnerables</h5>
                            <p className="text-xs text-orange-700">
                              Embarazadas, lactantes, niños y adultos mayores requieren supervisión especial.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-red-800 mb-1">Reacciones adversas</h5>
                            <p className="text-xs text-red-700">
                              Suspenda el uso inmediatamente si presenta efectos secundarios.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interacciones" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    Interacciones con Fármacos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {highSeverityInteractions.length > 0 && (
                    <InteractionAlert severity="alta" interactions={highSeverityInteractions} />
                  )}

                  {moderateSeverityInteractions.length > 0 && (
                    <InteractionAlert severity="moderada" interactions={moderateSeverityInteractions} />
                  )}

                  {plant.interactions.filter(i => i.severity === "baja").length > 0 && (
                    <InteractionAlert
                      severity="baja"
                      interactions={plant.interactions.filter(i => i.severity === "baja")}
                    />
                  )}

                  <div className="p-4 bg-ui border border-border rounded-lg">
                    <p className="text-sm text-foreground/80">
                      <strong>Recomendación general:</strong> Informe siempre a su médico y farmacéutico
                      sobre el uso de plantas medicinales cuando le prescriban o dispensen medicamentos.
                      Mantenga una lista actualizada de todos los productos naturales que consume.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default PlantaDetalle;