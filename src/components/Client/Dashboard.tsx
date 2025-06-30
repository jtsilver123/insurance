import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Upload,
  Shield,
  DollarSign,
  Calendar,
  PenTool,
  Eye,
  Download,
  Star,
  Award,
  TrendingDown,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink,
  ArrowRight,
  User,
  Building,
  Send
} from 'lucide-react';

interface TaskItem {
  id: string;
  type: 'esign' | 'upload' | 'form' | 'review_quote';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed';
  estimatedTime?: string;
  action: string;
}

interface Quote {
  id: string;
  carrier: string;
  annualPremium: number;
  monthlyPremium: number;
  deductible: number;
  coverageHighlights: string[];
  aiScore: number;
  isRecommended: boolean;
  pros: string[];
  cons: string[];
  specialFeatures: string[];
}

const ClientDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Mock data for current tasks
  const currentTasks: TaskItem[] = [
    {
      id: '1',
      type: 'review_quote',
      title: 'Review Your Insurance Quotes',
      description: 'We\'ve received 3 competitive quotes for your business. Our AI recommends Liberty Mutual for the best value.',
      priority: 'high',
      status: 'pending',
      estimatedTime: '10 minutes',
      action: 'Review Quotes'
    },
    {
      id: '2',
      type: 'form',
      title: 'Complete Professional Liability Questions',
      description: 'Your agent needs additional information about your professional services to finalize your quote.',
      priority: 'medium',
      status: 'pending',
      estimatedTime: '5 minutes',
      action: 'Complete Form'
    }
  ];

  // Mock data for completed tasks
  const completedTasks: TaskItem[] = [
    {
      id: '3',
      type: 'esign',
      title: 'Letter of Authority Signed',
      description: 'Authorization to represent you in insurance matters',
      priority: 'high',
      status: 'completed',
      action: 'View Document'
    },
    {
      id: '4',
      type: 'upload',
      title: 'Current Policy Documents',
      description: 'Uploaded your existing insurance policy for review',
      priority: 'medium',
      status: 'completed',
      action: 'View Files'
    },
    {
      id: '5',
      type: 'upload',
      title: 'Loss Run History',
      description: 'Uploaded 5-year claims history documentation',
      priority: 'medium',
      status: 'completed',
      action: 'View Files'
    },
    {
      id: '6',
      type: 'form',
      title: 'Business Information Form',
      description: 'Completed general business and operations questionnaire',
      priority: 'high',
      status: 'completed',
      action: 'View Responses'
    }
  ];

  // Mock quotes data
  const quotes: Quote[] = [
    {
      id: '1',
      carrier: 'Liberty Mutual',
      annualPremium: 45000,
      monthlyPremium: 3750,
      deductible: 5000,
      coverageHighlights: ['$2M General Liability', '$1M Professional Liability', 'Cyber Coverage Included'],
      aiScore: 92,
      isRecommended: true,
      pros: ['Best overall value', 'Excellent claims service', 'Technology industry expertise'],
      cons: ['Higher deductible than some options'],
      specialFeatures: ['24/7 claims hotline', 'Risk management resources', 'Premium financing available']
    },
    {
      id: '2',
      carrier: 'Travelers',
      annualPremium: 48500,
      monthlyPremium: 4042,
      deductible: 2500,
      coverageHighlights: ['$2M General Liability', '$1M Professional Liability', 'Employment Practices'],
      aiScore: 78,
      isRecommended: false,
      pros: ['Lower deductible', 'Strong financial rating', 'Broad coverage'],
      cons: ['Higher premium', 'Limited cyber coverage'],
      specialFeatures: ['Online policy management', 'Loss control services']
    },
    {
      id: '3',
      carrier: 'Chubb',
      annualPremium: 52000,
      monthlyPremium: 4333,
      deductible: 2500,
      coverageHighlights: ['$2M General Liability', '$2M Professional Liability', 'Premium Coverage'],
      aiScore: 85,
      isRecommended: false,
      pros: ['Premium carrier reputation', 'Excellent coverage terms', 'High limits available'],
      cons: ['Most expensive option', 'Stricter underwriting'],
      specialFeatures: ['Worldwide coverage', 'Premium claims service', 'Risk engineering']
    }
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'esign': return PenTool;
      case 'upload': return Upload;
      case 'form': return FileText;
      case 'review_quote': return DollarSign;
      default: return FileText;
    }
  };

  const getTaskColor = (type: string, status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-600';
    
    switch (type) {
      case 'esign': return 'bg-blue-100 text-blue-600';
      case 'upload': return 'bg-purple-100 text-purple-600';
      case 'form': return 'bg-orange-100 text-orange-600';
      case 'review_quote': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
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

  const renderQuoteComparison = () => (
    <div className="space-y-6">
      {/* AI Recommendation Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Award className="h-6 w-6 text-green-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-2">🎯 Our AI Recommendation</h3>
            <p className="text-green-800 mb-3">
              Based on your business profile and coverage needs, <strong>Liberty Mutual</strong> offers 
              the best combination of coverage, price, and service quality for your technology company.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingDown className="h-4 w-4" />
                <span>7% below market average</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Star className="h-4 w-4" />
                <span>92% AI match score</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Shield className="h-4 w-4" />
                <span>Excellent tech industry expertise</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quotes.map((quote) => (
          <div 
            key={quote.id} 
            className={`bg-white rounded-lg border p-6 transition-all duration-200 hover:shadow-md ${
              quote.isRecommended ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{quote.carrier}</h3>
              {quote.isRecommended && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-green-500" />
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="mb-4">
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(quote.annualPremium)}</span>
                <span className="text-sm text-gray-600">per year</span>
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(quote.monthlyPremium)}/month • ${quote.deductible.toLocaleString()} deductible
              </div>
            </div>

            {/* AI Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">AI Match Score</span>
                <span className="text-sm font-bold text-gray-900">{quote.aiScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    quote.aiScore >= 90 ? 'bg-green-500' :
                    quote.aiScore >= 80 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${quote.aiScore}%` }}
                />
              </div>
            </div>

            {/* Coverage Highlights */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Coverage Highlights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {quote.coverageHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pros and Cons */}
            <div className="mb-4 space-y-3">
              <div>
                <h5 className="text-xs font-medium text-green-700 mb-1">Advantages</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  {quote.pros.slice(0, 2).map((pro, index) => (
                    <li key={index}>• {pro}</li>
                  ))}
                </ul>
              </div>
              {quote.cons.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-red-700 mb-1">Considerations</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {quote.cons.slice(0, 1).map((con, index) => (
                      <li key={index}>• {con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button 
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                quote.isRecommended
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {quote.isRecommended ? 'Select This Quote' : 'View Details'}
            </button>
          </div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <ArrowRight className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Ready to Move Forward?</h3>
            <p className="text-blue-800 mb-4">
              Once you select a quote, we'll prepare your policy documents for electronic signature. 
              Your coverage can be effective as soon as tomorrow.
            </p>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Questions? Schedule a Call
              </button>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Download Quote Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
            <p className="text-green-100 text-lg">Your insurance application is progressing smoothly</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-green-100 text-sm">Application Progress</p>
              <p className="text-3xl font-bold text-white">85%</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Tasks - High Priority */}
      {currentTasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  Action Required
                </h2>
                <p className="text-gray-600 mt-1">Complete these tasks to move your application forward</p>
              </div>
              <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-sm font-bold px-3 py-2 rounded-xl shadow-sm">
                {currentTasks.length} pending
              </span>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {currentTasks.map((task) => {
              const IconComponent = getTaskIcon(task.type);
              return (
                <div 
                  key={task.id} 
                  className={`group flex items-start space-x-4 p-5 border-l-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${getPriorityColor(task.priority)}`}
                  onClick={() => setActiveSection(task.type === 'review_quote' ? 'quotes' : task.type)}
                >
                  <div className={`p-3 rounded-xl shadow-sm ${getTaskColor(task.type, task.status)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors">{task.title}</h3>
                      <div className="flex items-center space-x-2">
                        {task.estimatedTime && (
                          <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                            {task.estimatedTime}
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{task.description}</p>
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                      {task.action}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quote Comparison Section */}
      {activeSection === 'quotes' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Your Insurance Quotes</h2>
              <button 
                onClick={() => setActiveSection(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-6">
            {renderQuoteComparison()}
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Tasks */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Completed Tasks
              </h2>
              <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm font-bold px-3 py-2 rounded-xl shadow-sm">
                {completedTasks.length} completed
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {completedTasks.map((task) => {
                const IconComponent = getTaskIcon(task.type);
                return (
                  <div key={task.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                    <div className="p-3 bg-green-200 rounded-xl shadow-sm">
                      <IconComponent className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Your Agent */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Insurance Agent</h2>
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Sarah Johnson</h3>
                <p className="text-gray-600">Licensed Insurance Producer</p>
                <p className="text-gray-600">ABC Insurance Agency</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group">
                <Phone className="h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">Call Sarah</p>
                  <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors">(555) 123-4567</p>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group">
                <Mail className="h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">Send Email</p>
                  <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors">sarah@abcinsurance.com</p>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">Schedule Meeting</p>
                  <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors">Book a consultation call</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="group flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
            <Upload className="h-5 w-5 text-blue-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">Upload Documents</p>
              <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors">Add additional files</p>
            </div>
          </button>
          
          <button className="group flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-300">
            <Eye className="h-5 w-5 text-green-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 group-hover:text-green-900 transition-colors">View Application</p>
              <p className="text-sm text-gray-600 group-hover:text-green-700 transition-colors">Review your responses</p>
            </div>
          </button>
          
          <button className="group flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-300">
            <Download className="h-5 w-5 text-purple-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 group-hover:text-purple-900 transition-colors">Download Summary</p>
              <p className="text-sm text-gray-600 group-hover:text-purple-700 transition-colors">Get application PDF</p>
            </div>
          </button>
          
          <button className="group flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-300">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 group-hover:text-orange-900 transition-colors">Ask Questions</p>
              <p className="text-sm text-gray-600 group-hover:text-orange-700 transition-colors">Get help from your agent</p>
            </div>
          </button>
        </div>
      </div>

      {/* Application Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Clock className="h-5 w-5 text-blue-600 mr-2" />
          Application Timeline
        </h2>
        <div className="space-y-4">
          {[
            { date: 'Jan 22, 2024', event: 'Quotes received and ready for review', status: 'current', icon: DollarSign },
            { date: 'Jan 20, 2024', event: 'Application submitted to insurance carriers', status: 'completed', icon: Send },
            { date: 'Jan 18, 2024', event: 'Professional liability questionnaire completed', status: 'completed', icon: FileText },
            { date: 'Jan 17, 2024', event: 'Loss run history uploaded', status: 'completed', icon: Upload },
            { date: 'Jan 16, 2024', event: 'Current policy documents uploaded', status: 'completed', icon: Upload },
            { date: 'Jan 15, 2024', event: 'Letter of Authority signed', status: 'completed', icon: PenTool },
            { date: 'Jan 15, 2024', event: 'Application started', status: 'completed', icon: FileText }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${
                item.status === 'current' ? 'bg-blue-200 shadow-sm' : 'bg-green-200 shadow-sm'
              }`}>
                <item.icon className={`h-4 w-4 ${
                  item.status === 'current' ? 'text-blue-600' : 'text-green-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  item.status === 'current' ? 'text-blue-900 font-bold' : 'text-gray-900'
                }`}>
                  {item.event}
                </p>
                <p className="text-sm text-gray-500 mt-1">{item.date}</p>
              </div>
              {item.status === 'completed' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {item.status === 'current' && (
                <Clock className="h-5 w-5 text-blue-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;