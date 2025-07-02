// Export utility functions for data export functionality

export interface ExportColumn {
  key: string;
  label: string;
  formatter?: (value: any) => string;
}

export function exportToCSV(data: any[], columns: ExportColumn[], filename: string) {
  // Create CSV headers
  const headers = columns.map(col => col.label).join(',');
  
  // Create CSV rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      const formattedValue = col.formatter ? col.formatter(value) : value;
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(formattedValue || '').replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    }).join(',');
  });
  
  // Combine headers and rows
  const csvContent = [headers, ...rows].join('\n');
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: any[], filename: string) {
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

export function exportToExcel(data: any[], columns: ExportColumn[], filename: string) {
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
  date: (value: string) => value ? new Date(value).toLocaleDateString() : '',
  currency: (value: number) => value ? `$${value.toLocaleString()}` : '$0',
  boolean: (value: boolean) => value ? 'Yes' : 'No',
  role: (value: string) => value ? value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : '',
};