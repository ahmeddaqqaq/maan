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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 7;

  // Load mines and expenses on component mount
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
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load expense data when mine, year, or page changes
  useEffect(() => {
    if (!selectedMine || !selectedYear) return;

    const loadExpenseData = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * pageSize;
        const response =
          await ExpenseMonthlyDataService.expenseMonthlyDataControllerFindMany({
            mineId: parseInt(selectedMine),
            year: parseInt(selectedYear),
            skip,
            take: pageSize,
          });

        setMonthlyData(response.data || []);
        setTotalRows(response.rows || 0);
        setTotalPages(Math.ceil((response.rows || 0) / pageSize));
      } catch (error) {
        console.error("Failed to load expense data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExpenseData();
  }, [selectedMine, selectedYear, currentPage]);

  const refreshData = () => {
    if (selectedMine && selectedYear) {
      const loadExpenseData = async () => {
        setLoading(true);
        try {
          const skip = (currentPage - 1) * pageSize;
          const response =
            await ExpenseMonthlyDataService.expenseMonthlyDataControllerFindMany({
              mineId: parseInt(selectedMine),
              year: parseInt(selectedYear),
              skip,
              take: pageSize,
            });
          setMonthlyData(response.data || []);
          setTotalRows(response.rows || 0);
          setTotalPages(Math.ceil((response.rows || 0) / pageSize));
        } catch (error) {
          console.error("Failed to load expense data:", error);
        } finally {
          setLoading(false);
        }
      };
      loadExpenseData();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMineChange = (value: string) => {
    setSelectedMine(value);
    setCurrentPage(1);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setCurrentPage(1);
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
      "Date",
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
      `expense-data-${
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
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    
    const arabicDate = `${arabicMonths[month - 1]} ${year}`;
    const currentDate = new Date().toLocaleDateString('ar-SA');
    const totalExpenses = monthData.reduce((sum, item) => sum + item.price, 0);

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
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">إجمالي المصروفات: ${monthData.length}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333; font-weight: bold;">المجموع الكلي: $${totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #dddddd;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #dddddd; padding: 12px; text-align: center; font-weight: bold; color: #333333; font-size: 12px;">السعر</th>
              <th style="border: 1px solid #dddddd; padding: 12px; text-align: center; font-weight: bold; color: #333333; font-size: 12px;">الوحدة</th>
              <th style="border: 1px solid #dddddd; padding: 12px; text-align: center; font-weight: bold; color: #333333; font-size: 12px;">نوع المصروف</th>
            </tr>
          </thead>
          <tbody>
            ${monthData.length > 0 ? monthData.map((item, index) => `
              <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 11px; color: #333333;">$${item.price.toFixed(2)}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 11px; color: #333333;">${item.expense.unit}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 11px; color: #333333;">${item.expense.name}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="3" style="border: 1px solid #dddddd; padding: 20px; text-align: center; color: #7f8c8d; font-size: 12px;">
                  لا توجد بيانات مصروفات لهذا الشهر
                </td>
              </tr>
            `}
          </tbody>
        </table>

        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #7f8c8d; border-top: 1px solid #bdc3c7; padding-top: 20px;">
          <p style="margin: 5px 0;">تم إنشاء هذه الفاتورة تلقائياً من نظام إدارة المصروفات</p>
          <p style="margin: 5px 0;">تم الإنشاء في ${currentDate}</p>
        </div>
      </div>
    `;

    // Create isolated iframe for PDF generation
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '800px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframe.src = 'about:blank';
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      throw new Error('Could not access iframe document');
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
      await new Promise(resolve => setTimeout(resolve, 300));
      const contentElement = iframeDoc.body.firstElementChild as HTMLElement;
      
      const canvas = await html2canvas(contentElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: contentElement.scrollHeight || 600,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: 600,
        foreignObjectRendering: true
      });

      document.body.removeChild(iframe);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const filename = `فاتورة-مصروفات-${mineName.replace(/\s+/g, "-")}-${arabicDate.replace(/\s+/g, "-")}.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    }
  };

  if (loading && expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mine-select">Select Mine</Label>
              <Select value={selectedMine} onValueChange={handleMineChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mine" />
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
              <Label htmlFor="year-select">Select Year</Label>
              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a year" />
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
                <Plus className="h-4 w-4 mr-2" />
                Add Data
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
                <Download className="h-4 w-4 mr-2" />
                Export CSV
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
              {selectedYear} Expenses Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {monthlyData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Date</TableHead>
                      {expenses.map((expense) => (
                        <TableHead
                          key={expense.id}
                          className="text-center min-w-32"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">{expense.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ({expense.unit})
                            </div>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="w-16">Actions</TableHead>
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
                          <TableCell className="font-medium">
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
                                className="text-center"
                              >
                                {data ? `$${data.price.toFixed(2)}` : "-"}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center">
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
                                  <FileText className="mr-2 h-4 w-4" />
                                  Export Invoice
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
                  No expense data found for this mine and year.
                </div>
              )}
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 pt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRows)} of {totalRows} entries
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
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