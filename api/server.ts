import express from "express";
import cors from "cors";
import { db, plantsTable, benefitsTable, usageMethodsTable } from "./db.ts";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// --- OBTENER TODAS LAS PLANTAS (con sus relaciones) ---
app.get("/api/plants", async (req, res) => {
    try {
        const result = await db.query.plants.findMany({
            with: {
                benefits: true,
                usageMethods: true,
            },
        });
        res.json(result);
    } catch (error) {
        console.error("Error en GET /api/plants:", error);
        res.status(500).json({ error: "Error al obtener las plantas" });
    }
});


// --- AÑADIR UNA NUEVA PLANTA (Desde el formulario del Admin) ---
app.post("/api/plants", async (req, res) => {
    // El frontend enviará un objeto con esta estructura
    const { slug, commonName, scientificName, description, imageUrl, benefits, usageMethods } = req.body;

    if (!slug || !commonName) {
        return res.status(400).json({ error: "El slug y el nombre común son requeridos." });
    }

    const newPlantId = randomUUID();

    try {
        await db.transaction(async (tx) => {
            // 1. Insertar la planta principal
            await tx.insert(plantsTable).values({
                id: newPlantId,
                slug,
                commonName,
                scientificName,
                description,
                imageUrl,
            });

            // 2. Insertar los beneficios (que vienen como un array de strings)
            if (benefits && Array.isArray(benefits)) {
                for (const benefitDescription of benefits) {
                    if (benefitDescription.trim() !== '') {
                        await tx.insert(benefitsTable).values({
                            id: randomUUID(),
                            description: benefitDescription,
                            plantId: newPlantId,
                        });
                    }
                }
            }

            // 3. Insertar los modos de uso (que vienen como un array de strings)
            if (usageMethods && Array.isArray(usageMethods)) {
                for (const usageMethodDescription of usageMethods) {
                    if (usageMethodDescription.trim() !== '') {
                        await tx.insert(usageMethodsTable).values({
                            id: randomUUID(),
                            description: usageMethodDescription,
                            plantId: newPlantId,
                        });
                    }
                }
            }
        });
        res.status(201).json({ message: "Planta creada exitosamente." });
    } catch (error) {
        console.error("Error en POST /api/plants:", error);
        res.status(500).json({ error: "Error al crear la planta." });
    }
});


// --- ACTUALIZAR UNA PLANTA ---
app.put("/api/plants/:id", async (req, res) => {
    const { id } = req.params;
    const { slug, commonName, scientificName, description, imageUrl, benefits, usageMethods } = req.body;

    try {
        await db.transaction(async (tx) => {
            // 1. Actualizar la planta principal
            await tx.update(plantsTable).set({ slug, commonName, scientificName, description, imageUrl }).where(eq(plantsTable.id, id));

            // 2. Borrar y re-insertar beneficios
            await tx.delete(benefitsTable).where(eq(benefitsTable.plantId, id));
            if (benefits && Array.isArray(benefits)) {
                for (const benefit of benefits) {
                    await tx.insert(benefitsTable).values({ id: benefit.id || randomUUID(), description: benefit.description, plantId: id });
                }
            }

            // 3. Borrar y re-insertar modos de uso
            await tx.delete(usageMethodsTable).where(eq(usageMethodsTable.plantId, id));
            if (usageMethods && Array.isArray(usageMethods)) {
                for (const method of usageMethods) {
                    await tx.insert(usageMethodsTable).values({ id: method.id || randomUUID(), description: method.description, plantId: id });
                }
            }
        });
        res.json({ message: "Planta actualizada exitosamente" });
    } catch (error) {
        console.error(`Error en PUT /api/plants/${id}:`, error);
        res.status(500).json({ error: "Error al actualizar la planta" });
    }
});


// --- ELIMINAR UNA PLANTA ---
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


// --- RUTA ESPECIAL PARA MIGRAR DATOS DESDE EL JSON ---
app.post("/api/migrate-from-json", async (req, res) => {
    const plantsData = req.body; // El frontend enviará el contenido del JSON
    let count = 0;
    try {
        for (const plant of plantsData) {
            const { id, slug, commonName, scientificName, Descripción, "Beneficios medicinales y respaldo científico": beneficios, "Modo de uso": modoDeUso } = plant;
            if (!slug || !commonName) continue; // Ignorar datos inválidos

            await db.transaction(async (tx) => {
                await tx.insert(plantsTable).values({ id, slug, commonName, scientificName: scientificName || '', description: Descripción || '', imageUrl: null }).onConflictDoNothing();
                if (beneficios && typeof beneficios === 'object') {
                    for (const [key, value] of Object.entries(beneficios)) {
                        await tx.insert(benefitsTable).values({ id: randomUUID(), description: `${key}: ${value}`, plantId: id }).onConflictDoNothing();
                    }
                }
                if (modoDeUso && typeof modoDeUso === 'object') {
                    for (const [key, value] of Object.entries(modoDeUso)) {
                        await tx.insert(usageMethodsTable).values({ id: randomUUID(), description: `${key}: ${value}`, plantId: id }).onConflictDoNothing();
                    }
                }
            });
            count++;
        }
        res.status(200).json({ message: `${count} plantas procesadas para migración.` });
    } catch (error) {
        console.error("Error en la migración masiva:", error);
        res.status(500).json({ error: "Ocurrió un error durante la migración masiva." });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
});