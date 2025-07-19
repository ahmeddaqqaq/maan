"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ExpenseMonthlyDataService } from "../../../../../../client/services/ExpenseMonthlyDataService";
import { ExpenseResponse } from "../../../../../../client/models/ExpenseResponse";
import { BulkCreateExpenseMonthlyDataDto } from "../../../../../../client/models/BulkCreateExpenseMonthlyDataDto";
import { ExpenseDataDto } from "../../../../../../client/models/ExpenseDataDto";

interface AddExpenseDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mineId?: number;
  expenses: ExpenseResponse[];
  onDataAdded: () => void;
}

interface ExpenseData {
  [expenseId: string]: {
    price: number;
    notes?: string;
  };
}

export function AddExpenseDataDialog({
  open,
  onOpenChange,
  mineId,
  expenses,
  onDataAdded,
}: AddExpenseDataDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [expenseData, setExpenseData] = useState<ExpenseData>({});
  const [saving, setSaving] = useState(false);

  const updateExpenseData = (expenseId: string, field: string, value: string | number) => {
    setExpenseData((prev) => ({
      ...prev,
      [expenseId]: {
        ...prev[expenseId],
        [field]: field === 'price' ? Number(value) : value,
      },
    }));
  };

  const getExpenseValue = (expenseId: string, field: string) => {
    return expenseData[expenseId]?.[field as keyof typeof expenseData[string]] || '';
  };

  const saveExpenseData = async () => {
    if (!mineId || !selectedDate) return;

    setSaving(true);
    try {
      const expensesData: ExpenseDataDto[] = [];

      expenses.forEach((expense) => {
        const data = expenseData[expense.id.toString()];
        if (data && data.price > 0) {
          expensesData.push({
            expenseId: expense.id,
            price: data.price,
            notes: data.notes || "",
          });
        }
      });

      if (expensesData.length > 0) {
        const bulkData: BulkCreateExpenseMonthlyDataDto = {
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
          mineId: mineId,
          expenses: expensesData,
        };

        await ExpenseMonthlyDataService.expenseMonthlyDataControllerBulkCreate({
          requestBody: bulkData,
        });
      }

      onDataAdded();
      onOpenChange(false);
      // Reset form
      setSelectedDate(undefined);
      setExpenseData({});
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
      setExpenseData({});
    }
  };

  if (!mineId) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Expense Data</DialogTitle>
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

          {/* Expenses Input */}
          {selectedDate && (
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Expense Data for {format(selectedDate, "MMMM yyyy")}
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {expenses.map((expense) => {
                    const expenseId = expense.id.toString();
                    
                    return (
                      <div key={expense.id} className="space-y-4 p-4 border rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor={`expense-${expense.id}`} className="text-sm font-medium">
                            {expense.name} ({expense.unit})
                          </Label>
                          <Input
                            id={`expense-${expense.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={getExpenseValue(expenseId, 'price') as number || ''}
                            onChange={(e) =>
                              updateExpenseData(expenseId, 'price', e.target.value)
                            }
                            placeholder="0.00"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`notes-${expense.id}`} className="text-sm">
                            Notes
                          </Label>
                          <Textarea
                            id={`notes-${expense.id}`}
                            value={getExpenseValue(expenseId, 'notes') as string || ''}
                            onChange={(e) =>
                              updateExpenseData(expenseId, 'notes', e.target.value)
                            }
                            placeholder="Optional notes..."
                            rows={3}
                          />
                        </div>
                      </div>
                    );
                  })}
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
            onClick={saveExpenseData}
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