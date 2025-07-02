import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, Eye, Mail, Calendar, MoreVertical, ExternalLink, FileText, PenTool, Send, DollarSign, Clock, CheckCircle, AlertTriangle, X, ChevronDown, ChevronRight, Download, Upload, MessageSquare, Phone, Settings, Archive, Star, StarOff, Target, TrendingUp, User, Building, Baseline as Timeline, Globe, UserCheck, Sparkles } from 'lucide-react';
import { mockProspects } from '../../data/mockData';
import ProspectProgressBar from '../Common/ProspectProgressBar';
import ProspectTimeline from '../Common/ProspectTimeline';
import { format } from 'date-fns';
import NewProspectModal from './NewProspectModal';

interface SlideOutPanel {
  isOpen: boolean;
  type: 'documents' | 'esignature' | 'forms' | 'submissions' | 'quotes' | 'details' | 'timeline' | null;
  prospectId: string | null;
  prospectName: string | null;
}

interface DropdownState {
  [key: string]: boolean;
}

const ProspectList: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({});
  const [slideOut, setSlideOut] = useState<SlideOutPanel>({
    isOpen: false,
    type: null,
    prospectId: null,
    prospectName: null
  });
  const [showNewProspectModal, setShowNewProspectModal] = useState(false);

  const toggleDropdown = (prospectId: string) => {
    setDropdownOpen(prev => ({
      ...prev,
      [prospectId]: !prev[prospectId]
    }));
  };

  const closeAllDropdowns = () => {
    setDropdownOpen({});
  };

  const openSlideOut = (type: SlideOutPanel['type'], prospectId: string, prospectName: string) => {
    closeAllDropdowns();
    setSlideOut({
      isOpen: true,
      type,
      prospectId,
      prospectName
    });
  };

  const closeSlideOut = () => {
    setSlideOut({
      isOpen: false,
      type: null,
      prospectId: null,
      prospectName: null
    });
  };

  const handleStageClick = (stageId: string, prospectId: string) => {
    console.log(`Navigating to prospect ${prospectId} with stage ${stageId} highlighted`);
    // Navigate to prospect detail page with stage parameter
    navigate(`/producer/prospects/${prospectId}?stage=${stageId}&highlight=true`);
  };

  const handleNewProspect = (prospectData: any) => {
    console.log('New prospect created:', prospectData);
    
    // Navigate to prospect detail with docs stage
    const newProspectId = 'new-' + Date.now();
    navigate(`/producer/prospects/${newProspectId}?stage=docs&highlight=true`);
    
    setShowNewProspectModal(false);
  };

  const handleProgressBarClick = (prospectId: string, currentStage: string) => {
    console.log(`Progress bar clicked for prospect ${prospectId}, current stage: ${currentStage}`);
    // Navigate to prospect detail page with current stage highlighted
    navigate(`/producer/prospects/${prospectId}?stage=${currentStage}&highlight=true`);
  };

  const handleOpenClientPortal = (prospect: any) => {
    // Copy portal link to clipboard
    navigator.clipboard.writeText(prospect.portalLink);
    toast.success('Client portal link copied to clipboard!');
  };

  const handleViewClientDetails = (prospectId: string) => {
    // Navigate to the prospect detail page
    navigate(`/producer/prospects/${prospectId}`);
  };
  
  const sortedAndFilteredProspects = mockProspects
    .filter(prospect => {
      const matchesFilter = filter === 'all' || prospect.status === filter;
      const matchesSearch = prospect.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prospect.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prospect.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.businessName.toLowerCase();
          bValue = b.businessName.toLowerCase();
          break;
        case 'created':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updated':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'revenue':
          aValue = a.revenue || 0;
          bValue = b.revenue || 0;
          break;
        default:
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const renderSlideOutContent = () => {
    if (!slideOut.isOpen || !slideOut.type || !slideOut.prospectId) return null;

    const prospect = mockProspects.find(p => p.id === slideOut.prospectId);
    if (!prospect) return null;

    const commonHeader = (
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{slideOut.prospectName}</h2>
          <p className="text-sm text-gray-600 capitalize">{slideOut.type} Management</p>
        </div>
        <button
          onClick={closeSlideOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    );

    switch (slideOut.type) {
      case 'timeline':
        return (
          <div className="h-full flex flex-col">
            {commonHeader}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Application Progress Timeline</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    prospect.status === 'bound' ? 'bg-green-100 text-green-800' :
                    prospect.status === 'quotes' ? 'bg-blue-100 text-blue-800' :
                    prospect.status === 'submitted' ? 'bg-purple-100 text-purple-800' :
                    prospect.status === 'form' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Current: {prospect.status.toUpperCase()}
                  </span>
                </div>
                
                <ProspectTimeline 
                  prospectId={prospect.id}
                  prospectName={prospect.businessName}
                  currentStage={prospect.status}
                  onStageClick={handleStageClick}
                />
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Current Stage: {prospect.status.toUpperCase()}</h4>
                  <p className="text-sm text-blue-800">
                    {prospect.status === 'quotes' ? 'Waiting for carrier responses and quote comparison.' :
                     prospect.status === 'submitted' ? 'Submission packages sent to carriers.' :
                     prospect.status === 'form' ? 'Smart form completion in progress.' :
                     prospect.status === 'docs' ? 'Document collection and verification.' :
                     'Initial contact and portal setup.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Days in Current Stage</p>
                    <p className="font-semibold text-gray-900">
                      {Math.ceil((new Date().getTime() - prospect.updatedAt.getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Days Active</p>
                    <p className="font-semibold text-gray-900">
                      {Math.ceil((new Date().getTime() - prospect.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="h-full flex flex-col">
            {commonHeader}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Document Repository</h3>
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                </div>
                
                {[
                  { name: 'Letter of Authority', type: 'LOA', status: 'completed', date: '2024-01-16', size: '2.3 MB', stage: 'kickoff' },
                  { name: 'Current Policy', type: 'Policy', status: 'completed', date: '2024-01-16', size: '1.8 MB', stage: 'docs' },
                  { name: 'Loss Runs (2019-2023)', type: 'Loss Run', status: 'completed', date: '2024-01-17', size: '4.2 MB', stage: 'docs' },
                  { name: 'Financial Statements', type: 'Financial', status: 'pending', date: null, size: null, stage: 'docs' }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${doc.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <FileText className={`h-4 w-4 ${doc.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{doc.type}</span>
                          {doc.size && (
                            <>
                              <span>•</span>
                              <span>{doc.size}</span>
                            </>
                          )}
                          <span className="px-1 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                            {doc.stage.toUpperCase()}
                          </span>
                        </div>
                        {doc.date && <p className="text-xs text-gray-500">Uploaded {doc.date}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.status === 'completed' && (
                        <>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Download className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {doc.status === 'pending' && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Request
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="h-full flex flex-col">
            {commonHeader}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Business Information */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Business Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Name:</span>
                      <span className="font-medium">{prospect.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium">{prospect.contactName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{prospect.contactEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NAICS Code:</span>
                      <span className="font-medium">{prospect.naicsCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">
                        {prospect.revenue ? `$${(prospect.revenue / 1000000).toFixed(1)}M` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Portal Information */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Portal Access</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Client Portal Link</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Copy Link
                      </button>
                    </div>
                    <div className="text-xs text-gray-600 font-mono bg-white border border-gray-200 rounded p-2">
                      {prospect.portalLink}
                    </div>
                  </div>
                </div>

                {/* Timeline Summary */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { date: '2024-01-20', event: 'Quote received from Liberty Mutual', type: 'quote', stage: 'quotes' },
                      { date: '2024-01-18', event: 'Submission sent to carriers', type: 'submission', stage: 'submitted' },
                      { date: '2024-01-17', event: 'Smart form completed', type: 'form', stage: 'form' },
                      { date: '2024-01-16', event: 'Documents uploaded', type: 'document', stage: 'docs' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-1 rounded-full mt-1 ${
                          item.type === 'quote' ? 'bg-green-100' :
                          item.type === 'submission' ? 'bg-blue-100' :
                          item.type === 'form' ? 'bg-yellow-100' :
                          'bg-purple-100'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            item.type === 'quote' ? 'bg-green-500' :
                            item.type === 'submission' ? 'bg-blue-500' :
                            item.type === 'form' ? 'bg-yellow-500' :
                            'bg-purple-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.event}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{item.date}</span>
                            <span className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded">
                              {item.stage.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Send Email</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Schedule Call</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Add Note</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex flex-col">
            {commonHeader}
            <div className="flex-1 p-6 overflow-y-auto">
              <p className="text-gray-600">Content for {slideOut.type} coming soon...</p>
            </div>
          </div>
        );
    }
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      closeAllDropdowns();
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${slideOut.isOpen ? 'mr-96' : ''}`}>
        <div className="p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Prospects
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your insurance submissions with interactive timeline tracking</p>
            </div>
            <button
              onClick={() => setShowNewProspectModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI New Prospect</span>
            </button>
          </div>

          {/* Advanced Filters and Controls */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search prospects by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-gray-50 focus:bg-white transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Filter className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                >
                  <option value="all">All Stages</option>
                  <option value="kickoff">Kickoff</option>
                  <option value="docs">Docs In</option>
                  <option value="form">Form Complete</option>
                  <option value="submitted">Submitted</option>
                  <option value="quotes">Quotes In</option>
                  <option value="bound">Bound</option>
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                >
                  <option value="updated">Last Updated</option>
                  <option value="created">Date Created</option>
                  <option value="name">Business Name</option>
                  <option value="status">Status</option>
                  <option value="revenue">Revenue</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <div className="w-4 h-4 flex flex-col space-y-1">
                    <div className="h-0.5 bg-current"></div>
                    <div className="h-0.5 bg-current"></div>
                    <div className="h-0.5 bg-current"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current"></div>
                    <div className="bg-current"></div>
                    <div className="bg-current"></div>
                    <div className="bg-current"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {sortedAndFilteredProspects.length} of {mockProspects.length} prospects
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Quick access:</span>
              <button className="text-blue-600 hover:text-blue-800">All Documents</button>
              <span>•</span>
              <button className="text-blue-600 hover:text-blue-800">Pending Signatures</button>
              <span>•</span>
              <button className="text-blue-600 hover:text-blue-800">Active Quotes</button>
            </div>
          </div>

          {/* Prospect Cards */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
            {sortedAndFilteredProspects.map((prospect) => (
              <div key={prospect.id} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors">{prospect.businessName}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        prospect.status === 'bound' ? 'bg-green-100 text-green-800' :
                        prospect.status === 'quotes' ? 'bg-blue-100 text-blue-800' :
                        prospect.status === 'submitted' ? 'bg-purple-100 text-purple-800' :
                        prospect.status === 'form' ? 'bg-yellow-100 text-yellow-800' :
                        prospect.status === 'esign' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prospect.status.charAt(0).toUpperCase() + prospect.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span>{prospect.contactName}</span>
                      <span>•</span>
                      <span>{prospect.contactEmail}</span>
                      {prospect.revenue && (
                        <>
                          <span>•</span>
                          <span>${(prospect.revenue / 1000000).toFixed(1)}M revenue</span>
                        </>
                      )}
                    </div>
                    
                    {/* Interactive Progress Bar - Now clickable */}
                    <div className="mb-4">
                      <ProspectProgressBar 
                        currentStage={prospect.status}
                        prospectId={prospect.id}
                        prospectName={prospect.businessName}
                        variant="interactive"
                        showLabels={true}
                        size="md"
                        className="w-full"
                        onStageClick={(stageId) => handleStageClick(stageId, prospect.id)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>Created {format(prospect.createdAt, 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>Updated {format(prospect.updatedAt, 'MMM d, yyyy')}</span>
                      {prospect.renewalDate && (
                        <>
                          <span>•</span>
                          <span>Renewal {format(prospect.renewalDate, 'MMM d, yyyy')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button className="p-2 text-gray-400 hover:text-yellow-500 rounded-lg hover:bg-yellow-50 transition-colors">
                      <StarOff className="h-4 w-4" />
                    </button>
                    
                    {/* Client Details Dropdown */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(prospect.id);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {dropdownOpen[prospect.id] && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-xl z-50">
                          <div className="py-1">
                            <div className="px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-100 bg-gray-50">
                              Client Details
                            </div>
                            
                            <button
                              onClick={() => openSlideOut('details', prospect.id, prospect.businessName)}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                              <User className="h-4 w-4 text-gray-400" />
                              <span>Client Information</span>
                            </button>
                            
                            <button
                              onClick={() => openSlideOut('timeline', prospect.id, prospect.businessName)}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                              <Timeline className="h-4 w-4 text-gray-400" />
                              <span>Progress Timeline</span>
                            </button>
                            
                            <button
                              onClick={() => openSlideOut('documents', prospect.id, prospect.businessName)}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span>Documents</span>
                            </button>
                            
                            <div className="border-t border-gray-100 mt-1 pt-1">
                              <button
                                onClick={() => {
                                  closeAllDropdowns();
                                  // Handle email action
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>Send Email</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  closeAllDropdowns();
                                  // Handle call action
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>Schedule Call</span>
                              </button>
                              
                              <Link
                                to={`/producer/prospects/${prospect.id}`}
                                onClick={closeAllDropdowns}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4 text-gray-400" />
                                <span>Open Full View</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Two Action Buttons: Client Portal and Client Details */}
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => handleViewClientDetails(prospect.id)}
                    className="flex-[2] flex items-center justify-center space-x-2 px-6 py-4 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Client Details</span>
                  </button>
                  
                  <button
                    onClick={() => handleOpenClientPortal(prospect)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Copy Portal Link</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedAndFilteredProspects.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No prospects found</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? "You haven't created any prospects yet." 
                  : `No prospects in "${filter}" stage.`}
              </p>
              <button
                onClick={() => setShowNewProspectModal(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create Your First Prospect</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Panel */}
      {slideOut.isOpen && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-100 shadow-2xl z-50 transform transition-transform duration-300">
          {renderSlideOutContent()}
        </div>
      )}
      
      {/* New Prospect Modal */}
      <NewProspectModal
        isOpen={showNewProspectModal}
        onClose={() => setShowNewProspectModal(false)}
        onSave={handleNewProspect}
      />
    </div>
  );
};

export default ProspectList;