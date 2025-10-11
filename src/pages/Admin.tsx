import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";

// URL de tu API corriendo en localhost
const API_URL = "http://localhost:3001/api";

// El tipo Plant ahora refleja que los campos complejos son strings JSON
type Plant = {
    id: string;
    slug: string;
    commonName: string;
    scientificName: string;
    Descripción: string;
    beneficios: string; // JSON string
    modoDeUso: string;  // JSON string
};

const Admin = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [selectedPlant, setSelectedPlant] = useState<Partial<Plant> | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. OBTENER PLANTAS DESDE LA API
    const fetchPlants = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/plants`);
            if (!response.ok) {
                throw new Error('Error al conectar con la API.');
            }
            const data = await response.json();
            setPlants(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Un error desconocido ocurrió.");
            console.error("Error fetching plants:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    // 2. ELIMINAR PLANTA
    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/plants/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error('No se pudo eliminar la planta.');
            }
            await fetchPlants(); // Recargar la lista de plantas
        } catch (error) {
            console.error("Error deleting plant:", error);
            setError("No se pudo eliminar la planta.");
        }
    };

    // 3. GUARDAR (CREAR O EDITAR) PLANTA
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        let beneficiosParsed, modoDeUsoParsed;
        try {
            beneficiosParsed = JSON.parse(formData.get("beneficios") as string || '{}');
            modoDeUsoParsed = JSON.parse(formData.get("modoDeUso") as string || '{}');
        } catch {
            alert("Error: El formato de 'Beneficios' o 'Modo de Uso' no es un JSON válido.");
            return;
        }

        const plantData = {
            id: formData.get("id") as string,
            slug: (formData.get("commonName") as string).toLowerCase().trim().replace(/\s+/g, '-'),
            commonName: formData.get("commonName") as string,
            scientificName: formData.get("scientificName") as string,
            Descripción: formData.get("Descripción") as string,
            beneficios: beneficiosParsed,
            modoDeUso: modoDeUsoParsed,
        };

        const url = selectedPlant?.id ? `${API_URL}/plants/${selectedPlant.id}` : `${API_URL}/plants`;
        const method = selectedPlant?.id ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(plantData),
            });

            if (!response.ok) {
                throw new Error('No se pudo guardar la planta.');
            }

            await fetchPlants(); // Recargar datos
            setIsDialogOpen(false);
            setSelectedPlant(null);
        } catch (error) {
            console.error("Error saving plant:", error);
            setError("No se pudo guardar la planta.");
        }
    };

    const openDialog = (plant: Partial<Plant> | null = null) => {
        setSelectedPlant(plant);
        setIsDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-12 text-center text-destructive">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p>{error}</p>
                <Button onClick={fetchPlants} className="mt-4">Reintentar</Button>
            </div>
        )
    }

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold">
                    Administración del Herbario
                </h1>
                <Button onClick={() => openDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar Planta
                </Button>
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
                                    <Button variant="ghost" size="icon" onClick={() => openDialog(plant)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta acción no se puede deshacer. Se eliminará permanentemente la planta "{plant.commonName}".
                                                </AlertDialogDescription>
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

            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedPlant(null); }}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedPlant?.id ? "Editar Planta" : "Agregar Nueva Planta"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="grid gap-6 py-4">
                        <input type="hidden" name="id" defaultValue={selectedPlant?.id || ''} />
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="commonName" className="text-right">Nombre Común</Label>
                            <Input id="commonName" name="commonName" defaultValue={selectedPlant?.commonName} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="scientificName" className="text-right">Nombre Científico</Label>
                            <Input id="scientificName" name="scientificName" defaultValue={selectedPlant?.scientificName} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Descripción" className="text-right">Descripción</Label>
                            <Textarea id="Descripción" name="Descripción" defaultValue={selectedPlant?.Descripción} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="beneficios" className="text-right">Beneficios (JSON)</Label>
                            <Textarea
                                id="beneficios"
                                name="beneficios"
                                defaultValue={JSON.stringify(selectedPlant?.id ? JSON.parse(selectedPlant.beneficios || '{}') : {}, null, 2)}
                                className="col-span-3 font-mono"
                                rows={6}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modoDeUso" className="text-right">Modo de Uso (JSON)</Label>
                            <Textarea
                                id="modoDeUso"
                                name="modoDeUso"
                                defaultValue={JSON.stringify(selectedPlant?.id ? JSON.parse(selectedPlant.modoDeUso || '{}') : {}, null, 2)}
                                className="col-span-3 font-mono"
                                rows={6}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                            <Button type="submit">Guardar Cambios</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Admin;