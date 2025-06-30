import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Mail,
  Eye,
  Zap,
  Clock,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Activity,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Plus,
  X,
  Star,
  Image,
  File,
  User,
  Building,
  Calendar,
  Send,
  Phone,
  Shield,
  ChevronDown,
  ChevronRight,
  Bell,
  Copy,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DocsInTabContentProps {
  prospectId: string;
  prospectName: string;
}

interface DocumentRequest {
  id: string;
  documentName: string;
  documentType: string;
  recipient: 'prospect' | 'agent';
  recipientName: string;
  recipientEmail: string;
  status: 'pending' | 'sent' | 'received' | 'overdue' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  requestedAt: Date;
  notes?: string;
  daysPending: number;
  daysUntilDue: number;
  actionRequiredBy: string;
  authorizationRequired?: boolean;
  authorizationStatus?: 'pending' | 'sent' | 'signed' | 'declined';
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'processing' | 'error';
  uploadedAt: Date;
  size: string;
  uploadedBy: string;
  extractedData?: any;
  processingProgress?: number;
  notes?: string;
}

const DocsInTabContent: React.FC<DocsInTabContentProps> = ({ prospectId, prospectName }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'request' | 'upload'>('dashboard');
  const [isExecuting, setIsExecuting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<'prospect' | 'agent'>('prospect');
  const [requestNotes, setRequestNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Mock data for document requests
  const documentRequests: DocumentRequest[] = [
    {
      id: '1',
      documentName: 'Loss Runs (5-year history)',
      documentType: 'Loss Run',
      recipient: 'prospect',
      recipientName: 'John Smith',
      recipientEmail: 'john@techsolutions.com',
      status: 'overdue',
      priority: 'high',
      dueDate: new Date('2024-01-20'),
      requestedAt: new Date('2024-01-15'),
      daysPending: 8,
      daysUntilDue: -3,
      actionRequiredBy: 'John Smith (Prospect)',
      notes: 'Please provide complete 5-year loss run history from current carrier'
    },
    {
      id: '2',
      documentName: 'Current Policy Documents',
      documentType: 'Policy',
      recipient: 'agent',
      recipientName: 'Sarah Wilson',
      recipientEmail: 'sarah@currentagency.com',
      status: 'pending',
      priority: 'high',
      dueDate: new Date('2024-01-25'),
      requestedAt: new Date('2024-01-18'),
      daysPending: 5,
      daysUntilDue: 2,
      actionRequiredBy: 'Sarah Wilson (Current Agent)',
      authorizationRequired: true,
      authorizationStatus: 'signed',
      notes: 'Using signed LOA to collect from current agent'
    },
    {
      id: '3',
      documentName: 'Financial Statements',
      documentType: 'Financial',
      recipient: 'prospect',
      recipientName: 'John Smith',
      recipientEmail: 'john@techsolutions.com',
      status: 'sent',
      priority: 'medium',
      dueDate: new Date('2024-01-28'),
      requestedAt: new Date('2024-01-20'),
      daysPending: 3,
      daysUntilDue: 5,
      actionRequiredBy: 'John Smith (Prospect)',
      notes: 'Last 2 years of audited financial statements'
    }
  ];

  // Mock data for uploaded documents
  const uploadedDocuments: UploadedDocument[] = [
    {
      id: '1',
      name: 'Business License 2024.pdf',
      type: 'License',
      status: 'completed',
      uploadedAt: new Date('2024-01-16'),
      size: '1.2 MB',
      uploadedBy: 'Producer',
      extractedData: {
        licenseNumber: 'BL-2024-789456',
        expirationDate: '2024-12-31',
        businessType: 'Technology Services'
      },
      notes: 'Current business license - valid through 2024'
    },
    {
      id: '2',
      name: 'Safety Manual.pdf',
      type: 'Safety',
      status: 'processing',
      uploadedAt: new Date('2024-01-22'),
      size: '3.4 MB',
      uploadedBy: 'Producer',
      processingProgress: 65,
      notes: 'Company safety procedures and protocols'
    }
  ];

  const availableDocuments = [
    { id: 'loss-runs', name: 'Loss Runs (5-year history)', type: 'Loss Run', required: true },
    { id: 'current-policy', name: 'Current Policy Documents', type: 'Policy', required: true },
    { id: 'financial-statements', name: 'Financial Statements', type: 'Financial', required: true },
    { id: 'business-license', name: 'Business License', type: 'License', required: false },
    { id: 'safety-manual', name: 'Safety Manual', type: 'Safety', required: false },
    { id: 'workers-comp-mod', name: 'Workers Comp Experience Mod', type: 'Workers Comp', required: false },
    { id: 'contracts', name: 'Sample Contracts', type: 'Contract', required: false },
    { id: 'certificates', name: 'Professional Certificates', type: 'Certificate', required: false }
  ];

  const handleRequestDocuments = async () => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select at least one document to request');
      return;
    }

    setIsExecuting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (selectedRecipient === 'agent') {
        toast.success(`Authorization form sent to prospect. Document requests will be sent to agent once authorized.`);
      } else {
        toast.success(`Document requests sent to ${prospectName}`);
      }
      
      setShowRequestModal(false);
      setSelectedDocuments([]);
      setRequestNotes('');
    } catch (error) {
      toast.error('Failed to send document requests');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleUploadDocuments = async (files: FileList) => {
    setIsExecuting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`${files.length} document(s) uploaded successfully`);
      setShowUploadModal(false);
    } catch (error) {
      toast.error('Failed to upload documents');
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'sent':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{documentRequests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {documentRequests.filter(req => req.status === 'overdue').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Received</p>
              <p className="text-2xl font-bold text-green-600">
                {documentRequests.filter(req => req.status === 'received').length + uploadedDocuments.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Response</p>
              <p className="text-2xl font-bold text-yellow-600">3.2d</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search documents and requests..."
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
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="overdue">Overdue</option>
              <option value="received">Received</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="daysPending">Days Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Requests */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Document Requests</h3>
          <p className="text-sm text-gray-600 mt-1">Track all pending and completed document requests</p>
        </div>
        <div className="divide-y divide-gray-200">
          {documentRequests.map((request) => (
            <div key={request.id} className={`p-6 border-l-4 ${getPriorityColor(request.priority)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{request.documentName}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.priority === 'high' ? 'bg-red-100 text-red-800' :
                      request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Recipient</p>
                      <p className="font-medium text-gray-900">{request.recipientName}</p>
                      <p className="text-xs text-gray-500">({request.recipient})</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Action Required By</p>
                      <p className="font-medium text-gray-900">{request.actionRequiredBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Days Pending</p>
                      <p className={`font-medium ${request.daysPending > 5 ? 'text-red-600' : 'text-gray-900'}`}>
                        {request.daysPending} days
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Due Date</p>
                      <p className={`font-medium ${request.daysUntilDue < 0 ? 'text-red-600' : request.daysUntilDue <= 1 ? 'text-yellow-600' : 'text-gray-900'}`}>
                        {request.daysUntilDue < 0 ? `${Math.abs(request.daysUntilDue)} days overdue` :
                         request.daysUntilDue === 0 ? 'Due today' :
                         `${request.daysUntilDue} days remaining`}
                      </p>
                    </div>
                  </div>

                  {request.authorizationRequired && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Authorization Required</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.authorizationStatus === 'signed' ? 'bg-green-100 text-green-800' :
                          request.authorizationStatus === 'sent' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.authorizationStatus?.charAt(0).toUpperCase() + request.authorizationStatus?.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800 mt-1">
                        {request.authorizationStatus === 'signed' ? 
                          'Client has authorized collection from current agent' :
                          'Waiting for client authorization to collect from agent'
                        }
                      </p>
                    </div>
                  )}

                  {request.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{request.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Bell className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
          <p className="text-sm text-gray-600 mt-1">Documents that have been manually uploaded</p>
        </div>
        <div className="divide-y divide-gray-200">
          {uploadedDocuments.map((doc) => (
            <div key={doc.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-2 rounded-lg ${
                    doc.status === 'completed' ? 'bg-green-100' :
                    doc.status === 'processing' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <FileText className={`h-5 w-5 ${
                      doc.status === 'completed' ? 'text-green-600' :
                      doc.status === 'processing' ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-medium text-gray-900">{doc.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Size</p>
                        <p className="font-medium text-gray-900">{doc.size}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Uploaded By</p>
                        <p className="font-medium text-gray-900">{doc.uploadedBy}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Upload Date</p>
                        <p className="font-medium text-gray-900">{doc.uploadedAt.toLocaleDateString()}</p>
                      </div>
                    </div>

                    {doc.status === 'processing' && doc.processingProgress && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Processing with AI</span>
                          <span className="text-sm font-medium text-gray-900">{doc.processingProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${doc.processingProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {doc.extractedData && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-green-600" />
                          <p className="text-sm font-medium text-green-900">Information Extracted</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(doc.extractedData).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="ml-1 font-medium text-gray-900">{value as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {doc.notes && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{doc.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRequestModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900">Request Documents</h2>
                <p className="text-blue-800">Send document requests to prospect or their current agent</p>
              </div>
            </div>
            <button 
              onClick={() => setShowRequestModal(false)}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-blue-600" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Document Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Documents to Request</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableDocuments.map((doc) => (
                  <label key={doc.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocuments([...selectedDocuments, doc.id]);
                        } else {
                          setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{doc.name}</span>
                        {doc.required && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{doc.type}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Recipient Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Recipient</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  selectedRecipient === 'prospect' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="recipient"
                    value="prospect"
                    checked={selectedRecipient === 'prospect'}
                    onChange={(e) => setSelectedRecipient(e.target.value as 'prospect' | 'agent')}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <User className={`h-5 w-5 mt-1 ${selectedRecipient === 'prospect' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <h4 className={`font-medium ${selectedRecipient === 'prospect' ? 'text-blue-900' : 'text-gray-900'}`}>
                        Send to Prospect
                      </h4>
                      <p className={`text-sm mt-1 ${selectedRecipient === 'prospect' ? 'text-blue-800' : 'text-gray-600'}`}>
                        Request documents directly from {prospectName}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">john@techsolutions.com</p>
                    </div>
                  </div>
                </label>

                <label className={`p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  selectedRecipient === 'agent' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="recipient"
                    value="agent"
                    checked={selectedRecipient === 'agent'}
                    onChange={(e) => setSelectedRecipient(e.target.value as 'prospect' | 'agent')}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <Building className={`h-5 w-5 mt-1 ${selectedRecipient === 'agent' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <h4 className={`font-medium ${selectedRecipient === 'agent' ? 'text-blue-900' : 'text-gray-900'}`}>
                        Send to Current Agent
                      </h4>
                      <p className={`text-sm mt-1 ${selectedRecipient === 'agent' ? 'text-blue-800' : 'text-gray-600'}`}>
                        Use signed authority to collect from current agent
                      </p>
                      <p className="text-xs text-gray-500 mt-2">sarah@currentagency.com</p>
                    </div>
                  </div>
                </label>
              </div>

              {selectedRecipient === 'agent' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Authorization Required</h4>
                      <p className="text-yellow-800 text-sm mt-1">
                        We'll first send an authorization form to {prospectName} to give you permission to collect 
                        documents from their current agent. Once signed, we'll automatically request the documents.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Request Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Notes/Instructions</label>
              <textarea
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any specific instructions or notes for the recipient..."
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedDocuments.length} document(s) selected
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowRequestModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestDocuments}
              disabled={isExecuting || selectedDocuments.length === 0}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isExecuting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isExecuting ? 'Sending...' : 'Send Requests'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-600 rounded-xl">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-900">Upload Documents</h2>
                <p className="text-green-800">Manually upload documents for this prospect</p>
              </div>
            </div>
            <button 
              onClick={() => setShowUploadModal(false)}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-green-600" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drag & drop files here
              </h3>
              <p className="text-gray-600 mb-4">
                or click to browse your computer
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  if (e.target.files) {
                    handleUploadDocuments(e.target.files);
                  }
                }}
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Select Files</span>
              </label>
              <p className="text-xs text-gray-500 mt-4">
                Supported formats: PDF, DOC, DOCX, JPG, PNG • Max 25MB per file
              </p>
            </div>

            {/* Document Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">Select document type</option>
                <option value="policy">Current Policy</option>
                <option value="loss-run">Loss Run</option>
                <option value="financial">Financial Statement</option>
                <option value="license">Business License</option>
                <option value="safety">Safety Manual</option>
                <option value="certificate">Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Add any relevant notes about this document..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
          <p className="text-gray-600 mt-1">Request documents or upload files for {prospectName}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <Mail className="h-4 w-4" />
            <span>Request Documents</span>
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {renderDashboard()}

      {/* Modals */}
      {showRequestModal && renderRequestModal()}
      {showUploadModal && renderUploadModal()}
    </div>
  );
};

export default DocsInTabContent;