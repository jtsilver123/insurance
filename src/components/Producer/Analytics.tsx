import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Target,
  Calendar,
  Filter,
  Download,
  BarChart3
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Memoize expensive calculations
  const chartData = useMemo(() => ({
    monthly: [
      { month: 'Jan', prospects: 12, bound: 8, revenue: 145000 },
      { month: 'Feb', prospects: 15, bound: 10, revenue: 180000 },
      { month: 'Mar', prospects: 18, bound: 12, revenue: 220000 },
      { month: 'Apr', prospects: 22, bound: 15, revenue: 275000 },
      { month: 'May', prospects: 20, bound: 14, revenue: 250000 },
      { month: 'Jun', prospects: 25, bound: 18, revenue: 320000 }
    ],
    conversion: [
      { stage: 'Prospects', count: 100, percentage: 100 },
      { stage: 'Documents', count: 85, percentage: 85 },
      { stage: 'Forms', count: 72, percentage: 72 },
      { stage: 'Submitted', count: 68, percentage: 68 },
      { stage: 'Quoted', count: 45, percentage: 45 },
      { stage: 'Bound', count: 32, percentage: 32 }
    ],
    carriers: [
      { name: 'Liberty Mutual', value: 35, color: '#0066CC' },
      { name: 'Travelers', value: 25, color: '#00B894' },
      { name: 'Chubb', value: 20, color: '#FDCB6E' },
      { name: 'Hartford', value: 12, color: '#E17055' },
      { name: 'Others', value: 8, color: '#74B9FF' }
    ],
    coverage: [
      { type: 'General Liability', count: 45, revenue: 850000 },
      { type: 'Professional Liability', count: 32, revenue: 640000 },
      { type: 'Cyber Liability', count: 28, revenue: 420000 },
      { type: 'Commercial Property', count: 25, revenue: 380000 },
      { type: 'Workers Comp', count: 22, revenue: 330000 }
    ]
  }), []);

  const kpiCards = useMemo(() => [
    {
      title: 'Total Revenue',
      value: '$1.2M',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Prospects',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Conversion Rate',
      value: '32%',
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'yellow'
    },
    {
      title: 'Avg. Premium',
      value: '$12.5K',
      change: '+5.7%',
      trend: 'up',
      icon: FileText,
      color: 'purple'
    }
  ], []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your performance and insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => (
          <div key={kpi.title} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-${kpi.color}-100`}>
                <kpi.icon className={`h-6 w-6 text-${kpi.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h2>
        <div className="space-y-4">
          {chartData.conversion.map((stage, index) => (
            <div key={stage.stage} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                <span className="text-sm text-gray-600">{stage.count} ({stage.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
              {index < chartData.conversion.length - 1 && (
                <div className="text-xs text-red-600 mt-1">
                  -{chartData.conversion[index].count - chartData.conversion[index + 1].count} drop-off
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Performance Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Coverage Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.coverage.map((coverage) => (
                <tr key={coverage.type} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {coverage.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {coverage.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(coverage.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(Math.round(coverage.revenue / coverage.count))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min(coverage.count * 2, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.min(coverage.count * 2, 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;