"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Loader2,
  Download,
  MoreHorizontal,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpenseService } from "../../../../../../client/services/ExpenseService";
import { MineService } from "../../../../../../client/services/MineService";
import { ExpenseMonthlyDataService } from "../../../../../../client/services/ExpenseMonthlyDataService";
import { ExpenseResponse } from "../../../../../../client/models/ExpenseResponse";
import { MineResponse } from "../../../../../../client/models/MineResponse";
import { AddExpenseDataDialog } from "./add-expense-data-dialog";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface MonthlyExpenseData {
  id: number;
  month: number;
  year: number;
  price: number;
  expense: {
    id: number;
    name: string;
    unit: string;
  };
}

export function MonthlyExpensesTable() {
  const [selectedMine, setSelectedMine] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [mines, setMines] = useState<MineResponse[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyExpenseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // تحميل المناجم والمصروفات عند تحميل المكون
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [minesResponse, expensesResponse] = await Promise.all([
          MineService.mineControllerFindMany({}),
          ExpenseService.expenseControllerFindMany({}),
        ]);

        setMines(minesResponse.data || []);
        setExpenses(expensesResponse.data || []);
      } catch (error) {
        console.error("فشل في تحميل البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // تحميل بيانات المصروفات عندما يتغير المنجم أو السنة
  useEffect(() => {
    if (!selectedMine || !selectedYear) return;

    const loadExpenseData = async () => {
      setLoading(true);
      try {
        const response =
          await ExpenseMonthlyDataService.expenseMonthlyDataControllerFindMany({
            mineId: parseInt(selectedMine),
            year: parseInt(selectedYear),
            skip: 0,
            take: 1000, // Load all data for the year
          });

        setMonthlyData(response.data || []);
      } catch (error) {
        console.error("فشل في تحميل بيانات المصروفات:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExpenseData();
  }, [selectedMine, selectedYear]);

  const refreshData = () => {
    if (selectedMine && selectedYear) {
      const loadExpenseData = async () => {
        setLoading(true);
        try {
          const response =
            await ExpenseMonthlyDataService.expenseMonthlyDataControllerFindMany(
              {
                mineId: parseInt(selectedMine),
                year: parseInt(selectedYear),
                skip: 0,
                take: 1000, // Load all data for the year
              }
            );
          setMonthlyData(response.data || []);
        } catch (error) {
          console.error("فشل في تحميل بيانات المصروفات:", error);
        } finally {
          setLoading(false);
        }
      };
      loadExpenseData();
    }
  };

  const handleMineChange = (value: string) => {
    setSelectedMine(value);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const getUniqueMonths = () => {
    const months = new Set<string>();
    monthlyData.forEach((data) => {
      months.add(`${data.year}-${data.month}`);
    });
    return Array.from(months).sort();
  };

  const exportToCSV = () => {
    if (!selectedMine || !selectedYear || monthlyData.length === 0) return;

    const headers = [
      "التاريخ",
      ...expenses.map((expense) => `${expense.name} (${expense.unit})`),
    ];

    const rows = getUniqueMonths().map((monthKey) => {
      const [year, month] = monthKey.split("-").map(Number);
      const monthDate = `${year}-${month.toString().padStart(2, "0")}`;

      const row = [monthDate];
      expenses.forEach((expense) => {
        const data = monthlyData.find(
          (item) =>
            item.year === year &&
            item.month === month &&
            item.expense.id === expense.id
        );
        row.push(data ? data.price.toString() : "0");
      });

      return row;
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `بيانات-المصروفات-${
        mines.find((m) => m.id.toString() === selectedMine)?.name
      }-${selectedYear}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMonthlyInvoice = async (year: number, month: number) => {
    if (!selectedMine || monthlyData.length === 0) return;

    const mineName =
      mines.find((m) => m.id.toString() === selectedMine)?.name ||
      "منجم غير معروف";

    const monthData = monthlyData.filter(
      (item) => item.year === year && item.month === month
    );

    const arabicMonths = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];

    // Calculate totals
    const totalExpenses = monthData.reduce((sum, item) => sum + item.price, 0);
    const expenseCount = monthData.length;

    const arabicDate = `${arabicMonths[month - 1]} ${year}`;
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Create HTML content with proper Arabic text and styling matching extractions
    const htmlContent = `
      <div style="
        font-family: 'Arial', 'Tahoma', sans-serif;
        direction: rtl;
        text-align: right;
        padding: 20px;
        width: 800px;
        background: #ffffff;
        color: #333333;
        line-height: 1.6;
        box-sizing: border-box;
      ">
        <div style="text-align: center; border-bottom: 2px solid #333333; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 24px; margin: 0; color: #2c3e50; font-weight: bold;">فاتورة المصروفات الشهرية</h1>
          <p style="font-size: 14px; margin: 10px 0; color: #000000;">تقرير مصروفات المنجم</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="width: 48%;">
            <h3 style="margin: 0 0 10px 0; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; font-size: 14px;">معلومات المنجم</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">اسم المنجم: ${mineName}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">فترة المصروفات: ${arabicDate}</p>
          </div>
          <div style="width: 48%;">
            <h3 style="margin: 0 0 10px 0; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; font-size: 14px;">تفاصيل التقرير</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">تاريخ الإنشاء: ${currentDate}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333; font-weight: bold;">إجمالي المصروفات: $${totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #dddddd;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">اسم المصروف</th>
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">الوحدة</th>
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">المبلغ</th>
            </tr>
          </thead>
          <tbody>
            ${
              monthData.length > 0
                ? monthData
                    .map((item, index) => {
                      return `
              <tr style="background-color: ${
                index % 2 === 0 ? "#f9f9f9" : "#ffffff"
              };">
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333;">${
                  item.expense.name
                }</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333;">${
                  item.expense.unit
                }</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333; font-weight: bold;">$${item.price.toFixed(
                  2
                )}</td>
              </tr>`;
                    })
                    .join("") +
                  `
              <tr style="background-color: #e8f4f8; border-top: 2px solid #2c3e50;">
                <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;">إجمالي المصروفات</td>
                <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;">-</td>
                <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #e74c3c; font-weight: bold;">$${totalExpenses.toFixed(
                  2
                )}</td>
              </tr>`
                : `
              <tr>
                <td colspan="3" style="border: 1px solid #dddddd; padding: 20px; text-align: center; color: #7f8c8d; font-size: 12px;">
                  لا توجد مصروفات لهذا الشهر
                </td>
              </tr>
            `
            }
          </tbody>
        </table>

        <!-- Summary Section -->
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 2px solid #dee2e6;">
          <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px; text-align: center; font-weight: bold;">ملخص المصروفات الشهرية</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="text-align: center;">
              <h4 style="margin: 0 0 10px 0; color: #34495e; font-size: 14px;">تفاصيل عامة</h4>
              <p style="margin: 5px 0; font-size: 12px; color: #333333;">عدد المصروفات: <span style="font-weight: bold;">${expenseCount}</span></p>
              <p style="margin: 5px 0; font-size: 12px; color: #333333;">الشهر: <span style="font-weight: bold;">${arabicDate}</span></p>
            </div>
            <div style="text-align: center;">
              <h4 style="margin: 0 0 10px 0; color: #34495e; font-size: 14px;">التفاصيل المالية</h4>
              <p style="margin: 5px 0; font-size: 12px; color: #333333;">المنجم: <span style="font-weight: bold;">${mineName}</span></p>
              <p style="margin: 5px 0; font-size: 12px; color: #333333;">إجمالي المصروفات: <span style="font-weight: bold; color: #e74c3c;">$${totalExpenses.toFixed(
                2
              )}</span></p>
            </div>
          </div>
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #7f8c8d; border-top: 1px solid #bdc3c7; padding-top: 20px;">
          <p style="margin: 5px 0;">تم إنشاء هذه الفاتورة تلقائياً من نظام إدارة المصروفات</p>
          <p style="margin: 5px 0;">تم الإنشاء في ${currentDate}</p>
        </div>
      </div>
    `;

    // Generate PDF using the same method as extractions
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-9999px";
    iframe.style.left = "-9999px";
    iframe.style.width = "800px";
    iframe.style.height = "600px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframe.src = "about:blank";
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      throw new Error("Could not access iframe document");
    }

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', 'Tahoma', sans-serif;
            background: #ffffff;
            color: #333333;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
    iframeDoc.close();

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const contentElement = iframeDoc.body.firstElementChild as HTMLElement;

      const canvas = await html2canvas(contentElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 800,
        height: contentElement.scrollHeight || 600,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: 600,
        foreignObjectRendering: true,
      });

      document.body.removeChild(iframe);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const filename = `فاتورة-المصروفات-${mineName.replace(
        /\s+/g,
        "-"
      )}-${arabicDate.replace(/\s+/g, "-")}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      alert("حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.");
    }
  };

  if (loading && expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin me-2" />
          جاري التحميل...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات المصروفات الشهرية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mine-select">اختر المنجم</Label>
              <Select value={selectedMine} onValueChange={handleMineChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر منجم" />
                </SelectTrigger>
                <SelectContent>
                  {mines.map((mine) => (
                    <SelectItem key={mine.id} value={mine.id.toString()}>
                      {mine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year-select">اختر السنة</Label>
              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر سنة" />
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

            <div className="flex items-end">
              <Button
                onClick={() => setShowAddDialog(true)}
                disabled={!selectedMine || !selectedYear}
                className="w-full"
              >
                <Plus className="h-4 w-4 me-2" />
                إضافة بيانات
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                onClick={exportToCSV}
                disabled={
                  !selectedMine || !selectedYear || monthlyData.length === 0
                }
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 me-2" />
                تصدير CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      {selectedMine && selectedYear && (
        <Card>
          <CardHeader>
            <CardTitle>
              {mines.find((m) => m.id.toString() === selectedMine)?.name} -{" "}
              بيانات المصروفات {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {monthlyData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24 text-right">التاريخ</TableHead>
                      {expenses.map((expense) => (
                        <TableHead
                          key={expense.id}
                          className="text-right min-w-32"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">{expense.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ({expense.unit})
                            </div>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="w-16 text-left"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getUniqueMonths().map((monthKey) => {
                      const [year, month] = monthKey.split("-").map(Number);
                      const monthDate = `${year}-${month
                        .toString()
                        .padStart(2, "0")}`;

                      return (
                        <TableRow key={monthKey}>
                          <TableCell className="font-medium text-right">
                            {monthDate}
                          </TableCell>
                          {expenses.map((expense) => {
                            const data = monthlyData.find(
                              (item) =>
                                item.year === year &&
                                item.month === month &&
                                item.expense.id === expense.id
                            );
                            return (
                              <TableCell
                                key={expense.id}
                                className="text-right"
                              >
                                {data ? data.price.toFixed(2) : "-"}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-left">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    exportMonthlyInvoice(year, month)
                                  }
                                >
                                  <FileText className="me-2 h-4 w-4" />
                                  تصدير الفاتورة
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد بيانات مصروفات لهذا المنجم والسنة.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <AddExpenseDataDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        mineId={selectedMine ? parseInt(selectedMine) : undefined}
        expenses={expenses}
        onDataAdded={refreshData}
      />
    </div>
  );
}
