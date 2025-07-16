"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Save, Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MineMonthlyDataService } from "../../../../../../client/services/MineMonthlyDataService";
import { MaterialResponse } from "../../../../../../client/models/MaterialResponse";
import { BulkCreateMineMonthlyDataDto } from "../../../../../../client/models/BulkCreateMineMonthlyDataDto";
import { MaterialDataDto } from "../../../../../../client/models/MaterialDataDto";

interface AddExtractionDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mineId?: number;
  materials: MaterialResponse[];
  onDataAdded: () => void;
}

interface ExtractionData {
  [materialId: string]: number;
}

export function AddExtractionDataDialog({
  open,
  onOpenChange,
  mineId,
  materials,
  onDataAdded,
}: AddExtractionDataDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [extractionData, setExtractionData] = useState<ExtractionData>({});
  const [saving, setSaving] = useState(false);

  const updateExtractionData = (materialId: string, value: string | number) => {
    setExtractionData((prev) => ({
      ...prev,
      [materialId]: Number(value),
    }));
  };

  const saveExtractionData = async () => {
    if (!mineId || !selectedDate) return;

    setSaving(true);
    try {
      const materialsData: MaterialDataDto[] = [];

      materials.forEach((material) => {
        const quantity = extractionData[material.id.toString()] || 0;
        if (quantity > 0) {
          materialsData.push({
            materialId: material.id,
            quantity: quantity,
            notes: "",
          });
        }
      });

      if (materialsData.length > 0) {
        const bulkData: BulkCreateMineMonthlyDataDto = {
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
          mineId: mineId,
          materials: materialsData,
        };

        await MineMonthlyDataService.mineMonthlyDataControllerBulkCreate({
          requestBody: bulkData,
        });
      }

      onDataAdded();
      onOpenChange(false);
      // Reset form
      setSelectedDate(undefined);
      setExtractionData({});
    } catch (error) {
      console.error("Failed to save data:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onOpenChange(false);
      // Reset form
      setSelectedDate(undefined);
      setExtractionData({});
    }
  };

  if (!mineId) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-6xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Extraction Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Materials Input */}
          {selectedDate && (
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Extraction Data for {format(selectedDate, "MMMM yyyy")}
                </h3>
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${materials.length}, 1fr)`,
                  }}
                >
                  {materials.map((material) => (
                    <div key={material.id} className="space-y-2">
                      <Label htmlFor={`material-${material.id}`}>
                        {material.name} ({material.unit})
                      </Label>
                      <Input
                        id={`material-${material.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        className="my-2"
                        value={extractionData[material.id.toString()] || ""}
                        onChange={(e) =>
                          updateExtractionData(
                            material.id.toString(),
                            e.target.value
                          )
                        }
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={saveExtractionData}
            disabled={saving || !selectedDate}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Data
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
