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

const PlantaDetalle = () => {
  const { slug } = useParams();

  // Mock data - en una app real vendría de API
  const plant = {
    id: "1",
    slug: "uña-de-gato",
    commonName: "Uña de Gato", 
    scientificName: "Uncaria tomentosa",
    family: "Rubiaceae",
    summary: "Planta trepadora reconocida por sus propiedades inmunomoduladoras y antiinflamatorias, utilizada tradicionalmente para fortalecer el sistema inmune y tratar diversos procesos inflamatorios.",
    description: "La Uña de Gato es una liana trepadora nativa de la selva amazónica que puede alcanzar hasta 30 metros de altura. Debe su nombre a las espinas curvadas que utiliza para trepar por los árboles. Ha sido utilizada durante siglos por las comunidades indígenas amazónicas, especialmente los Asháninka y Shipibo, quienes la consideran una planta sagrada y la llaman 'Samento'.",
    imageUrl: samplePlantImage,
    evidenceLevel: "alta" as const,
    hasInteractions: true,
    
    traditionalUses: [
      {
        ailment: "Fortalecimiento del sistema inmune",
        partUsed: "Corteza interna",
        preparation: "Decocción o tintura",
        dosage: "2-3 tazas de té al día o 20-30 gotas de tintura 3 veces al día",
        notes: "Uso tradicional por comunidades Asháninka para prevenir enfermedades"
      },
      {
        ailment: "Artritis y dolores articulares",
        partUsed: "Corteza y raíz",
        preparation: "Decocción concentrada",
        dosage: "1 taza 2 veces al día por 2-3 semanas",
        notes: "Aplicación tópica en combinación con uso interno"
      },
      {
        ailment: "Problemas digestivos",
        partUsed: "Corteza",
        preparation: "Infusión suave",
        dosage: "1 taza después de las comidas",
        notes: "Tradicionalmente usado para gastritis y úlceras"
      }
    ],

    scientificEvidence: [
      {
        claim: "Actividad inmunomoduladora",
        evidenceLevel: "alta" as const,
        citation: "Sheng Y, et al. Treatment of chemotherapy-induced leukopenia in a rat model with aqueous extract from Uncaria tomentosa. Phytomedicine. 2000;7(2):137-43.",
        summary: "Estudios clínicos muestran mejora significativa en marcadores inmunológicos en pacientes con cáncer."
      },
      {
        claim: "Efectos antiinflamatorios",
        evidenceLevel: "alta" as const,
        citation: "Piscoya J, et al. Efficacy and safety of freeze-dried cat's claw in osteoarthritis of the knee. Inflammopharmacology. 2001;9(1-2):75-81.",
        summary: "Ensayo controlado aleatorio demostró reducción del dolor articular y mejora de la movilidad."
      },
      {
        claim: "Actividad antioxidante",
        evidenceLevel: "moderada" as const,
        citation: "Gonçalves C, et al. Antioxidant properties of proanthocyanidins of Uncaria tomentosa bark decoction. Phytochemistry. 2005;66(1):89-98.",
        summary: "Estudios in vitro confirman potente actividad antioxidante de los compuestos fenólicos."
      }
    ],

    precautions: [
      "No usar durante el embarazo y lactancia",
      "Evitar en pacientes con trasplantes de órganos",
      "Suspender 2 semanas antes de cirugías",
      "Puede causar mareos o náuseas en dosis altas",
      "No recomendado en niños menores de 3 años",
      "Supervisión médica necesaria en tratamientos prolongados"
    ],

    interactions: [
      {
        drugName: "Inmunosupresores (ciclosporina, tacrolimus)",
        severity: "alta" as const,
        mechanism: "Potenciación de efectos inmunomoduladores",
        recommendation: "Contraindicado. Evitar uso conjunto."
      },
      {
        drugName: "Anticoagulantes (warfarina)",
        severity: "moderada" as const,
        mechanism: "Posible potenciación del efecto anticoagulante",
        recommendation: "Monitoreo estrecho de INR. Consultar con médico."
      },
      {
        drugName: "Antihipertensivos",
        severity: "baja" as const,
        mechanism: "Posible efecto hipotensor aditivo",
        recommendation: "Monitoreo de presión arterial. Ajustar dosis si es necesario."
      }
    ]
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