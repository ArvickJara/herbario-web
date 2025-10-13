import { SearchBar } from "@/components/SearchBar";
import { PlantCard } from "@/components/PlantCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Search, BookOpen, Shield, ArrowRight, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-amazon-plants.jpg";

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
          backgroundImage: `linear-gradient(135deg, rgba(27, 94, 85, 0.8), rgba(42, 111, 151, 0.8)), url(${heroImage})`,
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
    </div>
  );
};

export default Index;
