import { useState, useEffect } from 'react';
import { PlantService } from '@/lib/services/plantService';
import plantsJsonData from '@/data/plants_parsed.json';
import type { Plant } from '@/lib/db';

// Interfaz para compatibilidad con el JSON existente
interface JsonPlant {
    id: string;
    slug: string;
    commonName: string;
    scientificName: string;
    Descripción?: string;
    'Beneficios medicinales y respaldo científico'?: Record<string, string>;
    'Modo de uso'?: Record<string, string>;
}

// Función para transformar datos del JSON al formato de Plant
function transformJsonToPlant(jsonPlant: JsonPlant): Omit<Plant, 'createdAt' | 'updatedAt'> {
    return {
        id: jsonPlant.id || `plant-${Date.now()}`,
        slug: jsonPlant.slug || jsonPlant.commonName?.toLowerCase().replace(/\s+/g, '-'),
        commonName: jsonPlant.commonName || '',
        scientificName: jsonPlant.scientificName || '',
        description: jsonPlant.Descripción || '',
        benefits: jsonPlant['Beneficios medicinales y respaldo científico'] || {},
        usageMethods: jsonPlant['Modo de uso'] || {},
        imageUrl: null,
        evidenceLevel: 'moderada' as const,
        hasInteractions: false,
        precautions: [],
        interactions: [],
    };
}

export function usePlants() {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPlants();
    }, []);

    const loadPlants = async () => {
        setLoading(true);
        setError(null);

        try {
            // Intentar cargar desde la base de datos
            const dbPlants = await PlantService.getAllPlants();

            if (dbPlants.length > 0) {
                setPlants(dbPlants);
            } else {
                // Fallback al JSON si no hay datos en la BD
                console.log('No plants in database, using JSON data as fallback');
                const jsonPlants = plantsJsonData
                    .filter(plant => plant.commonName && plant.commonName.trim() !== '')
                    .map(transformJsonToPlant)
                    .filter(plant => plant.id && plant.commonName);

                setPlants(jsonPlants as Plant[]);
            }
        } catch (err) {
            console.error('Error loading plants:', err);
            setError('Error loading plants');

            // Fallback al JSON en caso de error
            const jsonPlants = plantsJsonData
                .filter(plant => plant.commonName && plant.commonName.trim() !== '')
                .map(transformJsonToPlant)
                .filter(plant => plant.id && plant.commonName);

            setPlants(jsonPlants as Plant[]);
        } finally {
            setLoading(false);
        }
    };

    const refreshPlants = () => {
        loadPlants();
    };

    return {
        plants,
        loading,
        error,
        refreshPlants
    };
}

export function usePlantBySlug(slug: string | undefined) {
    const [plant, setPlant] = useState<Plant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPlant = async () => {
            if (!slug) return;

            setLoading(true);
            setError(null);

            try {
                // Intentar cargar desde la base de datos
                let dbPlant = await PlantService.getPlantBySlug(slug);

                if (!dbPlant) {
                    // Fallback al JSON
                    const jsonPlant = plantsJsonData.find(p => p.slug === slug);
                    if (jsonPlant) {
                        dbPlant = transformJsonToPlant(jsonPlant) as Plant;
                    }
                }

                setPlant(dbPlant);
            } catch (err) {
                console.error('Error loading plant:', err);
                setError('Error loading plant');

                // Fallback al JSON en caso de error
                const jsonPlant = plantsJsonData.find(p => p.slug === slug);
                if (jsonPlant) {
                    setPlant(transformJsonToPlant(jsonPlant) as Plant);
                }
            } finally {
                setLoading(false);
            }
        };

        if (!slug) {
            setLoading(false);
            return;
        }

        loadPlant();
    }, [slug]);

    return {
        plant,
        loading,
        error
    };
}
