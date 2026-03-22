import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

import type { DateRange } from '../types/common';

export function toExportFileName(
  module: string,
  dateRange: DateRange,
  extension: 'csv' | 'xlsx' | 'pdf',
): string {
  return `transdata-rndc-${module}-${dateRange.from}-${dateRange.to}.${extension}`;
}

export function exportRowsToCsv(
  rows: Array<Record<string, string | number>>,
  fileName: string,
): void {
  if (!rows.length) {
    return;
  }

  const keys = Object.keys(rows[0]);
  const lines = [keys.join(',')];

  rows.forEach((row) => {
    lines.push(keys.map((key) => JSON.stringify(row[key] ?? '')).join(','));
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', fileName);
  link.click();
}

export function exportRowsToExcel(
  rows: Array<Record<string, string | number>>,
  fileName: string,
): void {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
  XLSX.writeFile(workbook, fileName);
}

export async function exportSectionToPdf(elementId: string, fileName: string): Promise<void> {
  const node = document.getElementById(elementId);

  if (!node) {
    return;
  }

  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: '#020617',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = (canvas.height * pageWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
  pdf.save(fileName);
}
