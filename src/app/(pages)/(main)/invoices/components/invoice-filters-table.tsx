"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Loader2 } from "lucide-react";
import { MineMonthlyDataService } from "../../../../../../client/services/MineMonthlyDataService";
import { ExpenseMonthlyDataService } from "../../../../../../client/services/ExpenseMonthlyDataService";
import { EntityResponse } from "../../../../../../client/models/EntityResponse";
import { MineResponse } from "../../../../../../client/models/MineResponse";
import { MaterialResponse } from "../../../../../../client/models/MaterialResponse";
import { ExpenseResponse } from "../../../../../../client/models/ExpenseResponse";
import { InvoiceFilters } from "../page";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface FilteredExtractionData {
  id: number;
  month: number;
  year: number;
  quantity: number;
  isUsed: boolean;
  quantityInCubicMeters?: number;
  dieselPriceThisMonth?: number;
  totalPrice?: number;
  material: {
    id: number;
    name: string;
    unit: string;
  };
  mine: {
    id: number;
    name: string;
  };
  entity: {
    id: number;
    name: string;
  };
}

interface FilteredExpenseData {
  id: number;
  month: number;
  year: number;
  price: number;
  expense: {
    id: number;
    name: string;
    unit: string;
  };
  mine: {
    id: number;
    name: string;
  };
  entity: {
    id: number;
    name: string;
  };
}

interface InvoiceFiltersTableProps {
  filters: InvoiceFilters;
  entities: EntityResponse[];
  mines: MineResponse[];
  materials: MaterialResponse[];
  expenses: ExpenseResponse[];
}

export function InvoiceFiltersTable({
  filters,
  entities,
  mines,
  materials,
  expenses,
}: InvoiceFiltersTableProps) {
  const [extractionData, setExtractionData] = useState<FilteredExtractionData[]>([]);
  const [expenseData, setExpenseData] = useState<FilteredExpenseData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (filters.dateRange?.from && filters.dateRange?.to) {
      loadFilteredData();
    } else {
      setExtractionData([]);
      setExpenseData([]);
    }
  }, [filters]);

  const loadFilteredData = async () => {
    if (!filters.dateRange?.from || !filters.dateRange?.to) return;

    setLoading(true);
    try {
      const promises = [];

      // Load extraction data if needed
      if (filters.includeExtractions) {
        promises.push(
          MineMonthlyDataService.mineMonthlyDataControllerFindMany({
            startDate: filters.dateRange.from.toISOString(),
            endDate: filters.dateRange.to.toISOString(),
            entityIds: filters.entities.length > 0 ? filters.entities : undefined,
            mineIds: filters.mines.length > 0 ? filters.mines : undefined,
            materialIds: filters.materials.length > 0 ? filters.materials : undefined,
            onlyUsed: filters.onlyUsedMaterials,
            skip: 0,
            take: 1000, // Load more data for invoices
          })
        );
      } else {
        promises.push(Promise.resolve({ data: [] }));
      }

      // Load expense data if needed
      if (filters.includeExpenses) {
        promises.push(
          ExpenseMonthlyDataService.expenseMonthlyDataControllerFindMany({
            startDate: filters.dateRange.from.toISOString(),
            endDate: filters.dateRange.to.toISOString(),
            entityIds: filters.entities.length > 0 ? filters.entities : undefined,
            mineIds: filters.mines.length > 0 ? filters.mines : undefined,
            expenseIds: filters.expenses.length > 0 ? filters.expenses : undefined,
            skip: 0,
            take: 1000,
          })
        );
      } else {
        promises.push(Promise.resolve({ data: [] }));
      }

      const [extractionRes, expenseRes] = await Promise.all(promises);
      
      setExtractionData(extractionRes.data || []);
      setExpenseData(expenseRes.data || []);
    } catch (error) {
      console.error("Failed to load filtered data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCombinedInvoice = async () => {
    if (!filters.dateRange?.from || !filters.dateRange?.to) return;

    const startDate = filters.dateRange.from;
    const endDate = filters.dateRange.to;
    
    const arabicMonths = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    
    const dateRange = `${arabicMonths[startDate.getMonth()]} ${startDate.getFullYear()} - ${arabicMonths[endDate.getMonth()]} ${endDate.getFullYear()}`;
    const currentDate = new Date().toLocaleDateString('ar-SA');

    // Group data by entity
    const entitiesInData = new Set<number>();
    extractionData.forEach(item => entitiesInData.add(item.entity.id));
    expenseData.forEach(item => entitiesInData.add(item.entity.id));

    const entityNames = Array.from(entitiesInData).map(id => 
      entities.find(e => e.id === id)?.name || 'غير معروف'
    ).join(', ');

    // Calculate totals
    const totalExtractionValue = extractionData.reduce((sum, item) => 
      sum + (item.totalPrice || 0), 0
    );
    const totalExpenseValue = expenseData.reduce((sum, item) => 
      sum + item.price, 0
    );
    const grandTotal = totalExtractionValue + totalExpenseValue;

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
          <h1 style="font-size: 24px; margin: 0; color: #2c3e50; font-weight: bold;">فاتورة شاملة</h1>
          <p style="font-size: 14px; margin: 10px 0; color: #000000;">تقرير الاستخراج والمصروفات</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="width: 48%;">
            <h3 style="margin: 0 0 10px 0; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; font-size: 14px;">معلومات العمليات</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">الجهات: ${entityNames}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">فترة التقرير: ${dateRange}</p>
          </div>
          <div style="width: 48%;">
            <h3 style="margin: 0 0 10px 0; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; font-size: 14px;">ملخص المالي</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">تاريخ الإنشاء: ${currentDate}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">مجموع الاستخراج: $${totalExtractionValue.toFixed(2)}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">مجموع المصروفات: $${totalExpenseValue.toFixed(2)}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333; font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px;">المجموع الكلي: $${grandTotal.toFixed(2)}</p>
          </div>
        </div>

        ${filters.includeExtractions && extractionData.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #34495e; font-size: 16px;">بيانات الاستخراج</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #dddddd;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">الجهة</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">المنجم</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">المادة</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">الكمية</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">السعر الإجمالي</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              ${extractionData.map((item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">${item.entity.name}</td>
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">${item.mine.name}</td>
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">${item.material.name}</td>
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">${item.quantity} ${item.material.unit}</td>
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">$${(item.totalPrice || 0).toFixed(2)}</td>
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">${item.year}-${item.month.toString().padStart(2, '0')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${filters.includeExpenses && expenseData.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #34495e; font-size: 16px;">بيانات المصروفات</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #dddddd;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">الجهة</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">المنجم</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">نوع المصروف</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">السعر</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px;">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              ${expenseData.map((item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">${item.entity.name}</td>
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">${item.mine.name}</td>
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">${item.expense.name}</td>
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">$${item.price.toFixed(2)}</td>
                  <td style="border: 1px solid #dddddd; padding: 6px; text-align: center; font-size: 9px;">${item.year}-${item.month.toString().padStart(2, '0')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #7f8c8d; border-top: 1px solid #bdc3c7; padding-top: 20px;">
          <p style="margin: 5px 0;">تم إنشاء هذه الفاتورة تلقائياً من نظام إدارة الفواتير</p>
          <p style="margin: 5px 0;">تم الإنشاء في ${currentDate}</p>
        </div>
      </div>
    `;

    // Generate PDF
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
      
      const filename = `فاتورة-شاملة-${dateRange.replace(/\s+/g, "-")}.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    }
  };

  const hasData = extractionData.length > 0 || expenseData.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtered Invoice Data</CardTitle>
          {hasData && (
            <Button onClick={generateCombinedInvoice}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Combined Invoice
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading filtered data...
          </div>
        ) : !filters.dateRange?.from || !filters.dateRange?.to ? (
          <div className="text-center py-8 text-muted-foreground">
            Please select a date range to view invoice data.
          </div>
        ) : !hasData ? (
          <div className="text-center py-8 text-muted-foreground">
            No data found for the selected filters.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">Total Extractions</h4>
                <p className="text-2xl font-bold text-blue-600">{extractionData.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900">Total Expenses</h4>
                <p className="text-2xl font-bold text-green-600">{expenseData.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900">Total Value</h4>
                <p className="text-2xl font-bold text-purple-600">
                  ${(
                    extractionData.reduce((sum, item) => sum + (item.totalPrice || 0), 0) +
                    expenseData.reduce((sum, item) => sum + item.price, 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Extraction Data */}
            {filters.includeExtractions && extractionData.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Material Extractions</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entity</TableHead>
                        <TableHead>Mine</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Is Used</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extractionData.slice(0, 20).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.entity.name}</TableCell>
                          <TableCell>{item.mine.name}</TableCell>
                          <TableCell>{item.material.name}</TableCell>
                          <TableCell>{item.quantity} {item.material.unit}</TableCell>
                          <TableCell>
                            <Badge variant={item.isUsed ? "default" : "secondary"}>
                              {item.isUsed ? "Used" : "Overburden"}
                            </Badge>
                          </TableCell>
                          <TableCell>${(item.totalPrice || 0).toFixed(2)}</TableCell>
                          <TableCell>{item.year}-{item.month.toString().padStart(2, '0')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {extractionData.length > 20 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing first 20 of {extractionData.length} extraction records
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Expense Data */}
            {filters.includeExpenses && expenseData.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Expenses</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entity</TableHead>
                        <TableHead>Mine</TableHead>
                        <TableHead>Expense Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseData.slice(0, 20).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.entity.name}</TableCell>
                          <TableCell>{item.mine.name}</TableCell>
                          <TableCell>{item.expense.name}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.year}-{item.month.toString().padStart(2, '0')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {expenseData.length > 20 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing first 20 of {expenseData.length} expense records
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}