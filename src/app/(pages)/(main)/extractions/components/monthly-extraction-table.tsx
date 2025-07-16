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
import { Plus, Loader2, Download } from "lucide-react";
import { MaterialService } from "../../../../../../client/services/MaterialService";
import { MineService } from "../../../../../../client/services/MineService";
import { MineMonthlyDataService } from "../../../../../../client/services/MineMonthlyDataService";
import { MaterialResponse } from "../../../../../../client/models/MaterialResponse";
import { MineResponse } from "../../../../../../client/models/MineResponse";
import { AddExtractionDataDialog } from "./add-extraction-data-dialog";

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
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
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
          MaterialService.materialControllerFindMany({})
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
        const response = await MineMonthlyDataService.mineMonthlyDataControllerFindMany({
          mineId: parseInt(selectedMine),
          year: parseInt(selectedYear)
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
          const response = await MineMonthlyDataService.mineMonthlyDataControllerFindMany({
            mineId: parseInt(selectedMine),
            year: parseInt(selectedYear)
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
    monthlyData.forEach(data => {
      months.add(`${data.year}-${data.month}`);
    });
    return Array.from(months).sort();
  };

  const exportToCSV = () => {
    if (!selectedMine || !selectedYear || monthlyData.length === 0) return;

    // Create CSV headers
    const headers = ['Date', ...materials.map(material => `${material.name} (${material.unit})`)];
    
    // Create CSV rows
    const rows = getUniqueMonths().map(monthKey => {
      const [year, month] = monthKey.split('-').map(Number);
      const monthDate = `${year}-${month.toString().padStart(2, '0')}`;
      
      const row = [monthDate];
      materials.forEach(material => {
        const data = monthlyData.find(
          item => item.year === year && 
                 item.month === month && 
                 item.material.id === material.id
        );
        row.push(data ? data.quantity.toString() : '0');
      });
      
      return row;
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `extraction-data-${mines.find(m => m.id.toString() === selectedMine)?.name}-${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                disabled={!selectedMine || !selectedYear || monthlyData.length === 0}
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
              {mines.find(m => m.id.toString() === selectedMine)?.name} - {selectedYear} Extraction Data
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
                        <TableHead key={material.id} className="text-center min-w-32">
                          <div className="space-y-1">
                            <div className="font-medium">{material.name}</div>
                            <div className="text-xs text-muted-foreground">({material.unit})</div>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getUniqueMonths().map((monthKey) => {
                      const [year, month] = monthKey.split('-').map(Number);
                      const monthDate = `${year}-${month.toString().padStart(2, '0')}`;
                      
                      return (
                        <TableRow key={monthKey}>
                          <TableCell className="font-medium">{monthDate}</TableCell>
                          {materials.map((material) => {
                            const data = monthlyData.find(
                              item => item.year === year && 
                                     item.month === month && 
                                     item.material.id === material.id
                            );
                            return (
                              <TableCell key={material.id} className="text-center">
                                {data ? data.quantity : '-'}
                              </TableCell>
                            );
                          })}
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