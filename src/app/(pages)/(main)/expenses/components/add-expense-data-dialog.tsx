"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, Loader2 } from "lucide-react";
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
  };
}

export function AddExpenseDataDialog({
  open,
  onOpenChange,
  mineId,
  expenses,
  onDataAdded,
}: AddExpenseDataDialogProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [expenseData, setExpenseData] = useState<ExpenseData>({});
  const [saving, setSaving] = useState(false);

  const updateExpenseData = (
    expenseId: string,
    value: string | number
  ) => {
    setExpenseData((prev) => ({
      ...prev,
      [expenseId]: {
        ...prev[expenseId],
        price: Number(value),
      },
    }));
  };

  const getExpenseValue = (expenseId: string) => {
    return expenseData[expenseId]?.price || "";
  };

  const saveExpenseData = async () => {
    if (!mineId || !selectedMonth || !selectedYear) return;

    setSaving(true);
    try {
      const expensesData: ExpenseDataDto[] = [];

      expenses.forEach((expense) => {
        const data = expenseData[expense.id.toString()];
        if (data && data.price > 0) {
          expensesData.push({
            expenseId: expense.id,
            price: data.price,
            notes: "",
          });
        }
      });

      if (expensesData.length > 0) {
        const bulkData: BulkCreateExpenseMonthlyDataDto = {
          month: selectedMonth,
          year: selectedYear,
          mineId: mineId,
          entityId: 1, // TODO: Get from props or context
          expenses: expensesData,
        };

        await ExpenseMonthlyDataService.expenseMonthlyDataControllerBulkCreate({
          requestBody: bulkData,
        });
      }

      onDataAdded();
      onOpenChange(false);
      setSelectedMonth(0);
      setSelectedYear(0);
      setExpenseData({});
    } catch (error) {
      console.error("فشل حفظ البيانات:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onOpenChange(false);
      setSelectedMonth(0);
      setSelectedYear(0);
      setExpenseData({});
    }
  };

  // Get available months
  const months = [
    { value: 1, label: "يناير" },
    { value: 2, label: "فبراير" },
    { value: 3, label: "مارس" },
    { value: 4, label: "أبريل" },
    { value: 5, label: "مايو" },
    { value: 6, label: "يونيو" },
    { value: 7, label: "يوليو" },
    { value: 8, label: "أغسطس" },
    { value: 9, label: "سبتمبر" },
    { value: 10, label: "أكتوبر" },
    { value: 11, label: "نوفمبر" },
    { value: 12, label: "ديسمبر" },
  ];

  // Get available years (current year +/- 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  if (!mineId) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>إضافة بيانات المصروفات</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Month and Year Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Expenses Input */}
          {selectedMonth && selectedYear && (
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  بيانات المصروفات لشهر{" "}
                  {months.find((m) => m.value === selectedMonth)?.label}{" "}
                  {selectedYear}
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {expenses.map((expense) => {
                    const expenseId = expense.id.toString();

                    return (
                      <div
                        key={expense.id}
                        className="space-y-2 p-4 border rounded-lg"
                      >
                        <Label
                          htmlFor={`expense-${expense.id}`}
                          className="text-sm font-medium"
                        >
                          {expense.name} ({expense.unit})
                        </Label>
                        <Input
                          id={`expense-${expense.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={getExpenseValue(expenseId) || ""}
                          onChange={(e) =>
                            updateExpenseData(expenseId, e.target.value)
                          }
                          placeholder="0.00"
                        />
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
            إلغاء
          </Button>
          <Button
            onClick={saveExpenseData}
            disabled={saving || !selectedMonth || !selectedYear}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin me-2" />
                جارٍ الحفظ...
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
