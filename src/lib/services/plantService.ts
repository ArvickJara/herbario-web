import { eq, like, or } from 'drizzle-orm';
import { db, plants, type Plant, type NewPlant } from '../db';

export class PlantService {
    // Obtener todas las plantas con filtros opcionales
    static async getAllPlants(filters?: {
        search?: string;
        ailment?: string;
        part?: string;
        evidenceLevel?: string;
    }): Promise<Plant[]> {
        try {
            let query = db.select().from(plants);

            if (filters?.search) {
                const searchTerm = `%${filters.search}%`;
                query = query.where(
                    or(
                        like(plants.commonName, searchTerm),
                        like(plants.scientificName, searchTerm),
                        like(plants.description, searchTerm)
                    )
                ) as any;
            }

            if (filters?.evidenceLevel) {
                query = query.where(eq(plants.evidenceLevel, filters.evidenceLevel as any)) as any;
            }

            const result = await query;
            return result;
        } catch (error) {
            console.error('Error fetching plants:', error);
            return [];
        }
    }

    // Obtener una planta por slug
    static async getPlantBySlug(slug: string): Promise<Plant | null> {
        try {
            const result = await db.select().from(plants).where(eq(plants.slug, slug));
            return result[0] || null;
        } catch (error) {
            console.error('Error fetching plant by slug:', error);
            return null;
        }
    }

    // Crear una nueva planta
    static async createPlant(plantData: NewPlant): Promise<Plant | null> {
        try {
            const result = await db.insert(plants).values(plantData).returning();
            return result[0] || null;
        } catch (error) {
            console.error('Error creating plant:', error);
            return null;
        }
    }

    // Actualizar una planta
    static async updatePlant(id: string, plantData: Partial<NewPlant>): Promise<Plant | null> {
        try {
            const result = await db
                .update(plants)
                .set({ ...plantData, updatedAt: new Date().toISOString() })
                .where(eq(plants.id, id))
                .returning();
            return result[0] || null;
        } catch (error) {
            console.error('Error updating plant:', error);
            return null;
        }
    }

    // Eliminar una planta
    static async deletePlant(id: string): Promise<boolean> {
        try {
            await db.delete(plants).where(eq(plants.id, id));
            return true;
        } catch (error) {
            console.error('Error deleting plant:', error);
            return false;
        }
    }

    // Migrar datos del JSON existente
    static async migrateFromJSON(jsonData: any[]): Promise<void> {
        try {
            for (const item of jsonData) {
                if (!item.id || !item.commonName) continue;

                const plantData: NewPlant = {
                    id: item.id,
                    slug: item.slug || item.commonName.toLowerCase().replace(/\s+/g, '-'),
                    commonName: item.commonName,
                    scientificName: item.scientificName || '',
                    description: item.Descripción || item.description || '',
                    benefits: item['Beneficios medicinales y respaldo científico'] || {},
                    usageMethods: item['Modo de uso'] || {},
                    imageUrl: item.imageUrl || null,
                    evidenceLevel: 'moderada',
                    hasInteractions: false,
                    precautions: [],
                    interactions: [],
                };

                // Verificar si ya existe
                const existing = await this.getPlantBySlug(plantData.slug);
                if (!existing) {
                    await this.createPlant(plantData);
                    console.log(`Migrated plant: ${plantData.commonName}`);
                }
            }
        } catch (error) {
            console.error('Error migrating from JSON:', error);
        }
    }
}
