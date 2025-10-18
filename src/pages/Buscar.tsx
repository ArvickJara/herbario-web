import { useState, useMemo, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { PlantCard } from "@/components/PlantCard";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, SlidersHorizontal, X, Search, ChevronLeft, ChevronRight, Loader2, Leaf, Microscope, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// Importaciones para la base de datos
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { like, or } from "drizzle-orm";

const ITEMS_PER_PAGE = 6;

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

type UsageMethod = {
  id: string;
  tipo: string;
  description: string;
  plantId: string;
};

type PlantWithDetails = DatabasePlant & {
  benefits: Benefit[];
  usageMethods: UsageMethod[];
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

// Función para obtener todas las plantas con detalles
const getAllPlantsWithDetails = async (): Promise<PlantWithDetails[]> => {
  try {
    if (!db) {
      db = initDatabase();
    }

    if (!db) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    const plants = await db.select().from(plantsTable);
    const benefits = await db.select().from(benefitsTable);
    const usageMethods = await db.select().from(usageMethodsTable);

    // Combinar datos
    const plantsWithDetails = plants.map(plant => ({
      ...plant,
      benefits: benefits.filter(b => b.plantId === plant.id),
      usageMethods: usageMethods.filter(u => u.plantId === plant.id)
    }));

    return plantsWithDetails;
  } catch (error) {
    console.error('Error al obtener plantas:', error);
    return [];
  }
};

const Buscar = () => {
  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAilment, setSelectedAilment] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados para datos de la base de datos
  const [plantsData, setPlantsData] = useState<PlantWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar plantas de la base de datos
  useEffect(() => {
    const loadPlants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const plants = await getAllPlantsWithDetails();
        setPlantsData(plants);
      } catch (err) {
        console.error('Error cargando plantas:', err);
        setError('Error al cargar las plantas. Intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlants();
  }, []);

  // Extraer categorías únicas de los beneficios
  const ailments = useMemo(() => {
    const ailmentsSet = new Set<string>();
    plantsData.forEach(plant => {
      plant.benefits.forEach(benefit => {
        ailmentsSet.add(benefit.tipo);
      });
    });
    return Array.from(ailmentsSet).sort();
  }, [plantsData]);

  // Extraer tipos de métodos de uso
  const partsUsed = useMemo(() => {
    const partsSet = new Set<string>();
    plantsData.forEach(plant => {
      plant.usageMethods.forEach(method => {
        partsSet.add(method.tipo);
      });
    });
    return Array.from(partsSet).sort();
  }, [plantsData]);

  const evidenceLevels = [
    { value: "alta", label: "Evidencia Alta" },
    { value: "moderada", label: "Evidencia Moderada" },
    { value: "baja", label: "Evidencia Baja" },
    { value: "sin-evidencia", label: "Sin Evidencia" }
  ];

  // Transformar y filtrar plantas de la base de datos
  const plants = useMemo(() => {
    return plantsData
      .filter(plant => {
        // Filtro de búsqueda
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesName = plant.commonName?.toLowerCase().includes(query);
          const matchesScientific = plant.scientificName?.toLowerCase().includes(query);
          const matchesDescription = plant.description?.toLowerCase().includes(query);
          const matchesBenefits = plant.benefits.some(benefit =>
            benefit.tipo.toLowerCase().includes(query) ||
            benefit.description.toLowerCase().includes(query)
          );

          if (!matchesName && !matchesScientific && !matchesDescription && !matchesBenefits) {
            return false;
          }
        }

        // Filtro por dolencia (tipo de beneficio)
        if (selectedAilment) {
          const hasBenefit = plant.benefits.some(benefit =>
            benefit.tipo.toLowerCase().includes(selectedAilment.toLowerCase())
          );
          if (!hasBenefit) return false;
        }

        // Filtro por tipo de método de uso
        if (selectedPart) {
          const hasMethod = plant.usageMethods.some(method =>
            method.tipo.toLowerCase().includes(selectedPart.toLowerCase())
          );
          if (!hasMethod) return false;
        }

        return true;
      })
      .map(plant => {
        // Extraer usos tradicionales de los beneficios
        const traditionalUses = plant.benefits.slice(0, 3).map(benefit => benefit.tipo);

        return {
          id: plant.id,
          slug: plant.commonName.toLowerCase().replace(/\s+/g, '-'),
          commonName: plant.commonName,
          scientificName: plant.scientificName || 'No especificado',
          family: "Amazónica",
          summary: plant.description || "Planta medicinal amazónica con propiedades terapéuticas tradicionales.",
          evidenceLevel: "moderada" as const,
          hasInteractions: false,
          traditionalUses,
          imageUrl: plant.imageUrl
        };
      });
  }, [searchQuery, selectedAilment, selectedPart, plantsData]);

  // Resetear a la primera página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedAilment, selectedPart]);

  // Calcular paginación
  const totalPages = Math.ceil(plants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPlants = plants.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilters = [
    searchQuery && { type: "query", value: searchQuery, label: `"${searchQuery}"` },
    selectedAilment && { type: "ailment", value: selectedAilment, label: selectedAilment },
    selectedEvidence && { type: "evidence", value: selectedEvidence, label: evidenceLevels.find(e => e.value === selectedEvidence)?.label },
    selectedPart && { type: "part", value: selectedPart, label: selectedPart }
  ].filter(Boolean);

  const clearFilter = (filterType: string) => {
    switch (filterType) {
      case "query": setSearchQuery(""); break;
      case "ailment": setSelectedAilment(""); break;
      case "evidence": setSelectedEvidence(""); break;
      case "part": setSelectedPart(""); break;
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedAilment("");
    setSelectedEvidence("");
    setSelectedPart("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-ui via-primary/10 to-secondary/15 border-b border-border/50 py-12 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 right-8 transform rotate-12">
            <Leaf className="h-32 w-32 text-primary" />
          </div>
          <div className="absolute bottom-8 left-8 transform -rotate-12">
            <Microscope className="h-28 w-28 text-secondary" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
            <BookOpen className="h-24 w-24 text-accent" />
          </div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Herbario Digital Amazónico
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
              Explorar Plantas
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}Medicinales
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Descubra el poder curativo de la naturaleza amazónica. Busque por nombre de planta, dolencia o síntoma
              y encuentre remedios naturales respaldados por la sabiduría ancestral.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all duration-300">
                <SearchBar
                  placeholder="🔍 Buscar plantas por nombre o dolencia..."
                  onSearch={setSearchQuery}
                />
              </div>
            </div>

            {/* Quick search suggestions */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">Búsquedas populares:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Digestivo', 'Dolor de cabeza', 'Inflamación', 'Ansiedad', 'Gripe'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-3 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-full border border-primary/20 hover:border-primary/30 transition-all duration-200 hover:scale-105"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Toggle */}

        </div>
      </section>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
            <Card className="sticky top-24 shadow-lg border-border/50 bg-gradient-to-br from-background to-ui/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Filter className="h-5 w-5 text-primary" />
                  </div>
                  Filtros de Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dolencias */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    Dolencia o Sistema
                  </label>
                  <Select value={selectedAilment} onValueChange={setSelectedAilment}>
                    <SelectTrigger className="bg-background/80 border-border/50 hover:border-primary/30 transition-colors">
                      <SelectValue placeholder="Seleccionar dolencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {ailments.map((ailment) => (
                        <SelectItem key={ailment} value={ailment.toLowerCase()}>
                          {ailment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nivel de Evidencia */}


                {/* Parte Usada */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-accent" />
                    Parte de la Planta
                  </label>
                  <Select value={selectedPart} onValueChange={setSelectedPart}>
                    <SelectTrigger className="bg-background/80 border-border/50 hover:border-accent/30 transition-colors">
                      <SelectValue placeholder="Seleccionar parte" />
                    </SelectTrigger>
                    <SelectContent>
                      {partsUsed.map((part) => (
                        <SelectItem key={part} value={part.toLowerCase()}>
                          {part}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {activeFilters.length > 0 && (
                  <div className="pt-4 border-t border-border/30">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="w-full bg-destructive/5 hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30 text-destructive hover:text-destructive transition-all duration-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Limpiar Filtros
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mb-8">
                <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Filter className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">Filtros activos:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.map((filter, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary transition-all duration-200 hover:scale-105">
                          <span>{filter.label}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full"
                            onClick={() => clearFilter(filter.type)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Search className="h-4 w-4 text-secondary" />
                  </div>
                  Resultados
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                    {plants.length}
                  </Badge>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, plants.length)} de {plants.length} plantas encontradas
                </p>
              </div>

              <Select defaultValue="relevance">
                <SelectTrigger className="w-full sm:w-48 bg-background/80 border-border/50 hover:border-primary/30 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Más Relevantes</SelectItem>
                  <SelectItem value="evidence">Mayor Evidencia</SelectItem>
                  <SelectItem value="alphabetical">Alfabético</SelectItem>
                  <SelectItem value="family">Por Familia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-background to-primary/5">
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <Leaf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-serif font-semibold text-foreground">Buscando plantas medicinales</h3>
                      <p className="text-muted-foreground">Explorando la base de datos del herbario...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card className="shadow-lg border-destructive/20 bg-gradient-to-br from-background to-destructive/5">
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-foreground mb-2">Error al cargar plantas</h3>
                  <p className="text-destructive mb-6">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline" className="border-destructive/30 hover:bg-destructive/10">
                    <Search className="h-4 w-4 mr-2" />
                    Reintentar Búsqueda
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            {!isLoading && !error && paginatedPlants.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedPlants.map((plant) => (
                    <PlantCard key={plant.id} {...plant} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Mostrar solo algunas páginas alrededor de la actual
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="min-w-[40px]"
                            >
                              {page}
                            </Button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="px-2">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            ) : !isLoading && !error && (
              <Card className="shadow-lg border-accent/20 bg-gradient-to-br from-background to-accent/5">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-foreground mb-4">
                    {plantsData.length === 0 ? "🌱 Herbario en construcción" : "🔍 No se encontraron plantas"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                    {plantsData.length === 0
                      ? "El herbario digital está esperando ser poblado con plantas medicinales amazónicas. ¡Sea el primero en agregar conocimiento ancestral!"
                      : "No encontramos plantas que coincidan con su búsqueda. Intente ajustar los filtros o usar términos más generales para explorar nuestro herbario."
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {plantsData.length === 0 ? (
                      <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
                        <Link to="/admin">
                          <Leaf className="h-4 w-4 mr-2" />
                          Panel de Administración
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={clearAllFilters} className="border-accent/30 hover:bg-accent/10">
                          <X className="h-4 w-4 mr-2" />
                          Limpiar Filtros
                        </Button>
                        <Button asChild variant="default">
                          <Link to="/">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Volver al Inicio
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>

                  {plantsData.length > 0 && (
                    <div className="mt-8 p-4 bg-accent/5 rounded-lg border border-accent/20">
                      <p className="text-sm text-accent font-medium">💡 Consejo de búsqueda</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pruebe términos como "digestivo", "dolor", "inflamación" o nombres comunes de plantas amazónicas
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buscar;