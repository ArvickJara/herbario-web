import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { PlantCard } from "@/components/PlantCard";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";

const Buscar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAilment, setSelectedAilment] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const ailments = [
    "Digestivo", "Respiratorio", "Cardiovascular", "Nervioso", 
    "Inmunológico", "Dermatológico", "Musculoesquelético", "Reproductivo"
  ];

  const partsUsed = [
    "Hojas", "Corteza", "Raíz", "Flores", "Frutos", 
    "Semillas", "Resina", "Látex", "Toda la planta"
  ];

  const evidenceLevels = [
    { value: "alta", label: "Evidencia Alta" },
    { value: "moderada", label: "Evidencia Moderada" },
    { value: "baja", label: "Evidencia Baja" },
    { value: "sin-evidencia", label: "Sin Evidencia" }
  ];

  // Mock plant results
  const plants = [
    {
      id: "1",
      slug: "uña-de-gato",
      commonName: "Uña de Gato",
      scientificName: "Uncaria tomentosa",
      family: "Rubiaceae",
      summary: "Planta trepadora reconocida por sus propiedades inmunomoduladoras y antiinflamatorias, utilizada tradicionalmente para fortalecer el sistema inmune.",
      evidenceLevel: "alta" as const,
      hasInteractions: true,
      traditionalUses: ["Inmunidad", "Artritis", "Digestivo"]
    },
    {
      id: "2", 
      slug: "sangre-de-drago",
      commonName: "Sangre de Drago",
      scientificName: "Croton lechleri",
      family: "Euphorbiaceae", 
      summary: "Árbol que produce una resina rojiza con propiedades cicatrizantes y antimicrobianas, tradicionalmente usada para heridas y problemas digestivos.",
      evidenceLevel: "moderada" as const,
      hasInteractions: false,
      traditionalUses: ["Cicatrización", "Diarrea", "Heridas"]
    },
    {
      id: "3",
      slug: "copaiba",
      commonName: "Copaiba",
      scientificName: "Copaifera officinalis", 
      family: "Fabaceae",
      summary: "Árbol productor de oleorresina con propiedades antiinflamatorias y analgésicas, usado en medicina tradicional para dolores y inflamaciones.",
      evidenceLevel: "baja" as const,
      hasInteractions: false,
      traditionalUses: ["Antiinflamatorio", "Dolor", "Heridas"]
    },
    {
      id: "4",
      slug: "boldo",
      commonName: "Boldo",
      scientificName: "Peumus boldus",
      family: "Monimiaceae",
      summary: "Árbol nativo con hojas utilizadas tradicionalmente para problemas digestivos y hepáticos, con estudios que respaldan sus propiedades hepatoprotectoras.",
      evidenceLevel: "moderada" as const,
      hasInteractions: true,
      traditionalUses: ["Digestivo", "Hepático", "Digestión"]
    }
  ];

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-ui border-b py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
              Explorar Plantas Medicinales
            </h1>
            <p className="text-lg text-muted-foreground">
              Busque por nombre de planta, dolencia o síntoma
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar 
              placeholder="Buscar plantas por nombre o dolencia..."
              onSearch={setSearchQuery}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dolencias */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Dolencia o Sistema
                  </label>
                  <Select value={selectedAilment} onValueChange={setSelectedAilment}>
                    <SelectTrigger>
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
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Nivel de Evidencia
                  </label>
                  <Select value={selectedEvidence} onValueChange={setSelectedEvidence}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar evidencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {evidenceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <EvidenceBadge level={level.value as any} showIcon={false} size="sm" />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Parte Usada */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Parte de la Planta
                  </label>
                  <Select value={selectedPart} onValueChange={setSelectedPart}>
                    <SelectTrigger>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllFilters}
                    className="w-full"
                  >
                    Limpiar Filtros
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-foreground">Filtros activos:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {filter.label}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => clearFilter(filter.type)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <Separator className="mt-4" />
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-serif font-semibold text-foreground">
                  Resultados ({plants.length})
                </h2>
                <p className="text-sm text-muted-foreground">
                  Plantas medicinales amazónicas documentadas
                </p>
              </div>
              
              <Select defaultValue="relevance">
                <SelectTrigger className="w-48">
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

            {/* Results Grid */}
            {plants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plants.map((plant) => (
                  <PlantCard key={plant.id} {...plant} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <CardContent className="p-0">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif font-semibold text-lg text-foreground mb-2">
                    No se encontraron plantas
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Intente ajustar sus filtros de búsqueda o usar términos más generales
                  </p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Limpiar Filtros
                  </Button>
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