"use client";

import { useTranslations } from "next-intl";
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
  data: Record<string, unknown>[];
  columns: ExportColumn[];
  filename: string;
  disabled?: boolean;
}

export function ExportDropdown({ data, columns, filename, disabled }: ExportDropdownProps) {
  const t = useTranslations();
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
          {isExporting ? t('export.exporting') : t('common.export')}
          <FiChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          {t('export.csv')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          {t('export.excel')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          {t('export.json')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}