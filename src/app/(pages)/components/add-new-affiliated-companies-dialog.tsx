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

export default function AddNewAffiliatedCompaniesDialog() {
  const form = useForm();

  const onSubmit = (data: any) => {
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
          <DialogTitle>Add New Affiliated Company</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                placeholder="Enter company name"
                {...form.register("name")}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter company email"
                {...form.register("email")}
              />
            </div>

            {/* Phone Number with Country Code */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-0">
                <Select
                  onValueChange={(value) => form.setValue("countryCode", value)}
                  defaultValue="+962"
                >
                  <SelectTrigger className="w-[120px] rounded-e-none">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+962">+962</SelectItem>
                    <SelectItem value="+971">+971</SelectItem>
                    <SelectItem value="+966">+966</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="border-s-0 rounded-s-none"
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  {...form.register("phoneNumber")}
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter company location"
                {...form.register("location")}
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
