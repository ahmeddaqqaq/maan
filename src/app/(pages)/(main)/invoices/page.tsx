"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxWithIndeterminate } from "@/components/ui/checkbox-with-indeterminate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Loader2 } from "lucide-react";
import { InvoiceFiltersTable } from "./components/invoice-filters-table";
import { EntityService } from "../../../../../client/services/EntityService";
import { MineService } from "../../../../../client/services/MineService";
import { MaterialService } from "../../../../../client/services/MaterialService";
import { ExpenseService } from "../../../../../client/services/ExpenseService";
import { EntityResponse } from "../../../../../client/models/EntityResponse";
import { MineResponse } from "../../../../../client/models/MineResponse";
import { MaterialResponse } from "../../../../../client/models/MaterialResponse";
import { ExpenseResponse } from "../../../../../client/models/ExpenseResponse";

export interface InvoiceFilters {
  entities: number[];
  mines: number[];
  materials: number[];
  expenses: number[];
  month: number | undefined;
  year: number | undefined;
  includeExtractions: boolean;
  includeExpenses: boolean;
  onlyUsedMaterials: boolean;
}

export default function InvoicesPage() {
  const [entities, setEntities] = useState<EntityResponse[]>([]);
  const [mines, setMines] = useState<MineResponse[]>([]);
  const [materials, setMaterials] = useState<MaterialResponse[]>([]);
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<InvoiceFilters>({
    entities: [],
    mines: [],
    materials: [],
    expenses: [],
    month: undefined,
    year: undefined,
    includeExtractions: false,
    includeExpenses: false,
    onlyUsedMaterials: false,
  });

  // Load reference data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [entitiesRes, minesRes, materialsRes, expensesRes] =
          await Promise.all([
            EntityService.entityControllerFindMany({}),
            MineService.mineControllerFindMany({}),
            MaterialService.materialControllerFindMany({}),
            ExpenseService.expenseControllerFindMany({}),
          ]);

        setEntities(entitiesRes.data || []);
        setMines(minesRes.data || []);
        setMaterials(materialsRes.data || []);
        setExpenses(expensesRes.data || []);
      } catch (error) {
        console.error("فشل في تحميل البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter available options based on selections
  const getFilteredMines = () => {
    if (filters.entities.length === 0) return mines;
    // Show mines that belong to selected entities
    const selectedEntities = entities.filter((entity) =>
      filters.entities.includes(entity.id)
    );
    const availableMines = selectedEntities.flatMap(
      (entity) => entity.mines || []
    );
    return mines.filter((mine) =>
      availableMines.some((availableMine) => availableMine.id === mine.id)
    );
  };

  const getFilteredMaterials = () => {
    if (filters.entities.length === 0) return materials;
    // Show materials that belong to selected entities
    const selectedEntities = entities.filter((entity) =>
      filters.entities.includes(entity.id)
    );
    const availableMaterials = selectedEntities.flatMap(
      (entity) => entity.materials || []
    );
    return materials.filter((material) =>
      availableMaterials.some(
        (availableMaterial) => availableMaterial.id === material.id
      )
    );
  };

  const getFilteredExpenses = () => {
    // Expenses are filtered by entityId at API level, show all if entities selected
    return expenses;
  };

  const updateFilter = <K extends keyof InvoiceFilters>(
    key: K,
    value: InvoiceFilters[K]
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      // Clear dependent selections when parent changes
      if (key === "entities") {
        // When entities change, clear mines, materials, and expenses that are no longer available
        const newEntityIds = value as number[];
        if (newEntityIds.length === 0) {
          // If no entities selected, clear all dependent selections
          return {
            ...newFilters,
            mines: [],
            materials: [],
            expenses: [],
          };
        } else {
          // Filter out mines and materials that don't belong to selected entities
          const selectedEntities = entities.filter((entity) =>
            newEntityIds.includes(entity.id)
          );
          const availableMineIds = selectedEntities.flatMap((entity) =>
            (entity.mines || []).map((mine) => mine.id)
          );
          const availableMaterialIds = selectedEntities.flatMap((entity) =>
            (entity.materials || []).map((material) => material.id)
          );

          return {
            ...newFilters,
            mines: prev.mines.filter((mineId) =>
              availableMineIds.includes(mineId)
            ),
            materials: prev.materials.filter((materialId) =>
              availableMaterialIds.includes(materialId)
            ),
            expenses: [], // Clear expenses as they're filtered by API
          };
        }
      }

      return newFilters;
    });
  };

  const toggleFilterArray = (
    key: "entities" | "mines" | "materials" | "expenses",
    id: number
  ) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(id)
      ? currentArray.filter((item) => item !== id)
      : [...currentArray, id];

    updateFilter(key, newArray);
  };

  const toggleSelectAll = (
    key: "entities" | "mines" | "materials" | "expenses",
    items: { id: number }[]
  ) => {
    const currentArray = filters[key];
    const allIds = items.map((item) => item.id);
    const isAllSelected = allIds.every((id) => currentArray.includes(id));

    if (isAllSelected) {
      // Deselect all
      updateFilter(key, []);
    } else {
      // Select all
      updateFilter(key, allIds);
    }
  };

  const isAllSelected = (
    key: "entities" | "mines" | "materials" | "expenses",
    items: { id: number }[]
  ) => {
    if (items.length === 0) return false;
    const currentArray = filters[key];
    const allIds = items.map((item) => item.id);
    return allIds.every((id) => currentArray.includes(id));
  };

  const isIndeterminate = (
    key: "entities" | "mines" | "materials" | "expenses",
    items: { id: number }[]
  ) => {
    if (items.length === 0) return false;
    const currentArray = filters[key];
    const allIds = items.map((item) => item.id);
    const selectedCount = allIds.filter((id) =>
      currentArray.includes(id)
    ).length;
    return selectedCount > 0 && selectedCount < allIds.length;
  };

  const clearFilters = () => {
    setFilters({
      entities: [],
      mines: [],
      materials: [],
      expenses: [],
      month: undefined,
      year: undefined,
      includeExtractions: false,
      includeExpenses: false,
      onlyUsedMaterials: false,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        جاري تحميل بيانات الفواتير...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">الفواتير</h2>
          <p className="text-gray-600">إنشاء فواتير مفلترة للمواد والنفقات</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            عوامل تصفية الفاتورة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Month and Year Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الشهر</Label>
              <Select
                value={filters.month?.toString() || ""}
                onValueChange={(value) =>
                  updateFilter("month", value ? parseInt(value) : undefined)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الشهر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">01</SelectItem>
                  <SelectItem value="2">02</SelectItem>
                  <SelectItem value="3">03</SelectItem>
                  <SelectItem value="4">04</SelectItem>
                  <SelectItem value="5">05</SelectItem>
                  <SelectItem value="6">06</SelectItem>
                  <SelectItem value="7">07</SelectItem>
                  <SelectItem value="8">08</SelectItem>
                  <SelectItem value="9">09</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="11">11</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>السنة</Label>
              <Select
                value={filters.year?.toString() || ""}
                onValueChange={(value) =>
                  updateFilter("year", value ? parseInt(value) : undefined)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر السنة" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - 5 + i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Include Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-extractions"
                checked={filters.includeExtractions}
                onCheckedChange={(checked) =>
                  updateFilter("includeExtractions", checked === true)
                }
              />
              <Label htmlFor="include-extractions">متر مكعب</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-expenses"
                checked={filters.includeExpenses}
                onCheckedChange={(checked) =>
                  updateFilter("includeExpenses", checked === true)
                }
              />
              <Label htmlFor="include-expenses">تضمين النفقات</Label>
            </div>

            <div className="flex items-center space-x-2 ">
              <Checkbox
                id="only-used-materials"
                checked={filters.onlyUsedMaterials}
                onCheckedChange={(checked) =>
                  updateFilter("onlyUsedMaterials", checked === true)
                }
              />
              <Label htmlFor="only-used-materials">الأطنان</Label>
            </div>
          </div>

          {/* Entity Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>الشركات</Label>
              <div className="flex items-center space-x-2">
                <CheckboxWithIndeterminate
                  id="select-all-entities"
                  checked={isAllSelected("entities", entities)}
                  indeterminate={isIndeterminate("entities", entities)}
                  onCheckedChange={() => toggleSelectAll("entities", entities)}
                />
                <Label
                  htmlFor="select-all-entities"
                  className="text-sm font-medium"
                >
                  تحديد الكل
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded p-2">
              {entities.map((entity) => (
                <div key={entity.id} className="flex items-center space-x-2 ">
                  <Checkbox
                    id={`entity-${entity.id}`}
                    checked={filters.entities.includes(entity.id)}
                    onCheckedChange={() =>
                      toggleFilterArray("entities", entity.id)
                    }
                  />
                  <Label htmlFor={`entity-${entity.id}`} className="text-sm">
                    {entity.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Mine Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>المناجم</Label>
              <div className="flex items-center space-x-2">
                <CheckboxWithIndeterminate
                  id="select-all-mines"
                  checked={isAllSelected("mines", getFilteredMines())}
                  indeterminate={isIndeterminate("mines", getFilteredMines())}
                  onCheckedChange={() =>
                    toggleSelectAll("mines", getFilteredMines())
                  }
                  disabled={getFilteredMines().length === 0}
                />
                <Label
                  htmlFor="select-all-mines"
                  className="text-sm font-medium"
                >
                  تحديد الكل
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded p-2">
              {getFilteredMines().map((mine) => (
                <div key={mine.id} className="flex items-center space-x-2 ">
                  <Checkbox
                    id={`mine-${mine.id}`}
                    checked={filters.mines.includes(mine.id)}
                    onCheckedChange={() => toggleFilterArray("mines", mine.id)}
                  />
                  <Label htmlFor={`mine-${mine.id}`} className="text-sm">
                    {mine.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Material Selection */}
          {filters.includeExtractions && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>المواد</Label>
                <div className="flex items-center space-x-2">
                  <CheckboxWithIndeterminate
                    id="select-all-materials"
                    checked={isAllSelected("materials", getFilteredMaterials())}
                    indeterminate={isIndeterminate(
                      "materials",
                      getFilteredMaterials()
                    )}
                    onCheckedChange={() =>
                      toggleSelectAll("materials", getFilteredMaterials())
                    }
                    disabled={getFilteredMaterials().length === 0}
                  />
                  <Label
                    htmlFor="select-all-materials"
                    className="text-sm font-medium"
                  >
                    تحديد الكل
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {getFilteredMaterials().map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center space-x-2 "
                  >
                    <Checkbox
                      id={`material-${material.id}`}
                      checked={filters.materials.includes(material.id)}
                      onCheckedChange={() =>
                        toggleFilterArray("materials", material.id)
                      }
                    />
                    <Label
                      htmlFor={`material-${material.id}`}
                      className="text-sm"
                    >
                      {material.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expense Selection */}
          {filters.includeExpenses && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>النفقات</Label>
                <div className="flex items-center space-x-2">
                  <CheckboxWithIndeterminate
                    id="select-all-expenses"
                    checked={isAllSelected("expenses", getFilteredExpenses())}
                    indeterminate={isIndeterminate(
                      "expenses",
                      getFilteredExpenses()
                    )}
                    onCheckedChange={() =>
                      toggleSelectAll("expenses", getFilteredExpenses())
                    }
                    disabled={getFilteredExpenses().length === 0}
                  />
                  <Label
                    htmlFor="select-all-expenses"
                    className="text-sm font-medium"
                  >
                    تحديد الكل
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {getFilteredExpenses().map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center space-x-2 "
                  >
                    <Checkbox
                      id={`expense-${expense.id}`}
                      checked={filters.expenses.includes(expense.id)}
                      onCheckedChange={() =>
                        toggleFilterArray("expenses", expense.id)
                      }
                    />
                    <Label
                      htmlFor={`expense-${expense.id}`}
                      className="text-sm"
                    >
                      {expense.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearFilters}>
              مسح الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtered Results Table */}
      <InvoiceFiltersTable
        filters={filters}
        entities={entities}
        mines={mines}
        materials={materials}
        expenses={expenses}
      />
    </div>
  );
}
