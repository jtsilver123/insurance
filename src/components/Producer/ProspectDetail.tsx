import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
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
  X,
  Upload,
  Send,
  Target,
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
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { mockProspects } from '../../data/mockData';
import ProspectProgressBar from '../Common/ProspectProgressBar';
import DocsInTabContent from './DocsInTabContent';
import FormTabContent from './FormTabContent';
import SubmitTabContent from './SubmitTabContent';
import QuoteTabContent from './QuoteTabContent';
import toast from 'react-hot-toast';

const ProspectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('businessInfo');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get prospect data
  const prospect = mockProspects.find(p => p.id === id);

  useEffect(() => {
    const stage = searchParams.get('stage');
    const highlight = searchParams.get('highlight');
    
    if (stage && highlight === 'true') {
      // Add the stage-specific tab
      setActiveTab(stage);
      setSelectedStage(stage);
      
      // Clear the URL parameters
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  if (!prospect) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Prospect Not Found</h1>
        <p className="text-gray-600 mb-4">The prospect you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/producer/prospects')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Prospects
        </button>
      </div>
    );
  }

  const handleStageClick = (stageId: string) => {
    setSelectedStage(stageId);
    setActiveTab(stageId);
  };

  const handleExecuteAction = (action: string) => {
    console.log(`Executing action: ${action} for prospect ${prospect.id}`);
    toast.success(`Action "${action}" executed successfully!`);
  };

  // Get the consistent icon for each stage (matching timeline and progress bar)
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'docs': return Upload;
      case 'form': return FileText;
      case 'submitted': return Send;
      case 'quotes': return DollarSign;
      case 'bound': return Shield;
      default: return FileText;
    }
  };
  const tabs = [
    { id: 'businessInfo', label: 'Business Info', icon: Building },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  // Add stage-specific tab if a stage is selected
  const stageSpecificTabs = [];
  if (selectedStage) {
    const stageLabels = {
      docs: 'Docs',
      form: 'Form',
      submitted: 'Submit',
      quotes: 'Quote',
      bound: 'Bound'
    };
    
    stageSpecificTabs.push({
      id: selectedStage,
      label: stageLabels[selectedStage as keyof typeof stageLabels] || selectedStage,
      icon: getStageIcon(selectedStage),
      isStageTab: true
    });
  }

  const allTabs = [...tabs, ...stageSpecificTabs];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'businessInfo':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <p className="text-gray-900">{prospect.businessName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <p className="text-gray-900">{prospect.contactName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{prospect.contactEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NAICS Code</label>
                  <p className="text-gray-900">{prospect.naicsCode || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue</label>
                  <p className="text-gray-900">
                    {prospect.revenue ? `$${(prospect.revenue / 1000000).toFixed(1)}M` : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    prospect.status === 'bound' ? 'bg-green-100 text-green-800' :
                    prospect.status === 'quotes' ? 'bg-blue-100 text-blue-800' :
                    prospect.status === 'submitted' ? 'bg-purple-100 text-purple-800' :
                    prospect.status === 'form' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {prospect.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Portal Link</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={prospect.portalLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(prospect.portalLink);
                        toast.success('Portal link copied to clipboard!');
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.open(prospect.portalLink, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'communication':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication History</h3>
              <div className="space-y-4">
                {[
                  { type: 'email', message: 'Portal link sent', date: '2024-01-15', status: 'sent' },
                  { type: 'email', message: 'Welcome email sent', date: '2024-01-16', status: 'opened' },
                  { type: 'call', message: 'Discovery call completed', date: '2024-01-17', status: 'completed' }
                ].map((comm, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {comm.type === 'email' ? <Mail className="h-4 w-4 text-blue-600" /> : <Phone className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{comm.message}</p>
                      <p className="text-sm text-gray-500">{comm.date} • {comm.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {[
                  { action: 'Prospect created', date: prospect.createdAt, type: 'create' },
                  { action: 'Portal link generated', date: prospect.createdAt, type: 'portal' },
                  { action: 'Status updated to ' + prospect.status, date: prospect.updatedAt, type: 'status' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{format(activity.date, 'MMM d, yyyy \'at\' h:mm a')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );


      case 'docs':
        return <DocsInTabContent prospectId={prospect.id} prospectName={prospect.businessName} />;

      case 'form':
        return (
          <FormTabContent 
            prospectId={prospect.id} 
            prospectName={prospect.businessName} 
          />
        );

      case 'submitted':
        return (
          <SubmitTabContent 
            prospectId={prospect.id} 
            prospectName={prospect.businessName} 
          />
        );

      case 'quotes':
        return (
          <QuoteTabContent 
            prospectId={prospect.id} 
            prospectName={prospect.businessName} 
          />
        );

      case 'bound':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Bound Stage Management</h3>
                  <p className="text-green-800">Manage policy binding and finalization</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Policy Status</h4>
              <p className="text-gray-600">Policy binding interface will be implemented here.</p>
            </div>
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/producer/prospects')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {prospect.businessName}
              </h1>
              <p className="text-gray-600 mt-1">Prospect Details & Management</p>
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
                      <span>Edit Prospect</span>
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

        {/* Progress Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Application Progress</h2>
          </div>
          
          <ProspectProgressBar 
            currentStage={prospect.status}
            activeViewingStage={selectedStage}
            prospectId={prospect.id}
            prospectName={prospect.businessName}
            variant="interactive"
            showLabels={true}
            size="lg"
            className=""
            onStageClick={handleStageClick}
          />
          
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {allTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-label={`${tab.label} tab${tab.isStageTab ? ' (stage-specific)' : ''}`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.isStageTab && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStage(null);
                        setActiveTab('businessInfo');
                      }}
                      className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                      aria-label="Close stage tab"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
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
    </div>
  );
};

export default ProspectDetail;