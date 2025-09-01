"use client";

import React, { useState, useEffect } from "react";
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
  Trash2,
  Edit,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { MineMonthlyDataResponse } from "../../../../../../client/models/MineMonthlyDataResponse";

type MonthlyData = MineMonthlyDataResponse & {
  entity: {
    id: number;
    name: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
};

export function MonthlyExtractionTable() {
  const [selectedMine, setSelectedMine] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [materials, setMaterials] = useState<MaterialResponse[]>([]);
  const [mines, setMines] = useState<MineResponse[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingMonth, setEditingMonth] = useState<{
    year: number;
    month: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 7;

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

  // Load extraction data when a mine is selected
  useEffect(() => {
    if (!selectedMine) {
      setMonthlyData([]);
      return;
    }

    const loadExtractionData = async () => {
      setLoading(true);
      try {
        const extractionDataResponse =
          await MineMonthlyDataService.mineMonthlyDataControllerFindMany({
            skip: 0,
            take: 10000, // Large number to get all data
            mineId: parseInt(selectedMine),
          });

        setMonthlyData((extractionDataResponse.data || []) as MonthlyData[]);
        setTotalRows(extractionDataResponse.rows || 0);
        setTotalPages(Math.ceil((extractionDataResponse.rows || 0) / pageSize));
      } catch (error) {
        console.error("Failed to load extraction data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExtractionData();
  }, [selectedMine]);

  // State for filtered and paginated data
  const [filteredData, setFilteredData] = useState<MonthlyData[]>([]);

  // Helper to get filtered data (all filtered data, not just current page)
  const getAllFilteredData = () => {
    let filtered = [...monthlyData];

    if (selectedYear) {
      filtered = filtered.filter(
        (item) => item.year === parseInt(selectedYear)
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (item) => item.month === parseInt(selectedMonth)
      );
    }

    return filtered;
  };

  // Filter and paginate data when filters or page changes
  useEffect(() => {
    let filtered = [...monthlyData];

    // Apply year filter
    if (selectedYear) {
      filtered = filtered.filter(
        (item) => item.year === parseInt(selectedYear)
      );
    }

    // Apply month filter
    if (selectedMonth) {
      filtered = filtered.filter(
        (item) => item.month === parseInt(selectedMonth)
      );
    }

    // Calculate pagination
    const skip = (currentPage - 1) * pageSize;
    const paginatedData = filtered.slice(skip, skip + pageSize);

    setFilteredData(paginatedData);
    setTotalRows(filtered.length);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  }, [monthlyData, selectedYear, selectedMonth, currentPage]);

  const refreshData = async () => {
    if (!selectedMine) return;

    setLoading(true);
    try {
      const response =
        await MineMonthlyDataService.mineMonthlyDataControllerFindMany({
          skip: 0,
          take: 10000, // Large number to get all data
          mineId: parseInt(selectedMine),
        });
      setMonthlyData((response.data || []) as MonthlyData[]);
      // Filtering and pagination will be handled by the useEffect
    } catch (error) {
      console.error("Failed to load extraction data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters change
  const handleMineChange = (value: string) => {
    setSelectedMine(value);
    setCurrentPage(1);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setCurrentPage(1);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    setCurrentPage(1);
  };

  const getUniqueMonths = () => {
    const months = new Set<string>();
    let dataToUse = [...monthlyData];

    if (selectedYear) {
      dataToUse = dataToUse.filter(
        (item) => item.year === parseInt(selectedYear)
      );
    }

    if (selectedMonth) {
      dataToUse = dataToUse.filter(
        (item) => item.month === parseInt(selectedMonth)
      );
    }

    dataToUse.forEach((data) => {
      months.add(`${data.year}-${data.month}`);
    });
    return Array.from(months).sort();
  };

  const exportToCSV = () => {
    const dataToExport = getAllFilteredData();
    if (!selectedMine || dataToExport.length === 0) return;

    // Create CSV headers - include entity column
    const headers = [
      "Date",
      "Entity",
      ...materials.map((material) => `${material.name} (${material.unit})`),
    ];

    // Create CSV rows - one row per entity per month
    const rows = getUniqueMonths().flatMap((monthKey) => {
      const [year, month] = monthKey.split("-").map(Number);
      const monthDate = `${year}-${month.toString().padStart(2, "0")}`;

      // Get data for this month
      const monthDataForRow = dataToExport.filter(
        (item) => item.year === year && item.month === month
      );

      // Group data by entity for this month
      const entitiesMap = new Map<string, typeof monthDataForRow>();
      monthDataForRow.forEach((item) => {
        const entityName =
          (item.entity as { name?: string })?.name || "غير محدد";
        if (!entitiesMap.has(entityName)) {
          entitiesMap.set(entityName, []);
        }
        entitiesMap.get(entityName)?.push(item);
      });

      // Create a row for each entity
      return Array.from(entitiesMap.entries()).map(
        ([entityName, entityData]) => {
          const row = [monthDate, entityName];

          materials.forEach((material) => {
            const data = entityData.find(
              (item) => item.material.id === material.id
            );
            row.push(data ? data.quantity.toString() : "0");
          });

          return row;
        }
      );
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
    const mineName = mines.find((m) => m.id.toString() === selectedMine)?.name;
    const yearSuffix = selectedYear ? `-${selectedYear}` : "";
    const monthSuffix = selectedMonth ? `-${selectedMonth.padStart(2, "0")}` : "";
    link.setAttribute(
      "download",
      `extraction-data-${mineName}${yearSuffix}${monthSuffix}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const editMonthlyData = (year: number, month: number) => {
    setEditingMonth({ year, month });
    setShowEditDialog(true);
  };

  const exportMonthlyInvoice = async (year: number, month: number) => {
    if (!selectedMine) return;

    // Get data for the specific mine and month
    const filteredInvoiceData = monthlyData;
    if (filteredInvoiceData.length === 0) return;

    const mineName =
      mines.find((m) => m.id.toString() === selectedMine)?.name ||
      "منجم غير معروف";

    // Get data for the specific month - only used materials
    const monthData = filteredInvoiceData.filter(
      (item) =>
        item.year === year && item.month === month && item.isUsed === true
    );

    // Group by entity to show each entity's contribution
    const entitiesMap = new Map<string, MonthlyData[]>();
    monthData.forEach((item) => {
      const entityName = (item.entity as { name?: string })?.name || "غير محدد";
      if (!entitiesMap.has(entityName)) {
        entitiesMap.set(entityName, []);
      }
      entitiesMap.get(entityName)?.push(item);
    });

    // Calculate totals based on business requirements
    const totalQuantity = monthData.reduce(
      (sum, item) => sum + item.quantity,
      0
    ); // All materials quantity (tons)
    const usedMaterials = monthData.filter((item) => item.isUsed === true);
    const totalUsedQuantity = usedMaterials.reduce(
      (sum, item) => sum + item.quantity,
      0
    ); // Used materials quantity (tons)
    const totalCubicMeters = usedMaterials.reduce(
      (sum, item) => sum + (item.quantityInCubicMeters || 0),
      0
    ); // Used materials cubic meters
    // const totalDieselCost = usedMaterials.reduce(
    //   (sum, item) => sum + (item.dieselPriceThisMonth || 0),
    //   0
    // ); // Total diesel cost
    const totalValue = usedMaterials.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    ); // Use calculated totalPrice field

    // Get Arabic month names
    const arabicMonths = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    const arabicDate = `${arabicMonths[month - 1]} ${year}`;
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

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
            <p style="margin: 5px 0; font-size: 12px; color: #333333; font-weight: bold;">إجمالي الكمية: ${totalQuantity.toFixed(
              2
            )}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #dddddd;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">الجهة</th>
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">اسم المادة</th>
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">الكمية (طن)</th>
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">الكمية (متر مكعب)</th>
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">القيمة الإجمالية</th>
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            ${
              monthData.length > 0
                ? Array.from(entitiesMap.entries())
                    .flatMap(([entityName, entityItems], groupIndex) => {
                      return entityItems.map((item, itemIndex) => {
                        const globalIndex = groupIndex * 1000 + itemIndex; // Ensure unique index
                        return `
              <tr style="background-color: ${
                globalIndex % 2 === 0 ? "#f9f9f9" : "#ffffff"
              };">
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333; font-weight: bold;">${entityName}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333;">${
                  item.material.name
                }</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333;">${item.quantity.toFixed(
                  2
                )} طن</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333;">
                  ${
                    item.quantityInCubicMeters
                      ? item.quantityInCubicMeters.toFixed(2) + " م³"
                      : "-"
                  }
                </td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333; font-weight: bold;">
                  ${item.totalPrice ? "$" + item.totalPrice.toFixed(2) : "-"}
                </td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333;">
                  ${item.notes || "-"}
                </td>
              </tr>`;
                      });
                    })
                    .join("") +
                  `
              <tr style="background-color: #e8f4f8; border-top: 2px solid #2c3e50;">
                <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;" colspan="2">الإجمالي للمواد المستخدمة</td>
                <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;">${totalQuantity.toFixed(
                  2
                )} طن</td>
                <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;">${totalCubicMeters.toFixed(
                  2
                )} م³</td>
                <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #27ae60; font-weight: bold;">$${totalValue.toFixed(
                  2
                )}</td>
                <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50;">-</td>
              </tr>`
                : `
              <tr>
                <td colspan="6" style="border: 1px solid #dddddd; padding: 20px; text-align: center; color: #7f8c8d; font-size: 12px;">
                  لا توجد مواد مستخدمة لهذا الشهر
                </td>
              </tr>
            `
            }
          </tbody>
        </table>

        <!-- Summary Section -->
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 2px solid #dee2e6;">
          <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px; text-align: center; font-weight: bold;">ملخص الاستخراج الشهري</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="text-align: center;">
              <h4 style="margin: 0 0 10px 0; color: #34495e; font-size: 14px;">المواد الكلية</h4>
              <p style="margin: 5px 0; font-size: 12px; color: #333333;">العدد الكلي: <span style="font-weight: bold;">${
                monthData.length
              }</span></p>
              <p style="margin: 5px 0; font-size: 12px; color: #333333;">الكمية الإجمالية: <span style="font-weight: bold;">${totalQuantity.toFixed(
                2
              )}</span></p>
            </div>
            <div style="text-align: center;">
              <h4 style="margin: 0 0 10px 0; color: #34495e; font-size: 14px;">التفاصيل المالية</h4>
              <p style="margin: 5px 0; font-size: 12px; color: #333333;">المواد المستخدمة: <span style="font-weight: bold;">${
                usedMaterials.length
              }</span></p>
              <p style="margin: 5px 0; font-size: 12px; color: #333333;">الكمية المستخدمة: <span style="font-weight: bold;">${totalUsedQuantity.toFixed(
                2
              )}</span></p>
              <p style="margin: 5px 0; font-size: 12px; color: #333333;">الأمتار المكعبة: <span style="font-weight: bold; color: #e74c3c;">${totalCubicMeters.toFixed(
                2
              )} م³</span></p>
              <p style="margin: 5px 0; font-size: 12px; color: #333333;">القيمة الإجمالية: <span style="font-weight: bold; color: #27ae60;">$${totalValue.toFixed(
                2
              )}</span></p>
            </div>
          </div>
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #7f8c8d; border-top: 1px solid #bdc3c7; padding-top: 20px;">
          <p style="margin: 5px 0;">تم الإنشاء في ${currentDate}</p>
        </div>
      </div>
    `;

    // Create a completely isolated iframe to avoid CSS inheritance
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-9999px";
    iframe.style.left = "-9999px";
    iframe.style.width = "800px";
    iframe.style.height = "600px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    // Wait for iframe to load
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframe.src = "about:blank";
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      throw new Error("Could not access iframe document");
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
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get the content element from iframe
      const contentElement = iframeDoc.body.firstElementChild as HTMLElement;

      // Convert HTML to canvas with better options
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

      // Remove iframe
      document.body.removeChild(iframe);

      // Create PDF with better sizing
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Save with proper filename
      const filename = `فاتورة-${mineName.replace(
        /\s+/g,
        "-"
      )}-${arabicDate.replace(/\s+/g, "-")}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Remove iframe in case of error
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      // Show user-friendly error
      alert("حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.");
    }
  };

  const exportTableAsPDF = async () => {
    if (!selectedMine || getAllFilteredData().length === 0) return;

    const mineName = mines.find((m) => m.id.toString() === selectedMine)?.name || "منجم غير معروف";
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
    });

    // Get filtered data for the table
    const tableData = getAllFilteredData();
    
    // Build filter description
    let filterDescription = "";
    if (selectedYear && selectedMonth) {
      const arabicMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      filterDescription = `${arabicMonths[parseInt(selectedMonth) - 1]} ${selectedYear}`;
    } else if (selectedYear) {
      filterDescription = `سنة ${selectedYear}`;
    } else if (selectedMonth) {
      const arabicMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      filterDescription = `شهر ${arabicMonths[parseInt(selectedMonth) - 1]}`;
    } else {
      filterDescription = "جميع البيانات";
    }

    // Group data by month and entity for display
    const groupedData = new Map<string, Map<string, MonthlyData[]>>();
    tableData.forEach((item) => {
      const monthKey = `${item.year}-${item.month}`;
      const entityName = (item.entity as { name?: string })?.name || "غير محدد";
      
      if (!groupedData.has(monthKey)) {
        groupedData.set(monthKey, new Map());
      }
      if (!groupedData.get(monthKey)?.has(entityName)) {
        groupedData.get(monthKey)?.set(entityName, []);
      }
      groupedData.get(monthKey)?.get(entityName)?.push(item);
    });

    // Calculate grand totals
    const grandTotalTons = tableData.filter(item => item.isUsed).reduce((sum, item) => sum + item.quantity, 0);
    const grandTotalCubic = tableData.reduce((sum, item) => {
      if (item.isUsed) {
        return sum + (item.quantityInCubicMeters || 0);
      } else {
        return sum + item.quantity;
      }
    }, 0);
    const grandTotalPrice = tableData.filter(item => item.isUsed).reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    // Create table rows HTML
    const tableRows = Array.from(groupedData.entries()).flatMap(([monthKey, entitiesMap]) => {
      const [year, month] = monthKey.split("-").map(Number);
      const monthDate = `${year}-${month.toString().padStart(2, "0")}`;
      
      return Array.from(entitiesMap.entries()).map(([entityName, entityData], entityIndex) => {
        const totalTons = entityData.filter(item => item.isUsed).reduce((sum, item) => sum + item.quantity, 0);
        const totalCubic = entityData.reduce((sum, item) => {
          if (item.isUsed) {
            return sum + (item.quantityInCubicMeters || 0);
          } else {
            return sum + item.quantity;
          }
        }, 0);

        const totalPrice = entityData
          .filter(item => item.isUsed)
          .reduce((sum, item) => sum + (item.totalPrice || 0), 0);

        // Create cells for each material
        const materialCells = materials.map(material => {
          const data = entityData.find(item => item.material.id === material.id);
          const hasUsedEntries = tableData.some(item => item.material.id === material.id && item.isUsed);
          
          if (hasUsedEntries) {
            return `
              <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333;">
                ${data && data.isUsed ? data.quantity.toFixed(2) : "-"}
              </td>
              <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333;">
                ${data && data.isUsed && data.quantityInCubicMeters ? data.quantityInCubicMeters.toFixed(2) : "-"}
              </td>
            `;
          } else {
            return `
              <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333;">
                ${data ? data.quantity.toFixed(2) : "-"}
              </td>
            `;
          }
        }).join("");

        return `
          <tr style="background-color: ${entityIndex % 2 === 0 ? "#f9f9f9" : "#ffffff"};">
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333; font-weight: bold;">${monthDate}</td>
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333;">${entityName}</td>
            ${materialCells}
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333; font-weight: bold;">
              ${totalTons > 0 ? totalTons.toFixed(2) : "-"}
            </td>
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #333333; font-weight: bold;">
              ${totalCubic > 0 ? totalCubic.toFixed(2) : "-"}
            </td>
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: center; font-size: 10px; color: #27ae60; font-weight: bold;">
              ${totalPrice > 0 ? "$" + totalPrice.toFixed(2) : "-"}
            </td>
          </tr>
        `;
      });
    }).join("");

    // Create header cells for materials
    const materialHeaders = materials.map(material => {
      const hasUsedEntries = tableData.some(item => item.material.id === material.id && item.isUsed);
      
      if (hasUsedEntries) {
        return `
          <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">
            ${material.name}<br/><small>(طن)</small>
          </th>
          <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">
            ${material.name}<br/><small>(م³)</small>
          </th>
        `;
      } else {
        return `
          <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">
            ${material.name}<br/><small>(م³)</small>
          </th>
        `;
      }
    }).join("");

    // Create totals row for materials
    const materialTotalCells = materials.map(material => {
      const materialData = tableData.filter(item => item.material.id === material.id);
      const hasUsedEntries = materialData.some(item => item.isUsed);
      
      if (hasUsedEntries) {
        const materialTotalTons = materialData.filter(item => item.isUsed).reduce((sum, item) => sum + item.quantity, 0);
        const materialTotalCubic = materialData.filter(item => item.isUsed).reduce((sum, item) => sum + (item.quantityInCubicMeters || 0), 0);
        return `
          <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;">
            ${materialTotalTons > 0 ? materialTotalTons.toFixed(2) : "-"}
          </td>
          <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;">
            ${materialTotalCubic > 0 ? materialTotalCubic.toFixed(2) : "-"}
          </td>
        `;
      } else {
        const materialTotalCubic = materialData.reduce((sum, item) => sum + item.quantity, 0);
        return `
          <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;">
            ${materialTotalCubic > 0 ? materialTotalCubic.toFixed(2) : "-"}
          </td>
        `;
      }
    }).join("");

    const htmlContent = `
      <div style="
        font-family: 'Arial', 'Tahoma', sans-serif;
        direction: rtl;
        text-align: right;
        padding: 20px;
        width: 1200px;
        background: #ffffff;
        color: #333333;
        line-height: 1.6;
        box-sizing: border-box;
      ">
        <div style="text-align: center; border-bottom: 2px solid #333333; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 24px; margin: 0; color: #2c3e50; font-weight: bold;">تقرير الاستخراجات الشهرية</h1>
          <p style="font-size: 14px; margin: 10px 0; color: #000000;">${filterDescription}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="width: 48%;">
            <h3 style="margin: 0 0 10px 0; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; font-size: 14px;">معلومات المنجم</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">اسم المنجم: ${mineName}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">الفترة: ${filterDescription}</p>
          </div>
          <div style="width: 48%;">
            <h3 style="margin: 0 0 10px 0; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; font-size: 14px;">ملخص البيانات</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">تاريخ الإنشاء: ${currentDate}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">إجمالي الأطنان: ${grandTotalTons.toFixed(2)} طن</p>
            <p style="margin: 5px 0; font-size: 12px; color: #333333;">إجمالي الأمتار المكعبة: ${grandTotalCubic.toFixed(2)} م³</p>
            <p style="margin: 5px 0; font-size: 12px; color: #27ae60; font-weight: bold;">إجمالي السعر: $${grandTotalPrice.toFixed(2)}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #dddddd;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">التاريخ</th>
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">الجهة</th>
              ${materialHeaders}
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">إجمالي الأطنان</th>
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">إجمالي م³</th>
              <th style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-weight: bold; color: #333333; font-size: 11px;">إجمالي السعر</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr style="background-color: #e8f4f8; border-top: 2px solid #2c3e50;">
              <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;" colspan="2">الإجمالي العام</td>
              ${materialTotalCells}
              <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;">${grandTotalTons > 0 ? grandTotalTons.toFixed(2) : "-"}</td>
              <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #2c3e50; font-weight: bold;">${grandTotalCubic > 0 ? grandTotalCubic.toFixed(2) : "-"}</td>
              <td style="border: 1px solid #dddddd; padding: 10px; text-align: center; font-size: 11px; color: #27ae60; font-weight: bold;">
                ${(() => {
                  const grandTotalPrice = tableData.filter(item => item.isUsed).reduce((sum, item) => sum + (item.totalPrice || 0), 0);
                  return grandTotalPrice > 0 ? "$" + grandTotalPrice.toFixed(2) : "-";
                })()}
              </td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #7f8c8d; border-top: 1px solid #bdc3c7; padding-top: 20px;">
          <p style="margin: 5px 0;">تم الإنشاء في ${currentDate}</p>
        </div>
      </div>
    `;

    // Create iframe for PDF generation (similar to existing function)
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-9999px";
    iframe.style.left = "-9999px";
    iframe.style.width = "1200px";
    iframe.style.height = "800px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    // Wait for iframe to load
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      iframe.src = "about:blank";
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      throw new Error("Could not access iframe document");
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
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get the content element from iframe
      const contentElement = iframeDoc.body.firstElementChild as HTMLElement;

      // Convert HTML to canvas
      const canvas = await html2canvas(contentElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 1200,
        height: contentElement.scrollHeight || 800,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
        windowHeight: 800,
        foreignObjectRendering: true,
      });

      // Remove iframe
      document.body.removeChild(iframe);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Save with proper filename
      const filename = `تقرير-استخراجات-${mineName.replace(/\s+/g, "-")}-${filterDescription.replace(/\s+/g, "-")}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Remove iframe in case of error
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      alert("حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.");
    }
  };

  if (loading && materials.length === 0) {
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
          <CardTitle>بيانات الاستخراج الشهرية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="month-select">اختر الشهر</Label>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر شهر" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthNum = i + 1;
                    const monthNames = [
                      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
                      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
                    ];
                    return (
                      <SelectItem key={monthNum} value={monthNum.toString()}>
                        {monthNum} - {monthNames[i]}
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
                disabled={!selectedMine || filteredData.length === 0}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 me-2" />
                تصدير CSV
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                onClick={exportTableAsPDF}
                disabled={!selectedMine || filteredData.length === 0}
                variant="outline"
                className="w-full"
              >
                <FileText className="h-4 w-4 me-2" />
                تصدير PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extraction Table */}
      {selectedMine && (
        <Card>
          <CardHeader>
            <CardTitle>
              {mines.find((m) => m.id.toString() === selectedMine)?.name} -{" "}
              بيانات الاستخراج{" "}
              {selectedYear && selectedMonth
                ? `${selectedYear}/${selectedMonth.padStart(2, "0")}`
                : selectedYear
                ? `سنة ${selectedYear}`
                : selectedMonth
                ? `شهر ${selectedMonth}`
                : "جميع البيانات"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {filteredData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24 text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الجهة</TableHead>
                      {materials.map((material) => {
                        // Check if this material has any used entries in the filtered data
                        const allFilteredData = getAllFilteredData();
                        const hasUsedEntries = allFilteredData.some(
                          (item) =>
                            item.material.id === material.id && item.isUsed
                        );

                        if (hasUsedEntries) {
                          // For used materials: show both tons and cubic meters columns
                          return (
                            <React.Fragment key={material.id}>
                              <TableHead className="text-right min-w-28">
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {material.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    (طن)
                                  </div>
                                </div>
                              </TableHead>
                              <TableHead className="text-right min-w-28">
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {material.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    (م³)
                                  </div>
                                </div>
                              </TableHead>
                            </React.Fragment>
                          );
                        } else {
                          // For not used materials: show only cubic meters column
                          return (
                            <TableHead
                              key={material.id}
                              className="text-right min-w-32"
                            >
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {material.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  (م³)
                                </div>
                              </div>
                            </TableHead>
                          );
                        }
                      })}
                      <TableHead className="text-right min-w-28">
                        <div className="space-y-1">
                          <div className="font-medium">إجمالي الأطنان</div>
                          <div className="text-xs text-muted-foreground">
                            (طن)
                          </div>
                        </div>
                      </TableHead>
                      <TableHead className="text-right min-w-28">
                        <div className="space-y-1">
                          <div className="font-medium">إجمالي م³</div>
                          <div className="text-xs text-muted-foreground">
                            (م³)
                          </div>
                        </div>
                      </TableHead>
                      <TableHead className="text-right min-w-32">
                        <div className="space-y-1">
                          <div className="font-medium">إجمالي السعر</div>
                          <div className="text-xs text-muted-foreground">
                            (المواد المستخدمة)
                          </div>
                        </div>
                      </TableHead>
                      <TableHead className="w-16 text-left"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getUniqueMonths().flatMap((monthKey) => {
                      const [year, month] = monthKey.split("-").map(Number);
                      const monthDate = `${year}-${month
                        .toString()
                        .padStart(2, "0")}`;

                      // Calculate totals for this month using filtered data
                      const allFilteredData = getAllFilteredData();
                      const monthDataForRow = allFilteredData.filter(
                        (item) => item.year === year && item.month === month
                      );

                      // Group data by entity for this month
                      const entitiesMap = new Map<
                        string,
                        typeof monthDataForRow
                      >();
                      monthDataForRow.forEach((item) => {
                        const entityName =
                          (item.entity as { name?: string })?.name ||
                          "غير محدد";
                        if (!entitiesMap.has(entityName)) {
                          entitiesMap.set(entityName, []);
                        }
                        entitiesMap.get(entityName)?.push(item);
                      });

                      // Create a row for each entity in this month
                      return Array.from(entitiesMap.entries()).map(
                        ([entityName, entityData]) => {
                          const totalTons = entityData
                            .filter((item) => item.isUsed)
                            .reduce((sum, item) => sum + item.quantity, 0);

                          const totalCubicMeters = entityData.reduce(
                            (sum, item) => {
                              if (item.isUsed) {
                                return sum + (item.quantityInCubicMeters || 0);
                              } else {
                                return sum + item.quantity; // Not used materials: quantity is in m³
                              }
                            },
                            0
                          );

                          const totalPrice = entityData
                            .filter((item) => item.isUsed)
                            .reduce((sum, item) => sum + (item.totalPrice || 0), 0);

                          return (
                            <TableRow key={`${monthKey}-${entityName}`}>
                              <TableCell className="font-medium text-right">
                                {monthDate}
                              </TableCell>
                              <TableCell className="text-right">
                                {entityName}
                              </TableCell>
                              {materials.map((material) => {
                                const data = entityData.find(
                                  (item) => item.material.id === material.id
                                );

                                // Check if this material has any used entries in filtered data
                                const hasUsedEntries = allFilteredData.some(
                                  (item) =>
                                    item.material.id === material.id &&
                                    item.isUsed
                                );

                                if (hasUsedEntries) {
                                  // For used materials: show both tons and cubic meters
                                  return (
                                    <React.Fragment key={material.id}>
                                      <TableCell className="text-right">
                                        <div className="font-medium">
                                          {data && data.isUsed
                                            ? data.quantity.toFixed(2)
                                            : "-"}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="font-medium">
                                          {data &&
                                          data.isUsed &&
                                          data.quantityInCubicMeters
                                            ? data.quantityInCubicMeters.toFixed(
                                                2
                                              )
                                            : "-"}
                                        </div>
                                      </TableCell>
                                    </React.Fragment>
                                  );
                                } else {
                                  // For not used materials: show only cubic meters (from quantity field)
                                  return (
                                    <TableCell
                                      key={material.id}
                                      className="text-right"
                                    >
                                      <div className="font-medium">
                                        {data ? data.quantity.toFixed(2) : "-"}
                                      </div>
                                    </TableCell>
                                  );
                                }
                              })}
                              <TableCell className="text-right">
                                <div className="font-semibold text-primary">
                                  {totalTons > 0 ? totalTons.toFixed(2) : "-"}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-semibold text-primary">
                                  {totalCubicMeters > 0
                                    ? totalCubicMeters.toFixed(2)
                                    : "-"}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-semibold text-green-600">
                                  {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "-"}
                                </div>
                              </TableCell>
                              <TableCell className="text-left">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        editMonthlyData(year, month)
                                      }
                                    >
                                      <Edit className="me-2 h-4 w-4" />
                                      تعديل البيانات
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        exportMonthlyInvoice(year, month)
                                      }
                                    >
                                      <FileText className="me-2 h-4 w-4" />
                                      تصدير الفاتورة
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        if (
                                          confirm(
                                            `هل أنت متأكد من حذف جميع بيانات شهر ${month}/${year} لجهة "${entityName}"؟`
                                          )
                                        ) {
                                          // Delete only data for this specific entity in this month
                                          Promise.all(
                                            entityData.map((item) =>
                                              MineMonthlyDataService.mineMonthlyDataControllerDelete(
                                                {
                                                  id: item.id,
                                                }
                                              )
                                            )
                                          )
                                            .then(() => {
                                              refreshData();
                                            })
                                            .catch((error) => {
                                              console.error(
                                                "Failed to delete entity data:",
                                                error
                                              );
                                              alert(
                                                "فشل في حذف بيانات الجهة. يرجى المحاولة مرة أخرى."
                                              );
                                            });
                                        }
                                      }}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="me-2 h-4 w-4" />
                                      حذف بيانات الجهة
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      );
                    })}
                    {/* Totals Row */}
                    <TableRow className="border-t-2 border-primary bg-muted/50">
                      <TableCell className="font-bold text-right">
                        الإجمالي
                      </TableCell>
                      <TableCell className="font-bold text-right">
                        جميع الجهات
                      </TableCell>
                      {materials.map((material) => {
                        // Calculate total for each material using filtered data
                        const allFilteredData = getAllFilteredData();
                        const materialData = allFilteredData.filter(
                          (item) => item.material.id === material.id
                        );
                        const hasUsedEntries = materialData.some(
                          (item) => item.isUsed
                        );

                        if (hasUsedEntries) {
                          // For used materials: show totals for both tons and cubic meters
                          const materialTotalTons = materialData
                            .filter((item) => item.isUsed)
                            .reduce((sum, item) => sum + item.quantity, 0);

                          const materialTotalCubic = materialData
                            .filter((item) => item.isUsed)
                            .reduce(
                              (sum, item) =>
                                sum + (item.quantityInCubicMeters || 0),
                              0
                            );

                          return (
                            <React.Fragment key={material.id}>
                              <TableCell className="text-right">
                                <div className="font-bold">
                                  {materialTotalTons > 0
                                    ? materialTotalTons.toFixed(2)
                                    : "-"}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-bold">
                                  {materialTotalCubic > 0
                                    ? materialTotalCubic.toFixed(2)
                                    : "-"}
                                </div>
                              </TableCell>
                            </React.Fragment>
                          );
                        } else {
                          // For not used materials: show only cubic meters total
                          const materialTotalCubic = materialData.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          );

                          return (
                            <TableCell key={material.id} className="text-right">
                              <div className="font-bold">
                                {materialTotalCubic > 0
                                  ? materialTotalCubic.toFixed(2)
                                  : "-"}
                              </div>
                            </TableCell>
                          );
                        }
                      })}
                      <TableCell className="text-right">
                        <div className="font-bold text-primary">
                          {(() => {
                            const allFilteredData = getAllFilteredData();
                            const grandTotalTons = allFilteredData
                              .filter((item) => item.isUsed)
                              .reduce((sum, item) => sum + item.quantity, 0);
                            return grandTotalTons > 0
                              ? grandTotalTons.toFixed(2)
                              : "-";
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-primary">
                          {(() => {
                            const allFilteredData = getAllFilteredData();
                            const grandTotalCubic = allFilteredData.reduce(
                              (sum, item) => {
                                if (item.isUsed) {
                                  return (
                                    sum + (item.quantityInCubicMeters || 0)
                                  );
                                } else {
                                  return sum + item.quantity;
                                }
                              },
                              0
                            );
                            return grandTotalCubic > 0
                              ? grandTotalCubic.toFixed(2)
                              : "-";
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-green-600">
                          {(() => {
                            const allFilteredData = getAllFilteredData();
                            const grandTotalPrice = allFilteredData
                              .filter((item) => item.isUsed)
                              .reduce((sum, item) => sum + (item.totalPrice || 0), 0);
                            return grandTotalPrice > 0
                              ? `$${grandTotalPrice.toFixed(2)}`
                              : "-";
                          })()}
                        </div>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {!selectedMine
                    ? "يرجى اختيار منجم لعرض بيانات الاستخراج"
                    : "لا توجد بيانات استخراج لهذا المنجم. اختر سنة واضغط 'إضافة بيانات' لبدء إدخال البيانات."}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 pt-4">
                <div className="text-sm text-muted-foreground">
                  عرض {(currentPage - 1) * pageSize + 1} إلى{" "}
                  {Math.min(currentPage * pageSize, totalRows)} من {totalRows}{" "}
                  إدخال
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage <= 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
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
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage >= totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AddExtractionDataDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        mineId={selectedMine ? parseInt(selectedMine) : undefined}
        materials={materials}
        onDataAdded={refreshData}
        selectedYear={selectedYear}
      />

      {editingMonth && (
        <AddExtractionDataDialog
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) setEditingMonth(null);
          }}
          mineId={selectedMine ? parseInt(selectedMine) : undefined}
          materials={materials}
          onDataAdded={refreshData}
          selectedYear={editingMonth.year.toString()}
          selectedMonth={editingMonth.month.toString()}
          isEditMode={true}
          existingData={getAllFilteredData().filter(
            (item) =>
              item.year === editingMonth.year &&
              item.month === editingMonth.month
          )}
        />
      )}
    </div>
  );
}
