// api/server.ts

import express from "express";
import cors from "cors";
// FIX: Add the '.ts' extension to the import path
import { turso } from "../src/lib/db/turso.ts";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// ... (el resto de tu código de la API se mantiene igual) ...

// RUTA PARA OBTENER TODAS LAS PLANTAS (Read)
app.get("/api/plants", async (req, res) => {
    try {
        const result = await turso.execute("SELECT * FROM plants");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las plantas" });
    }
});

// RUTA PARA CREAR UNA PLANTA (Create)
app.post("/api/plants", async (req, res) => {
    const { slug, commonName, scientificName, Descripción, beneficios, modoDeUso } = req.body;

    if (!commonName || !scientificName) {
        return res.status(400).json({ error: "Nombre común y científico son requeridos." });
    }

    try {
        await turso.execute({
            sql: "INSERT INTO plants (id, slug, commonName, scientificName, Descripción, beneficios, modoDeUso) VALUES (?, ?, ?, ?, ?, ?, ?)",
            args: [
                Date.now().toString(),
                slug,
                commonName,
                scientificName,
                Descripción,
                JSON.stringify(beneficios),
                JSON.stringify(modoDeUso),
            ],
        });
        res.status(201).json({ message: "Planta creada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la planta" });
    }
});

// RUTA PARA ACTUALIZAR UNA PLANTA (Update)
app.put("/api/plants/:id", async (req, res) => {
    const { id } = req.params;
    const { slug, commonName, scientificName, Descripción, beneficios, modoDeUso } = req.body;

    try {
        await turso.execute({
            sql: "UPDATE plants SET slug = ?, commonName = ?, scientificName = ?, Descripción = ?, beneficios = ?, modoDeUso = ? WHERE id = ?",
            args: [slug, commonName, scientificName, Descripción, JSON.stringify(beneficios), JSON.stringify(modoDeUso), id],
        });
        res.json({ message: "Planta actualizada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la planta" });
    }
});


// RUTA PARA ELIMINAR UNA PLANTA (Delete)
app.delete("/api/plants/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await turso.execute({
            sql: "DELETE FROM plants WHERE id = ?",
            args: [id],
        });
        res.json({ message: "Planta eliminada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la planta" });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
});