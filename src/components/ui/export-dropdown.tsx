"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiDownload, FiChevronDown } from "react-icons/fi";
import { useExport } from "@/hooks/useExport";
import { ExportColumn } from "@/lib/export-utils";

interface ExportDropdownProps {
  data: any[];
  columns: ExportColumn[];
  filename: string;
  disabled?: boolean;
}

export function ExportDropdown({ data, columns, filename, disabled }: ExportDropdownProps) {
  const { exportData, isExporting } = useExport();

  const handleExport = (format: 'csv' | 'json' | 'excel') => {
    exportData(data, columns, filename, format);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={disabled || isExporting || !data || data.length === 0}
        >
          <FiDownload className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
          <FiChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}