import { useState } from 'react';
import { exportToCSV, exportToJSON, exportToExcel, ExportColumn } from '@/lib/export-utils';
import { toast } from 'sonner';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (
    data: any[],
    columns: ExportColumn[],
    filename: string,
    format: 'csv' | 'json' | 'excel' = 'csv'
  ) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    setIsExporting(true);
    
    try {
      switch (format) {
        case 'csv':
          exportToCSV(data, columns, filename);
          break;
        case 'json':
          exportToJSON(data, filename);
          break;
        case 'excel':
          exportToExcel(data, columns, filename);
          break;
        default:
          throw new Error('Unsupported export format');
      }
      
      toast.success(`Data exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportData,
    isExporting,
  };
}