import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  FileText,
  MessageSquare,
  Activity,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Download,
  Send,
  Star, Eye, Copy, ExternalLink, Settings, MoreVertical,
  Edit, Archive, Trash2, RefreshCw, TrendingDown, BarChart2,
  PieChart, LineChart, Zap, Target, Award, Plus, X
} from 'lucide-react';
import { mockRenewals } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

// Mock historical policy data
const mockPolicyHistory = [
  {
    year: 2023,
    carrier: 'Liberty Mutual',
    premium: 45000,
    coverages: ['General Liability', 'Professional Liability', 'Cyber Liability'],
    limits: {
      generalLiability: '$2M/$4M',
      professionalLiability: '$1M/$3M',
      cyberLiability: '$1M'
    },
    deductibles: {
      generalLiability: '$5,000',
      professionalLiability: '$10,000',
      cyberLiability: '$5,000'
    },
    claims: 0,
    notes: 'Initial policy with Liberty Mutual. Client was previously with Travelers at a higher premium.'
  },
  {
    year: 2022,
    carrier: 'Travelers',
    premium: 48000,
    coverages: ['General Liability', 'Professional Liability', 'Cyber Liability'],
    limits: {
      generalLiability: '$2M/$4M',
      professionalLiability: '$1M/$2M',
      cyberLiability: '$500K'
    },
    deductibles: {
      generalLiability: '$5,000',
      professionalLiability: '$10,000',
      cyberLiability: '$5,000'
    },
    claims: 0,
    notes: 'Moved from Chubb to Travelers due to premium increase.'
  },
  {
    year: 2021,
    carrier: 'Chubb',
    premium: 42000,
    coverages: ['General Liability', 'Professional Liability'],
    limits: {
      generalLiability: '$2M/$4M',
      professionalLiability: '$1M/$2M'
    },
    deductibles: {
      generalLiability: '$5,000',
      professionalLiability: '$10,000'
    },
    claims: 1,
    claimDetails: [
      {
        date: '2021-05-15',
        type: 'Professional Liability',
        description: 'Client alleged software failure caused data loss',
        amount: 15000,
        status: 'Closed'
      }
    ],
    notes: 'One professional liability claim that was settled for $15,000.'
  }
];

// Mock renewal options
const mockRenewalOptions = [
  {
    id: '1',
    carrier: 'Liberty Mutual',
    premium: 48600,
    changePercentage: 8,
    coverages: ['General Liability', 'Professional Liability', 'Cyber Liability'],
    limits: {
      generalLiability: '$2M/$4M',
      professionalLiability: '$1M/$3M',
      cyberLiability: '$1M'
    },
    deductibles: {
      generalLiability: '$5,000',
      professionalLiability: '$10,000',
      cyberLiability: '$5,000'
    },
    notes: 'Renewal with current carrier. Premium increase due to market conditions.',
    isRecommended: true,
    aiScore: 85,
    pros: [
      'Incumbent carrier with knowledge of the risk',
      'Consistent coverage terms',
      'Simplified renewal process'
    ],
    cons: [
      '8% premium increase',
      'No coverage enhancements'
    ]
  },
  {
    id: '2',
    carrier: 'Travelers',
    premium: 46500,
    changePercentage: 3.3,
    coverages: ['General Liability', 'Professional Liability', 'Cyber Liability'],
    limits: {
      generalLiability: '$2M/$4M',
      professionalLiability: '$1M/$3M',
      cyberLiability: '$1M'
    },
    deductibles: {
      generalLiability: '$7,500',
      professionalLiability: '$15,000',
      cyberLiability: '$10,000'
    },
    notes: 'Lower premium but higher deductibles.',
    isRecommended: false,
    aiScore: 72,
    pros: [
      'Lower premium than incumbent',
      'Similar coverage limits'
    ],
    cons: [
      'Higher deductibles across all coverages',
      'New carrier relationship',
      'More extensive application process'
    ]
  },
  {
    id: '3',
    carrier: 'Chubb',
    premium: 51000,
    changePercentage: 13.3,
    coverages: ['General Liability', 'Professional Liability', 'Cyber Liability', 'Technology E&O'],
    limits: {
      generalLiability: '$2M/$4M',
      professionalLiability: '$2M/$4M',
      cyberLiability: '$2M',
      technologyEO: '$2M'
    },
    deductibles: {
      generalLiability: '$5,000',
      professionalLiability: '$10,000',
      cyberLiability: '$5,000',
      technologyEO: '$10,000'
    },
    notes: 'Premium increase but enhanced coverage with Technology E&O and higher limits.',
    isRecommended: false,
    aiScore: 78,
    pros: [
      'Enhanced coverage with Technology E&O',
      'Higher professional liability limits',
      'Higher cyber liability limits',
      'Premium carrier with excellent claims service'
    ],
    cons: [
      'Significant premium increase',
      'May be more coverage than needed'
    ]
  }
];

// Mock client communications
const mockCommunications = [
  {
    id: '1',
    date: new Date('2024-01-10'),
    type: 'email',
    subject: 'Upcoming Renewal Discussion',
    content: 'Reached out to discuss upcoming renewal and gather updated information.',
    from: 'John Doe',
    to: 'John Smith',
    status: 'sent'
  },
  {
    id: '2',
    date: new Date('2024-01-12'),
    type: 'call',
    subject: 'Renewal Strategy Call',
    content: 'Discussed renewal strategy and potential coverage changes. Client mentioned expansion plans that may require coverage adjustments.',
    from: 'John Doe',
    to: 'John Smith',
    duration: '25 minutes',
    status: 'completed'
  },
  {
    id: '3',
    date: new Date('2024-01-18'),
    type: 'email',
    subject: 'Updated Exposure Information',
    content: 'Received updated revenue figures and employee count for renewal submission.',
    from: 'John Smith',
    to: 'John Doe',
    status: 'received'
  }
];

const RenewalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedYear, setExpandedYear] = useState<number | null>(2023);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Find renewal data
  const renewal = mockRenewals.find(r => r.id === id);

  if (!renewal) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Renewal Not Found</h1>
        <p className="text-gray-600 mb-4">The renewal you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/producer/renewals')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Renewals
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'history', label: 'Policy History', icon: Clock },
    { id: 'options', label: 'Renewal Options', icon: FileText },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: Activity }
  ];

  const toggleYearExpansion = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  const handleAIAction = (action: string) => {
    setSelectedAction(action);
    setShowAIModal(true);
  };

  const executeAIAction = async () => {
    setIsExecuting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`AI action "${selectedAction}" executed successfully!`);
      setShowAIModal(false);
    } catch (error) {
      toast.error('Failed to execute AI action');
    } finally {
      setIsExecuting(false);
    }
  };

  const getChangeColor = (percentage: number) => {
    if (percentage <= 0) return 'text-green-600';
    if (percentage <= 5) return 'text-yellow-600';
    if (percentage <= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  const getChangeIcon = (percentage: number) => {
    if (percentage <= 0) return <TrendingDown className="h-4 w-4 text-green-600" />;
    return <TrendingUp className="h-4 w-4 text-red-600" />;
  };

  const getAIActionSteps = (action: string) => {
    switch (action) {
      case 'shop_carriers':
        return [
          'Analyze current coverage and identify key requirements',
          'Select 3-5 carriers with strong appetite for this risk profile',
          'Prepare comprehensive submission package with loss runs and updated exposures',
          'Highlight positive risk characteristics to underwriters',
          'Schedule follow-up calls with underwriters to advocate for competitive pricing'
        ];
      case 'renegotiate':
        return [
          'Analyze market conditions and comparable accounts',
          'Prepare negotiation strategy based on client tenure and loss history',
          'Request underwriter call to discuss renewal terms',
          'Present alternative quotes as leverage (if available)',
          'Negotiate specific coverage enhancements to offset premium increase'
        ];
      case 'increase_coverage':
        return [
          'Analyze current coverage gaps based on business operations',
          'Identify specific coverage enhancements with highest value',
          'Calculate cost-benefit analysis of increased limits',
          'Prepare visual comparison of current vs. recommended coverage',
          'Develop presentation highlighting risk mitigation benefits'
        ];
      case 'decrease_coverage':
        return [
          'Identify coverages with low utilization potential',
          'Analyze deductible options and premium impact',
          'Calculate risk/reward scenarios for coverage reductions',
          'Prepare cost-saving recommendations with minimal risk exposure',
          'Develop phased approach to implementing changes'
        ];
      case 'no_changes':
        return [
          'Verify all current coverage details are still appropriate',
          'Confirm no business changes that would require coverage updates',
          'Prepare renewal submission to current carrier',
          'Request early renewal indication to lock in current terms',
          'Schedule renewal confirmation meeting with client'
        ];
      default:
        return ['No specific steps available for this action'];
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Client Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <p className="text-gray-900">{renewal.businessName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <p className="text-gray-900">{renewal.clientName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{renewal.contactEmail}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <p className="text-gray-900">{renewal.contactPhone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Tenure</label>
            <p className="text-gray-900">{renewal.clientTenure} {renewal.clientTenure === 1 ? 'year' : 'years'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <p className="text-gray-900">{renewal.assignedTo}</p>
          </div>
        </div>
      </div>

      {/* Renewal Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Renewal Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-blue-700 mb-1">Renewal Date</label>
            <p className="text-xl font-bold text-blue-900">{formatDate(renewal.renewalDate)}</p>
            <p className="text-sm text-blue-700 mt-1">
              {renewal.daysRemaining > 0 
                ? `${renewal.daysRemaining} days remaining` 
                : renewal.daysRemaining === 0 
                  ? 'Due today' 
                  : `${Math.abs(renewal.daysRemaining)} days overdue`}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Premium</label>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(renewal.currentPremium)}</p>
            <p className="text-sm text-gray-600 mt-1">Current Carrier: {renewal.currentCarrier}</p>
          </div>
          <div className={`rounded-lg p-4 ${renewal.changePercentage <= 0 ? 'bg-green-50' : renewal.changePercentage > 10 ? 'bg-red-50' : 'bg-yellow-50'}`}>
            <label className={`block text-sm font-medium mb-1 ${renewal.changePercentage <= 0 ? 'text-green-700' : renewal.changePercentage > 10 ? 'text-red-700' : 'text-yellow-700'}`}>
              Estimated Renewal
            </label>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(renewal.estimatedRenewalPremium)}</p>
            <div className="flex items-center space-x-1 mt-1">
              {getChangeIcon(renewal.changePercentage)}
              <p className={`text-sm font-medium ${getChangeColor(renewal.changePercentage)}`}>
                {renewal.changePercentage > 0 ? '+' : ''}{renewal.changePercentage}% change
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Types</label>
          <div className="flex flex-wrap gap-2">
            {renewal.coverageType.map((coverage, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {coverage}
              </span>
            ))}
          </div>
        </div>

        {renewal.notes && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Notes</h4>
                <p className="text-yellow-800 text-sm mt-1">{renewal.notes}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600">AI-Powered</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => handleAIAction('shop_carriers')}
              className={`p-4 border-2 rounded-xl transition-colors ${
                renewal.changePercentage > 10 
                  ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Shop with new carriers</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {renewal.changePercentage > 10 
                      ? 'Recommended due to significant premium increase' 
                      : 'Explore alternative markets for competitive options'}
                  </p>
                  {renewal.changePercentage > 10 && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-600">Highly Recommended</span>
                    </div>
                  )}
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleAIAction('renegotiate')}
              className={`p-4 border-2 rounded-xl transition-colors ${
                renewal.changePercentage > 5 && renewal.changePercentage <= 10
                  ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Renegotiate pricing</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {renewal.changePercentage > 5 && renewal.changePercentage <= 10
                      ? 'Recommended due to moderate premium increase' 
                      : 'Leverage client history to negotiate better terms'}
                  </p>
                  {renewal.changePercentage > 5 && renewal.changePercentage <= 10 && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-600">Highly Recommended</span>
                    </div>
                  )}
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleAIAction('increase_coverage')}
              className={`p-4 border-2 rounded-xl transition-colors ${
                renewal.clientTenure >= 3 && renewal.changePercentage <= 5
                  ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Increase policy coverage</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {renewal.clientTenure >= 3 && renewal.changePercentage <= 5
                      ? 'Recommended for long-term client with stable pricing' 
                      : 'Enhance protection with additional coverage options'}
                  </p>
                  {renewal.clientTenure >= 3 && renewal.changePercentage <= 5 && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-600">Highly Recommended</span>
                    </div>
                  )}
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleAIAction('decrease_coverage')}
              className={`p-4 border-2 rounded-xl transition-colors ${
                renewal.changePercentage > 15
                  ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Decrease policy coverage</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {renewal.changePercentage > 15
                      ? 'Recommended to offset significant premium increase' 
                      : 'Adjust coverage to reduce premium costs'}
                  </p>
                  {renewal.changePercentage > 15 && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-600">Highly Recommended</span>
                    </div>
                  )}
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleAIAction('no_changes')}
              className={`p-4 border-2 rounded-xl transition-colors ${
                renewal.changePercentage <= 0
                  ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">No changes needed</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {renewal.changePercentage <= 0
                      ? 'Recommended due to favorable renewal terms' 
                      : 'Maintain current coverage and carrier relationship'}
                  </p>
                  {renewal.changePercentage <= 0 && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-600">Highly Recommended</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Mail className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">Send Email</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Phone className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900">Schedule Call</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-900">Set Meeting</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <FileText className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-gray-900">Create Quote</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      {/* Premium Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Premium History</h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
        
        <div className="h-64 w-full">
          {/* This would be a real chart in production */}
          <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="w-full px-8">
              <div className="flex items-end justify-between h-40 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Premium Trend Chart</span>
                </div>
                
                {/* Bars for the chart */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 bg-blue-500 rounded-t-lg" style={{ height: '120px' }}></div>
                  <p className="text-xs mt-2 font-medium">2021</p>
                  <p className="text-xs text-gray-600">{formatCurrency(42000)}</p>
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 bg-blue-500 rounded-t-lg" style={{ height: '137px' }}></div>
                  <p className="text-xs mt-2 font-medium">2022</p>
                  <p className="text-xs text-gray-600">{formatCurrency(48000)}</p>
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 bg-blue-500 rounded-t-lg" style={{ height: '128px' }}></div>
                  <p className="text-xs mt-2 font-medium">2023</p>
                  <p className="text-xs text-gray-600">{formatCurrency(45000)}</p>
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 bg-yellow-500 rounded-t-lg" style={{ height: '139px' }}></div>
                  <p className="text-xs mt-2 font-medium">2024 (Est.)</p>
                  <p className="text-xs text-gray-600">{formatCurrency(48600)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policy History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy History</h3>
        
        <div className="space-y-4">
          {mockPolicyHistory.map((policy) => (
            <div key={policy.year} className="border border-gray-200 rounded-xl overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleYearExpansion(policy.year)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{policy.year} Policy</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{policy.carrier}</span>
                      <span>•</span>
                      <span>{formatCurrency(policy.premium)}</span>
                      <span>•</span>
                      <span>{policy.coverages.length} coverages</span>
                      {policy.claims > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">{policy.claims} claim{policy.claims !== 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {expandedYear === policy.year ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {expandedYear === policy.year && (
                <div className="p-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Coverage Details</h5>
                      <div className="space-y-3">
                        {Object.entries(policy.limits).map(([coverage, limit]) => (
                          <div key={coverage} className="flex justify-between">
                            <span className="text-sm text-gray-600 capitalize">{coverage.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-900">{limit}</span>
                              <span className="text-xs text-gray-500 block">
                                Deductible: {policy.deductibles[coverage as keyof typeof policy.deductibles]}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      {policy.claims > 0 && policy.claimDetails && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">Claims</h5>
                          <div className="space-y-3">
                            {policy.claimDetails.map((claim, index) => (
                              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-red-800">{claim.type}</span>
                                  <span className="text-sm text-red-800">{new Date(claim.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-red-700 mb-2">{claim.description}</p>
                                <div className="flex justify-between text-xs">
                                  <span className="text-red-600">Amount: {formatCurrency(claim.amount)}</span>
                                  <span className={`px-2 py-1 rounded-full ${
                                    claim.status === 'Closed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {claim.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <h5 className="font-medium text-gray-900 mb-3">Notes</h5>
                      <p className="text-sm text-gray-700">{policy.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Evolution</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage
                </th>
                {mockPolicyHistory.map((policy) => (
                  <th key={policy.year} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {policy.year}
                  </th>
                ))}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2024 (Est.)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  General Liability
                </td>
                {mockPolicyHistory.map((policy) => (
                  <td key={policy.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.limits.generalLiability || 'Not Covered'}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $2M/$4M
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Professional Liability
                </td>
                {mockPolicyHistory.map((policy) => (
                  <td key={policy.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.limits.professionalLiability || 'Not Covered'}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $1M/$3M
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Cyber Liability
                </td>
                {mockPolicyHistory.map((policy) => (
                  <td key={policy.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.limits.cyberLiability || 'Not Covered'}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $1M
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Premium
                </td>
                {mockPolicyHistory.map((policy) => (
                  <td key={policy.year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(policy.premium)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(renewal.estimatedRenewalPremium)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Carrier
                </td>
                {mockPolicyHistory.map((policy) => (
                  <td key={policy.year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.carrier}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {renewal.currentCarrier} (Expected)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOptionsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Renewal Options</h3>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Plus className="h-4 w-4" />
            <span>Add Option</span>
          </button>
        </div>
        
        <div className="space-y-6">
          {mockRenewalOptions.map((option) => (
            <div 
              key={option.id} 
              className={`border-2 rounded-xl overflow-hidden ${
                option.isRecommended ? 'border-green-300' : 'border-gray-200'
              }`}
            >
              <div className="p-4 bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-gray-900">{option.carrier}</h4>
                        {option.isRecommended && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            ⭐ Recommended
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(option.premium)}</span>
                        <div className="flex items-center space-x-1">
                          {option.changePercentage > 0 ? (
                            <TrendingUp className={`h-4 w-4 ${getChangeColor(option.changePercentage)}`} />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-600" />
                          )}
                          <span className={`text-sm font-medium ${getChangeColor(option.changePercentage)}`}>
                            {option.changePercentage > 0 ? '+' : ''}{option.changePercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">{option.aiScore}</span>
                    </div>
                    <p className="text-xs text-gray-500">AI Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Coverage Details</h5>
                    <div className="space-y-3">
                      {Object.entries(option.limits).map(([coverage, limit]) => (
                        <div key={coverage} className="flex justify-between">
                          <span className="text-sm text-gray-600 capitalize">{coverage.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">{limit}</span>
                            <span className="text-xs text-gray-500 block">
                              Deductible: {option.deductibles[coverage as keyof typeof option.deductibles]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">AI Analysis</h5>
                    <div className="space-y-3">
                      <div>
                        <h6 className="text-sm font-medium text-green-700">Pros</h6>
                        <ul className="mt-1 space-y-1">
                          {option.pros.map((pro, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span className="text-gray-700">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="text-sm font-medium text-red-700">Cons</h6>
                        <ul className="mt-1 space-y-1">
                          {option.cons.map((con, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                              <span className="text-gray-700">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">{option.notes}</p>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Present to Client
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommunicationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Communication History</h3>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              <Mail className="h-4 w-4" />
              <span>Send Email</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              <Phone className="h-4 w-4" />
              <span>Log Call</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>Add Note</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {mockCommunications.map((comm) => (
            <div key={comm.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${
                comm.type === 'email' ? 'bg-blue-100' : 
                comm.type === 'call' ? 'bg-green-100' : 
                'bg-purple-100'
              }`}>
                {comm.type === 'email' ? (
                  <Mail className="h-5 w-5 text-blue-600" />
                ) : comm.type === 'call' ? (
                  <Phone className="h-5 w-5 text-green-600" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                  <span className="text-sm text-gray-500">{comm.date.toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{comm.content}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>From: {comm.from}</span>
                  <span>To: {comm.to}</span>
                  {comm.type === 'call' && comm.duration && (
                    <span>Duration: {comm.duration}</span>
                  )}
                  {comm.type === 'email' && (
                    <span className={`px-2 py-1 rounded-full ${
                      comm.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      comm.status === 'received' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {comm.status}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
        <div className="space-y-4">
          {[
            { action: 'Renewal notice sent to client', date: new Date('2024-01-10'), type: 'email' },
            { action: 'Initial renewal discussion call', date: new Date('2024-01-12'), type: 'call' },
            { action: 'Updated exposure information received', date: new Date('2024-01-18'), type: 'document' },
            { action: 'Renewal submission created', date: new Date('2024-01-20'), type: 'submission' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${
                activity.type === 'email' ? 'bg-blue-100' :
                activity.type === 'call' ? 'bg-green-100' :
                activity.type === 'document' ? 'bg-yellow-100' :
                'bg-purple-100'
              }`}>
                {activity.type === 'email' ? (
                  <Mail className="h-4 w-4 text-blue-600" />
                ) : activity.type === 'call' ? (
                  <Phone className="h-4 w-4 text-green-600" />
                ) : activity.type === 'document' ? (
                  <FileText className="h-4 w-4 text-yellow-600" />
                ) : (
                  <Send className="h-4 w-4 text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500 mt-1">{activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAIActionModal = () => {
    if (!selectedAction) return null;
    
    const actionTitles: Record<string, string> = {
      shop_carriers: 'Shop with New Carriers',
      renegotiate: 'Renegotiate Pricing',
      increase_coverage: 'Increase Policy Coverage',
      decrease_coverage: 'Decrease Policy Coverage',
      no_changes: 'No Changes Needed'
    };
    
    const actionDescriptions: Record<string, string> = {
      shop_carriers: 'AI-generated plan to explore alternative markets and secure competitive quotes',
      renegotiate: 'Strategy to negotiate better terms with the current carrier',
      increase_coverage: 'Recommendations for enhancing protection with additional coverage',
      decrease_coverage: 'Plan to adjust coverage to reduce premium costs',
      no_changes: 'Confirmation of current coverage adequacy and renewal process'
    };
    
    const steps = getAIActionSteps(selectedAction);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900">{actionTitles[selectedAction]}</h2>
                  <p className="text-blue-800">{actionDescriptions[selectedAction]}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAIModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">AI-Generated Action Plan</h4>
                    <p className="text-yellow-800 text-sm mt-1">
                      This plan was created specifically for {renewal.businessName} based on their renewal data, 
                      policy history, and current market conditions.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Step-by-Step Action Plan</h4>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full flex-shrink-0">
                        <span className="text-sm font-medium text-blue-800">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-gray-900">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Expected Outcome</h4>
                    <p className="text-blue-800 text-sm mt-1">
                      {selectedAction === 'shop_carriers' && 'Potential premium savings of 5-15% with comparable or improved coverage.'}
                      {selectedAction === 'renegotiate' && 'Potential reduction in premium increase from 8% to 3-5% while maintaining coverage.'}
                      {selectedAction === 'increase_coverage' && 'Enhanced protection with minimal premium impact (estimated 2-4% additional premium).'}
                      {selectedAction === 'decrease_coverage' && 'Potential premium reduction of 5-10% by adjusting coverage and deductibles.'}
                      {selectedAction === 'no_changes' && 'Smooth renewal process with current terms and minimal disruption.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
            <button
              onClick={() => setShowAIModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={executeAIAction}
              disabled={isExecuting}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Apply This Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/producer/renewals')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {renewal.businessName}
              </h1>
              <p className="text-gray-600 mt-1">Renewal Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              renewal.daysRemaining <= 7 ? 'bg-red-100 text-red-800' :
              renewal.daysRemaining <= 30 ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              Renews: {formatDate(renewal.renewalDate)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'history' && renderHistoryTab()}
            {activeTab === 'options' && renderOptionsTab()}
            {activeTab === 'communication' && renderCommunicationTab()}
            {activeTab === 'activity' && renderActivityTab()}
          </div>
        </div>
      </div>

      {/* AI Action Modal */}
      {showAIModal && renderAIActionModal()}
    </div>
  );
};

export default RenewalDetail;