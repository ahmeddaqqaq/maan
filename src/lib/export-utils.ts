// Export utility functions for data export functionality

export interface ExportColumn {
  key: string;
  label: string;
  formatter?: (value: unknown) => string;
}

export function exportToCSV(data: Record<string, unknown>[], columns: ExportColumn[], filename: string) {
  // Create CSV headers with quotes for Arabic support
  const headers = columns.map(col => `"${col.label}"`).join(',');
  
  // Create CSV rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      const formattedValue = col.formatter ? col.formatter(value) : value;
      // Escape quotes and wrap in quotes for all values to ensure proper Arabic handling
      const escaped = String(formattedValue || '').replace(/"/g, '""');
      return `"${escaped}"`; // Always wrap in quotes for Arabic support
    }).join(',');
  });
  
  // Combine headers and rows
  const csvContent = [headers, ...rows].join('\n');
  
  // Add BOM for proper UTF-8 encoding in Excel and other applications
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;
  
  // Create and trigger download with proper UTF-8 encoding
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: Record<string, unknown>[], filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(data: Record<string, unknown>[], columns: ExportColumn[], filename: string) {
  // For Excel export, we'll use a simple HTML table approach that Excel can open
  const headers = columns.map(col => `<th>${col.label}</th>`).join('');
  
  const rows = data.map(item => {
    const cells = columns.map(col => {
      const value = item[col.key];
      const formattedValue = col.formatter ? col.formatter(value) : value;
      return `<td>${String(formattedValue || '')}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  
  const htmlContent = `
    <table>
      <thead>
        <tr>${headers}</tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
  
  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Format helper functions
export const formatters = {
  date: (value: unknown) => {
    return '';
  },
  currency: (value: unknown) => {
    if (typeof value === 'number' && value) {
      return `$${value.toLocaleString()}`;
    }
    return '$0';
  },
  boolean: (value: unknown) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return '';
  },
  role: (value: unknown) => {
    if (typeof value === 'string' && value) {
      return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }
    return '';
  },
};