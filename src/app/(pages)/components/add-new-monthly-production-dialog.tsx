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

export default function AddNewMonthlyProductionDialog() {
  const form = useForm();

  const onSubmit = (data: Record<string, unknown>) => {
    console.log(data);
    // Handle form submission here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Monthly Production</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Work Area Select */}
            <div className="space-y-2">
              <Label htmlFor="workArea">Work Area</Label>
              <Select
                onValueChange={(value) => form.setValue("workArea", value)}
              >
                <SelectTrigger id="workArea" className="w-full">
                  <SelectValue placeholder="Select work area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="area1">Area 1</SelectItem>
                  <SelectItem value="area2">Area 2</SelectItem>
                  <SelectItem value="area3">Area 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company Select */}
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                onValueChange={(value) => form.setValue("company", value)}
              >
                <SelectTrigger id="company" className="w-full">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company1">Company A</SelectItem>
                  <SelectItem value="company2">Company B</SelectItem>
                  <SelectItem value="company3">Company C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Material Select */}
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Select
                onValueChange={(value) => form.setValue("material", value)}
              >
                <SelectTrigger id="material" className="w-full">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cement">Cement</SelectItem>
                  <SelectItem value="steel">Steel</SelectItem>
                  <SelectItem value="sand">Sand</SelectItem>
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

            {/* Date Range - From and To */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">From</Label>
                <Input
                  id="fromDate"
                  type="date"
                  {...form.register("fromDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">To</Label>
                <Input id="toDate" type="date" {...form.register("toDate")} />
              </div>
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
