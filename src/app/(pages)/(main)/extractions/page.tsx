"use client";

import { MonthlyExtractionTable } from "./components/monthly-extraction-table";

export default function ExtractionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Monthly Extractions</h2>
          <p className="text-gray-600">Track monthly material extractions by mine</p>
        </div>
      </div>

      <MonthlyExtractionTable />
    </div>
  );
}