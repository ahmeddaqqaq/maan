"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function AddNewMaterialDialog() {
  const form = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          Add new material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Select */}
            <div className="space-y-2">
              <Label htmlFor="name">Material Name</Label>
              <Select onValueChange={(value) => form.setValue("name", value)}>
                <SelectTrigger id="name" className="w-full">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cement">Cement</SelectItem>
                  <SelectItem value="steel">Steel</SelectItem>
                  <SelectItem value="sand">Sand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Unit Select */}
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select onValueChange={(value) => form.setValue("unit", value)}>
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Input */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                {...form.register("quantity", { valueAsNumber: true })}
              />
            </div>

            <DialogFooter className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" type="button">
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
