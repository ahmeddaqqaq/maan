"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, Filter, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
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
  dateRange: DateRange | undefined;
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
    dateRange: undefined,
    includeExtractions: true,
    includeExpenses: true,
    onlyUsedMaterials: false,
  });

  // Load reference data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [entitiesRes, minesRes, materialsRes, expensesRes] = await Promise.all([
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
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateFilter = <K extends keyof InvoiceFilters>(
    key: K,
    value: InvoiceFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleFilterArray = (
    key: 'entities' | 'mines' | 'materials' | 'expenses',
    id: number
  ) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(id)
      ? currentArray.filter(item => item !== id)
      : [...currentArray, id];
    
    updateFilter(key, newArray);
  };

  const clearFilters = () => {
    setFilters({
      entities: [],
      mines: [],
      materials: [],
      expenses: [],
      dateRange: undefined,
      includeExtractions: true,
      includeExpenses: true,
      onlyUsedMaterials: false,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading invoice data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice Generator</h2>
          <p className="text-gray-600">Generate filtered invoices for materials and expenses</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Invoice Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange}
                  onSelect={(range) => updateFilter('dateRange', range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Include Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-extractions"
                checked={filters.includeExtractions}
                onCheckedChange={(checked) =>
                  updateFilter('includeExtractions', checked === true)
                }
              />
              <Label htmlFor="include-extractions">Include Material Extractions</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-expenses"
                checked={filters.includeExpenses}
                onCheckedChange={(checked) =>
                  updateFilter('includeExpenses', checked === true)
                }
              />
              <Label htmlFor="include-expenses">Include Expenses</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="only-used-materials"
                checked={filters.onlyUsedMaterials}
                onCheckedChange={(checked) =>
                  updateFilter('onlyUsedMaterials', checked === true)
                }
              />
              <Label htmlFor="only-used-materials">Only Used Materials</Label>
            </div>
          </div>

          {/* Entity Selection */}
          <div className="space-y-2">
            <Label>Entities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded p-2">
              {entities.map((entity) => (
                <div key={entity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`entity-${entity.id}`}
                    checked={filters.entities.includes(entity.id)}
                    onCheckedChange={() => toggleFilterArray('entities', entity.id)}
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
            <Label>Mines</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded p-2">
              {mines.map((mine) => (
                <div key={mine.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mine-${mine.id}`}
                    checked={filters.mines.includes(mine.id)}
                    onCheckedChange={() => toggleFilterArray('mines', mine.id)}
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
              <Label>Materials</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {materials.map((material) => (
                  <div key={material.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`material-${material.id}`}
                      checked={filters.materials.includes(material.id)}
                      onCheckedChange={() => toggleFilterArray('materials', material.id)}
                    />
                    <Label htmlFor={`material-${material.id}`} className="text-sm">
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
              <Label>Expenses</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`expense-${expense.id}`}
                      checked={filters.expenses.includes(expense.id)}
                      onCheckedChange={() => toggleFilterArray('expenses', expense.id)}
                    />
                    <Label htmlFor={`expense-${expense.id}`} className="text-sm">
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
              Clear Filters
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