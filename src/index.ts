import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// --- INICIO: CÓDIGO FUSIONADO DE DB.TS Y SCHEMA.TS ---
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { text, sqliteTable, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// 1. Definición de las tablas (contenido de schema.ts)
export const plantsTable = sqliteTable("plants", {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    commonName: text("common_name").notNull(),
    scientificName: text("scientific_name"),
    description: text("description"),
    imageUrl: text("image_url"),
});

export const benefitsTable = sqliteTable("benefits", {
    id: text("id").primaryKey(),
    description: text("description").notNull(),
    plantId: text("plant_id").notNull().references(() => plantsTable.id, { onDelete: "cascade" }),
});

export const usageMethodsTable = sqliteTable("usage_methods", {
    id: text("id").primaryKey(),
    description: text("description").notNull(),
    plantId: text("plant_id").notNull().references(() => plantsTable.id, { onDelete: "cascade" }),
});

export const plantsRelations = relations(plantsTable, ({ many }) => ({
    benefits: many(benefitsTable),
    usageMethods: many(usageMethodsTable),
}));

export const benefitsRelations = relations(benefitsTable, ({ one }) => ({
    plant: one(plantsTable, {
        fields: [benefitsTable.plantId],
        references: [plantsTable.id],
    }),
}));

export const usageMethodsRelations = relations(usageMethodsTable, ({ one }) => ({
    plant: one(plantsTable, {
        fields: [usageMethodsTable.plantId],
        references: [plantsTable.id],
    }),
}));

// 2. Creación del cliente y conexión a la base de datos (contenido de db.ts)
const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, {
    schema: {
        plants: plantsTable,
        benefits: benefitsTable,
        usageMethods: usageMethodsTable,
        plantsRelations,
        benefitsRelations,
        usageMethodsRelations,
    },
    logger: true,
});
// --- FIN: CÓDIGO FUSIONADO ---


// --- CONFIGURACIÓN DE CLOUDINARY ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const app = express();
const PORT = 3001;

// --- MIDDLEWARE ---
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use(cors());
app.use(express.json());

// --- RUTAS DE LA API ---
app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo.' });
    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ folder: "herbario" }, (error, result) => {
                if (error) reject(error); else resolve(result);
            });
            uploadStream.end(req.file.buffer);
        });
        // @ts-expect-error
        res.json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error("Error al subir a Cloudinary:", error);
        res.status(500).json({ error: 'Error al subir la imagen.' });
    }
});

app.get("/api/plants", async (req, res) => {
    try {
        // Ahora 'db' y las tablas están definidas en este mismo archivo
        const result = await db.query.plants.findMany({ with: { benefits: true, usageMethods: true } });
        res.json(result);
    } catch (error) {
        console.error("Error en GET /api/plants:", error);
        res.status(500).json({ error: "Error al obtener las plantas" });
    }
});

app.post("/api/plants", async (req, res) => {
    const { slug, commonName, scientificName, description, imageUrl, benefits, usageMethods } = req.body;
    if (!slug || !commonName) return res.status(400).json({ error: "El slug y el nombre común son requeridos." });
    const newPlantId = randomUUID();
    try {
        await db.transaction(async (tx) => {
            await tx.insert(plantsTable).values({ id: newPlantId, slug, commonName, scientificName, description, imageUrl });
            if (benefits && Array.isArray(benefits)) {
                for (const desc of benefits) { if (desc.trim()) await tx.insert(benefitsTable).values({ id: randomUUID(), description: desc, plantId: newPlantId }); }
            }
            if (usageMethods && Array.isArray(usageMethods)) {
                for (const desc of usageMethods) { if (desc.trim()) await tx.insert(usageMethodsTable).values({ id: randomUUID(), description: desc, plantId: newPlantId }); }
            }
        });
        res.status(201).json({ message: "Planta creada exitosamente." });
    } catch (error) {
        console.error("Error en POST /api/plants:", error);
        res.status(500).json({ error: "Error al crear la planta." });
    }
});

app.put("/api/plants/:id", async (req, res) => {
    const { id } = req.params;
    const { slug, commonName, scientificName, description, imageUrl, benefits, usageMethods } = req.body;
    try {
        await db.transaction(async (tx) => {
            await tx.update(plantsTable).set({ slug, commonName, scientificName, description, imageUrl }).where(eq(plantsTable.id, id));
            await tx.delete(benefitsTable).where(eq(benefitsTable.plantId, id));
            if (benefits && Array.isArray(benefits)) {
                for (const benefit of benefits) { await tx.insert(benefitsTable).values({ id: benefit.id || randomUUID(), description: benefit.description, plantId: id }); }
            }
            await tx.delete(usageMethodsTable).where(eq(usageMethodsTable.plantId, id));
            if (usageMethods && Array.isArray(usageMethods)) {
                for (const method of usageMethods) { await tx.insert(usageMethodsTable).values({ id: method.id || randomUUID(), description: method.description, plantId: id }); }
            }
        });
        res.json({ message: "Planta actualizada exitosamente" });
    } catch (error) {
        console.error(`Error en PUT /api/plants/${id}:`, error);
        res.status(500).json({ error: "Error al actualizar la planta" });
    }
});

app.delete("/api/plants/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.delete(plantsTable).where(eq(plantsTable.id, id));
        res.json({ message: "Planta eliminada exitosamente" });
    } catch (error) {
        console.error(`Error en DELETE /api/plants/${id}:`, error);
        res.status(500).json({ error: "Error al eliminar la planta" });
    }
});


// Si no estamos en Vercel, iniciamos el servidor de forma normal.
if (process.env.VERCEL_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
    });
}

export default app;