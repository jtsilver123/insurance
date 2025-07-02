import React, { useState } from 'react';
import { 
  User, Bell, Shield, CreditCard, Users, Mail, Phone, Building, Save, Eye, EyeOff, 
  Plus, Trash2, Edit, FileText, Settings as SettingsIcon, Zap, Search, Filter, 
  Upload, Download, Copy, X, CheckCircle, AlertTriangle, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import AddCarrierModal from './AddCarrierModal';
import AddTemplateModal from './AddTemplateModal';

interface Carrier {
  id: string;
  name: string;
  code: string;
  logo?: string;
  status: 'active' | 'inactive' | 'pending';
  rating: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    underwritingEmail: string;
  };
  appetite: {
    maxPolicyLimit: number;
    preferredIndustries: string[];
    premiumRange: {
      min: number;
      max: number;
    };
    geographicRestrictions: string[];
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    specialConsiderations: string[];
  };
  performance: {
    quoteRate: number;
    avgResponseTime: number;
    bindRate: number;
    claimsRating: number;
  };
  coverageLines: string[];
  submissionRequirements: string[];
  preferredSubmissionMethod: 'email' | 'portal' | 'api';
  notes: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  formNumber: string;
  version: string;
  versionDate: string;
  category: 'acord' | 'supplemental' | 'carrier_specific' | 'endorsement';
  lineOfBusiness: string[];
  industryTypes: string[];
  associatedCarriers: string[];
  purpose: string;
  requiredFields: string[];
  autoPopulate: boolean;
  presentationOrder: number;
  fileUrl: string;
  fileSize: string;
  lastUpdated: Date;
  isActive: boolean;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'stage_change' | 'document_upload' | 'form_completion' | 'time_based' | 'carrier_response';
    conditions: any;
  };
  actions: {
    type: 'send_email' | 'create_task' | 'update_status' | 'generate_form' | 'notify_user';
    parameters: any;
  }[];
  isActive: boolean;
  lastTriggered?: Date;
  triggerCount: number;
  createdAt: Date;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddCarrierModal, setShowAddCarrierModal] = useState(false);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);

  // Mock data
  const mockCarriers: Carrier[] = [
    {
      id: '1',
      name: 'Liberty Mutual',
      code: 'LM',
      status: 'active',
      rating: 'A',
      contact: {
        name: 'Jane Smith',
        email: 'jane.smith@libertymutual.com',
        phone: '(555) 123-4567',
        underwritingEmail: 'underwriting@libertymutual.com'
      },
      appetite: {
        maxPolicyLimit: 10000000,
        preferredIndustries: ['Technology', 'Professional Services', 'Manufacturing'],
        premiumRange: { min: 5000, max: 500000 },
        geographicRestrictions: ['CA', 'NY', 'TX', 'FL', 'IL'],
        riskTolerance: 'moderate',
        specialConsiderations: ['Strong financial statements required', 'No startups under 2 years']
      },
      performance: {
        quoteRate: 85,
        avgResponseTime: 3,
        bindRate: 72,
        claimsRating: 4.2
      },
      coverageLines: ['General Liability', 'Professional Liability', 'Cyber Liability'],
      submissionRequirements: ['ACORD 125', 'ACORD 126', 'Loss Runs', 'Financial Statements'],
      preferredSubmissionMethod: 'email',
      notes: 'Excellent for tech companies. Fast turnaround on quotes.'
    },
    {
      id: '2',
      name: 'Travelers',
      code: 'TR',
      status: 'active',
      rating: 'A+',
      contact: {
        name: 'Bob Wilson',
        email: 'bob.wilson@travelers.com',
        phone: '(555) 234-5678',
        underwritingEmail: 'submissions@travelers.com'
      },
      appetite: {
        maxPolicyLimit: 25000000,
        preferredIndustries: ['Construction', 'Healthcare', 'Retail', 'Manufacturing'],
        premiumRange: { min: 10000, max: 1000000 },
        geographicRestrictions: ['All US States'],
        riskTolerance: 'conservative',
        specialConsiderations: ['Requires safety programs for construction', 'Minimum 5 years in business']
      },
      performance: {
        quoteRate: 78,
        avgResponseTime: 5,
        bindRate: 68,
        claimsRating: 4.5
      },
      coverageLines: ['General Liability', 'Commercial Property', 'Workers Compensation'],
      submissionRequirements: ['ACORD 125', 'ACORD 140', 'Safety Manual', 'Experience Mod'],
      preferredSubmissionMethod: 'portal',
      notes: 'Conservative underwriting but excellent claims service.'
    }
  ];

  const mockDocuments: DocumentTemplate[] = [
    {
      id: '1',
      name: 'General Liability Application',
      formNumber: 'ACORD 125',
      version: '2016/03',
      versionDate: '2016-03-01',
      category: 'acord',
      lineOfBusiness: ['General Liability'],
      industryTypes: ['All'],
      associatedCarriers: ['Liberty Mutual', 'Travelers', 'Chubb'],
      purpose: 'Standard general liability application form',
      requiredFields: ['Business Name', 'NAICS Code', 'Revenue', 'Employee Count', 'Prior Coverage'],
      autoPopulate: true,
      presentationOrder: 1,
      fileUrl: '/forms/acord-125.pdf',
      fileSize: '2.1 MB',
      lastUpdated: new Date('2024-01-15'),
      isActive: true
    },
    {
      id: '2',
      name: 'Professional Liability Supplement',
      formNumber: 'PL-SUPP-001',
      version: '2023/01',
      versionDate: '2023-01-01',
      category: 'supplemental',
      lineOfBusiness: ['Professional Liability'],
      industryTypes: ['Technology', 'Professional Services', 'Healthcare'],
      associatedCarriers: ['Liberty Mutual', 'Chubb'],
      purpose: 'Supplemental questionnaire for professional liability coverage',
      requiredFields: ['Services Provided', 'Client Types', 'Project Values', 'Prior Claims'],
      autoPopulate: false,
      presentationOrder: 3,
      fileUrl: '/forms/pl-supplement.pdf',
      fileSize: '1.2 MB',
      lastUpdated: new Date('2024-01-20'),
      isActive: true
    }
  ];

  const mockAutomations: AutomationRule[] = [
    {
      id: '1',
      name: 'Welcome Email Sequence',
      description: 'Send welcome email when prospect is created and portal link when LOA is signed',
      trigger: {
        type: 'stage_change',
        conditions: { from: null, to: 'kickoff' }
      },
      actions: [
        { type: 'send_email', parameters: { template: 'welcome', delay: 0 } },
        { type: 'send_email', parameters: { template: 'portal_link', delay: 3600 } }
      ],
      isActive: true,
      lastTriggered: new Date('2024-01-22T10:30:00'),
      triggerCount: 45,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Document Reminder Follow-up',
      description: 'Send reminder emails for missing documents after 3 days',
      trigger: {
        type: 'time_based',
        conditions: { stage: 'docs', days_elapsed: 3 }
      },
      actions: [
        { type: 'send_email', parameters: { template: 'document_reminder' } },
        { type: 'create_task', parameters: { title: 'Follow up on missing documents' } }
      ],
      isActive: true,
      lastTriggered: new Date('2024-01-21T14:15:00'),
      triggerCount: 23,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Quote Received Notification',
      description: 'Notify producer and client when quotes are received',
      trigger: {
        type: 'carrier_response',
        conditions: { type: 'quote_received' }
      },
      actions: [
        { type: 'notify_user', parameters: { role: 'producer', message: 'New quote received' } },
        { type: 'send_email', parameters: { template: 'quote_notification', recipient: 'client' } },
        { type: 'update_status', parameters: { stage: 'quotes' } }
      ],
      isActive: true,
      lastTriggered: new Date('2024-01-22T16:45:00'),
      triggerCount: 18,
      createdAt: new Date('2024-01-05')
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'carriers', label: 'Carrier Profiles', icon: Building },
    { id: 'documents', label: 'Document Templates', icon: FileText },
    { id: 'automations', label: 'Workflow Automations', icon: Zap },
    { id: 'team', label: 'Team & Billing', icon: Users }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCarrier = (carrierData: any) => {
    // In a real app, this would make an API call to save the carrier
    console.log('Adding carrier:', carrierData);
    
    // For demo purposes, we'll just show a success message
    toast.success('Carrier added successfully!');
  };

  const handleAddTemplate = (templateData: any) => {
    // In a real app, this would make an API call to save the template
    console.log('Adding template:', templateData);
    
    // For demo purposes, we'll just show a success message
    toast.success('Template added successfully!');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-white">JD</span>
        </div>
        <div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
            Change Photo
          </button>
          <p className="text-sm text-gray-600 mt-2">JPG, GIF or PNG. 1MB max.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            defaultValue="John"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            defaultValue="Doe"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              defaultValue="(555) 123-4567"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              defaultValue="ABC Insurance Agency"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>
      
      {/* Security Settings - Moved from separate tab */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 bg-gray-50 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold">
            Update Password
          </button>
        </div>
      </div>
      
      {/* Notification Settings - Moved from separate tab */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-t border-gray-200 pt-8">Notification Settings</h3>
        <div className="space-y-4">
          {[
            { id: 'new-prospect', label: 'New prospect created', description: 'Get notified when a new prospect is added' },
            { id: 'quote-received', label: 'Quote received', description: 'Get notified when carriers send quotes' },
            { id: 'document-uploaded', label: 'Document uploaded', description: 'Get notified when clients upload documents' },
            { id: 'form-completed', label: 'Form completed', description: 'Get notified when clients complete forms' },
            { id: 'policy-bound', label: 'Policy bound', description: 'Get notified when policies are bound' }
          ].map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{notification.label}</p>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCarriersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Carrier Profiles</h3>
          <p className="text-sm text-gray-600">Manage your insurance carrier relationships and appetite criteria</p>
        </div>
        <button 
          onClick={() => setShowAddCarrierModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
        >
          <Plus className="h-4 w-4" />
          <span>Add Carrier</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search carriers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Filter className="h-4 w-4 text-gray-500" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockCarriers.map((carrier) => (
          <div key={carrier.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{carrier.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">Rating: {carrier.rating}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      carrier.status === 'active' ? 'bg-green-100 text-green-800' :
                      carrier.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {carrier.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Quote Rate</p>
                <p className="font-semibold text-gray-900">{carrier.performance.quoteRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="font-semibold text-gray-900">{carrier.performance.avgResponseTime} days</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Coverage Lines</p>
              <div className="flex flex-wrap gap-1">
                {carrier.coverageLines.slice(0, 2).map((line, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {line}
                  </span>
                ))}
                {carrier.coverageLines.length > 2 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{carrier.coverageLines.length - 2} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Premium Range: ${carrier.appetite.premiumRange.min.toLocaleString()} - ${carrier.appetite.premiumRange.max.toLocaleString()}
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Document Templates</h3>
          <p className="text-sm text-gray-600">Manage your standardized forms and document templates</p>
        </div>
        <button 
          onClick={() => setShowAddTemplateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
        >
          <Plus className="h-4 w-4" />
          <span>Add Template</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        <select className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors">
          <option value="all">All Categories</option>
          <option value="acord">ACORD Forms</option>
          <option value="supplemental">Supplemental</option>
          <option value="carrier_specific">Carrier Specific</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockDocuments.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ${
                  doc.category === 'acord' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                  doc.category === 'supplemental' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                  'bg-gradient-to-br from-purple-500 to-purple-600'
                }`}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{doc.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">{doc.formNumber}</span>
                    <span className="text-sm text-gray-600">v{doc.version}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      doc.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {doc.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Purpose</p>
              <p className="text-sm text-gray-900">{doc.purpose}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  doc.category === 'acord' ? 'bg-blue-100 text-blue-800' :
                  doc.category === 'supplemental' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {doc.category.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Auto-Populate</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  doc.autoPopulate ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {doc.autoPopulate ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Updated {doc.lastUpdated.toLocaleDateString()}
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAutomationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Workflow Automations</h3>
          <p className="text-sm text-gray-600">Configure automated actions and triggers for your workflow</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
          <Plus className="h-4 w-4" />
          <span>Create Rule</span>
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Automation Overview</h4>
            <p className="text-blue-800 text-sm mt-1">
              You have {mockAutomations.filter(a => a.isActive).length} active automation rules. 
              Total triggers this month: {mockAutomations.reduce((sum, a) => sum + a.triggerCount, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockAutomations.map((automation) => (
          <div key={automation.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{automation.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    automation.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {automation.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{automation.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Trigger Type</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {automation.trigger.type.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Actions</p>
                    <p className="font-medium text-gray-900">{automation.actions.length} configured</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Triggered</p>
                    <p className="font-medium text-gray-900">{automation.triggerCount} times</p>
                  </div>
                </div>

                {automation.lastTriggered && (
                  <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Last triggered: {automation.lastTriggered.toLocaleDateString()} at {automation.lastTriggered.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={automation.isActive} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h5 className="font-medium text-gray-900 mb-2">Configured Actions:</h5>
              <div className="flex flex-wrap gap-2">
                {automation.actions.map((action, index) => (
                  <span key={index} className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {action.type.replace('_', ' ').charAt(0).toUpperCase() + action.type.replace('_', ' ').slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Automation Best Practices</h4>
            <ul className="text-yellow-800 text-sm mt-2 space-y-1">
              <li>• Test automation rules with a small subset before enabling for all prospects</li>
              <li>• Monitor trigger counts to ensure rules are working as expected</li>
              <li>• Use time-based delays to avoid overwhelming clients with communications</li>
              <li>• Regularly review and update automation rules based on performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members & Billing</h3>
        <p className="text-sm text-gray-600 mb-6">Manage your team access, permissions, and subscription plan</p>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-medium text-gray-900">Team Members</h4>
            <p className="text-sm text-gray-600">Manage your team access and permissions</p>
          </div>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
            <Plus className="h-4 w-4" />
            <span>Invite Member</span>
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">JD</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">John Doe</div>
                        <div className="text-xs text-gray-500">Account Owner</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Admin</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-gray-400">Owner</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">SJ</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                        <div className="text-xs text-gray-500">Team Member</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sarah@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Producer</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Remove</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-4 border-t border-gray-200 pt-6">Current Plan</h4>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-blue-900">Professional Plan</h4>
              <p className="text-blue-700">$99/month • Billed annually</p>
              <p className="text-sm text-blue-600 mt-2">Next billing date: March 15, 2024</p>
            </div>
            <div>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
                Upgrade Plan
              </button>
              <p className="text-sm text-blue-600 mt-2 text-center">$49/user/month</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Billing Information</h4>
              <p className="text-yellow-800 text-sm mt-1">
                Your plan is billed annually. You currently have 2 team members. Adding additional team members will be prorated for your current billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Settings</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your account, carriers, documents, and workflow automations</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border-r-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'carriers' && renderCarriersTab()}
            {activeTab === 'documents' && renderDocumentsTab()}
            {activeTab === 'automations' && renderAutomationsTab()}
            {activeTab === 'team' && renderBillingTab()}

            {/* Save Button */}
            {(activeTab === 'profile' || activeTab === 'carriers' || activeTab === 'documents' || activeTab === 'automations') && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Carrier Modal */}
      <AddCarrierModal 
        isOpen={showAddCarrierModal}
        onClose={() => setShowAddCarrierModal(false)}
        onSave={handleAddCarrier}
      />
      
      {/* Add Template Modal */}
      <AddTemplateModal
        isOpen={showAddTemplateModal}
        onClose={() => setShowAddTemplateModal(false)}
        onSave={handleAddTemplate}
      />
    </div>
  );
};

export default Settings;