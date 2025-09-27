import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle, HelpCircle } from "lucide-react";

interface EvidenceBadgeProps {
  level: "alta" | "moderada" | "baja" | "sin-evidencia";
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
}

const evidenceConfig = {
  "alta": {
    label: "Evidencia Alta",
    description: "Estudios clínicos controlados",
    icon: CheckCircle,
    className: "bg-primary text-primary-foreground"
  },
  "moderada": {
    label: "Evidencia Moderada", 
    description: "Estudios observacionales",
    icon: AlertCircle,
    className: "bg-secondary text-secondary-foreground"
  },
  "baja": {
    label: "Evidencia Baja",
    description: "Estudios in vitro/animales",
    icon: HelpCircle,
    className: "bg-accent text-accent-foreground"
  },
  "sin-evidencia": {
    label: "Sin Evidencia",
    description: "Solo uso tradicional",
    icon: XCircle,
    className: "bg-muted text-muted-foreground"
  }
};

export function EvidenceBadge({ level, showIcon = true, size = "default" }: EvidenceBadgeProps) {
  const config = evidenceConfig[level];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    default: "text-sm",
    lg: "text-base px-4 py-2"
  };

  return (
    <Badge 
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1`}
      title={config.description}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}