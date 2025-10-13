import { SearchBar } from "@/components/SearchBar";
import { PlantCard } from "@/components/PlantCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Search, BookOpen, Shield, ArrowRight, Users, Award, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/parque_0.jpg";

const WhatsAppIcon = () => (
  <svg className="mr-2 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const Index = () => {
  // Mock data for demonstration
  const ailmentCategories = [
    { name: "Digestivo", count: 45, icon: "🌿" },
    { name: "Respiratorio", count: 32, icon: "🫁" },
    { name: "Cardiovascular", count: 28, icon: "❤️" },
    { name: "Nervioso", count: 23, icon: "🧠" },
    { name: "Inmunológico", count: 19, icon: "🛡️" },
    { name: "Dermatológico", count: 15, icon: "🫸" }
  ];

  const featuredPlants = [
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
      slug: "cat-s-claw",
      commonName: "Copaiba",
      scientificName: "Copaifera officinalis",
      family: "Fabaceae",
      summary: "Árbol productor de oleorresina con propiedades antiinflamatorias y analgésicas, usado en medicina tradicional para dolores y inflamaciones.",
      evidenceLevel: "baja" as const,
      hasInteractions: false,
      traditionalUses: ["Antiinflamatorio", "Dolor", "Heridas"]
    }
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-24 lg:py-32 bg-gradient-hero overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(20, 20, 20, 0.7), rgba(40, 40, 40, 0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary-foreground/10 rounded-full backdrop-blur-sm">
                <Leaf className="h-12 w-12 animate-leaf" />
              </div>
            </div>

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
          <Leaf className="h-20 w-20 text-primary-foreground animate-leaf" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Leaf className="h-16 w-16 text-primary-foreground animate-leaf" style={{ animationDelay: "1s" }} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Explorar por Categorías
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra plantas medicinales organizadas por sistema corporal y dolencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ailmentCategories.map((category, index) => (
              <Link key={category.name} to={`/buscar?dolencia=${encodeURIComponent(category.name.toLowerCase())}`}>
                <Card className="p-6 hover:shadow-botanical transition-all duration-300 hover:-translate-y-1 bg-gradient-subtle border-border/50">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{category.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-serif font-semibold text-lg text-foreground">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.count} plantas
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="py-16 bg-ui">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Plantas Destacadas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plantas medicinales con mayor respaldo científico y documentación completa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredPlants.map((plant) => (
              <PlantCard key={plant.id} {...plant} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="botanical" size="lg">
              <Link to="/buscar">
                Ver Todas las Plantas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
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
