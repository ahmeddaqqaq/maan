"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/dialog";
import { Save, Loader2 } from "lucide-react";
import { MineMonthlyDataService } from "../../../../../../client/services/MineMonthlyDataService";
import { EntityService } from "../../../../../../client/services/EntityService";
import { MaterialResponse } from "../../../../../../client/models/MaterialResponse";
import { EntityResponse } from "../../../../../../client/models/EntityResponse";
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
  [materialId: string]: {
    quantity: string;
    isUsed: boolean;
    additionalValue?: string;
    dieselPriceThisMonth?: string;
    notes?: string;
  };
}

export function AddExtractionDataDialog({
  open,
  onOpenChange,
  mineId,
  materials,
  onDataAdded,
}: AddExtractionDataDialogProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedEntityId, setSelectedEntityId] = useState<number>(0);
  const [entities, setEntities] = useState<EntityResponse[]>([]);
  const [extractionData, setExtractionData] = useState<ExtractionData>({});
  const [saving, setSaving] = useState(false);

  const updateExtractionData = (
    materialId: string,
    field: string,
    value: string | boolean
  ) => {
    setExtractionData((prev) => ({
      ...prev,
      [materialId]: {
        ...prev[materialId],
        [field]: value,
      },
    }));
  };

  const getExtractionValue = (materialId: string, field: string) => {
    return (
      extractionData[materialId]?.[
        field as keyof (typeof extractionData)[string]
      ] || (field === "isUsed" ? false : "")
    );
  };

  // Load entities when dialog opens
  useEffect(() => {
    const loadEntities = async () => {
      try {
        const response = await EntityService.entityControllerFindMany({});
        setEntities(response.data || []);
      } catch (error) {
        console.error("Failed to load entities:", error);
      }
    };

    if (open) {
      loadEntities();
    }
  }, [open]);

  const saveExtractionData = async () => {
    if (!mineId || !selectedMonth || !selectedYear || !selectedEntityId) return;

    setSaving(true);
    try {
      const materialsData: MaterialDataDto[] = [];

      materials.forEach((material) => {
        const data = extractionData[material.id.toString()];
        const quantity = parseFloat(data?.quantity || "0");
        if (data && quantity > 0) {
          materialsData.push({
            materialId: material.id,
            quantity: quantity,
            isUsed: data.isUsed,
            quantityInCubicMeters: data.isUsed && data.additionalValue
              ? parseFloat(data.additionalValue)
              : undefined,
            dieselPriceThisMonth: data.isUsed && data.dieselPriceThisMonth
              ? parseFloat(data.dieselPriceThisMonth)
              : undefined,
            notes: data.notes || "",
          });
        }
      });

      if (materialsData.length > 0) {
        const bulkData: BulkCreateMineMonthlyDataDto = {
          month: selectedMonth,
          year: selectedYear,
          mineId: mineId,
          entityId: selectedEntityId,
          materials: materialsData,
        };

        await MineMonthlyDataService.mineMonthlyDataControllerBulkCreate({
          requestBody: bulkData,
        });
      }

      onDataAdded();
      onOpenChange(false);
      // Reset form
      setSelectedMonth(0);
      setSelectedYear(0);
      setSelectedEntityId(0);
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
      setSelectedMonth(0);
      setSelectedYear(0);
      setSelectedEntityId(0);
      setExtractionData({});
    }
  };

  // Get available months
  const months = [
    { value: 1, label: "01" },
    { value: 2, label: "02" },
    { value: 3, label: "03" },
    { value: 4, label: "04" },
    { value: 5, label: "05" },
    { value: 6, label: "06" },
    { value: 7, label: "07" },
    { value: 8, label: "08" },
    { value: 9, label: "09" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
  ];

  // Get available years (current year +/- 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  if (!mineId) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-6xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>إضافة بيانات الاستخراج</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Entity, Month and Year Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>الشركة</Label>
              <Select
                value={selectedEntityId ? selectedEntityId.toString() : ""}
                onValueChange={(value) => setSelectedEntityId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الشركة" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الشهر</Label>
              <Select
                value={selectedMonth ? selectedMonth.toString() : ""}
                onValueChange={(value) => setSelectedMonth(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الشهر" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>السنة</Label>
              <Select
                value={selectedYear ? selectedYear.toString() : ""}
                onValueChange={(value) => setSelectedYear(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر السنة" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Materials Input */}
          {selectedEntityId && selectedMonth && selectedYear && (
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">
                  بيانات الاستخراج لشهر{" "}
                  {months.find((m) => m.value === selectedMonth)?.label}{" "}
                  {selectedYear}
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px] text-start">
                          المادة
                        </TableHead>
                        <TableHead className="min-w-[100px] text-start">
                          الكمية
                        </TableHead>
                        <TableHead className="min-w-[100px] text-start">
                          هل تم الاستخدام
                        </TableHead>
                        <TableHead className="min-w-[120px] text-start">
                          القيمة الإضافية
                        </TableHead>
                        <TableHead className="min-w-[120px] text-start">
                          سعر الديزل
                        </TableHead>
                        <TableHead className="min-w-[200px] text-start">
                          ملاحظات
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map((material) => {
                        const materialId = material.id.toString();
                        const isUsed = getExtractionValue(
                          materialId,
                          "isUsed"
                        ) as boolean;

                        return (
                          <TableRow key={material.id}>
                            <TableCell className="font-medium text-start">
                              {material.name} ({material.unit})
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full"
                                value={
                                  getExtractionValue(materialId, "quantity") as string ||
                                    ""
                                }
                                onChange={(e) =>
                                  updateExtractionData(
                                    materialId,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                placeholder="0"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  checked={isUsed}
                                  onCheckedChange={(checked) =>
                                    updateExtractionData(
                                      materialId,
                                      "isUsed",
                                      checked === true
                                    )
                                  }
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full"
                                disabled={!isUsed}
                                value={
                                  isUsed
                                    ? (getExtractionValue(
                                          materialId,
                                          "additionalValue"
                                        ) as string || "")
                                    : ""
                                }
                                onChange={(e) =>
                                  updateExtractionData(
                                    materialId,
                                    "additionalValue",
                                    e.target.value
                                  )
                                }
                                placeholder={isUsed ? "0" : "غير متاح"}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full"
                                disabled={!isUsed}
                                value={
                                  isUsed
                                    ? (getExtractionValue(
                                          materialId,
                                          "dieselPriceThisMonth"
                                        ) as string || "")
                                    : ""
                                }
                                onChange={(e) =>
                                  updateExtractionData(
                                    materialId,
                                    "dieselPriceThisMonth",
                                    e.target.value
                                  )
                                }
                                placeholder={isUsed ? "0.00" : "غير متاح"}
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                className="w-full min-h-[60px]"
                                value={
                                  (getExtractionValue(
                                    materialId,
                                    "notes"
                                  ) as string) || ""
                                }
                                onChange={(e) =>
                                  updateExtractionData(
                                    materialId,
                                    "notes",
                                    e.target.value
                                  )
                                }
                                placeholder="ملاحظات اختيارية..."
                                rows={2}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={saving}>
            إلغاء
          </Button>
          <Button
            onClick={saveExtractionData}
            disabled={
              saving || !selectedEntityId || !selectedMonth || !selectedYear
            }
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin me-2" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 me-2" />
                حفظ البيانات
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
