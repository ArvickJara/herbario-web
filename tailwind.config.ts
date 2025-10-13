import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          soft: "hsl(var(--primary-soft))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light: "hsl(var(--secondary-light))",
          soft: "hsl(var(--secondary-soft))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          light: "hsl(var(--accent-light))",
          soft: "hsl(var(--accent-soft))",
        },
        // Colores temáticos del herbario
        forest: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--primary-light))",
          soft: "hsl(var(--primary-soft))",
        },
        earth: {
          DEFAULT: "hsl(var(--secondary))",
          light: "hsl(var(--secondary-light))",
          soft: "hsl(var(--secondary-soft))",
        },
        gold: {
          DEFAULT: "hsl(var(--accent))",
          light: "hsl(var(--accent-light))",
          soft: "hsl(var(--accent-soft))",
        },
        ui: {
          DEFAULT: "hsl(var(--ui-background))",
          foreground: "hsl(var(--ui-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "leaf": "gentle-sway 3s ease-in-out infinite",
        "glow": "gentle-glow 2s ease-in-out infinite alternate",
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-forest': 'var(--gradient-forest)',
        'gradient-earth': 'var(--gradient-earth)',
        'gradient-subtle': 'var(--gradient-subtle)',
        // Gradientes adicionales para variedad
        'gradient-leaf': 'linear-gradient(135deg, hsl(var(--primary-soft)), hsl(var(--primary)))',
        'gradient-sunset': 'linear-gradient(135deg, hsl(var(--accent-soft)), hsl(var(--accent)))',
        'gradient-moss': 'linear-gradient(180deg, hsl(var(--primary-light)), hsl(var(--secondary)))',
        'shimmer': 'linear-gradient(90deg, transparent 30%, hsl(var(--accent) / 0.1) 50%, transparent 70%)',
      },
      fontFamily: {
        'serif': 'var(--font-serif)',
        'sans': 'var(--font-sans)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'botanical': 'var(--shadow-botanical)',
        'glow': 'var(--shadow-glow)',
        'earth': 'var(--shadow-earth)',
        // Sombras específicas para componentes
        'card-hover': '0 8px 25px hsl(var(--primary) / 0.08), 0 3px 10px hsl(var(--primary) / 0.04)',
        'button-hover': '0 6px 20px hsl(var(--accent) / 0.15), 0 2px 8px hsl(var(--accent) / 0.08)',
        'nature': '0 4px 15px hsl(var(--primary) / 0.12), 0 2px 6px hsl(var(--secondary) / 0.08)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
