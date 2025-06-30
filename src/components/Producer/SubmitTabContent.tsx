import React, { useState } from 'react';
import { Send, Building, Building as BuildingAdd, Target, Mail, Phone, Clock, CheckCircle, AlertTriangle, Star, TrendingUp, DollarSign, Shield, Eye, Edit, Copy, ExternalLink, RefreshCw, Plus, X, Filter, Search, Calendar, FileText, MessageSquare, Bell, Award, Zap, Brain, Users, MapPin, Globe, Sparkles, ArrowRight, Download, Upload, Settings, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

interface SubmitTabContentProps {
  prospectId: string;
  prospectName: string;
}

interface Carrier {
  id: string;
  name: string;
  code: string;
  logo?: string;
  rating: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    underwritingEmail: string;
  };
  appetite: {
    naicsCodes: string[];
    revenueRange: [number, number];
    states: string[];
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    preferredIndustries: string[];
  };
  performance: {
    quoteRate: number;
    avgResponseTime: number;
    bindRate: number;
    relationshipStrength: number;
  };
  aiScore: number;
  aiReasoning: string;
  isRecommended: boolean;
  submissionStatus: 'not_submitted' | 'submitted' | 'acknowledged' | 'quoted' | 'declined';
  submissionDate?: Date;
  lastContact?: Date;
  communicationHistory: CommunicationRecord[];
}

interface CommunicationRecord {
  id: string;
  type: 'email' | 'phone' | 'meeting' | 'submission';
  direction: 'outbound' | 'inbound';
  subject: string;
  content: string;
  timestamp: Date;
  contactPerson: string;
  status: 'sent' | 'delivered' | 'opened' | 'replied';
  attachments?: string[];
}

interface SubmissionPackage {
  id: string;
  name: string;
  description: string;
  forms: string[];
  documents: string[];
  customMessage: string;
  createdAt: Date;
  lastModified: Date;
}

const SubmitTabContent: React.FC<SubmitTabContentProps> = ({ prospectId, prospectName }) => {
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('ai_score');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCarrierModal, setShowAddCarrierModal] = useState(false);
  const [showCommunications, setShowCommunications] = useState(false);

  // Mock carrier data with AI recommendations
  const carriers: Carrier[] = [
    {
      id: '1',
      name: 'Liberty Mutual',
      code: 'LM',
      rating: 'A',
      contact: {
        name: 'Jane Smith',
        email: 'jane.smith@libertymutual.com',
        phone: '(555) 123-4567',
        underwritingEmail: 'underwriting@libertymutual.com'
      },
      appetite: {
        naicsCodes: ['541511', '541512'],
        revenueRange: [1000000, 10000000],
        states: ['CA', 'NY', 'TX', 'FL'],
        riskTolerance: 'moderate',
        preferredIndustries: ['Technology', 'Professional Services']
      },
      performance: {
        quoteRate: 85,
        avgResponseTime: 3,
        bindRate: 72,
        relationshipStrength: 9
      },
      aiScore: 94,
      aiReasoning: 'Excellent match for technology companies. Strong appetite for this NAICS code, revenue range fits perfectly, and historical performance shows high quote and bind rates.',
      isRecommended: true,
      submissionStatus: 'submitted',
      submissionDate: new Date('2024-01-19T14:30:00'),
      lastContact: new Date('2024-01-20T09:15:00'),
      communicationHistory: [
        {
          id: '1',
          type: 'submission',
          direction: 'outbound',
          subject: 'New Submission: Tech Solutions Inc - General Liability',
          content: 'Please find attached the complete submission package for Tech Solutions Inc...',
          timestamp: new Date('2024-01-19T14:30:00'),
          contactPerson: 'Jane Smith',
          status: 'delivered',
          attachments: ['ACORD_125.pdf', 'Loss_Runs.pdf', 'Financial_Statements.pdf']
        },
        {
          id: '2',
          type: 'email',
          direction: 'inbound',
          subject: 'RE: New Submission - Acknowledgment',
          content: 'Thank you for the submission. We have received all documents and will review...',
          timestamp: new Date('2024-01-20T09:15:00'),
          contactPerson: 'Jane Smith',
          status: 'replied'
        }
      ]
    },
    {
      id: '2',
      name: 'Travelers',
      code: 'TR',
      rating: 'A+',
      contact: {
        name: 'Bob Wilson',
        email: 'bob.wilson@travelers.com',
        phone: '(555) 234-5678',
        underwritingEmail: 'submissions@travelers.com'
      },
      appetite: {
        naicsCodes: ['541511', '541512'],
        revenueRange: [500000, 25000000],
        states: ['CA', 'NY', 'TX', 'FL', 'IL'],
        riskTolerance: 'conservative',
        preferredIndustries: ['Technology', 'Manufacturing', 'Healthcare']
      },
      performance: {
        quoteRate: 78,
        avgResponseTime: 5,
        bindRate: 68,
        relationshipStrength: 7
      },
      aiScore: 87,
      aiReasoning: 'Good match with conservative underwriting approach. Slightly longer response times but excellent financial strength.',
      isRecommended: true,
      submissionStatus: 'acknowledged',
      submissionDate: new Date('2024-01-19T14:30:00'),
      lastContact: new Date('2024-01-21T11:45:00'),
      communicationHistory: [
        {
          id: '3',
          type: 'submission',
          direction: 'outbound',
          subject: 'New Submission: Tech Solutions Inc - General Liability',
          content: 'Please find attached the complete submission package for Tech Solutions Inc...',
          timestamp: new Date('2024-01-19T14:30:00'),
          contactPerson: 'Bob Wilson',
          status: 'delivered',
          attachments: ['ACORD_125.pdf', 'Loss_Runs.pdf', 'Financial_Statements.pdf']
        },
        {
          id: '4',
          type: 'email',
          direction: 'inbound',
          subject: 'Submission Received - Additional Information Needed',
          content: 'We have reviewed the submission and need additional information about cybersecurity measures...',
          timestamp: new Date('2024-01-21T11:45:00'),
          contactPerson: 'Bob Wilson',
          status: 'replied'
        }
      ]
    },
    {
      id: '3',
      name: 'Chubb',
      code: 'CB',
      rating: 'A++',
      contact: {
        name: 'Sarah Davis',
        email: 'sarah.davis@chubb.com',
        phone: '(555) 345-6789',
        underwritingEmail: 'underwriting@chubb.com'
      },
      appetite: {
        naicsCodes: ['541511'],
        revenueRange: [2000000, 50000000],
        states: ['CA', 'NY', 'CT', 'NJ'],
        riskTolerance: 'conservative',
        preferredIndustries: ['Technology', 'Financial Services']
      },
      performance: {
        quoteRate: 65,
        avgResponseTime: 7,
        bindRate: 85,
        relationshipStrength: 6
      },
      aiScore: 76,
      aiReasoning: 'Premium carrier with excellent coverage terms but selective underwriting. Higher revenue threshold may result in higher premiums.',
      isRecommended: false,
      submissionStatus: 'not_submitted',
      communicationHistory: []
    }
  ];

  const submissionPackage: SubmissionPackage = {
    id: '1',
    name: 'Tech Solutions Inc - Complete Package',
    description: 'General Liability and Professional Liability submission package',
    forms: ['ACORD 125', 'ACORD 126', 'Technology E&O Supplement'],
    documents: ['Current Policy', 'Loss Runs', 'Financial Statements', 'Business License'],
    customMessage: '',
    createdAt: new Date('2024-01-19'),
    lastModified: new Date('2024-01-19')
  };

  const handleCarrierSelection = (carrierId: string, selected: boolean) => {
    if (selected) {
      setSelectedCarriers([...selectedCarriers, carrierId]);
    } else {
      setSelectedCarriers(selectedCarriers.filter(id => id !== carrierId));
    }
  };

  const generateAIEmailTemplate = (selectedCarrierIds: string[]) => {
    const selectedCarrierNames = carriers
      .filter(c => selectedCarrierIds.includes(c.id))
      .map(c => c.name)
      .join(', ');

    return `Subject: New Commercial Submission - ${prospectName} - General Liability & Professional Liability

Dear Underwriting Team,

I hope this email finds you well. I am pleased to submit a new commercial insurance opportunity for your consideration.

**Account Overview:**
• Business Name: ${prospectName}
• Industry: Technology Services (NAICS 541511)
• Annual Revenue: $2.5M
• Employees: 25
• Location: San Francisco, CA

**Coverage Requirements:**
• General Liability: $2M per occurrence / $4M aggregate
• Professional Liability: $1M per claim / $3M aggregate
• Cyber Liability: $1M per incident

**Key Highlights:**
• Established business with 6+ years of operations
• Strong financial performance with consistent growth
• No prior claims in the last 5 years
• Comprehensive risk management practices in place
• Current coverage expiring ${new Date().toLocaleDateString()}

**Submission Package Includes:**
• Completed ACORD 125 (General Liability Application)
• Technology E&O Supplemental Questionnaire
• 5-year loss run history (clean)
• Current policy declarations
• Financial statements (last 2 years)
• Business license and certificates

This account represents an excellent opportunity for a quality technology risk with strong fundamentals. The client is looking for comprehensive coverage with a carrier partner who understands their industry.

I would appreciate your prompt review and quote. Please let me know if you need any additional information or have questions about this submission.

Target effective date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Thank you for your time and consideration. I look forward to your response.

Best regards,
[Your Name]
[Your Title]
[Agency Name]
[Phone] | [Email]`;
  };

  const handleSubmitToCarriers = async () => {
    if (selectedCarriers.length === 0) {
      toast.error('Please select at least one carrier to submit to');
      return;
    }

    const template = generateAIEmailTemplate(selectedCarriers);
    setEmailTemplate(template);
    setShowEmailModal(true);
  };

  const handleSendSubmissions = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update carrier statuses
      selectedCarriers.forEach(carrierId => {
        const carrierIndex = carriers.findIndex(c => c.id === carrierId);
        if (carrierIndex !== -1) {
          carriers[carrierIndex].submissionStatus = 'submitted';
          carriers[carrierIndex].submissionDate = new Date();
        }
      });

      toast.success(`Submissions sent to ${selectedCarriers.length} carrier(s)`);
      setShowEmailModal(false);
      setSelectedCarriers([]);
      setShowCommunications(true);
    } catch (error) {
      toast.error('Failed to send submissions');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewCarrier = () => {
    setShowAddCarrierModal(true);
  };

  const filteredCarriers = carriers
    .filter(carrier => {
      const matchesFilter = filterStatus === 'all' || carrier.submissionStatus === filterStatus;
      const matchesSearch = carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           carrier.contact.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'ai_score':
          return b.aiScore - a.aiScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'quote_rate':
          return b.performance.quoteRate - a.performance.quoteRate;
        case 'response_time':
          return a.performance.avgResponseTime - b.performance.avgResponseTime;
        default:
          return b.aiScore - a.aiScore;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
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

  const renderEmailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900">AI-Generated Submission Email</h2>
                <p className="text-blue-800">Review and customize the email template before sending</p>
              </div>
            </div>
            <button 
              onClick={() => setShowEmailModal(false)}
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
                  <h4 className="font-medium text-green-900">Ready to Send</h4>
                  <p className="text-green-800 text-sm mt-1">
                    AI has generated a professional submission email template. You can edit the content below before sending to {selectedCarriers.length} carrier{selectedCarriers.length !== 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content
              </label>
              <textarea
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                rows={20}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Package
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{submissionPackage.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{submissionPackage.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Forms Included:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {submissionPackage.forms.map((form, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <FileText className="h-3 w-3" />
                          <span>{form}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Documents Included:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {submissionPackage.documents.map((doc, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <FileText className="h-3 w-3" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Sending to: {carriers.filter(c => selectedCarriers.includes(c.id)).map(c => c.name).join(', ')}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowEmailModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendSubmissions}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              {isSubmitting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isSubmitting ? 'Sending...' : 'Send Submissions'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddCarrierModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <BuildingAdd className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900">Add Additional Carrier</h2>
                <p className="text-blue-800">Add a carrier not in your recommended list</p>
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
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Hartford"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrier Code
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., HT"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Underwriter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
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
  );

  if (showCommunications) {
    return (
      <div className="space-y-6">
        {/* Communication Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Carrier Communications</h2>
              <p className="text-gray-600">Track communication history and manage follow-ups for {prospectName}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCommunications(false)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span>Back to Selection</span>
              </button>
              <button
                onClick={handleAddNewCarrier}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                <BuildingAdd className="h-4 w-4" />
                <span>Add Carrier</span>
              </button>
            </div>
          </div>

          {/* Submission Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Send className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600">Submitted</span>
              </div>
              <p className="text-xl font-bold text-blue-900">
                {carriers.filter(c => c.submissionStatus === 'submitted' || c.submissionStatus === 'acknowledged').length}
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-600">Pending</span>
              </div>
              <p className="text-xl font-bold text-yellow-900">
                {carriers.filter(c => c.submissionStatus === 'acknowledged').length}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Quoted</span>
              </div>
              <p className="text-xl font-bold text-green-900">
                {carriers.filter(c => c.submissionStatus === 'quoted').length}
              </p>
            </div>
          </div>
        </div>

        {/* Communication History for Each Carrier */}
        <div className="space-y-6">
          {carriers.filter(c => c.submissionStatus !== 'not_submitted').map((carrier) => (
            <div key={carrier.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{carrier.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">Rating: {carrier.rating}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(carrier.submissionStatus)}`}>
                        {carrier.submissionStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                    <Mail className="h-3 w-3" />
                    <span>Email</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                    <Phone className="h-3 w-3" />
                    <span>Call</span>
                  </button>
                </div>
              </div>

              {/* Communication History */}
              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-medium text-gray-900 mb-3">Communication History</h5>
                <div className="space-y-3">
                  {carrier.communicationHistory.length > 0 ? (
                    carrier.communicationHistory.map(comm => (
                      <div key={comm.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${
                          comm.type === 'email' ? 'bg-blue-100' :
                          comm.type === 'phone' ? 'bg-green-100' :
                          comm.type === 'submission' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          {comm.type === 'email' ? <Mail className="h-4 w-4 text-blue-600" /> :
                           comm.type === 'phone' ? <Phone className="h-4 w-4 text-green-600" /> :
                           comm.type === 'submission' ? <Send className="h-4 w-4 text-purple-600" /> :
                           <MessageSquare className="h-4 w-4 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="font-medium text-gray-900">{comm.subject}</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              comm.direction === 'outbound' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {comm.direction}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              comm.status === 'replied' ? 'bg-green-100 text-green-800' :
                              comm.status === 'opened' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {comm.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{comm.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{comm.contactPerson}</span>
                            <span>{comm.timestamp.toLocaleDateString()} at {comm.timestamp.toLocaleTimeString()}</span>
                            {comm.attachments && (
                              <span>{comm.attachments.length} attachment{comm.attachments.length !== 1 ? 's' : ''}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                      <div className="text-center">
                        <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No communications yet</p>
                        <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Send Message
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{carrier.contact.name}</p>
                    <p>{carrier.contact.email}</p>
                  </div>
                  {carrier.submissionDate && (
                    <span className="text-xs text-gray-500">
                      Submitted {carrier.submissionDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Submission Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Carrier Selection & Submission</h2>
            <p className="text-gray-600">Select carriers and submit with AI-generated email templates for {prospectName}</p>
          </div>
          
          <button
            onClick={handleAddNewCarrier}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
          >
            <BuildingAdd className="h-4 w-4" />
            <span>Add Carrier</span>
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search carriers or contacts..."
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
              <option value="not_submitted">Not Submitted</option>
              <option value="submitted">Submitted</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="quoted">Quoted</option>
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
              <option value="name">Carrier Name</option>
              <option value="quote_rate">Quote Rate</option>
              <option value="response_time">Response Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Carrier Cards */}
      <div className="space-y-6">
        {filteredCarriers.map((carrier) => (
          <div key={carrier.id} className={`bg-white rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg focus-within:shadow-lg ${
            selectedCarriers.includes(carrier.id) ? 'border-blue-500 bg-blue-50' : 
            carrier.isRecommended ? 'border-green-300 bg-green-50' : 'border-gray-200'
          }`}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 pt-1">
                <input
                  type="checkbox"
                  checked={selectedCarriers.includes(carrier.id)}
                  onChange={(e) => handleCarrierSelection(carrier.id, e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{carrier.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">Rating: {carrier.rating}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(carrier.submissionStatus)}`}>
                          {carrier.submissionStatus.replace('_', ' ').toUpperCase()}
                        </span>
                        {carrier.isRecommended && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            ⭐ Recommended
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className={`h-4 w-4 ${getAIScoreColor(carrier.aiScore)}`} />
                      <span className={`text-lg font-bold ${getAIScoreColor(carrier.aiScore)}`}>
                        {carrier.aiScore}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">AI Score</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{carrier.aiReasoning}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Quote Rate</p>
                    <p className="font-semibold text-gray-900">{carrier.performance.quoteRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Response</p>
                    <p className="font-semibold text-gray-900">{carrier.performance.avgResponseTime} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bind Rate</p>
                    <p className="font-semibold text-gray-900">{carrier.performance.bindRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Relationship</p>
                    <div className="flex items-center space-x-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${carrier.performance.relationshipStrength * 10}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{carrier.performance.relationshipStrength}/10</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{carrier.contact.name}</p>
                      <p>{carrier.contact.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {carrier.submissionDate && (
                        <span className="text-xs text-gray-500">
                          Submitted {carrier.submissionDate.toLocaleDateString()}
                        </span>
                      )}
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                          <Mail className="h-3 w-3" />
                          <span>Email</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                          <Phone className="h-3 w-3" />
                          <span>Call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Bar */}
      {selectedCarriers.length > 0 && (
        <div className="fixed bottom-0 left-72 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Send className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedCarriers.length} carrier{selectedCarriers.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-sm text-gray-600">
                      Ready to submit with AI-generated email template
                    </p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Selected:</span>
                  <div className="flex space-x-1">
                    {selectedCarriers.slice(0, 3).map((carrierId) => {
                      const carrier = carriers.find(c => c.id === carrierId);
                      return (
                        <span key={carrierId} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {carrier?.code}
                        </span>
                      );
                    })}
                    {selectedCarriers.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{selectedCarriers.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedCarriers([])}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleSubmitToCarriers}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate & Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && renderEmailModal()}
      
      {/* Add Carrier Modal */}
      {showAddCarrierModal && renderAddCarrierModal()}
    </div>
  );
};

export default SubmitTabContent;