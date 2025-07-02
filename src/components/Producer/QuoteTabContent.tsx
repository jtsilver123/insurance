import React, { useState } from 'react';
import {
  DollarSign,
  Building,
  Shield,
  Star,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Download,
  Send,
  Mail,
  Phone,
  Calendar,
  FileText,
  MessageSquare,
  X,
  Filter,
  Search,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit,
  Zap,
  Award,
  Sparkles,
  Brain,
  RefreshCw,
  BarChart,
  PieChart,
  Users,
  Settings,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface QuoteTabContentProps {
  prospectId: string;
  prospectName: string;
}

interface Quote {
  id: string;
  carrierId: string;
  carrierName: string;
  carrierRating: string;
  annualPremium: number;
  monthlyPremium: number;
  deductible: number;
  effectiveDate: Date;
  expirationDate: Date;
  coverageDetails: {
    generalLiability: string;
    professionalLiability: string;
    cyberLiability: string;
    additionalCoverages: string[];
  };
  limits: {
    perOccurrence: number;
    aggregate: number;
    products: number;
    personalInjury: number;
    cyber: number;
  };
  exclusions: string[];
  endorsements: string[];
  status: 'new' | 'reviewed' | 'presented' | 'accepted' | 'declined';
  receivedDate: Date;
  aiScore: number;
  aiReasoning: string;
  isRecommended: boolean;
  comparisonHighlights: {
    pros: string[];
    cons: string[];
  };
  paymentOptions: {
    annual: { discount: number; total: number };
    monthly: { fee: number; total: number };
    quarterly: { fee: number; total: number };
  };
  bindingRequirements: string[];
  underwriterNotes: string;
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  commissionRate?: number;
  estimatedCommission?: number;
}

interface ComparisonCategory {
  id: string;
  name: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

const QuoteTabContent: React.FC<QuoteTabContentProps> = ({ prospectId, prospectName }) => {
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [showComparisonView, setShowComparisonView] = useState(false);
  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [showQuoteDetailModal, setShowQuoteDetailModal] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('ai_score');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['premium', 'coverage', 'carrier']);
  const [customMessage, setCustomMessage] = useState('');

  // Mock quotes data
  const quotes: Quote[] = [
    {
      id: '1',
      carrierId: '1',
      carrierName: 'Liberty Mutual',
      carrierRating: 'A',
      annualPremium: 45000,
      monthlyPremium: 3750,
      deductible: 5000,
      effectiveDate: new Date('2024-02-01'),
      expirationDate: new Date('2025-02-01'),
      coverageDetails: {
        generalLiability: '$2,000,000 per occurrence / $4,000,000 aggregate',
        professionalLiability: '$1,000,000 per claim / $3,000,000 aggregate',
        cyberLiability: '$1,000,000 per incident',
        additionalCoverages: [
          'Employment Practices Liability',
          'Directors & Officers (Side A)',
          'Crime Coverage ($100,000)',
          'Business Personal Property'
        ]
      },
      limits: {
        perOccurrence: 2000000,
        aggregate: 4000000,
        products: 2000000,
        personalInjury: 1000000,
        cyber: 1000000
      },
      exclusions: [
        'Intentional criminal acts',
        'Nuclear risks',
        'War and terrorism (separate coverage available)',
        'Pollution (separate coverage available)'
      ],
      endorsements: [
        'Technology E&O Enhancement',
        'Cyber Liability Extension',
        'Business Income Extension'
      ],
      status: 'new',
      receivedDate: new Date('2024-01-22'),
      aiScore: 92,
      aiReasoning: 'Excellent overall value with strong technology industry expertise. Comprehensive coverage with competitive pricing and favorable terms. Strong financial rating and excellent claims service history.',
      isRecommended: true,
      comparisonHighlights: {
        pros: [
          'Best overall value',
          'Excellent claims service',
          'Technology industry expertise',
          'Comprehensive cyber coverage',
          'Flexible payment options'
        ],
        cons: [
          'Higher deductible than some options',
          'Requires security questionnaire'
        ]
      },
      paymentOptions: {
        annual: { discount: 5, total: 42750 },
        monthly: { fee: 25, total: 45300 },
        quarterly: { fee: 15, total: 45180 }
      },
      bindingRequirements: [
        'Signed application',
        'Security questionnaire',
        'Payment authorization'
      ],
      underwriterNotes: 'Excellent risk profile with strong management team. Approved for technology E&O enhancement endorsement at no additional cost.',
      documents: [
        {
          id: 'doc1',
          name: 'Liberty Mutual Quote.pdf',
          type: 'quote',
          url: '/documents/liberty-quote.pdf',
          uploadedAt: new Date('2024-01-22')
        },
        {
          id: 'doc2',
          name: 'Coverage Summary.pdf',
          type: 'summary',
          url: '/documents/liberty-summary.pdf',
          uploadedAt: new Date('2024-01-22')
        }
      ],
      commissionRate: 15,
      estimatedCommission: 6750
    },
    {
      id: '2',
      carrierId: '2',
      carrierName: 'Travelers',
      carrierRating: 'A+',
      annualPremium: 48500,
      monthlyPremium: 4042,
      deductible: 2500,
      effectiveDate: new Date('2024-02-01'),
      expirationDate: new Date('2025-02-01'),
      coverageDetails: {
        generalLiability: '$2,000,000 per occurrence / $4,000,000 aggregate',
        professionalLiability: '$1,000,000 per claim / $2,000,000 aggregate',
        cyberLiability: '$500,000 per incident',
        additionalCoverages: [
          'Employment Practices Liability',
          'Business Personal Property',
          'Business Interruption'
        ]
      },
      limits: {
        perOccurrence: 2000000,
        aggregate: 4000000,
        products: 2000000,
        personalInjury: 1000000,
        cyber: 500000
      },
      exclusions: [
        'Intentional criminal acts',
        'Nuclear risks',
        'War and terrorism',
        'Pollution'
      ],
      endorsements: [
        'Technology Services Enhancement',
        'Business Income Extension'
      ],
      status: 'new',
      receivedDate: new Date('2024-01-23'),
      aiScore: 78,
      aiReasoning: 'Strong financial rating and lower deductible, but higher premium and more limited cyber coverage. Good option for businesses prioritizing lower out-of-pocket costs over premium savings.',
      isRecommended: false,
      comparisonHighlights: {
        pros: [
          'Lower deductible',
          'Strong financial rating',
          'Broad coverage',
          'No security questionnaire required'
        ],
        cons: [
          'Higher premium',
          'Limited cyber coverage',
          'Fewer technology-specific enhancements'
        ]
      },
      paymentOptions: {
        annual: { discount: 3, total: 47045 },
        monthly: { fee: 30, total: 48860 },
        quarterly: { fee: 20, total: 48660 }
      },
      bindingRequirements: [
        'Signed application',
        'Payment authorization'
      ],
      underwriterNotes: 'Solid risk with good loss history. Standard terms offered with option to increase cyber limits for additional premium.',
      documents: [
        {
          id: 'doc3',
          name: 'Travelers Quote.pdf',
          type: 'quote',
          url: '/documents/travelers-quote.pdf',
          uploadedAt: new Date('2024-01-23')
        }
      ],
      commissionRate: 12,
      estimatedCommission: 5820
    },
    {
      id: '3',
      carrierId: '3',
      carrierName: 'Chubb',
      carrierRating: 'A++',
      annualPremium: 52000,
      monthlyPremium: 4333,
      deductible: 2500,
      effectiveDate: new Date('2024-02-01'),
      expirationDate: new Date('2025-02-01'),
      coverageDetails: {
        generalLiability: '$2,000,000 per occurrence / $4,000,000 aggregate',
        professionalLiability: '$2,000,000 per claim / $4,000,000 aggregate',
        cyberLiability: '$2,000,000 per incident',
        additionalCoverages: [
          'Employment Practices Liability',
          'Directors & Officers',
          'Crime Coverage ($250,000)',
          'Business Personal Property',
          'Business Interruption',
          'Media Liability'
        ]
      },
      limits: {
        perOccurrence: 2000000,
        aggregate: 4000000,
        products: 2000000,
        personalInjury: 2000000,
        cyber: 2000000
      },
      exclusions: [
        'Intentional criminal acts',
        'Nuclear risks',
        'War and terrorism'
      ],
      endorsements: [
        'Technology E&O Premium Coverage',
        'Cyber Incident Response Team',
        'Business Income Extension',
        'Worldwide Coverage Extension'
      ],
      status: 'new',
      receivedDate: new Date('2024-01-24'),
      aiScore: 85,
      aiReasoning: 'Premium carrier with excellent coverage terms and highest financial rating. Significantly higher limits for professional and cyber liability. Best option for comprehensive coverage despite higher premium.',
      isRecommended: true,
      comparisonHighlights: {
        pros: [
          'Premium carrier reputation',
          'Excellent coverage terms',
          'Highest professional liability limits',
          'Comprehensive cyber coverage',
          'Worldwide coverage',
          'Fewer exclusions'
        ],
        cons: [
          'Most expensive option',
          'Stricter underwriting requirements',
          'Detailed security assessment required'
        ]
      },
      paymentOptions: {
        annual: { discount: 4, total: 49920 },
        monthly: { fee: 35, total: 52420 },
        quarterly: { fee: 25, total: 52100 }
      },
      bindingRequirements: [
        'Signed application',
        'Security assessment',
        'Business continuity plan',
        'Payment authorization'
      ],
      underwriterNotes: 'Premium technology risk with excellent management team. Approved for enhanced coverage package with worldwide extension.',
      documents: [
        {
          id: 'doc4',
          name: 'Chubb Quote.pdf',
          type: 'quote',
          url: '/documents/chubb-quote.pdf',
          uploadedAt: new Date('2024-01-24')
        },
        {
          id: 'doc5',
          name: 'Chubb Coverage Comparison.pdf',
          type: 'comparison',
          url: '/documents/chubb-comparison.pdf',
          uploadedAt: new Date('2024-01-24')
        }
      ],
      commissionRate: 14,
      estimatedCommission: 7280
    }
  ];

  // Comparison categories
  const comparisonCategories: ComparisonCategory[] = [
    { id: 'premium', name: 'Premium & Deductible', description: 'Annual cost and out-of-pocket expenses', importance: 'high' },
    { id: 'coverage', name: 'Coverage Limits', description: 'Policy limits and sublimits', importance: 'high' },
    { id: 'carrier', name: 'Carrier Strength', description: 'Financial rating and claims service', importance: 'medium' },
    { id: 'exclusions', name: 'Exclusions & Limitations', description: 'What\'s not covered', importance: 'medium' },
    { id: 'endorsements', name: 'Endorsements', description: 'Special coverage enhancements', importance: 'medium' },
    { id: 'payment', name: 'Payment Options', description: 'Payment flexibility and terms', importance: 'low' }
  ];

  const handleQuoteSelection = (quoteId: string, selected: boolean) => {
    if (selected) {
      setSelectedQuotes([...selectedQuotes, quoteId]);
    } else {
      setSelectedQuotes(selectedQuotes.filter(id => id !== quoteId));
    }
  };

  const toggleQuoteExpansion = (quoteId: string) => {
    setExpandedQuote(expandedQuote === quoteId ? null : quoteId);
  };

  const handleCompareQuotes = () => {
    if (selectedQuotes.length < 2) {
      toast.error('Please select at least 2 quotes to compare');
      return;
    }
    setShowComparisonView(true);
  };

  const handlePresentToClient = () => {
    if (selectedQuotes.length === 0) {
      toast.error('Please select at least one quote to present');
      return;
    }
    setShowPresentationModal(true);
  };

  const handleSendPresentation = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Quote presentation sent to client successfully');
      setShowPresentationModal(false);
    } catch (error) {
      toast.error('Failed to send presentation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewQuoteDetail = (quoteId: string) => {
    setShowQuoteDetailModal(quoteId);
  };

  const handleCategorySelection = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'presented':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAIScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const filteredQuotes = quotes
    .filter(quote => {
      const matchesFilter = filterStatus === 'all' || quote.status === filterStatus;
      const matchesSearch = quote.carrierName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'ai_score':
          return b.aiScore - a.aiScore;
        case 'premium':
          return a.annualPremium - b.annualPremium;
        case 'carrier':
          return a.carrierName.localeCompare(b.carrierName);
        case 'date':
          return b.receivedDate.getTime() - a.receivedDate.getTime();
        default:
          return b.aiScore - a.aiScore;
      }
    });

  const renderQuoteCards = () => (
    <div className="space-y-6">
      {/* AI Analysis Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 mb-2">🎯 AI Quote Analysis Complete</h3>
            <p className="text-blue-800 mb-4">
              Our AI has analyzed {quotes.length} quotes for {prospectName} and identified the best options based on 
              coverage, pricing, carrier strength, and specific business needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-60 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Top Recommendation</span>
                </div>
                <p className="text-lg font-bold text-blue-900 mt-1">
                  {quotes.find(q => q.isRecommended && q.aiScore === Math.max(...quotes.filter(q => q.isRecommended).map(q => q.aiScore)))?.carrierName}
                </p>
              </div>
              <div className="bg-white bg-opacity-60 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Premium Range</span>
                </div>
                <p className="text-lg font-bold text-blue-900 mt-1">
                  {formatCurrency(Math.min(...quotes.map(q => q.annualPremium)))} - {formatCurrency(Math.max(...quotes.map(q => q.annualPremium)))}
                </p>
              </div>
              <div className="bg-white bg-opacity-60 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Effective Date</span>
                </div>
                <p className="text-lg font-bold text-blue-900 mt-1">
                  {formatDate(quotes[0].effectiveDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search carriers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="presented">Presented</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ai_score">AI Score</option>
              <option value="premium">Premium (Low to High)</option>
              <option value="carrier">Carrier Name</option>
              <option value="date">Date Received</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quote Cards */}
      <div className="space-y-6">
        {filteredQuotes.map((quote) => (
          <div 
            key={quote.id} 
            className={`bg-white rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
              selectedQuotes.includes(quote.id) ? 'border-blue-500 bg-blue-50' : 
              quote.isRecommended ? 'border-green-300' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 pt-1">
                <input
                  type="checkbox"
                  checked={selectedQuotes.includes(quote.id)}
                  onChange={(e) => handleQuoteSelection(quote.id, e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{quote.carrierName}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">Rating: {quote.carrierRating}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                          {quote.status.toUpperCase()}
                        </span>
                        {quote.isRecommended && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            ⭐ Recommended
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end">
                      <div className={`w-10 h-10 ${getAIScoreBg(quote.aiScore)} rounded-full flex items-center justify-center`}>
                        <span className={`text-lg font-bold ${getAIScoreColor(quote.aiScore)}`}>
                          {quote.aiScore}
                        </span>
                      </div>
                      <Star className={`h-4 w-4 ${getAIScoreColor(quote.aiScore)}`} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">AI Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Annual Premium</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(quote.annualPremium)}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(quote.monthlyPremium)}/month</p>
                    {quote.commissionRate && quote.estimatedCommission && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-green-600 font-medium">
                          {formatCurrency(quote.estimatedCommission)} commission
                        </span>
                        <span className="text-xs text-gray-500">
                          ({quote.commissionRate}%)
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deductible</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(quote.deductible)}</p>
                    <p className="text-sm text-gray-600">Per occurrence</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Coverage Period</p>
                    <p className="text-lg font-bold text-gray-900">{formatDate(quote.effectiveDate)}</p>
                    <p className="text-sm text-gray-600">to {formatDate(quote.expirationDate)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Coverage Highlights</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span className="text-sm text-gray-900">{quote.coverageDetails.generalLiability}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span className="text-sm text-gray-900">{quote.coverageDetails.professionalLiability}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">AI Analysis</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{quote.aiReasoning}</p>
                </div>

                {/* Expanded View */}
                {expandedQuote === quote.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Comparison Highlights</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-green-700 mb-2">Advantages</p>
                          <ul className="space-y-1">
                            {quote.comparisonHighlights.pros.map((pro, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <ThumbsUp className="h-4 w-4 text-green-600 mt-0.5" />
                                <span className="text-sm text-gray-700">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-700 mb-2">Considerations</p>
                          <ul className="space-y-1">
                            {quote.comparisonHighlights.cons.map((con, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <ThumbsDown className="h-4 w-4 text-red-600 mt-0.5" />
                                <span className="text-sm text-gray-700">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Payment Options</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <p className="font-medium text-gray-900">Annual</p>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(quote.paymentOptions.annual.total)}</p>
                          <p className="text-xs text-green-600">{quote.paymentOptions.annual.discount}% discount</p>
                        </div>
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <p className="font-medium text-gray-900">Quarterly</p>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(quote.paymentOptions.quarterly.total / 4)}/quarter</p>
                          <p className="text-xs text-gray-600">${quote.paymentOptions.quarterly.fee} fee per payment</p>
                        </div>
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <p className="font-medium text-gray-900">Monthly</p>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(quote.paymentOptions.monthly.total / 12)}/month</p>
                          <p className="text-xs text-gray-600">${quote.paymentOptions.monthly.fee} fee per payment</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Binding Requirements</h5>
                      <ul className="space-y-1">
                        {quote.bindingRequirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                            <span className="text-sm text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Documents</h5>
                      <div className="space-y-2">
                        {quote.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900">{doc.name}</p>
                                <p className="text-xs text-gray-500">Uploaded {doc.uploadedAt.toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleQuoteExpansion(quote.id)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {expandedQuote === quote.id ? (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          <span>Show Less</span>
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4" />
                          <span>Show More</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleViewQuoteDetail(quote.id)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Received {quote.receivedDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Bar */}
      {selectedQuotes.length > 0 && (
        <div className="fixed bottom-0 left-72 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedQuotes.length} quote{selectedQuotes.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedQuotes.length >= 2 ? 'Ready to compare or present' : 'Select another quote to compare'}
                    </p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Selected:</span>
                  <div className="flex space-x-1">
                    {selectedQuotes.slice(0, 3).map((quoteId) => {
                      const quote = quotes.find(q => q.id === quoteId);
                      return (
                        <span key={quoteId} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {quote?.carrierName}
                        </span>
                      );
                    })}
                    {selectedQuotes.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{selectedQuotes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedQuotes([])}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Selection
                </button>
                {selectedQuotes.length >= 2 && (
                  <button
                    onClick={handleCompareQuotes}
                    className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <BarChart className="h-4 w-4" />
                    <span>Compare</span>
                  </button>
                )}
                <button
                  onClick={handlePresentToClient}
                  disabled={selectedQuotes.length === 0}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Present to Client</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderComparisonView = () => {
    const selectedQuoteData = quotes.filter(quote => selectedQuotes.includes(quote.id));
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Quote Comparison</h3>
          <button
            onClick={() => setShowComparisonView(false)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Exit Comparison</span>
          </button>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Comparison Categories</p>
          <div className="flex flex-wrap gap-2">
            {comparisonCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelection(category.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategories.includes(category.id)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Feature
                  </th>
                  {selectedQuoteData.map((quote) => (
                    <th key={quote.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <span>{quote.carrierName}</span>
                        {quote.isRecommended && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full normal-case">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(quote.estimatedCommission || 0)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({quote.commissionRate || 0}% commission)
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Premium & Deductible */}
                {selectedCategories.includes('premium') && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={selectedQuoteData.length + 1} className="px-6 py-3">
                        <h4 className="font-medium text-gray-900">Premium & Deductible</h4>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Annual Premium
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          <span className="font-bold">{formatCurrency(quote.annualPremium)}</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Monthly Premium
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(quote.monthlyPremium)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Deductible
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(quote.deductible)}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Agency Commission
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <p className="font-semibold text-green-600">{formatCurrency(quote.estimatedCommission || 0)}</p>
                            <span className="text-xs text-gray-500">({quote.commissionRate || 0}%)</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* Coverage Limits */}
                {selectedCategories.includes('coverage') && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={selectedQuoteData.length + 1} className="px-6 py-3">
                        <h4 className="font-medium text-gray-900">Coverage Limits</h4>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        General Liability
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          {quote.coverageDetails.generalLiability}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Professional Liability
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          {quote.coverageDetails.professionalLiability}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Cyber Liability
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          {quote.coverageDetails.cyberLiability}
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* Carrier Strength */}
                {selectedCategories.includes('carrier') && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={selectedQuoteData.length + 1} className="px-6 py-3">
                        <h4 className="font-medium text-gray-900">Carrier Strength</h4>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Financial Rating
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          {quote.carrierRating}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        AI Score
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          <span className={`font-bold ${getAIScoreColor(quote.aiScore)}`}>{quote.aiScore}/100</span>
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* Exclusions */}
                {selectedCategories.includes('exclusions') && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={selectedQuoteData.length + 1} className="px-6 py-3">
                        <h4 className="font-medium text-gray-900">Exclusions</h4>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Key Exclusions
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          <ul className="list-disc pl-5 space-y-1">
                            {quote.exclusions.map((exclusion, index) => (
                              <li key={index}>{exclusion}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* Endorsements */}
                {selectedCategories.includes('endorsements') && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={selectedQuoteData.length + 1} className="px-6 py-3">
                        <h4 className="font-medium text-gray-900">Endorsements</h4>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Special Endorsements
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          <ul className="list-disc pl-5 space-y-1">
                            {quote.endorsements.map((endorsement, index) => (
                              <li key={index}>{endorsement}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* Payment Options */}
                {selectedCategories.includes('payment') && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={selectedQuoteData.length + 1} className="px-6 py-3">
                        <h4 className="font-medium text-gray-900">Payment Options</h4>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Annual Payment
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(quote.paymentOptions.annual.total)} 
                          <span className="text-green-600 ml-1">({quote.paymentOptions.annual.discount}% discount)</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Monthly Payment
                      </td>
                      {selectedQuoteData.map((quote) => (
                        <td key={quote.id} className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(quote.paymentOptions.monthly.total / 12)}/month
                        </td>
                      ))}
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Award className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h4 className="font-semibold text-green-900 mb-2">AI Recommendation</h4>
              <p className="text-green-800 mb-4">
                Based on {prospectName}'s specific needs and risk profile, our AI recommends the 
                <span className="font-bold"> {quotes.find(q => q.isRecommended && q.aiScore === Math.max(...quotes.filter(q => q.isRecommended).map(q => q.aiScore)))?.carrierName}</span> quote 
                as the best overall value. This recommendation considers coverage breadth, pricing, carrier strength, and industry expertise.
              </p>
              <button
                onClick={handlePresentToClient}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Send className="h-4 w-4" />
                <span>Present to Client</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPresentationModal = () => {
    const selectedQuoteData = quotes.filter(quote => selectedQuotes.includes(quote.id));
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900">Present Quote to Client</h2>
                  <p className="text-blue-800">Send professional quote presentation to {prospectName}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPresentationModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Ready to Present</h4>
                    <p className="text-green-800 text-sm mt-1">
                      You're about to send {selectedQuoteData.length} quote{selectedQuoteData.length !== 1 ? 's' : ''} to {prospectName}. 
                      The client will receive a professional presentation with all quote details and your recommendation.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Selected Quotes</h4>
                <div className="space-y-3">
                  {selectedQuoteData.map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{quote.carrierName}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(quote.annualPremium)} annual premium</p>
                        </div>
                      </div>
                      {quote.isRecommended && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a personal message to accompany the quote presentation..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Presentation Preview</h4>
                <p className="text-blue-800 text-sm">
                  The client will receive a professional, branded presentation that includes:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Executive summary with key coverage details</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Side-by-side quote comparison</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Coverage highlights and explanations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Payment options and next steps</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Your agency branding and contact information</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Delivery Options</h4>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="deliveryOption"
                          defaultChecked
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-yellow-800">Send email now</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="deliveryOption"
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-yellow-800">Schedule for later</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="deliveryOption"
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-yellow-800">Generate link to share manually</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Sending to: {prospectName} ({quotes[0].documents[0].uploadedAt.toLocaleDateString()})
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPresentationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendPresentation}
                disabled={isProcessing}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{isProcessing ? 'Sending...' : 'Send Presentation'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuoteDetailModal = () => {
    if (!showQuoteDetailModal) return null;
    
    const quote = quotes.find(q => q.id === showQuoteDetailModal);
    if (!quote) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900">{quote.carrierName} Quote Details</h2>
                  <p className="text-blue-800">Comprehensive quote information and analysis</p>
                </div>
              </div>
              <button 
                onClick={() => setShowQuoteDetailModal(null)}
                className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-8">
              {/* Quote Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Premium Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Premium:</span>
                      <span className="font-bold text-gray-900">{formatCurrency(quote.annualPremium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Premium:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(quote.monthlyPremium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deductible:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(quote.deductible)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effective Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(quote.effectiveDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agency Commission:</span>
                      <div className="flex items-center space-x-1">
                        <p className="font-semibold text-green-600">{formatCurrency(quote.estimatedCommission || 0)}</p>
                        <span className="text-xs text-gray-500">({quote.commissionRate || 0}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Carrier Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carrier:</span>
                      <span className="font-bold text-gray-900">{quote.carrierName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">A.M. Best Rating:</span>
                      <span className="font-medium text-gray-900">{quote.carrierRating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quote Received:</span>
                      <span className="font-medium text-gray-900">{formatDate(quote.receivedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                        {quote.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">AI Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">AI Score:</span>
                      <div className="flex items-center space-x-1">
                        <span className={`font-bold text-lg ${getAIScoreColor(quote.aiScore)}`}>{quote.aiScore}</span>
                        <Star className={`h-4 w-4 ${getAIScoreColor(quote.aiScore)}`} />
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Recommendation:</span>
                      <span className="font-medium text-gray-900 ml-2">
                        {quote.isRecommended ? 'Recommended' : 'Not Recommended'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">{quote.aiReasoning}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-medium text-gray-900 mb-4">Coverage Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Liability Limits</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Per Occurrence:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(quote.limits.perOccurrence)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Aggregate:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(quote.limits.aggregate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Products/Completed Ops:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(quote.limits.products)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Personal Injury:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(quote.limits.personalInjury)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cyber Liability:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(quote.limits.cyber)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Additional Coverages</h5>
                    <ul className="space-y-1">
                      {quote.coverageDetails.additionalCoverages.map((coverage, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm text-gray-900">{coverage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Exclusions & Endorsements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Exclusions</h4>
                  <ul className="space-y-1">
                    {quote.exclusions.map((exclusion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <span className="text-sm text-gray-900">{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Endorsements</h4>
                  <ul className="space-y-1">
                    {quote.endorsements.map((endorsement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm text-gray-900">{endorsement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Payment Options */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-medium text-gray-900 mb-4">Payment Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Annual</h5>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(quote.paymentOptions.annual.total)}</p>
                    <p className="text-sm text-green-600">{quote.paymentOptions.annual.discount}% discount</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Quarterly</h5>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(quote.paymentOptions.quarterly.total / 4)}</p>
                    <p className="text-sm text-gray-600">per quarter (${quote.paymentOptions.quarterly.fee} fee)</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Monthly</h5>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(quote.paymentOptions.monthly.total / 12)}</p>
                    <p className="text-sm text-gray-600">per month (${quote.paymentOptions.monthly.fee} fee)</p>
                  </div>
                </div>
              </div>

              {/* Binding Requirements */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-medium text-gray-900 mb-4">Binding Requirements</h4>
                <ul className="space-y-2">
                  {quote.bindingRequirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-900">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Underwriter Notes */}
              {quote.underwriterNotes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-2">Underwriter Notes</h4>
                      <p className="text-yellow-800">{quote.underwriterNotes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-medium text-gray-900 mb-4">Quote Documents</h4>
                <div className="space-y-3">
                  {quote.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">Uploaded {doc.uploadedAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
                <Download className="h-4 w-4" />
                <span>Download Quote</span>
              </button>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
                <Copy className="h-4 w-4" />
                <span>Copy Summary</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowQuoteDetailModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedQuotes([quote.id]);
                  setShowQuoteDetailModal(null);
                  setShowPresentationModal(true);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Send className="h-4 w-4" />
                <span>Present to Client</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showComparisonView ? renderComparisonView() : renderQuoteCards()}
      
      {/* Modals */}
      {showPresentationModal && renderPresentationModal()}
      {showQuoteDetailModal && renderQuoteDetailModal()}
    </div>
  );
};

export default QuoteTabContent;