"use client";

import { MonthlyExtractionTable } from "./components/monthly-extraction-table";

export default function ExtractionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">الاستخراجات الشهرية</h2>
          <p className="text-gray-600">تتبع استخراج المواد الشهري حسب المنجم</p>
        </div>
      </div>

      <MonthlyExtractionTable />
    </div>
  );
}
