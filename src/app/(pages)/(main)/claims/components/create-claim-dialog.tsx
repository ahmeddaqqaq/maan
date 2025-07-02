"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateClaim, useMines } from "@/hooks/useClaims";
import { useEntities } from "@/hooks/useUsers";
import { useContracts } from "@/hooks/useContracts";
import { useRequests } from "@/hooks/useRequests";
import { useMaterials } from "@/hooks/useMaterials";
import { useCreateMultipleMaterialExtractedAndExpended } from "@/hooks/useMaterialExtractedAndExpended";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Define interfaces for the data objects
interface Contract {
  id: number | string;
  description?: string;
  ownerId?: number;
  entityIds?: number[];
}

interface Request {
  id: number | string;
  description?: string;
  requestingEntityId?: number;
  targetEntityId?: number;
  contractId?: number;
  mineId?: number;
  materialId?: number;
  startDate?: string;
  endDate?: string;
}

interface Material {
  id: number | string;
  name?: string;
  description?: string;
  unit?: string;
}

interface MaterialEntry {
  materialId: number;
  amount: number;
  isExpense: boolean;
  material?: Material;
}

const createClaimSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  mineId: z.number().min(1, "Please select a mine"),
  entityId: z.number().min(1, "Please select an entity"),
  contractId: z.number().optional(),
  requestId: z.number().optional(),
  materials: z.array(z.object({
    materialId: z.number().min(1, "Please select a material"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    isExpense: z.boolean(),
  })).optional(),
});

type CreateClaimFormData = z.infer<typeof createClaimSchema>;

export default function CreateClaimDialog() {
  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState<MaterialEntry[]>([]);
  const { data: minesData } = useMines();
  const { data: entitiesData } = useEntities();
  const { data: contractsData } = useContracts();
  const { data: requestsData } = useRequests();
  const { data: materialsData } = useMaterials();
  const createClaimMutation = useCreateClaim();
  const createMaterialsMutation = useCreateMultipleMaterialExtractedAndExpended();

  const form = useForm<CreateClaimFormData>({
    resolver: zodResolver(createClaimSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      mineId: 0,
      entityId: 0,
      contractId: undefined,
      requestId: undefined,
      materials: [],
    },
  });

  const onSubmit = async (data: CreateClaimFormData) => {
    try {
      // First create the claim
      const claimResult = await createClaimMutation.mutateAsync({
        startDate: data.startDate,
        endDate: data.endDate,
        mineId: data.mineId,
        entityId: data.entityId,
        contractId: data.contractId === 0 ? undefined : data.contractId,
        requestId: data.requestId === 0 ? undefined : data.requestId,
      });

      // Then create material records if any materials are specified
      if (materials.length > 0 && claimResult?.id) {
        const materialRecords = materials.map(material => ({
          materialId: material.materialId,
          amount: material.amount,
          startDate: data.startDate,
          endDate: data.endDate,
          isExpense: material.isExpense,
          claimId: claimResult.id,
          contractId: data.contractId === 0 ? undefined : data.contractId,
        }));
        
        await createMaterialsMutation.mutateAsync(materialRecords);
      }
      
      setOpen(false);
      form.reset();
      setMaterials([]);
    } catch {
      // Error handling is done in the mutations
    }
  };

  const addMaterial = () => {
    setMaterials([...materials, { materialId: 0, amount: 0, isExpense: false }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof MaterialEntry, value: number | boolean) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    
    // Add material info for display
    if (field === 'materialId' && materialsData?.data) {
      const selectedMaterial = materialsData.data.find((m: Material) => m.id === value);
      if (selectedMaterial) {
        updatedMaterials[index].material = selectedMaterial;
      }
    }
    
    setMaterials(updatedMaterials);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          <FiPlus className="mr-2 h-4 w-4" />
          Create Claim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Claim</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mine *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value?.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a mine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {minesData?.data?.map((mine) => (
                        <SelectItem key={mine.id} value={String(mine.id)}>
                          {mine.name} - {mine.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value?.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entitiesData?.data?.map((entity) => (
                        <SelectItem key={entity.id} value={String(entity.id)}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(
                        value === "none" ? undefined : Number(value)
                      )
                    }
                    value={field.value?.toString() || "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a contract" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Contract</SelectItem>
                      {contractsData?.data?.map((contract: Contract) => (
                        <SelectItem
                          key={contract.id}
                          value={contract.id?.toString() || ""}
                        >
                          Contract #{contract.id} -{" "}
                          {contract.description || "No description"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(
                        value === "none" ? undefined : Number(value)
                      )
                    }
                    value={field.value?.toString() || "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a request" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Request</SelectItem>
                      {requestsData?.data?.map((request: Request) => (
                        <SelectItem
                          key={request.id}
                          value={request.id.toString()}
                        >
                          Request #{request.id} - {request.description || "No description"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Materials Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-medium">Materials</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMaterial}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Material
                </Button>
              </div>
              
              {materials.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <p>No materials added yet</p>
                  <p className="text-sm mt-1">Click &quot;Add Material&quot; to specify expenses and extracted materials</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.map((material, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant={material.isExpense ? "destructive" : "default"}>
                            {material.isExpense ? "Expense" : "Extracted"}
                          </Badge>
                          {material.material && (
                            <span className="text-sm text-gray-600">
                              {material.material.name}
                            </span>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <FormLabel className="text-sm">Material *</FormLabel>
                          <Select
                            value={material.materialId ? material.materialId.toString() : ""}
                            onValueChange={(value) => updateMaterial(index, 'materialId', Number(value))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent>
                              {materialsData?.data?.map((mat: Material) => (
                                <SelectItem key={mat.id} value={mat.id.toString()}>
                                  {mat.name} {mat.unit && `(${mat.unit})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <FormLabel className="text-sm">Amount *</FormLabel>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={material.amount}
                            onChange={(e) => updateMaterial(index, 'amount', Number(e.target.value))}
                            placeholder="Enter amount"
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`expense-${index}`}
                            checked={material.isExpense}
                            onCheckedChange={(checked) => updateMaterial(index, 'isExpense', checked as boolean)}
                          />
                          <FormLabel htmlFor={`expense-${index}`} className="text-sm cursor-pointer">
                            This is an expense (money spent to acquire this material)
                          </FormLabel>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          {material.isExpense 
                            ? "Material that was purchased or consumed during operations" 
                            : "Material that was extracted or produced during operations"
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setMaterials([]);
                }}
                disabled={createClaimMutation.isPending || createMaterialsMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createClaimMutation.isPending || createMaterialsMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {(createClaimMutation.isPending || createMaterialsMutation.isPending) ? "Creating..." : "Create Claim"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
