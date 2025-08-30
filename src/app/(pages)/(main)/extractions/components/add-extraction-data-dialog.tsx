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
  selectedYear?: string;
  selectedMonth?: string;
  isEditMode?: boolean;
  existingData?: any[];
}

interface ExtractionData {
  [materialId: string]: {
    quantity: string;
    isUsed: boolean;
    quantityInCubicMeters?: string;
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
  selectedYear,
  selectedMonth: propSelectedMonth,
  isEditMode = false,
  existingData = [],
}: AddExtractionDataDialogProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [internalSelectedYear, setInternalSelectedYear] = useState<string>("");
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
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

  // Load entities when dialog opens and set year/month if provided
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
      // Pre-select year if provided from parent
      if (selectedYear) {
        setInternalSelectedYear(selectedYear);
      }
      // Pre-select month if provided (for edit mode)
      if (propSelectedMonth) {
        setSelectedMonth(propSelectedMonth);
      }
      // Pre-populate data in edit mode
      if (isEditMode && existingData.length > 0) {
        const newExtractionData: ExtractionData = {};
        existingData.forEach((item) => {
          newExtractionData[item.material.id.toString()] = {
            quantity: item.quantity.toString(),
            isUsed: item.isUsed,
            quantityInCubicMeters: item.quantityInCubicMeters?.toString() || "",
            dieselPriceThisMonth: item.dieselPriceThisMonth?.toString() || "",
            notes: item.notes || "",
          };
          // Set entity ID from first item
          if (!selectedEntityId && item.entity) {
            setSelectedEntityId(item.entity.id.toString());
          }
        });
        setExtractionData(newExtractionData);
      }
    }
  }, [open, selectedYear, propSelectedMonth, isEditMode, existingData, selectedEntityId]);

  const saveExtractionData = async () => {
    if (!mineId || !selectedMonth || !internalSelectedYear || !selectedEntityId)
      return;

    setSaving(true);
    try {
      const materialsData: MaterialDataDto[] = [];

      materials.forEach((material) => {
        const data = extractionData[material.id.toString()];
        if (data && parseFloat(data.quantity) > 0) {
          materialsData.push({
            materialId: material.id,
            quantity: parseFloat(data.quantity),
            isUsed: data.isUsed,
            quantityInCubicMeters:
              data.isUsed && data.quantityInCubicMeters
                ? parseFloat(data.quantityInCubicMeters)
                : undefined,
            dieselPriceThisMonth:
              data.isUsed && data.dieselPriceThisMonth
                ? parseFloat(data.dieselPriceThisMonth)
                : undefined,
            notes: data.notes || "",
          });
        }
      });

      if (materialsData.length > 0) {
        const bulkData: BulkCreateMineMonthlyDataDto = {
          month: parseInt(selectedMonth),
          year: parseInt(internalSelectedYear),
          mineId: mineId,
          entityId: parseInt(selectedEntityId),
          materials: materialsData,
        };

        await MineMonthlyDataService.mineMonthlyDataControllerBulkCreate({
          requestBody: bulkData,
        });
      }

      onDataAdded();
      onOpenChange(false);
      // Reset form
      setSelectedMonth("");
      setInternalSelectedYear("");
      setSelectedEntityId("");
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
      setSelectedMonth("");
      setInternalSelectedYear("");
      setSelectedEntityId("");
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
          <DialogTitle>
            {isEditMode ? "تعديل بيانات الاستخراج" : "إضافة بيانات الاستخراج"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Entity, Month and Year Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>الشركة</Label>
              <Select
                value={selectedEntityId}
                onValueChange={setSelectedEntityId}
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
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
                value={internalSelectedYear}
                onValueChange={setInternalSelectedYear}
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
          {selectedEntityId && selectedMonth && internalSelectedYear && (
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">
                  بيانات الاستخراج لشهر{" "}
                  {
                    months.find((m) => m.value === parseInt(selectedMonth))
                      ?.label
                  }{" "}
                  {internalSelectedYear}
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px] text-right">
                          المادة
                        </TableHead>
                        <TableHead className="min-w-[100px] text-right">
                          م3
                        </TableHead>
                        <TableHead className="min-w-[100px] text-right">
                          هل تم الاستخدام
                        </TableHead>
                        <TableHead className="min-w-[120px] text-right">
                          الأطنان
                        </TableHead>
                        <TableHead className="min-w-[120px] text-right">
                          سعر الديزل
                        </TableHead>
                        <TableHead className="min-w-[200px] text-right">
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
                            <TableCell className="font-medium text-right">
                              {material.name} ({material.unit})
                            </TableCell>
                            <TableCell>
                              {!isUsed ? (
                                <Input
                                  className="w-full"
                                  value={String(
                                    getExtractionValue(
                                      materialId,
                                      "quantity"
                                    ) || ""
                                  )}
                                  onChange={(e) =>
                                    updateExtractionData(
                                      materialId,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0"
                                />
                              ) : (
                                <Input
                                  className="w-full"
                                  value={String(
                                    getExtractionValue(
                                      materialId,
                                      "quantityInCubicMeters"
                                    ) || ""
                                  )}
                                  onChange={(e) =>
                                    updateExtractionData(
                                      materialId,
                                      "quantityInCubicMeters",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0"
                                />
                              )}
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
                              {isUsed ? (
                                <Input
                                  className="w-full"
                                  value={String(
                                    getExtractionValue(
                                      materialId,
                                      "quantity"
                                    ) || ""
                                  )}
                                  onChange={(e) =>
                                    updateExtractionData(
                                      materialId,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0"
                                />
                              ) : (
                                <Input
                                  className="w-full"
                                  disabled={true}
                                  value=""
                                  placeholder="غير متاح"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Input
                                className="w-full"
                                disabled={!isUsed}
                                value={
                                  isUsed
                                    ? String(
                                        getExtractionValue(
                                          materialId,
                                          "dieselPriceThisMonth"
                                        ) || ""
                                      )
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
              saving ||
              !selectedEntityId ||
              !selectedMonth ||
              !internalSelectedYear
            }
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isEditMode ? "جاري التحديث..." : "جاري الحفظ..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? "تحديث البيانات" : "حفظ البيانات"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
