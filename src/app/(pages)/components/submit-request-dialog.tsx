"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

export default function SubmitRequest({
  defaultData,
  open,
  onOpenChange,
}: {
  defaultData?: { id: string; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm();

  useEffect(() => {
    if (defaultData) {
      // Pre-fill form with defaultData if provided
      form.reset({
        // Set your form fields based on defaultData
        // Example:
        // name: defaultData.name,
      });
    }
  }, [defaultData, form]);

  const onSubmit = (data: Record<string, unknown>) => {
    console.log(data);
    // Handle form submission here
  };

  const companies = [
    { id: "1", name: "ABC Mining Corp" },
    { id: "2", name: "XYZ Minerals" },
    { id: "3", name: "Global Extraction Co" },
  ];

  const mines = [
    { id: "1", name: "Northern Copper Mine" },
    { id: "2", name: "Southern Gold Field" },
    { id: "3", name: "Eastern Coal Pit" },
  ];

  const materials = [
    { id: "1", name: "Copper" },
    { id: "2", name: "Gold" },
    { id: "3", name: "Coal" },
    { id: "4", name: "Iron Ore" },
    { id: "5", name: "Silver" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Submit Request</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Company Select */}
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select
                  onValueChange={(value) => form.setValue("companyId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mine Select */}
              <div className="space-y-2">
                <Label htmlFor="mine">Mine</Label>
                <Select
                  onValueChange={(value) => form.setValue("mineId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a mine" />
                  </SelectTrigger>
                  <SelectContent>
                    {mines.map((mine) => (
                      <SelectItem key={mine.id} value={mine.id}>
                        {mine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Material Select */}
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Select
                  onValueChange={(value) => form.setValue("materialId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Input */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (tons)</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity in tons"
                  {...form.register("quantity", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Expense Claim Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Expense Claim</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Diesel Input */}
                  <div className="space-y-2">
                    <Label htmlFor="diesel">Diesel</Label>
                    <Input
                      id="diesel"
                      type="number"
                      placeholder="Enter amount"
                      {...form.register("diesel", { valueAsNumber: true })}
                    />
                  </div>

                  {/* Explosives Input */}
                  <div className="space-y-2">
                    <Label htmlFor="explosives">Explosives</Label>
                    <Input
                      id="explosives"
                      type="number"
                      placeholder="Enter amount"
                      {...form.register("explosives", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Electricity Input */}
                  <div className="space-y-2">
                    <Label htmlFor="electricity">Electricity</Label>
                    <Input
                      id="electricity"
                      type="number"
                      placeholder="Enter amount"
                      {...form.register("electricity", { valueAsNumber: true })}
                    />
                  </div>

                  {/* Medical Supplies Input */}
                  <div className="space-y-2">
                    <Label htmlFor="medicalSupplies">Medical Supplies</Label>
                    <Input
                      id="medicalSupplies"
                      type="number"
                      placeholder="Enter cost"
                      {...form.register("medicalSupplies", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
