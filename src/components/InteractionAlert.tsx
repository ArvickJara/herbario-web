import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, XCircle } from "lucide-react";

interface InteractionAlertProps {
  severity: "alta" | "moderada" | "baja";
  interactions: Array<{
    drugName: string;
    mechanism?: string;
    recommendation: string;
  }>;
}

const severityConfig = {
  "alta": {
    icon: XCircle,
    className: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
    title: "⚠️ Interacciones de Alto Riesgo"
  },
  "moderada": {
    icon: AlertTriangle,
    className: "border-orange-500/50 text-orange-700 dark:border-orange-500 [&>svg]:text-orange-600",
    title: "⚠️ Interacciones Moderadas"
  },
  "baja": {
    icon: Info,
    className: "border-blue-500/50 text-blue-700 dark:border-blue-500 [&>svg]:text-blue-600",
    title: "ℹ️ Precauciones Menores"
  }
};

export function InteractionAlert({ severity, interactions }: InteractionAlertProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Alert className={config.className}>
      <Icon className="h-4 w-4" />
      <AlertTitle className="font-serif font-semibold">
        {config.title}
      </AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          {interactions.map((interaction, index) => (
            <div key={index} className="border-l-2 border-current/20 pl-3">
              <p className="font-medium">{interaction.drugName}</p>
              {interaction.mechanism && (
                <p className="text-sm opacity-80">Mecanismo: {interaction.mechanism}</p>
              )}
              <p className="text-sm font-medium mt-1">
                Recomendación: {interaction.recommendation}
              </p>
            </div>
          ))}
        </div>
        
        {severity === "alta" && (
          <p className="mt-3 text-sm font-medium bg-destructive/10 p-2 rounded">
            <strong>Importante:</strong> Consulte con su médico antes de usar esta planta 
            si está tomando alguno de estos medicamentos.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}