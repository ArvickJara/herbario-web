import { useState, useEffect } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";

const API_URL = "http://localhost:3001/api";

// --- TIPOS DE DATOS QUE COINCIDEN CON LA NUEVA API Y BASE DE DATOS ---
type Benefit = {
    id: string;
    description: string;
};

type UsageMethod = {
    id: string;
    description: string;
};

type Plant = {
    id: string;
    slug: string;
    commonName: string;
    scientificName: string | null;
    description: string | null;
    imageUrl: string | null;
    benefits: Benefit[];
    usageMethods: UsageMethod[];
};

// --- TIPO PARA EL FORMULARIO (Permite campos dinámicos) ---
type FormValues = Omit<Plant, 'benefits' | 'usageMethods'> & {
    benefits: { description: string }[];
    usageMethods: { description: string }[];
};


// --- COMPONENTE DEL FORMULARIO REUTILIZABLE ---
function PlantForm({
    plant,
    onSave,
    onCancel,
}: {
    plant: Partial<Plant> | null;
    onSave: () => void;
    onCancel: () => void;
}) {
    const isEditing = !!plant?.id;
    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            ...plant,
            benefits: plant?.benefits?.length ? plant.benefits : [{ description: "" }],
            usageMethods: plant?.usageMethods?.length ? plant.usageMethods : [{ description: "" }],
        },
    });

    const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({ control, name: "benefits" });
    const { fields: usageMethodFields, append: appendUsageMethod, remove: removeUsageMethod } = useFieldArray({ control, name: "usageMethods" });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const payload = {
            ...data,
            benefits: data.benefits.map(b => b.description).filter(Boolean),
            usageMethods: data.usageMethods.map(u => u.description).filter(Boolean),
        };

        const url = isEditing ? `${API_URL}/plants/${plant!.id}` : `${API_URL}/plants`;
        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("Error al guardar la planta");
            onSave();
        } catch (error) {
            console.error(error);
            alert("No se pudo guardar la planta. Revisa la consola.");
        }
    };

    return (
        <Dialog open={true} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Planta" : "Agregar Nueva Planta"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
                    <Input type="hidden" {...register("id")} />
                    <div>
                        <Label htmlFor="commonName">Nombre Común</Label>
                        <Input id="commonName" {...register("commonName", { required: true })} />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" {...register("slug", { required: true })} placeholder="ej: uña-de-gato" />
                    </div>
                    <div>
                        <Label htmlFor="scientificName">Nombre Científico</Label>
                        <Input id="scientificName" {...register("scientificName")} />
                    </div>
                    <div>
                        <Label htmlFor="imageUrl">URL de la Imagen</Label>
                        <Input id="imageUrl" {...register("imageUrl")} placeholder="https://ejemplo.com/imagen.jpg" />
                    </div>
                    <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" {...register("description")} />
                    </div>

                    {/* --- SECCIÓN DINÁMICA PARA BENEFICIOS --- */}
                    <div className="space-y-2 p-3 border rounded-md">
                        <Label>Beneficios</Label>
                        {benefitFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <Input {...register(`benefits.${index}.description`)} placeholder={`Beneficio #${index + 1}`} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeBenefit(index)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendBenefit({ description: "" })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Beneficio
                        </Button>
                    </div>

                    {/* --- SECCIÓN DINÁMICA PARA MODOS DE USO --- */}
                    <div className="space-y-2 p-3 border rounded-md">
                        <Label>Modos de Uso</Label>
                        {usageMethodFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <Input {...register(`usageMethods.${index}.description`)} placeholder={`Modo de Uso #${index + 1}`} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeUsageMethod(index)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendUsageMethod({ description: "" })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Modo de Uso
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
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
            const response = await fetch(`${API_URL}/plants`);
            if (!response.ok) throw new Error("Error al conectar con la API.");
            const data = await response.json();
            setPlants(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Un error desconocido ocurrió.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/plants/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("No se pudo eliminar la planta.");
            fetchPlants();
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo eliminar la planta.");
        }
    };

    const handleSaveSuccess = () => {
        setIsFormOpen(false);
        setSelectedPlant(null);
        fetchPlants();
    };

    const openForm = (plant: Partial<Plant> | null = null) => {
        setSelectedPlant(plant);
        setIsFormOpen(true);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return (
            <div className="container py-12 text-center text-destructive">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p>{error}</p>
                <Button onClick={fetchPlants} className="mt-4">Reintentar</Button>
            </div>
        );
    }

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
                            <TableHead>Nombre Común</TableHead>
                            <TableHead className="hidden md:table-cell">Nombre Científico</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plants.map((plant) => (
                            <TableRow key={plant.id}>
                                <TableCell className="font-medium">{plant.commonName}</TableCell>
                                <TableCell className="hidden md:table-cell italic">{plant.scientificName}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openForm(plant)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará permanentemente la planta "{plant.commonName}".</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(plant.id)}>Eliminar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isFormOpen && (
                <PlantForm
                    plant={selectedPlant}
                    onSave={handleSaveSuccess}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
};

export default Admin;