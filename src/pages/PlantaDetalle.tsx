import { useParams, Link } from "react-router-dom";
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
  ExternalLink
} from "lucide-react";
import samplePlantImage from "@/assets/sample-plant.jpg";
import plantsData from "@/data/plants_parsed.json";

const PlantaDetalle = () => {
  const { slug } = useParams();

  // Buscar la planta en el JSON
  const plantData = plantsData.find(plant => plant.slug === slug);

  // Si no se encuentra la planta, mostrar mensaje
  if (!plantData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-serif font-bold mb-4">Planta no encontrada</h2>
            <p className="text-muted-foreground mb-6">
              No se encontró información sobre la planta solicitada.
            </p>
            <Button asChild>
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

  // Transformar datos del JSON al formato de la vista
  const plant = {
    id: plantData.id,
    slug: plantData.slug,
    commonName: plantData.commonName,
    scientificName: plantData.scientificName,
    family: "",
    summary: plantData.Descripción || "",
    description: plantData.Descripción || "",
    imageUrl: samplePlantImage,
    evidenceLevel: "moderada" as const,
    hasInteractions: false,

    traditionalUses: Object.entries(plantData["Beneficios medicinales y respaldo científico"] || {}).map(([ailment, description]) => {
      const modoUso = Object.entries(plantData["Modo de uso"] || {}).find(([key]) =>
        ailment.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(ailment.toLowerCase())
      );

      return {
        ailment,
        partUsed: modoUso ? modoUso[0] : "No especificado",
        preparation: modoUso ? modoUso[1] : "No especificado",
        dosage: "Consultar con profesional de la salud",
        notes: description
      };
    }),

    scientificEvidence: Object.entries(plantData["Beneficios medicinales y respaldo científico"] || {}).map(([claim, summary]) => ({
      claim,
      evidenceLevel: "moderada" as const,
      citation: "Ver referencias científicas",
      summary
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-ui border-b py-8">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/buscar">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Explorar
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plant Image */}
            <div className="lg:col-span-1">
              <div className="aspect-square rounded-lg overflow-hidden bg-gradient-forest">
                <img
                  src={plant.imageUrl}
                  alt={`${plant.commonName} - ${plant.scientificName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Plant Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                      {plant.commonName}
                    </h1>
                    <p className="text-xl text-muted-foreground italic mb-1">
                      {plant.scientificName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Familia: {plant.family}
                    </p>
                  </div>
                  <EvidenceBadge level={plant.evidenceLevel} size="lg" />
                </div>

                <p className="text-lg text-foreground/80 leading-relaxed">
                  {plant.summary}
                </p>
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
      <section className="py-8">
        <div className="container">
          <Tabs defaultValue="resumen" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="resumen" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Resumen</span>
              </TabsTrigger>
              <TabsTrigger value="usos" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                <span className="hidden sm:inline">Usos</span>
              </TabsTrigger>
              <TabsTrigger value="evidencia" className="flex items-center gap-2">
                <Microscope className="h-4 w-4" />
                <span className="hidden sm:inline">Evidencia</span>
              </TabsTrigger>
              <TabsTrigger value="precauciones" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Precauciones</span>
              </TabsTrigger>
              <TabsTrigger value="interacciones" className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                <span className="hidden sm:inline">Interacciones</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resumen" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Descripción General
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed">
                    {plant.description}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información Botánica</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Nombre común:</span>
                      <span>{plant.commonName}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium">Nombre científico:</span>
                      <span className="italic">{plant.scientificName}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium">Familia:</span>
                      <span>{plant.family}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Evidencia:</span>
                      <EvidenceBadge level={plant.evidenceLevel} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Usos Principales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {plant.traditionalUses.slice(0, 3).map((use, index) => (
                        <Badge key={index} variant="secondary" className="block text-center">
                          {use.ailment}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="usos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    Usos Tradicionales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {plant.traditionalUses.map((use, index) => (
                      <div key={index} className="border-l-4 border-primary/30 pl-4 space-y-2">
                        <h4 className="font-serif font-semibold text-lg text-primary">
                          {use.ailment}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Parte usada:</span> {use.partUsed}
                          </div>
                          <div>
                            <span className="font-medium">Preparación:</span> {use.preparation}
                          </div>
                          <div>
                            <span className="font-medium">Dosificación:</span> {use.dosage}
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Notas:</span> {use.notes}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evidencia" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-primary" />
                    Evidencia Científica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {plant.scientificEvidence.map((evidence, index) => (
                      <div key={index} className="space-y-3 p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between">
                          <h4 className="font-serif font-semibold text-lg text-foreground">
                            {evidence.claim}
                          </h4>
                          <EvidenceBadge level={evidence.evidenceLevel} />
                        </div>
                        <p className="text-foreground/80">
                          {evidence.summary}
                        </p>
                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                          <div className="flex items-start gap-2">
                            <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <cite className="italic">{evidence.citation}</cite>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="precauciones" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Precauciones y Contraindicaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plant.precautions.map((precaution, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <p className="text-foreground/80">{precaution}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-foreground/80">
                      <strong>Importante:</strong> Esta información no sustituye el consejo médico profesional.
                      Siempre consulte con un profesional de la salud antes de usar plantas medicinales,
                      especialmente si tiene condiciones médicas preexistentes o está tomando medicamentos.
                    </p>
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