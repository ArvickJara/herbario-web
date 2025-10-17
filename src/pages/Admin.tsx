import { useState, useEffect, ChangeEvent } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";

// --- IMPORTACIONES PARA CONEXIÓN DIRECTA A LA DB ---
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { eq } from "drizzle-orm";

// --- FUNCIÓN PARA GENERAR UUID QUE FUNCIONA EN EL NAVEGADOR ---
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// --- DEFINICIÓN DE ESQUEMAS (directamente en el frontend) ---
export const plantsTable = sqliteTable("plants", {
    id: text("id").primaryKey(),
    commonName: text("commonName").notNull(),
    scientificName: text("scientificName"),
    description: text("description"),
    imageUrl: text("image_url"),
});

export const benefitsTable = sqliteTable("benefits", {
    id: text("id").primaryKey(),
    tipo: text("tipo").notNull(),
    description: text("description").notNull(),
    plantId: text("plant_id").notNull().references(() => plantsTable.id, { onDelete: "cascade" }),
});

export const usageMethodsTable = sqliteTable("usage_methods", {
    id: text("id").primaryKey(),
    tipo: text("tipo").notNull(),
    description: text("description").notNull(),
    plantId: text("plant_id").notNull().references(() => plantsTable.id, { onDelete: "cascade" }),
});

export const respaldoCientificoTable = sqliteTable("respaldo_cientifico", {
    id: text("id").primaryKey(),
    plantId: text("plant_id").notNull().references(() => plantsTable.id, { onDelete: "cascade" }),
    hallazgoCientifico: text("hallazgo_cientifico").notNull(),
    idioma: text("idioma"),
    anio: text("anio"),
    urlFuente: text("url_fuente"),
});

export const plantsRelations = relations(plantsTable, ({ many }) => ({
    benefits: many(benefitsTable),
    usageMethods: many(usageMethodsTable),
    respaldoCientifico: many(respaldoCientificoTable),
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

export const respaldoCientificoRelations = relations(respaldoCientificoTable, ({ one }) => ({
    plant: one(plantsTable, {
        fields: [respaldoCientificoTable.plantId],
        references: [plantsTable.id],
    }),
}));

// --- VERIFICACIÓN Y CONEXIÓN A LA BASE DE DATOS ---
let db: ReturnType<typeof drizzle> | null = null;

function initDatabase() {
    const dbUrl = import.meta.env.VITE_TURSO_DATABASE_URL;
    const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

    console.log('Verificando variables de entorno:', {
        hasDbUrl: !!dbUrl,
        hasAuthToken: !!authToken,
        dbUrl: dbUrl ? dbUrl.substring(0, 30) + '...' : 'undefined'
    });

    if (!dbUrl || !authToken) {
        throw new Error(`Faltan variables de entorno: 
        VITE_TURSO_DATABASE_URL: ${!!dbUrl}
        VITE_TURSO_AUTH_TOKEN: ${!!authToken}`);
    }

    const client = createClient({
        url: dbUrl,
        authToken: authToken,
    });

    // CORRECCIÓN: Configurar el esquema correctamente
    return drizzle(client, {
        schema: {
            // Nombres de las tablas (deben coincidir con los nombres que usas en las queries)
            plants: plantsTable,
            benefits: benefitsTable,
            usageMethods: usageMethodsTable,
            respaldoCientifico: respaldoCientificoTable,
            // Relaciones
            plantsRelations,
            benefitsRelations,
            usageMethodsRelations,
            respaldoCientificoRelations,
        },
    });
}

// --- TIPOS DE DATOS ---
type Benefit = { id: string; tipo: string; description: string; };
type UsageMethod = { id: string; tipo: string; description: string; };
type RespaldoCientifico = { id: string; hallazgoCientifico: string; idioma: string | null; anio: string | null; urlFuente: string | null; };
type Plant = {
    id: string;
    commonName: string;
    scientificName: string | null;
    description: string | null;
    imageUrl: string | null;
    benefits: Benefit[];
    usageMethods: UsageMethod[];
    respaldoCientifico: RespaldoCientifico[];
};

// --- TIPO PARA EL FORMULARIO (incluye el archivo de imagen) ---
type FormValues = Omit<Plant, 'benefits' | 'usageMethods' | 'respaldoCientifico'> & {
    benefits: { tipo: string; description: string }[];
    usageMethods: { tipo: string; description: string }[];
    respaldoCientifico: { hallazgoCientifico: string; idioma: string; anio: string; urlFuente: string }[];
    imageFile?: FileList;
};

// --- FUNCIÓN PARA SUBIR IMÁGENES A CLOUDINARY ---
const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
        throw new Error('Falta la variable VITE_CLOUDINARY_CLOUD_NAME');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'herbario');
    formData.append('folder', 'herbario');

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error('Error al subir la imagen a Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
};

// --- COMPONENTE DEL FORMULARIO ---
function PlantForm({ plant, onSave, onCancel }: { plant: Partial<Plant> | null; onSave: () => void; onCancel: () => void; }) {
    const isEditing = !!plant?.id;
    const [imagePreview, setImagePreview] = useState<string | null>(plant?.imageUrl || null);

    const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<FormValues>({
        defaultValues: {
            ...plant,
            benefits: plant?.benefits?.length ? plant.benefits : [{ tipo: "", description: "" }],
            usageMethods: plant?.usageMethods?.length ? plant.usageMethods : [{ tipo: "", description: "" }],
            respaldoCientifico: plant?.respaldoCientifico?.length ? plant.respaldoCientifico : [{ hallazgoCientifico: "", idioma: "", anio: "", urlFuente: "" }]
        },
    });

    const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({ control, name: "benefits" });
    const { fields: usageMethodFields, append: appendUsageMethod, remove: removeUsageMethod } = useFieldArray({ control, name: "usageMethods" });
    const { fields: respaldoCientificoFields, append: appendRespaldoCientifico, remove: removeRespaldoCientifico } = useFieldArray({ control, name: "respaldoCientifico" });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            if (!db) {
                throw new Error('La base de datos no está inicializada');
            }

            let imageUrl = plant?.imageUrl || null;

            // Subir imagen si hay una nueva
            if (data.imageFile && data.imageFile.length > 0) {
                imageUrl = await uploadImageToCloudinary(data.imageFile[0]);
            }

            const plantData = {
                id: plant?.id || generateUUID(),
                commonName: data.commonName,
                scientificName: data.scientificName || null,
                description: data.description || null,
                imageUrl,
            };

            if (isEditing) {
                // Actualizar planta existente
                await db.transaction(async (tx) => {
                    await tx.update(plantsTable).set(plantData).where(eq(plantsTable.id, plant!.id!));

                    // Eliminar registros existentes
                    await tx.delete(benefitsTable).where(eq(benefitsTable.plantId, plant!.id!));
                    await tx.delete(usageMethodsTable).where(eq(usageMethodsTable.plantId, plant!.id!));
                    await tx.delete(respaldoCientificoTable).where(eq(respaldoCientificoTable.plantId, plant!.id!));

                    // Insertar nuevos beneficios
                    const benefits = data.benefits.filter(b => b.tipo && b.description);
                    for (const benefit of benefits) {
                        await tx.insert(benefitsTable).values({
                            id: generateUUID(),
                            tipo: benefit.tipo,
                            description: benefit.description,
                            plantId: plant!.id!
                        });
                    }

                    // Insertar nuevos métodos de uso
                    const usageMethods = data.usageMethods.filter(u => u.tipo && u.description);
                    for (const method of usageMethods) {
                        await tx.insert(usageMethodsTable).values({
                            id: generateUUID(),
                            tipo: method.tipo,
                            description: method.description,
                            plantId: plant!.id!
                        });
                    }

                    // Insertar nuevo respaldo científico
                    const respaldos = data.respaldoCientifico.filter(r => r.hallazgoCientifico);
                    for (const respaldo of respaldos) {
                        await tx.insert(respaldoCientificoTable).values({
                            id: generateUUID(),
                            hallazgoCientifico: respaldo.hallazgoCientifico,
                            idioma: respaldo.idioma || null,
                            anio: respaldo.anio || null,
                            urlFuente: respaldo.urlFuente || null,
                            plantId: plant!.id!
                        });
                    }
                });
            } else {
                // Crear nueva planta
                await db.transaction(async (tx) => {
                    await tx.insert(plantsTable).values(plantData);

                    // Insertar beneficios
                    const benefits = data.benefits.filter(b => b.tipo && b.description);
                    for (const benefit of benefits) {
                        await tx.insert(benefitsTable).values({
                            id: generateUUID(),
                            tipo: benefit.tipo,
                            description: benefit.description,
                            plantId: plantData.id
                        });
                    }

                    // Insertar métodos de uso
                    const usageMethods = data.usageMethods.filter(u => u.tipo && u.description);
                    for (const method of usageMethods) {
                        await tx.insert(usageMethodsTable).values({
                            id: generateUUID(),
                            tipo: method.tipo,
                            description: method.description,
                            plantId: plantData.id
                        });
                    }

                    // Insertar respaldo científico
                    const respaldos = data.respaldoCientifico.filter(r => r.hallazgoCientifico);
                    for (const respaldo of respaldos) {
                        await tx.insert(respaldoCientificoTable).values({
                            id: generateUUID(),
                            hallazgoCientifico: respaldo.hallazgoCientifico,
                            idioma: respaldo.idioma || null,
                            anio: respaldo.anio || null,
                            urlFuente: respaldo.urlFuente || null,
                            plantId: plantData.id
                        });
                    }
                });
            }

            onSave();
        } catch (error) {
            console.error('Error completo:', error);
            alert(`Error al guardar la planta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{isEditing ? "Editar Planta" : "Agregar Nueva Planta"}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
                    <div>
                        <Label htmlFor="imageFile">Imagen de la Planta</Label>
                        <div className="mt-2 flex items-center gap-4">
                            {imagePreview && <img src={imagePreview} alt="Vista previa" className="h-20 w-20 rounded-md object-cover" />}
                            <Input id="imageFile" type="file" {...register("imageFile")} onChange={handleImageChange} />
                        </div>
                    </div>
                    <div><Label htmlFor="commonName">Nombre Común de la planta</Label><Input id="commonName" {...register("commonName", { required: true })} /></div>
                    <div><Label htmlFor="scientificName">Nombre Científico de la planta</Label><Input id="scientificName" {...register("scientificName")} /></div>
                    <div><Label htmlFor="description">Descripción detallada de la planta</Label><Textarea id="description" {...register("description")} /></div>
                    <div className="space-y-2 p-3 border rounded-md">
                        <Label>Beneficios</Label>
                        {benefitFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <Input {...register(`benefits.${index}.tipo`)} placeholder="Tipo de beneficio" className="w-1/3" />
                                <Input {...register(`benefits.${index}.description`)} placeholder="Descripción del beneficio" className="flex-1" />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeBenefit(index)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendBenefit({ tipo: "", description: "" })}><PlusCircle className="mr-2 h-4 w-4" /> Añadir Beneficio</Button>
                    </div>
                    <div className="space-y-2 p-3 border rounded-md">
                        <Label>Métodos de Uso</Label>
                        {usageMethodFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <Input {...register(`usageMethods.${index}.tipo`)} placeholder="Tipo de método" className="w-1/3" />
                                <Input {...register(`usageMethods.${index}.description`)} placeholder="Descripción del método" className="flex-1" />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeUsageMethod(index)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendUsageMethod({ tipo: "", description: "" })}><PlusCircle className="mr-2 h-4 w-4" /> Añadir Método de Uso</Button>
                    </div>
                    <div className="space-y-2 p-3 border rounded-md">
                        <Label>Respaldo Científico</Label>
                        {respaldoCientificoFields.map((field, index) => (
                            <div key={field.id} className="space-y-2 p-2 border rounded">
                                <div className="flex items-center gap-2">
                                    <Textarea {...register(`respaldoCientifico.${index}.hallazgoCientifico`)} placeholder="Hallazgo científico" className="flex-1" />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeRespaldoCientifico(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input {...register(`respaldoCientifico.${index}.idioma`)} placeholder="Idioma" />
                                    <Input {...register(`respaldoCientifico.${index}.anio`)} placeholder="Año" />
                                    <Input {...register(`respaldoCientifico.${index}.urlFuente`)} placeholder="URL/DOI" />
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendRespaldoCientifico({ hallazgoCientifico: "", idioma: "", anio: "", urlFuente: "" })}><PlusCircle className="mr-2 h-4 w-4" /> Añadir Respaldo Científico</Button>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar Cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENTE PRINCIPAL DE LA PÁGINA DE ADMIN ---
const Admin = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [selectedPlant, setSelectedPlant] = useState<Partial<Plant> | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlants = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Inicializar la base de datos si no está inicializada
            if (!db) {
                db = initDatabase();
            }

            // CORRECCIÓN: Usar consultas directas en lugar de db.query
            const plantsResult = await db.select().from(plantsTable);
            const benefitsResult = await db.select().from(benefitsTable);
            const usageMethodsResult = await db.select().from(usageMethodsTable);
            const respaldoCientificoResult = await db.select().from(respaldoCientificoTable);

            // Combinar los datos manualmente
            const result = plantsResult.map(plant => ({
                ...plant,
                benefits: benefitsResult.filter(b => b.plantId === plant.id),
                usageMethods: usageMethodsResult.filter(u => u.plantId === plant.id),
                respaldoCientifico: respaldoCientificoResult.filter(r => r.plantId === plant.id),
            }));

            setPlants(result);
        } catch (err) {
            console.error('Error completo al cargar plantas:', err);
            setError(err instanceof Error ? err.message : "Un error desconocido ocurrió.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchPlants(); }, []);

    const handleDelete = async (id: string) => {
        try {
            if (!db) {
                db = initDatabase();
            }
            await db.delete(plantsTable).where(eq(plantsTable.id, id));
            fetchPlants();
        } catch (err) {
            console.error('Error al eliminar planta:', err);
            setError(err instanceof Error ? err.message : "No se pudo eliminar la planta.");
        }
    };

    const handleSaveSuccess = () => { setIsFormOpen(false); setSelectedPlant(null); fetchPlants(); };
    const openForm = (plant: Partial<Plant> | null = null) => { setSelectedPlant(plant); setIsFormOpen(true); };

    if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (error) return <div className="container py-12 text-center text-destructive"><h2 className="text-2xl font-bold mb-4">Error</h2><p>{error}</p><Button onClick={fetchPlants} className="mt-4">Reintentar</Button></div>;

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold">Administración del Herbario</h1>
                <Button onClick={() => openForm()}><PlusCircle className="mr-2 h-4 w-4" /> Agregar Planta</Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Imagen</TableHead>
                            <TableHead>Nombre Común</TableHead>
                            <TableHead className="hidden md:table-cell">Nombre Científico</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plants.map((plant) => (
                            <TableRow key={plant.id}>
                                <TableCell>
                                    {plant.imageUrl ? <img src={plant.imageUrl} alt={plant.commonName} className="h-12 w-12 rounded-md object-cover" /> : <div className="h-12 w-12 rounded-md bg-gray-200" />}
                                </TableCell>
                                <TableCell className="font-medium">{plant.commonName}</TableCell>
                                <TableCell className="hidden md:table-cell italic">{plant.scientificName}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openForm(plant)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará permanentemente la planta "{plant.commonName}".</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(plant.id)}>Eliminar</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {isFormOpen && <PlantForm plant={selectedPlant} onSave={handleSaveSuccess} onCancel={() => setIsFormOpen(false)} />}
        </div>
    );
};

export default Admin;