import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import dotenv from "dotenv";

// Carga las variables de entorno desde .env.local
dotenv.config({ path: ".env.local" });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
    throw new Error("La variable de entorno TURSO_DATABASE_URL no está definida.");
}

// --- TABLA PRINCIPAL DE PLANTAS ---
export const plantsTable = sqliteTable('plants', {
    id: text('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    commonName: text('commonName').notNull(),
    scientificName: text('scientificName'),
    description: text('description'),
    // NUEVO CAMPO: URL para la imagen de la planta
    imageUrl: text('image_url'),
});

// --- NUEVA TABLA PARA BENEFICIOS ---
export const benefitsTable = sqliteTable('benefits', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    // Llave foránea para conectar con la planta
    plantId: text('plant_id').notNull().references(() => plantsTable.id, { onDelete: 'cascade' }),
});

// --- NUEVA TABLA PARA MÉTODOS DE USO ---
export const usageMethodsTable = sqliteTable('usage_methods', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    // Llave foránea para conectar con la planta
    plantId: text('plant_id').notNull().references(() => plantsTable.id, { onDelete: 'cascade' }),
});

// --- DEFINICIÓN DE RELACIONES (Uno a Muchos) ---
export const plantRelations = relations(plantsTable, ({ many }) => ({
    benefits: many(benefitsTable),
    usageMethods: many(usageMethodsTable),
}));

export const benefitRelations = relations(benefitsTable, ({ one }) => ({
    plant: one(plantsTable, {
        fields: [benefitsTable.plantId],
        references: [plantsTable.id],
    }),
}));

export const usageMethodRelations = relations(usageMethodsTable, ({ one }) => ({
    plant: one(plantsTable, {
        fields: [usageMethodsTable.plantId],
        references: [plantsTable.id],
    }),
}));


const turso = createClient({
    url,
    authToken,
});

// Exportamos el cliente de Drizzle con el nuevo esquema relacional
export const db = drizzle(turso, {
    schema: {
        plants: plantsTable,
        benefits: benefitsTable,
        usageMethods: usageMethodsTable,
        plantRelations,
        benefitRelations,
        usageMethodRelations,
    }
});