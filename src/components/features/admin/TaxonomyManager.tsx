"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit2, Save, X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    createTaxonomyItem,
    updateTaxonomyItem,
    deleteTaxonomyItem,
    getTaxonomyItems,
    TaxonomyType,
} from "@/lib/actions/taxonomy";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Field {
    name: string;
    label: string;
    type: "text" | "select" | "boolean";
    source?: string;
}

interface TaxonomyManagerProps {
    type: TaxonomyType;
    title: string;
    description: string;
    fields: Field[];
}

export function TaxonomyManager({
    type,
    title,
    description,
    fields,
}: TaxonomyManagerProps) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState<Record<string, any>>({});
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItem, setEditItem] = useState<Record<string, any>>({});
    const [dependencies, setDependencies] = useState<Record<string, any[]>>({});

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getTaxonomyItems(type);
            setItems(data || []);
        } catch (error) {
            toast.error("Failed to fetch items");
        } finally {
            setLoading(false);
        }
    }, [type]);

    const fetchDependencies = useCallback(async () => {
        const supabase = createClient();
        const deps: Record<string, any[]> = {};

        for (const field of fields) {
            if (field.type === "select" && field.source) {
                const { data } = await supabase.from(field.source).select("*");
                deps[field.source] = data || [];
            }
        }
        setDependencies(deps);
    }, [fields]);

    useEffect(() => {
        fetchItems();
        fetchDependencies();
    }, [fetchItems, fetchDependencies]);

    const handleCreate = async () => {
        for (const field of fields) {
            if (!newItem[field.name] && field.type !== 'boolean') {
                toast.error(`${field.label} is required`);
                return;
            }
        }

        toast.loading("Creating item...");
        const { success, error } = await createTaxonomyItem(type, newItem);
        toast.dismiss();

        if (success) {
            toast.success("Item created successfully");
            setNewItem({});
            setIsAdding(false);
            fetchItems();
        } else {
            toast.error(error || "Failed to create item");
        }
    };

    const handleUpdate = async () => {
        if (!editingId) return;

        toast.loading("Updating item...");
        const { success, error } = await updateTaxonomyItem(type, editingId, editItem);
        toast.dismiss();

        if (success) {
            toast.success("Item updated successfully");
            setEditingId(null);
            setEditItem({});
            fetchItems();
        } else {
            toast.error(error || "Failed to update item");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            toast.loading("Deleting item...");
            const { success, error } = await deleteTaxonomyItem(type, id);
            toast.dismiss();

            if (success) {
                toast.success("Item deleted");
                fetchItems();
            } else {
                toast.error(error || "Failed to delete item");
            }
        }
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchItems}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={() => setIsAdding(!isAdding)} size="sm">
                        {isAdding ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        {isAdding ? "Cancel" : "Add New"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Add New Form */}
                    {isAdding && (
                        <div className="flex flex-wrap gap-4 items-end p-6 border rounded-xl bg-muted/40 animate-in fade-in slide-in-from-top-2 shadow-inner">
                            {fields.map((field) => (
                                <div key={field.name} className="flex-1 min-w-[200px]">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">
                                        {field.label}
                                    </label>
                                    {field.type === "select" ? (
                                        <div className="relative">
                                            <select
                                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={newItem[field.name] || ""}
                                                onChange={(e) =>
                                                    setNewItem({ ...newItem, [field.name]: e.target.value })
                                                }
                                            >
                                                <option value="">Select {field.label}</option>
                                                {dependencies[field.source!]?.map((opt) => (
                                                    <option key={opt.id} value={opt.id}>
                                                        {opt.name || opt.title || opt.code}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : field.type === "boolean" ? (
                                        <div className="flex h-9 items-center px-1">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 border-gray-300 rounded text-primary focus:ring-primary"
                                                checked={newItem[field.name] ?? true}
                                                onChange={(e) =>
                                                    setNewItem({ ...newItem, [field.name]: e.target.checked })
                                                }
                                            />
                                            <span className="ml-2 text-sm text-foreground">Active</span>
                                        </div>
                                    ) : (
                                        <Input
                                            className="h-9"
                                            placeholder={`Enter ${field.label}`}
                                            value={newItem[field.name] || ""}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, [field.name]: e.target.value })
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                            <Button onClick={handleCreate} className="h-9">Save Item</Button>
                        </div>
                    )}

                    {/* List */}
                    {loading && items.length === 0 ? (
                        <div className="flex justify-center p-12 flex-col items-center">
                            <Loader2 className="animate-spin h-8 w-8 text-primary mb-2" />
                            <p className="text-sm text-muted-foreground">Loading items...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center p-12 text-muted-foreground bg-muted/10 rounded-xl border-dashed border-2">
                            No items found. Create your first one above.
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        {fields.map((field) => (
                                            <TableHead key={field.name} className="font-semibold">
                                                {field.label}
                                            </TableHead>
                                        ))}
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id}>
                                            {fields.map((field) => (
                                                <TableCell key={field.name} className="py-3">
                                                    {editingId === item.id ? (
                                                        field.type === "select" ? (
                                                            <select
                                                                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                                                                value={editItem[field.name] || ""}
                                                                onChange={(e) =>
                                                                    setEditItem({ ...editItem, [field.name]: e.target.value })
                                                                }
                                                            >
                                                                {dependencies[field.source!]?.map((opt) => (
                                                                    <option key={opt.id} value={opt.id}>
                                                                        {opt.name || opt.title || opt.code}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : field.type === "boolean" ? (
                                                            <input
                                                                type="checkbox"
                                                                checked={editItem[field.name] ?? false}
                                                                onChange={(e) => setEditItem({ ...editItem, [field.name]: e.target.checked })}
                                                            />
                                                        ) : (
                                                            <Input
                                                                className="h-8"
                                                                value={editItem[field.name] || ""}
                                                                onChange={(e) =>
                                                                    setEditItem({ ...editItem, [field.name]: e.target.value })
                                                                }
                                                            />
                                                        )
                                                    ) : (
                                                        field.type === "select" ? (
                                                            <Badge variant="secondary" className="font-normal">
                                                                {dependencies[field.source!]?.find(d => d.id === item[field.name])?.name ||
                                                                    dependencies[field.source!]?.find(d => d.id === item[field.name])?.code ||
                                                                    item[field.name]}
                                                            </Badge>
                                                        ) : field.type === "boolean" ? (
                                                            <Badge variant={item[field.name] ? "default" : "destructive"} className="text-[10px]">
                                                                {item[field.name] ? "Active" : "Inactive"}
                                                            </Badge>
                                                        ) : (
                                                            <span className="font-medium text-foreground/90">{item[field.name]}</span>
                                                        )
                                                    )}
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {editingId === item.id ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setEditingId(null)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button size="sm" onClick={handleUpdate}>
                                                                <Save className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setEditingId(item.id);
                                                                    setEditItem(item);
                                                                }}
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
