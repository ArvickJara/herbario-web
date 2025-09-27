import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  BookOpen, 
  Shield, 
  Users, 
  Award,
  AlertTriangle,
  Mail,
  ExternalLink,
  Heart,
  Target,
  Eye,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";

const Acerca = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 text-primary-foreground">
        <div className="container text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-foreground/10 rounded-full backdrop-blur-sm">
              <Leaf className="h-12 w-12 animate-leaf" />
            </div>
          </div>
          
          <h1 className="text-4xl font-serif font-bold mb-6">
            Acerca del Herbario Amazónico
          </h1>
          
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Una plataforma educativa que documenta, valida y difunde el conocimiento tradicional 
            de plantas medicinales amazónicas con respaldo científico y enfoque preventivo.
          </p>
        </div>
      </section>

      <div className="container py-12 space-y-12">
        {/* Mission, Vision, Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center bg-gradient-subtle border-border/50">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="font-serif">Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Preservar y validar el conocimiento ancestral de plantas medicinales amazónicas 
                mediante documentación científica rigurosa, promoviendo su uso seguro y responsable.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-subtle border-border/50">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-secondary/10 rounded-full">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <CardTitle className="font-serif">Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Ser la referencia mundial en documentación científica de plantas medicinales amazónicas, 
                conectando sabiduría ancestral con evidencia moderna.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-subtle border-border/50">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
              </div>
              <CardTitle className="font-serif">Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Respeto por las comunidades indígenas, rigor científico, transparencia, 
                accesibilidad educativa y promoción del uso seguro de plantas medicinales.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Objetivos */}
        <section>
          <h2 className="text-3xl font-serif font-bold text-center mb-8">Nuestros Objetivos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h3 className="font-serif font-semibold text-lg">Educar</h3>
                </div>
                <p className="text-foreground/80">
                  Proporcionar información confiable sobre usos tradicionales, evidencia científica 
                  y preparaciones de plantas medicinales amazónicas.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-secondary" />
                  <h3 className="font-serif font-semibold text-lg">Prevenir</h3>
                </div>
                <p className="text-foreground/80">
                  Alertar sobre interacciones medicamentosas, precauciones y contraindicaciones 
                  para prevenir riesgos de automedicación.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-accent" />
                  <h3 className="font-serif font-semibold text-lg">Preservar</h3>
                </div>
                <p className="text-foreground/80">
                  Documentar y conservar el conocimiento tradicional de comunidades indígenas 
                  y locales amazónicas para futuras generaciones.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-earth" />
                  <h3 className="font-serif font-semibold text-lg">Validar</h3>
                </div>
                <p className="text-foreground/80">
                  Correlacionar usos tradicionales con evidencia científica disponible, 
                  clasificando los niveles de evidencia de manera transparente.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 md:col-span-2">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-6 w-6 text-primary" />
                  <h3 className="font-serif font-semibold text-lg">Conectar</h3>
                </div>
                <p className="text-foreground/80">
                  Facilitar el diálogo entre medicina tradicional y occidental, promoviendo 
                  colaboración entre curanderos tradicionales, investigadores y profesionales de la salud.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Metodología */}
        <section>
          <h2 className="text-3xl font-serif font-bold text-center mb-8">Nuestra Metodología</h2>
          
          <Card className="p-6">
            <CardContent className="p-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-serif font-semibold text-xl mb-4 text-primary">
                    Documentación Etnobotánica
                  </h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li>• Entrevistas con curanderos y conocedores tradicionales</li>
                    <li>• Registro de preparaciones, dosificaciones y aplicaciones</li>
                    <li>• Documentación de contexto cultural y ceremonial</li>
                    <li>• Verificación botánica por taxonomistas especializados</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-serif font-semibold text-xl mb-4 text-secondary">
                    Validación Científica
                  </h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li>• Revisión sistemática de literatura científica</li>
                    <li>• Clasificación de evidencia (in vitro, animal, clínica)</li>
                    <li>• Análisis de composición química y principios activos</li>
                    <li>• Evaluación de seguridad y toxicidad</li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-serif font-semibold text-xl mb-4 text-accent">
                  Niveles de Evidencia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <Badge className="mb-2 bg-primary text-primary-foreground">Alta</Badge>
                    <p className="text-sm">Estudios clínicos controlados y metaanálisis</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                    <Badge className="mb-2 bg-secondary text-secondary-foreground">Moderada</Badge>
                    <p className="text-sm">Estudios observacionales y casos clínicos</p>
                  </div>
                  <div className="text-center p-3 bg-accent/5 rounded-lg border border-accent/20">
                    <Badge className="mb-2 bg-accent text-accent-foreground">Baja</Badge>
                    <p className="text-sm">Estudios in vitro y en modelos animales</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg border border-muted">
                    <Badge className="mb-2 bg-muted text-muted-foreground">Sin Evidencia</Badge>
                    <p className="text-sm">Solo uso tradicional documentado</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Disclaimer Legal */}
        <section>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                Descargo de Responsabilidad Médica y Legal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-foreground/80">
                <p>
                  <strong>Propósito Educativo:</strong> La información contenida en este herbario tiene 
                  exclusivamente fines educativos e informativos. No constituye consejo médico, 
                  diagnóstico o tratamiento profesional.
                </p>
                
                <p>
                  <strong>No Sustituto Médico:</strong> Esta plataforma NO reemplaza la consulta, 
                  diagnóstico o tratamiento médico profesional. Siempre consulte a un profesional 
                  de la salud calificado antes de usar plantas medicinales.
                </p>
                
                <p>
                  <strong>Riesgos de Automedicación:</strong> El uso inadecuado de plantas medicinales 
                  puede ser peligroso. Pueden existir interacciones con medicamentos, alergias, 
                  contraindicaciones o efectos adversos no documentados.
                </p>
                
                <p>
                  <strong>Variabilidad Individual:</strong> Los efectos de las plantas medicinales 
                  pueden variar significativamente entre individuos según edad, estado de salud, 
                  medicamentos concurrentes y otros factores.
                </p>
                
                <p>
                  <strong>Información en Desarrollo:</strong> El conocimiento científico sobre plantas 
                  medicinales está en constante evolución. La información puede no estar completa 
                  o puede cambiar con nuevos estudios.
                </p>
                
                <p>
                  <strong>Limitación de Responsabilidad:</strong> Los autores y mantenedores de 
                  esta plataforma no se hacen responsables por cualquier daño, lesión o consecuencia 
                  adversa resultante del uso de la información aquí contenida.
                </p>
              </div>
              
              <div className="p-4 bg-background border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  IMPORTANTE: En caso de emergencia médica, busque atención médica inmediata. 
                  No utilice plantas medicinales como sustituto de tratamientos médicos urgentes.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contacto y Colaboración */}
        <section>
          <h2 className="text-3xl font-serif font-bold text-center mb-8">Colaboración y Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  <h3 className="font-serif font-semibold text-lg">Contacto Académico</h3>
                </div>
                <p className="text-foreground/80">
                  Investigadores, estudiantes y profesionales de la salud pueden contactarnos 
                  para colaboraciones, sugerencias de mejora o reportar errores en la información.
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>📧 info@herbarioamazonico.org</p>
                  <p>📧 investigacion@herbarioamazonico.org</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-secondary" />
                  <h3 className="font-serif font-semibold text-lg">Comunidades Indígenas</h3>
                </div>
                <p className="text-foreground/80">
                  Valoramos profundamente el conocimiento ancestral. Si pertenece a una comunidad 
                  indígena y desea colaborar o tiene observaciones sobre el contenido, contáctenos.
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>📧 comunidades@herbarioamazonico.org</p>
                  <p>🌐 Disponible en español, portugués y quechua</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="botanical" size="lg">
              <Link to="/buscar">
                <Search className="mr-2 h-5 w-5" />
                Comenzar a Explorar
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Acerca;