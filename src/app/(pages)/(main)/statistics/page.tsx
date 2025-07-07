'use client';

import { useState } from 'react';
import { 
  useRevenueByEntity, 
  useInvoiceTrends, 
  useTopPerformingMines, 
  useClaimsAnalytics, 
  useMineStatistics,
  type StatisticsFilters 
} from '@/hooks/useStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { CalendarDays, TrendingUp, Building, FileText, MapPin } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function StatisticsPage() {
  const t = useTranslations();
  const [filters, setFilters] = useState<StatisticsFilters>({
    startDate: '',
    endDate: '',
    period: 'monthly',
    entityId: undefined,
    mineId: undefined,
    contractId: undefined,
  });

  // Statistics API calls using custom hooks
  const { data: revenueByEntity, isLoading: loadingRevenue } = useRevenueByEntity(filters);
  const { data: invoiceTrends, isLoading: loadingInvoiceTrends } = useInvoiceTrends(filters);
  const { data: topPerformingMines, isLoading: loadingTopMines } = useTopPerformingMines(filters);
  const { data: claimsAnalytics, isLoading: loadingClaimsAnalytics } = useClaimsAnalytics(filters);
  const { data: mineStatistics, isLoading: loadingMineStatistics } = useMineStatistics(filters);

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      period: 'monthly',
      entityId: undefined,
      mineId: undefined,
      contractId: undefined,
    });
  };

  const updateFilter = (key: keyof StatisticsFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('statistics.title')}</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('statistics.filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="startDate">{t('common.startDate')}</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilter('startDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">{t('common.endDate')}</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilter('endDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="period">{t('statistics.period')}</Label>
              <Select value={filters.period} onValueChange={(value) => updateFilter('period', value)}>
                <SelectTrigger id="period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t('statistics.monthly')}</SelectItem>
                  <SelectItem value="quarterly">{t('statistics.quarterly')}</SelectItem>
                  <SelectItem value="yearly">{t('statistics.yearly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="entityId">{t('statistics.entityId')}</Label>
              <Input
                id="entityId"
                type="number"
                value={filters.entityId || ''}
                onChange={(e) => updateFilter('entityId', e.target.value ? Number(e.target.value) : undefined)}
                placeholder={t('statistics.entityIdPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="mineId">{t('statistics.mineId')}</Label>
              <Input
                id="mineId"
                type="number"
                value={filters.mineId || ''}
                onChange={(e) => updateFilter('mineId', e.target.value ? Number(e.target.value) : undefined)}
                placeholder={t('statistics.mineIdPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="contractId">{t('statistics.contractId')}</Label>
              <Input
                id="contractId"
                type="number"
                value={filters.contractId || ''}
                onChange={(e) => updateFilter('contractId', e.target.value ? Number(e.target.value) : undefined)}
                placeholder={t('statistics.contractIdPlaceholder')}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={resetFilters} variant="outline">
              {t('statistics.resetFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Entity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {t('statistics.revenueByEntity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRevenue ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">{t('common.loading')}</div>
            </div>
          ) : revenueByEntity && Array.isArray(revenueByEntity) ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueByEntity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="entityName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">{t('common.noData')}</div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Trends */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('statistics.invoiceTrends')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingInvoiceTrends ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">{t('common.loading')}</div>
            </div>
          ) : invoiceTrends && Array.isArray(invoiceTrends) ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={invoiceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0088FE" name={t('statistics.revenue')} />
                <Line type="monotone" dataKey="count" stroke="#00C49F" name={t('statistics.count')} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">{t('common.noData')}</div>
          )}
        </CardContent>
      </Card>

      {/* Top Performing Mines */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('statistics.topPerformingMines')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTopMines ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">{t('common.loading')}</div>
            </div>
          ) : topPerformingMines && Array.isArray(topPerformingMines) ? (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={topPerformingMines}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mineName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="claimVolume" stackId="1" stroke="#0088FE" fill="#0088FE" name={t('statistics.claimVolume')} />
                <Area type="monotone" dataKey="extractionAmount" stackId="1" stroke="#00C49F" fill="#00C49F" name={t('statistics.extractionAmount')} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">{t('common.noData')}</div>
          )}
        </CardContent>
      </Card>

      {/* Claims Analytics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('statistics.claimsAnalytics')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingClaimsAnalytics ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">{t('common.loading')}</div>
            </div>
          ) : claimsAnalytics && Array.isArray(claimsAnalytics) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={claimsAnalytics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {claimsAnalytics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={claimsAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="processingTime" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">{t('common.noData')}</div>
          )}
        </CardContent>
      </Card>

      {/* Mine Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {t('statistics.mineStatistics')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingMineStatistics ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">{t('common.loading')}</div>
            </div>
          ) : mineStatistics && Array.isArray(mineStatistics) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mineStatistics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="locationCount"
                  >
                    {mineStatistics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mineStatistics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="materialDiversity" fill="#8884D8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">{t('common.noData')}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}