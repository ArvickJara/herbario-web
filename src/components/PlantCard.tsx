import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface PlantCardProps {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  family: string;
  summary: string;
  imageUrl?: string;
  evidenceLevel: "alta" | "moderada" | "baja" | "sin-evidencia";
  hasInteractions?: boolean;
  traditionalUses: string[];
}

const evidenceColors = {
  "alta": "bg-primary text-primary-foreground",
  "moderada": "bg-secondary text-secondary-foreground", 
  "baja": "bg-accent text-accent-foreground",
  "sin-evidencia": "bg-muted text-muted-foreground"
};

const evidenceLabels = {
  "alta": "Evidencia Alta",
  "moderada": "Evidencia Moderada",
  "baja": "Evidencia Baja", 
  "sin-evidencia": "Sin Evidencia"
};

export function PlantCard({
  id,
  slug,
  commonName,
  scientificName,
  family,
  summary,
  imageUrl,
  evidenceLevel,
  hasInteractions,
  traditionalUses
}: PlantCardProps) {
  return (
    <Link to={`/plantas/${slug}`} className="group block">
      <Card className="h-full transition-all duration-300 hover:shadow-botanical hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${commonName} - ${scientificName}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-forest flex items-center justify-center">
              <Leaf className="h-12 w-12 text-primary-foreground/70 animate-leaf" />
            </div>
          )}
          
          {hasInteractions && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Interacciones
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {commonName}
              </h3>
              <p className="text-sm text-muted-foreground italic">
                {scientificName}
              </p>
              <p className="text-xs text-muted-foreground">
                Familia: {family}
              </p>
            </div>
            
            <Badge className={evidenceColors[evidenceLevel]}>
              <CheckCircle className="h-3 w-3 mr-1" />
              {evidenceLabels[evidenceLevel]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
            {summary}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {traditionalUses.slice(0, 3).map((use, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {use}
              </Badge>
            ))}
            {traditionalUses.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{traditionalUses.length - 3} más
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}