import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Building, 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  FileText,
  MessageSquare, 
  Activity, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Star, 
  Eye, 
  Download, 
  Copy, 
  ExternalLink, 
  Settings, 
  MoreVertical,
  Edit, 
  Archive, 
  Trash2, 
  RefreshCw, 
  BarChart2,
  PieChart, 
  LineChart, 
  Zap, 
  Target, 
  Award, 
  Plus, 
  X,
  Send
} from 'lucide-react';
import { mockRenewals } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const RenewalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAddCarrierModal, setShowAddCarrierModal] = useState(false);
  const [showCustomRenewalModal, setShowCustomRenewalModal] = useState(false);

  // Get renewal data
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
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'options', label: 'Renewal Options', icon: Target },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'communication', label: 'Communication', icon: MessageSquare }
  ];

  const handleAddNewCarrier = () => {
    setShowAddCarrierModal(true);
  };

  const handleCustomRenewal = () => {
    setShowCustomRenewalModal(true);
  };

  const handleSendRenewalRequest = () => {
    toast.success('Renewal request sent to carrier');
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Renewal Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Renewal Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Current Carrier</p>
            <div className="flex items-center space-x-2 mt-1">
              <Building className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-semibold text-gray-900">{renewal.currentCarrier}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Current Premium</p>
            <div className="flex items-center space-x-2 mt-1">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(renewal.currentPremium)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Estimated Renewal</p>
            <div className="flex items-center space-x-2 mt-1">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(renewal.estimatedRenewalPremium)}</p>
              <span className={`text-sm font-medium ${renewal.changePercentage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {renewal.changePercentage > 0 ? '+' : ''}{renewal.changePercentage}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Renewal Date</p>
            <div className="flex items-center space-x-2 mt-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-semibold text-gray-900">{formatDate(renewal.renewalDate)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Days Remaining</p>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <p className={`text-lg font-semibold ${
                renewal.daysRemaining < 0 ? 'text-red-600' :
                renewal.daysRemaining < 15 ? 'text-yellow-600' :
                'text-gray-900'
              }`}>
                {renewal.daysRemaining < 0 ? 'Expired' : `${renewal.daysRemaining} days`}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                renewal.status === 'bound' ? 'bg-green-100 text-green-800' :
                renewal.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                renewal.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                renewal.status === 'lost' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {renewal.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                renewal.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                renewal.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                renewal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {renewal.priority.toUpperCase()} PRIORITY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Coverage Types</p>
            <div className="flex flex-wrap gap-2">
              {renewal.coverageType.map((type, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Recommendations</h3>
            <p className="text-blue-800 mb-4">{renewal.recommendedAction}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-blue-200">
                <p className="font-medium text-blue-900 mb-2">Recommended Contact Method</p>
                <div className="flex items-center space-x-2">
                  {renewal.recommendedContactMethod === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                  {renewal.recommendedContactMethod === 'call' && <Phone className="h-4 w-4 text-blue-600" />}
                  {renewal.recommendedContactMethod === 'meeting' && <Users className="h-4 w-4 text-blue-600" />}
                  {renewal.recommendedContactMethod === 'video' && <Video className="h-4 w-4 text-blue-600" />}
                  <span className="text-blue-800 capitalize">{renewal.recommendedContactMethod}</span>
                </div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-blue-200">
                <p className="font-medium text-blue-900 mb-2">Client Tenure</p>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">{renewal.clientTenure} {renewal.clientTenure === 1 ? 'year' : 'years'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Contact Name</p>
            <div className="flex items-center space-x-2 mt-1">
              <User className="h-4 w-4 text-gray-500" />
              <p className="text-gray-900">{renewal.clientName}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Business Name</p>
            <div className="flex items-center space-x-2 mt-1">
              <Building className="h-4 w-4 text-gray-500" />
              <p className="text-gray-900">{renewal.businessName}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <div className="flex items-center space-x-2 mt-1">
              <Mail className="h-4 w-4 text-gray-500" />
              <p className="text-gray-900">{renewal.contactEmail}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Phone</p>
            <div className="flex items-center space-x-2 mt-1">
              <Phone className="h-4 w-4 text-gray-500" />
              <p className="text-gray-900">{renewal.contactPhone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {renewal.notes && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          <p className="text-gray-700">{renewal.notes}</p>
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy History</h3>
        <div className="space-y-4">
          {[
            { year: '2023-2024', carrier: renewal.currentCarrier, premium: renewal.currentPremium, change: '+5%' },
            { year: '2022-2023', carrier: renewal.currentCarrier, premium: renewal.currentPremium * 0.95, change: '+3%' },
            { year: '2021-2022', carrier: renewal.currentCarrier, premium: renewal.currentPremium * 0.92, change: 'New Business' }
          ].map((policy, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{policy.year}</p>
                  <p className="text-sm text-gray-600">{policy.change}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{policy.carrier}</span>
                  <span>•</span>
                  <span>{formatCurrency(policy.premium)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOptionsTab = () => (
    <div className="space-y-6">
      {/* Current Carrier Renewal */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Carrier Renewal</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            renewal.changePercentage > 10 ? 'bg-red-100 text-red-800' :
            renewal.changePercentage > 5 ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {renewal.changePercentage > 0 ? '+' : ''}{renewal.changePercentage}% Change
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Current Carrier</p>
            <div className="flex items-center space-x-2 mt-1">
              <Building className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-semibold text-gray-900">{renewal.currentCarrier}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Current Premium</p>
            <div className="flex items-center space-x-2 mt-1">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(renewal.currentPremium)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Estimated Renewal</p>
            <div className="flex items-center space-x-2 mt-1">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(renewal.estimatedRenewalPremium)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Coverage Types</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {renewal.coverageType.map((type, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleSendRenewalRequest}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Request Renewal Quote</span>
          </button>
          <button 
            onClick={handleCustomRenewal}
            className="flex items-center space-x-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Request Pricing Options</span>
          </button>
        </div>
      </div>
      
      {/* Additional Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Additional Market Options</h3>
          <button 
            onClick={handleAddNewCarrier}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Add Carrier</span>
          </button>
        </div>
        
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No additional carriers added yet</h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Add carriers to shop this renewal and compare quotes from multiple markets
          </p>
          <button 
            onClick={handleAddNewCarrier}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Carrier</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Policy Documents</h3>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Current Policy.pdf', type: 'Policy', date: '2023-03-15', size: '2.4 MB' },
            { name: 'Loss Runs (5 Year).pdf', type: 'Loss Run', date: '2023-12-10', size: '1.8 MB' },
            { name: 'Schedule of Values.xlsx', type: 'Schedule', date: '2023-03-15', size: '1.2 MB' }
          ].map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Download className="h-4 w-4" />
                </button>
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Communication History</h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Mail className="h-4 w-4" />
              <span>Send Email</span>
            </button>
            <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="h-4 w-4" />
              <span>Log Call</span>
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { type: 'email', direction: 'outbound', subject: 'Upcoming Renewal', date: '2024-01-15', status: 'opened' },
            { type: 'call', direction: 'outbound', subject: 'Renewal Discussion', date: '2024-01-10', status: 'completed' }
          ].map((comm, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                {comm.type === 'email' ? <Mail className="h-4 w-4 text-blue-600" /> : <Phone className="h-4 w-4 text-blue-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{comm.subject}</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    comm.status === 'opened' ? 'bg-green-100 text-green-800' :
                    comm.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {comm.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <span className="capitalize">{comm.direction}</span>
                  <span>•</span>
                  <span>{comm.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'history':
        return renderHistoryTab();
      case 'options':
        return renderOptionsTab();
      case 'documents':
        return renderDocumentsTab();
      case 'communication':
        return renderCommunicationTab();
      default:
        return <div>Content not found</div>;
    }
  };

  // Mock function for Video icon since it's not imported
  const Video = (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 8.5V15.5C22 16.3 21.3 17 20.5 17H3.5C2.7 17 2 16.3 2 15.5V8.5C2 7.7 2.7 7 3.5 7H20.5C21.3 7 22 7.7 22 8.5Z" />
      <path d="M18 12L13 9V15L18 12Z" />
    </svg>
  );

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
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-xl z-50">
                  <div className="py-1">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50">
                      <Edit className="h-4 w-4" />
                      <span>Edit Renewal</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50">
                      <Archive className="h-4 w-4" />
                      <span>Archive</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`mb-6 p-4 rounded-xl ${
          renewal.status === 'bound' ? 'bg-green-50 border border-green-200' :
          renewal.status === 'quoted' ? 'bg-blue-50 border border-blue-200' :
          renewal.status === 'in_progress' ? 'bg-yellow-50 border border-yellow-200' :
          renewal.status === 'lost' ? 'bg-red-50 border border-red-200' :
          'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {renewal.status === 'bound' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {renewal.status === 'quoted' && <FileText className="h-5 w-5 text-blue-600" />}
              {renewal.status === 'in_progress' && <Clock className="h-5 w-5 text-yellow-600" />}
              {renewal.status === 'lost' && <AlertTriangle className="h-5 w-5 text-red-600" />}
              {renewal.status === 'pending' && <Clock className="h-5 w-5 text-gray-600" />}
              <div>
                <p className={`font-medium ${
                  renewal.status === 'bound' ? 'text-green-900' :
                  renewal.status === 'quoted' ? 'text-blue-900' :
                  renewal.status === 'in_progress' ? 'text-yellow-900' :
                  renewal.status === 'lost' ? 'text-red-900' :
                  'text-gray-900'
                }`}>
                  {renewal.status === 'bound' ? 'Renewal Bound' :
                   renewal.status === 'quoted' ? 'Quotes Received' :
                   renewal.status === 'in_progress' ? 'Renewal In Progress' :
                   renewal.status === 'lost' ? 'Renewal Lost' :
                   'Renewal Pending'}
                </p>
                <p className={`text-sm ${
                  renewal.status === 'bound' ? 'text-green-800' :
                  renewal.status === 'quoted' ? 'text-blue-800' :
                  renewal.status === 'in_progress' ? 'text-yellow-800' :
                  renewal.status === 'lost' ? 'text-red-800' :
                  'text-gray-800'
                }`}>
                  {renewal.status === 'bound' ? 'Policy has been renewed and bound.' :
                   renewal.status === 'quoted' ? 'Quotes have been received and are ready for review.' :
                   renewal.status === 'in_progress' ? 'Renewal is being processed with carriers.' :
                   renewal.status === 'lost' ? 'Client did not renew with us.' :
                   `Renewal is due in ${renewal.daysRemaining} days.`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Renewal Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(renewal.renewalDate)}</p>
              </div>
              <div className={`p-3 rounded-xl ${
                renewal.daysRemaining < 0 ? 'bg-red-100' :
                renewal.daysRemaining < 15 ? 'bg-yellow-100' :
                renewal.daysRemaining < 30 ? 'bg-blue-100' :
                'bg-green-100'
              }`}>
                <Calendar className={`h-6 w-6 ${
                  renewal.daysRemaining < 0 ? 'text-red-600' :
                  renewal.daysRemaining < 15 ? 'text-yellow-600' :
                  renewal.daysRemaining < 30 ? 'text-blue-600' :
                  'text-green-600'
                }`} />
              </div>
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
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Add Carrier Modal */}
      {showAddCarrierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-600 rounded-xl">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">Add Market Option</h2>
                    <p className="text-blue-800">Add a carrier to shop this renewal</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddCarrierModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-blue-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carrier Name *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a carrier</option>
                      <option value="travelers">Travelers</option>
                      <option value="chubb">Chubb</option>
                      <option value="hartford">The Hartford</option>
                      <option value="cna">CNA</option>
                      <option value="nationwide">Nationwide</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Underwriter Email *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="underwriter@carrier.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submission Notes
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any specific notes for this carrier submission..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
              <button
                onClick={() => setShowAddCarrierModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Plus className="h-4 w-4" />
                <span>Add Carrier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Renewal Modal */}
      {showCustomRenewalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-600 rounded-xl">
                    <Edit className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">Request Pricing Options</h2>
                    <p className="text-blue-800">Request different pricing scenarios from {renewal.currentCarrier}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCustomRenewalModal(false)}
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
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Request Multiple Options</h4>
                      <p className="text-yellow-800 text-sm mt-1">
                        You can request different coverage options or deductible scenarios to help your client make an informed decision.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Option 1: Current Coverage (Base Option)
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">Current coverage with estimated {renewal.changePercentage}% increase</p>
                    <p className="font-medium text-gray-900 mt-1">{formatCurrency(renewal.estimatedRenewalPremium)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Option 2: Higher Deductible
                  </label>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-700">Increase deductible to:</p>
                      <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option value="5000">$5,000</option>
                        <option value="10000">$10,000</option>
                        <option value="25000">$25,000</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-600">This option may reduce premium by approximately 5-15%</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Option 3: Coverage Adjustments
                  </label>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">Adjust liability limits:</p>
                        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                          <option value="1m">$1M/$2M</option>
                          <option value="2m">$2M/$4M</option>
                          <option value="3m">$3M/$6M</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-gray-700">Include additional cyber coverage</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-gray-700">Remove terrorism coverage</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any specific requests or notes for the underwriter..."
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
              <button
                onClick={() => setShowCustomRenewalModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCustomRenewalModal(false);
                  toast.success('Pricing options request sent to carrier');
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Send className="h-4 w-4" />
                <span>Send Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenewalDetail;