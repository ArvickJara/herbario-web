import { Link } from "react-router-dom";
import { Leaf, Mail, AlertTriangle, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ui border-t-2">
      <div className="container py-12">
        {/* Disclaimer destacado */}
        <div className="mb-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-accent-foreground mb-1">
                Descargo de Responsabilidad Médica
              </p>
              <p className="text-muted-foreground">
                La información en este sitio es solo educativa. No reemplaza el consejo médico profesional.
                Consulte siempre a su médico antes de usar plantas medicinales, especialmente si toma medicamentos
                o tiene condiciones médicas.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">

              <span className="font-serif font-semibold text-lg text-primary">
                Herbario Amazónico
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Documentando y validando el conocimiento tradicional de plantas medicinales
              amazónicas con respaldo científico para educar y prevenir riesgos.
            </p>
          </div>

          {/* Enlaces */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-foreground">Enlaces</h4>
            <nav className="space-y-2">
              <Link
                to="/"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Inicio
              </Link>
              <Link
                to="/buscar"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Explorar Plantas
              </Link>
              <Link
                to="/acerca"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Acerca del Proyecto
              </Link>
            </nav>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-foreground">Contacto</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>espinozanicky20@gmail.com</span>

              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+51 927 459 843 </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Para sugerencias, correcciones o colaboraciones académicas.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © 2024 Herbario Amazónico. Proyecto universitario de investigación.
          </p>
        </div>
      </div>
    </footer>
  );
}