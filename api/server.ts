import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { db, plantsTable, benefitsTable, usageMethodsTable } from "./db.ts";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// --- CONFIGURACIÓN DE CLOUDINARY ---
// Las variables de entorno se cargan automáticamente por Vercel en producción
// y por el comando `npm run api` que debería usar `dotenv` o un flag.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const app = express();
const PORT = 3001;

// --- CONFIGURACIÓN DE MULTER (para manejar el archivo en memoria) ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- RUTA PARA SUBIR IMÁGENES A CLOUDINARY ---
app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo.' });
    }

    try {
        // Sube el buffer de la imagen a Cloudinary
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "herbario" }, // Opcional: crea una carpeta en Cloudinary
                (error, result: UploadApiResponse | undefined) => {
                    if (error) reject(error);
                    else if (result) resolve(result);
                    else reject(new Error("No se recibió respuesta de Cloudinary"));
                }
            );
            uploadStream.end(req.file.buffer);
        });

        res.json({ imageUrl: result.secure_url }); // Devuelve la URL segura y permanente
    } catch (error) {
        console.error("Error al subir a Cloudinary:", error);
        res.status(500).json({ error: 'Error al subir la imagen.' });
    }
});


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
    const { slug, commonName, scientificName, description, imageUrl, benefits, usageMethods } = req.body;
    if (!slug || !commonName) {
        return res.status(400).json({ error: "El slug y el nombre común son requeridos." });
    }
    const newPlantId = randomUUID();
    try {
        await db.transaction(async (tx) => {
            await tx.insert(plantsTable).values({ id: newPlantId, slug, commonName, scientificName, description, imageUrl });
            if (benefits && Array.isArray(benefits)) {
                for (const benefitDescription of benefits) {
                    if (benefitDescription.trim() !== '') {
                        await tx.insert(benefitsTable).values({ id: randomUUID(), description: benefitDescription, plantId: newPlantId });
                    }
                }
            }
            if (usageMethods && Array.isArray(usageMethods)) {
                for (const usageMethodDescription of usageMethods) {
                    if (usageMethodDescription.trim() !== '') {
                        await tx.insert(usageMethodsTable).values({ id: randomUUID(), description: usageMethodDescription, plantId: newPlantId });
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
            await tx.update(plantsTable).set({ slug, commonName, scientificName, description, imageUrl }).where(eq(plantsTable.id, id));
            await tx.delete(benefitsTable).where(eq(benefitsTable.plantId, id));
            if (benefits && Array.isArray(benefits)) {
                for (const benefit of benefits) {
                    await tx.insert(benefitsTable).values({ id: benefit.id || randomUUID(), description: benefit.description, plantId: id });
                }
            }
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
    const plantsData = req.body;
    let count = 0;
    try {
        for (const plant of plantsData) {
            const { id, slug, commonName, scientificName, Descripción, "Beneficios medicinales y respaldo científico": beneficios, "Modo de uso": modoDeUso } = plant;
            if (!slug || !commonName) continue;
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