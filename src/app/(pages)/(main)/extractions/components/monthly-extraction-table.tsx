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
import { MaterialService } from "../../../../../../client/services/MaterialService";
import { MineService } from "../../../../../../client/services/MineService";
import { MineMonthlyDataService } from "../../../../../../client/services/MineMonthlyDataService";
import { MaterialResponse } from "../../../../../../client/models/MaterialResponse";
import { MineResponse } from "../../../../../../client/models/MineResponse";
import { AddExtractionDataDialog } from "./add-extraction-data-dialog";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface MonthlyData {
  id: number;
  month: number;
  year: number;
  quantity: number;
  material: {
    id: number;
    name: string;
    unit: string;
  };
}

export function MonthlyExtractionTable() {
  const [selectedMine, setSelectedMine] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [materials, setMaterials] = useState<MaterialResponse[]>([]);
  const [mines, setMines] = useState<MineResponse[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Load mines and materials on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [minesResponse, materialsResponse] = await Promise.all([
          MineService.mineControllerFindMany({}),
          MaterialService.materialControllerFindMany({}),
        ]);

        setMines(minesResponse.data || []);
        setMaterials(materialsResponse.data || []);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load extraction data when mine or year changes
  useEffect(() => {
    if (!selectedMine || !selectedYear) return;

    const loadExtractionData = async () => {
      setLoading(true);
      try {
        const response =
          await MineMonthlyDataService.mineMonthlyDataControllerFindMany({
            mineId: parseInt(selectedMine),
            year: parseInt(selectedYear),
          });

        setMonthlyData(response.data || []);
      } catch (error) {
        console.error("Failed to load extraction data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExtractionData();
  }, [selectedMine, selectedYear]);

  const refreshData = () => {
    if (selectedMine && selectedYear) {
      // Reload the data
      const loadExtractionData = async () => {
        setLoading(true);
        try {
          const response =
            await MineMonthlyDataService.mineMonthlyDataControllerFindMany({
              mineId: parseInt(selectedMine),
              year: parseInt(selectedYear),
            });
          setMonthlyData(response.data || []);
        } catch (error) {
          console.error("Failed to load extraction data:", error);
        } finally {
          setLoading(false);
        }
      };
      loadExtractionData();
    }
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

    // Create CSV headers
    const headers = [
      "Date",
      ...materials.map((material) => `${material.name} (${material.unit})`),
    ];

    // Create CSV rows
    const rows = getUniqueMonths().map((monthKey) => {
      const [year, month] = monthKey.split("-").map(Number);
      const monthDate = `${year}-${month.toString().padStart(2, "0")}`;

      const row = [monthDate];
      materials.forEach((material) => {
        const data = monthlyData.find(
          (item) =>
            item.year === year &&
            item.month === month &&
            item.material.id === material.id
        );
        row.push(data ? data.quantity.toString() : "0");
      });

      return row;
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `extraction-data-${
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

    // Get data for the specific month
    const monthData = monthlyData.filter(
      (item) => item.year === year && item.month === month
    );

    // Get Arabic month names
    const arabicMonths = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    
    const arabicDate = `${arabicMonths[month - 1]} ${year}`;
    const currentDate = new Date().toLocaleDateString('ar-SA');

    // Create HTML content with proper Arabic text and fixed colors
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
          <h1 style="font-size: 24px; margin: 0; color: #2c3e50; font-weight: bold;">فاتورة الاستخراج الشهرية</h1>
          <p style="font-size: 14px; margin: 10px 0; color: #000000;">تقرير استخراج المنجم</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="width: 48%;">
            <h3 style="margin: 0 0 10px 0; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; font-size: 14px;">معلومات المنجم</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">اسم المنجم: ${mineName}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">فترة الاستخراج: ${arabicDate}</p>
          </div>
          <div style="width: 48%;">
            <h3 style="margin: 0 0 10px 0; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; font-size: 14px;">تفاصيل التقرير</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">تاريخ الإنشاء: ${currentDate}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">إجمالي المواد: ${monthData.length}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #dddddd;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #dddddd; padding: 12px; text-align: center; font-weight: bold; color: #333333; font-size: 12px;">الكمية</th>
              <th style="border: 1px solid #dddddd; padding: 12px; text-align: center; font-weight: bold; color: #333333; font-size: 12px;">الوحدة</th>
              <th style="border: 1px solid #dddddd; padding: 12px; text-align: center; font-weight: bold; color: #333333; font-size: 12px;">اسم المادة</th>
            </tr>
          </thead>
          <tbody>
            ${monthData.length > 0 ? monthData.map((item, index) => `
              <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 11px; color: #333333;">${item.quantity}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 11px; color: #333333;">${item.material.unit}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 11px; color: #333333;">${item.material.name}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="3" style="border: 1px solid #dddddd; padding: 20px; text-align: center; color: #7f8c8d; font-size: 12px;">
                  لا توجد بيانات استخراج لهذا الشهر
                </td>
              </tr>
            `}
          </tbody>
        </table>

        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #7f8c8d; border-top: 1px solid #bdc3c7; padding-top: 20px;">
          <p style="margin: 5px 0;">تم إنشاء هذه الفاتورة تلقائياً من نظام إدارة الاستخراج</p>
          <p style="margin: 5px 0;">تم الإنشاء في ${currentDate}</p>
        </div>
      </div>
    `;

    // Create a completely isolated iframe to avoid CSS inheritance
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '800px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    // Wait for iframe to load
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframe.src = 'about:blank';
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      throw new Error('Could not access iframe document');
    }

    // Write the HTML content to the iframe
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
      // Wait a bit for fonts to load
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get the content element from iframe
      const contentElement = iframeDoc.body.firstElementChild as HTMLElement;
      
      // Convert HTML to canvas with better options
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

      // Remove iframe
      document.body.removeChild(iframe);

      // Create PDF with better sizing
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save with proper filename
      const filename = `فاتورة-${mineName.replace(/\s+/g, "-")}-${arabicDate.replace(/\s+/g, "-")}.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Remove iframe in case of error
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      // Show user-friendly error
      alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    }
  };

  if (loading && materials.length === 0) {
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
          <CardTitle>Monthly Extraction Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mine-select">Select Mine</Label>
              <Select value={selectedMine} onValueChange={setSelectedMine}>
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
              <Select value={selectedYear} onValueChange={setSelectedYear}>
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

      {/* Extraction Table */}
      {selectedMine && selectedYear && (
        <Card>
          <CardHeader>
            <CardTitle>
              {mines.find((m) => m.id.toString() === selectedMine)?.name} -{" "}
              {selectedYear} Extraction Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {monthlyData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Date</TableHead>
                      {materials.map((material) => (
                        <TableHead
                          key={material.id}
                          className="text-center min-w-32"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">{material.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ({material.unit})
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
                          {materials.map((material) => {
                            const data = monthlyData.find(
                              (item) =>
                                item.year === year &&
                                item.month === month &&
                                item.material.id === material.id
                            );
                            return (
                              <TableCell
                                key={material.id}
                                className="text-center"
                              >
                                {data ? data.quantity : "-"}
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
                  No extraction data found for this mine and year.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <AddExtractionDataDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        mineId={selectedMine ? parseInt(selectedMine) : undefined}
        materials={materials}
        onDataAdded={refreshData}
      />
    </div>
  );
}
