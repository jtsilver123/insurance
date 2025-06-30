import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Zap,
  Eye,
  Edit,
  Send,
  User,
  Building,
  DollarSign,
  Shield,
  X,
  Plus,
  Minus,
  RefreshCw,
  Brain,
  Target,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  Settings,
  Download,
  Upload,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FormTabContentProps {
  prospectId: string;
  prospectName: string;
}

interface RecommendedForm {
  id: string;
  name: string;
  formNumber: string;
  category: 'acord' | 'supplemental' | 'carrier_specific';
  priority: 'required' | 'recommended' | 'optional';
  aiConfidence: number;
  reasoning: string;
  estimatedTime: string;
  coverageTypes: string[];
  autoPopulatedFields: number;
  totalFields: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  lastModified?: Date;
  completionPercentage: number;
  requiresProspectInput: boolean;
  extractedData?: any;
  fieldMappings?: FormFieldMapping[];
  expanded?: boolean;
}

interface FormFieldMapping {
  fieldId: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea';
  sourceDocument?: string;
  extractedValue?: any;
  confidence: number;
  status: 'approved' | 'denied' | 'pending' | 'input_needed';
  assignedTo?: 'prospect' | 'team_member';
  assignedToName?: string;
  assignedToEmail?: string;
  lastReminder?: Date;
  reminderCount: number;
  validationRules?: string[];
  options?: string[];
  notes?: string;
}

interface DocumentData {
  id: string;
  name: string;
  type: string;
  extractedData: any;
  confidence: number;
}

const FormTabContent: React.FC<FormTabContentProps> = ({ prospectId, prospectName }) => {
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<RecommendedForm[]>([]);
  const [fieldOverrides, setFieldOverrides] = useState<Record<string, any>>({});
  const [prospectInputFields, setProspectInputFields] = useState<string[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedField, setSelectedField] = useState<{formId: string, fieldId: string} | null>(null);

  // Mock extracted document data
  const documentData: DocumentData[] = [
    {
      id: '1',
      name: 'Business License 2024.pdf',
      type: 'License',
      extractedData: {
        businessName: 'Tech Solutions Inc',
        businessAddress: '123 Main Street, San Francisco, CA 94105',
        licenseNumber: 'BL-2024-789456',
        naicsCode: '541511',
        establishedDate: '2018-03-15',
        ownerName: 'John Smith',
        businessType: 'Technology Services'
      },
      confidence: 94
    },
    {
      id: '2',
      name: 'Current Policy.pdf',
      type: 'Policy',
      extractedData: {
        currentCarrier: 'Previous Insurance Co',
        policyNumber: 'POL-123456789',
        effectiveDate: '2023-01-01',
        expirationDate: '2024-01-01',
        annualPremium: 42000,
        coverageTypes: ['General Liability', 'Professional Liability'],
        limits: {
          generalLiability: 2000000,
          professionalLiability: 1000000
        }
      },
      confidence: 89
    }
  ];

  // Mock AI-recommended forms
  const recommendedForms: RecommendedForm[] = [
    {
      id: 'acord-125',
      name: 'General Liability Application',
      formNumber: 'ACORD 125',
      category: 'acord',
      priority: 'required',
      aiConfidence: 95,
      reasoning: 'Required for all commercial general liability coverage. High confidence based on business type (Technology Services) and current policy indicating GL coverage.',
      estimatedTime: '8-12 minutes',
      coverageTypes: ['General Liability'],
      autoPopulatedFields: 18,
      totalFields: 24,
      status: 'pending',
      completionPercentage: 0,
      requiresProspectInput: true,
      extractedData: {
        businessName: 'Tech Solutions Inc',
        businessAddress: '123 Main Street, San Francisco, CA 94105',
        naicsCode: '541511',
        yearsInBusiness: 6,
        currentCarrier: 'Previous Insurance Co',
        currentPremium: 42000
      },
      fieldMappings: [
        {
          fieldId: 'business_name',
          fieldName: 'Business Name',
          fieldType: 'text',
          sourceDocument: 'Business License 2024.pdf',
          extractedValue: 'Tech Solutions Inc',
          confidence: 94,
          status: 'pending',
          reminderCount: 0
        },
        {
          fieldId: 'business_address',
          fieldName: 'Business Address',
          fieldType: 'textarea',
          sourceDocument: 'Business License 2024.pdf',
          extractedValue: '123 Main Street, San Francisco, CA 94105',
          confidence: 94,
          status: 'pending',
          reminderCount: 0
        },
        {
          fieldId: 'annual_revenue',
          fieldName: 'Annual Revenue',
          fieldType: 'number',
          extractedValue: null,
          confidence: 0,
          status: 'pending',
          reminderCount: 0,
          validationRules: ['required', 'min:0']
        },
        {
          fieldId: 'employee_count',
          fieldName: 'Number of Employees',
          fieldType: 'number',
          extractedValue: null,
          confidence: 0,
          status: 'pending',
          reminderCount: 0,
          validationRules: ['required', 'min:1']
        },
        {
          fieldId: 'operations_description',
          fieldName: 'Description of Operations',
          fieldType: 'textarea',
          extractedValue: 'Technology Services',
          confidence: 85,
          status: 'pending',
          reminderCount: 0,
          validationRules: ['required', 'min:50']
        }
      ],
      expanded: false
    },
    {
      id: 'acord-126',
      name: 'Commercial Property Application',
      formNumber: 'ACORD 126',
      category: 'acord',
      priority: 'recommended',
      aiConfidence: 78,
      reasoning: 'Recommended based on business type and typical coverage needs for technology companies with physical locations.',
      estimatedTime: '6-10 minutes',
      coverageTypes: ['Commercial Property'],
      autoPopulatedFields: 12,
      totalFields: 20,
      status: 'pending',
      completionPercentage: 0,
      requiresProspectInput: true,
      extractedData: {
        businessName: 'Tech Solutions Inc',
        businessAddress: '123 Main Street, San Francisco, CA 94105'
      },
      fieldMappings: [
        {
          fieldId: 'property_address',
          fieldName: 'Property Address',
          fieldType: 'textarea',
          sourceDocument: 'Business License 2024.pdf',
          extractedValue: '123 Main Street, San Francisco, CA 94105',
          confidence: 94,
          status: 'pending',
          reminderCount: 0
        },
        {
          fieldId: 'building_value',
          fieldName: 'Building Value',
          fieldType: 'number',
          extractedValue: null,
          confidence: 0,
          status: 'pending',
          reminderCount: 0,
          validationRules: ['required', 'min:0']
        },
        {
          fieldId: 'contents_value',
          fieldName: 'Contents Value',
          fieldType: 'number',
          extractedValue: null,
          confidence: 0,
          status: 'pending',
          reminderCount: 0,
          validationRules: ['required', 'min:0']
        }
      ],
      expanded: false
    },
    {
      id: 'tech-supplement',
      name: 'Technology E&O Supplement',
      formNumber: 'TECH-E&O-001',
      category: 'supplemental',
      priority: 'recommended',
      aiConfidence: 88,
      reasoning: 'Highly recommended for technology services companies. Provides detailed professional liability coverage specific to software development and IT consulting.',
      estimatedTime: '10-15 minutes',
      coverageTypes: ['Professional Liability', 'Cyber Liability'],
      autoPopulatedFields: 8,
      totalFields: 16,
      status: 'pending',
      completionPercentage: 0,
      requiresProspectInput: true,
      extractedData: {
        businessType: 'Technology Services',
        naicsCode: '541511'
      },
      fieldMappings: [
        {
          fieldId: 'services_provided',
          fieldName: 'Primary Services Provided',
          fieldType: 'textarea',
          extractedValue: 'Technology Services',
          confidence: 85,
          status: 'pending',
          reminderCount: 0,
          validationRules: ['required', 'min:100']
        },
        {
          fieldId: 'client_types',
          fieldName: 'Typical Client Types',
          fieldType: 'select',
          extractedValue: null,
          confidence: 0,
          status: 'pending',
          reminderCount: 0,
          options: ['Small Business', 'Mid-Market', 'Enterprise', 'Government', 'Mixed']
        }
      ],
      expanded: false
    },
    {
      id: 'cyber-supplement',
      name: 'Cyber Liability Questionnaire',
      formNumber: 'CYBER-001',
      category: 'supplemental',
      priority: 'optional',
      aiConfidence: 72,
      reasoning: 'Optional but recommended for technology companies handling client data. Can provide significant premium savings with proper cybersecurity measures.',
      estimatedTime: '5-8 minutes',
      coverageTypes: ['Cyber Liability'],
      autoPopulatedFields: 4,
      totalFields: 12,
      status: 'pending',
      completionPercentage: 0,
      requiresProspectInput: true,
      extractedData: {},
      fieldMappings: [
        {
          fieldId: 'data_types',
          fieldName: 'Types of Data Handled',
          fieldType: 'checkbox',
          extractedValue: null,
          confidence: 0,
          status: 'pending',
          reminderCount: 0,
          options: ['PII', 'Financial', 'Health', 'Payment Card', 'Proprietary']
        }
      ],
      expanded: false
    }
  ];

  const handleFormSelection = (formId: string, selected: boolean) => {
    if (selected) {
      setSelectedForms([...selectedForms, formId]);
    } else {
      setSelectedForms(selectedForms.filter(id => id !== formId));
    }
  };

  const toggleFormExpansion = (formId: string) => {
    setFormData(prevForms => 
      prevForms.map(form => 
        form.id === formId 
          ? { ...form, expanded: !form.expanded } 
          : form
      )
    );
  };

  // Show/hide floating CTA based on form selection
  useEffect(() => {
    setShowFloatingCTA(selectedForms.length > 0 && !isConfiguring);
  }, [selectedForms.length, isConfiguring]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleGenerateForms = async () => {
    if (selectedForms.length === 0) {
      toast.error('Please select at least one form to generate');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Set the form data with expanded details for configuration
      setFormData(recommendedForms.filter(form => selectedForms.includes(form.id)).map(form => ({
        ...form,
        expanded: true
      })));
      
      setIsConfiguring(true);
      toast.success(`${selectedForms.length} form(s) generated with AI auto-population`);
      scrollToTop();
    } catch (error) {
      toast.error('Failed to generate forms');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFieldOverride = (formId: string, fieldId: string, value: any) => {
    setFieldOverrides(prev => ({
      ...prev,
      [`${formId}-${fieldId}`]: value
    }));
  };

  const handleFieldStatusChange = (formId: string, fieldId: string, status: 'approved' | 'denied' | 'input_needed') => {
    // Update the field status in the form data
    setFormData(prevForms => 
      prevForms.map(form => 
        form.id === formId 
          ? {
              ...form,
              fieldMappings: form.fieldMappings?.map(field =>
                field.fieldId === fieldId
                  ? { ...field, status }
                  : field
              )
            }
          : form
      )
    );

    if (status === 'input_needed') {
      setSelectedField({ formId, fieldId });
      setShowAssignmentModal(true);
    } else if (status === 'approved') {
      toast.success('Field approved successfully');
    }
  };

  const handleAssignField = (assignedTo: 'prospect' | 'team_member', assignedToName: string, assignedToEmail: string) => {
    if (!selectedField) return;

    setFormData(prevForms => 
      prevForms.map(form => 
        form.id === selectedField.formId 
          ? {
              ...form,
              fieldMappings: form.fieldMappings?.map(field =>
                field.fieldId === selectedField.fieldId
                  ? { 
                      ...field, 
                      assignedTo,
                      assignedToName,
                      assignedToEmail,
                      status: 'input_needed'
                    }
                  : field
              )
            }
          : form
      )
    );

    setShowAssignmentModal(false);
    setSelectedField(null);
    toast.success(`Field assigned to ${assignedToName}`);
  };

  const handleSendReminder = (formId: string, fieldId: string) => {
    setFormData(prevForms => 
      prevForms.map(form => 
        form.id === formId 
          ? {
              ...form,
              fieldMappings: form.fieldMappings?.map(field =>
                field.fieldId === fieldId
                  ? { 
                      ...field, 
                      lastReminder: new Date(),
                      reminderCount: field.reminderCount + 1
                    }
                  : field
              )
            }
          : form
      )
    );

    toast.success('Reminder sent successfully');
  };

  const handleSendToProspect = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Forms sent to prospect for completion');
      scrollToTop();
    } catch (error) {
      toast.error('Failed to send forms to prospect');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'required':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'recommended':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'optional':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'input_needed': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderAssignmentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Assign Field for Input</h3>
            <button 
              onClick={() => setShowAssignmentModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-gray-600">Who should provide the input for this field?</p>
          
          <div className="space-y-3">
            <button
              onClick={() => handleAssignField('prospect', prospectName, 'john@techsolutions.com')}
              className="w-full flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <User className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Assign to Prospect</p>
                <p className="text-sm text-gray-600">{prospectName}</p>
                <p className="text-xs text-gray-500">john@techsolutions.com</p>
              </div>
            </button>
            
            <button
              onClick={() => handleAssignField('team_member', 'Sarah Johnson', 'sarah@agency.com')}
              className="w-full flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Users className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Assign to Team Member</p>
                <p className="text-sm text-gray-600">Sarah Johnson (Assistant Producer)</p>
                <p className="text-xs text-gray-500">sarah@agency.com</p>
              </div>
            </button>
            
            <button
              onClick={() => handleAssignField('team_member', 'Mike Chen', 'mike@agency.com')}
              className="w-full flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Users className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Assign to Team Member</p>
                <p className="text-sm text-gray-600">Mike Chen (Senior Producer)</p>
                <p className="text-xs text-gray-500">mike@agency.com</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Form Selection & Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {isConfiguring ? 'Form Configuration' : 'Recommended Forms'}
          </h3>
          <div className="flex items-center space-x-4">
            {isConfiguring && (
              <button
                onClick={() => setIsConfiguring(false)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Additional Forms</span>
              </button>
            )}
            <div className="text-sm text-gray-600">
              {selectedForms.length} of {recommendedForms.length} selected
            </div>
          </div>
        </div>

        {/* Form Cards */}
        {(isConfiguring ? formData : recommendedForms).map((form) => (
          <div key={form.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-start space-x-4">
              {!isConfiguring && (
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedForms.includes(form.id)}
                    onChange={(e) => handleFormSelection(form.id, e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{form.name}</h4>
                      <span className="text-sm text-gray-600">({form.formNumber})</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(form.priority)}`}>
                        {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)}
                      </span>
                    </div>
                    {!isConfiguring && <p className="text-gray-700 leading-relaxed">{form.reasoning}</p>}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!isConfiguring && (
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className={`h-4 w-4 ${getConfidenceColor(form.aiConfidence)}`} />
                          <span className={`text-sm font-medium ${getConfidenceColor(form.aiConfidence)}`}>
                            {form.aiConfidence}% confidence
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{form.estimatedTime}</p>
                      </div>
                    )}
                    
                    {isConfiguring && (
                      <button
                        onClick={() => toggleFormExpansion(form.id)}
                        className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        {form.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <span>{form.expanded ? 'Collapse' : 'Configure'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Configuration */}
                {isConfiguring && form.fieldMappings && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Form Completion</span>
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round((form.fieldMappings.filter(f => f.status !== 'pending').length / form.fieldMappings.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(form.fieldMappings.filter(f => f.status !== 'pending').length / form.fieldMappings.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {!isConfiguring && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Coverage Types</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {form.coverageTypes.map((type, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Auto-Population</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(form.autoPopulatedFields / form.totalFields) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {form.autoPopulatedFields}/{form.totalFields}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prospect Input</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {form.requiresProspectInput ? 'Required' : 'Not needed'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded mt-1 ${
                        form.category === 'acord' ? 'bg-purple-100 text-purple-800' :
                        form.category === 'supplemental' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {form.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Extracted Data Preview */}
                {!isConfiguring && form.extractedData && Object.keys(form.extractedData).length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Auto-Populated Data Preview</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(form.extractedData).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium text-gray-900 truncate ml-2">{value as string}</span>
                        </div>
                      ))}
                      {Object.keys(form.extractedData).length > 4 && (
                        <div className="col-span-2 text-center">
                          <span className="text-green-600">+{Object.keys(form.extractedData).length - 4} more fields</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Field Configuration (when expanded) */}
                {isConfiguring && form.expanded && form.fieldMappings && (
                  <div className="space-y-4 border-t border-gray-200 pt-6 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-gray-900">AI Field Analysis & Approval</h5>
                      <div className="text-sm text-gray-600">
                        Review AI-extracted values and approve or assign for input
                      </div>
                    </div>

                    {form.fieldMappings.map((field) => (
                      <div key={field.fieldId} className={`rounded-lg p-4 border-2 ${
                        field.status === 'approved' ? 'bg-green-50 border-green-200' :
                        field.status === 'denied' ? 'bg-red-50 border-red-200' :
                        field.status === 'input_needed' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h6 className="font-medium text-gray-900">{field.fieldName}</h6>
                              <span className="text-xs text-gray-500">({field.fieldType})</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(field.status)}`}>
                                {field.status.replace('_', ' ').toUpperCase()}
                              </span>
                              {field.sourceDocument && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                  From: {field.sourceDocument}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">AI Extracted Value</label>
                                {field.extractedValue ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={fieldOverrides[`${form.id}-${field.fieldId}`] || field.extractedValue}
                                      onChange={(e) => handleFieldOverride(form.id, field.fieldId, e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      disabled={field.status === 'approved' || field.status === 'input_needed'}
                                    />
                                    <div className="flex items-center space-x-1">
                                      <Star className={`h-4 w-4 ${getConfidenceColor(field.confidence)}`} />
                                      <span className={`text-xs ${getConfidenceColor(field.confidence)}`}>
                                        {field.confidence}%
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500 italic">No value extracted - requires input</div>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Actions</label>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleFieldStatusChange(form.id, field.fieldId, 'approved')}
                                    className="flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => handleFieldStatusChange(form.id, field.fieldId, 'input_needed')}
                                    className="flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                                  >
                                    <User className="h-3 w-3" />
                                    <span>Input Needed</span>
                                  </button>
                                </div>
                              </div>

                              <div>
                                {field.assignedTo && (
                                  <div>
                                    <label className="block text-sm text-gray-600 mb-1">Assigned To</label>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex items-center space-x-1">
                                        {field.assignedTo === 'prospect' ? (
                                          <User className="h-3 w-3 text-blue-600" />
                                        ) : (
                                          <Users className="h-3 w-3 text-purple-600" />
                                        )}
                                        <span className="text-sm font-medium text-gray-900">{field.assignedToName}</span>
                                      </div>
                                      {field.reminderCount > 0 && (
                                        <span className="text-xs text-gray-500">
                                          ({field.reminderCount} reminder{field.reminderCount !== 1 ? 's' : ''})
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => handleSendReminder(form.id, field.fieldId)}
                                      className="mt-1 flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                      <Mail className="h-3 w-3" />
                                      <span>Send Reminder</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {field.status === 'input_needed' && field.assignedTo && (
                              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm font-medium text-yellow-900">
                                    Waiting for input from {field.assignedToName}
                                  </span>
                                </div>
                                <p className="text-xs text-yellow-700 mt-1">
                                  Assigned to: {field.assignedToEmail}
                                </p>
                                {field.lastReminder && (
                                  <p className="text-xs text-yellow-700 mt-1">
                                    Last reminder sent: {field.lastReminder.toLocaleDateString()} at {field.lastReminder.toLocaleTimeString()}
                                  </p>
                                )}
                              </div>
                            )}

                            {field.status === 'approved' && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-900">
                                    Field approved with value: <span className="font-bold">{fieldOverrides[`${form.id}-${field.fieldId}`] || field.extractedValue}</span>
                                  </span>
                                </div>
                              </div>
                            )}

                            {field.validationRules && field.validationRules.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-gray-600">Validation: {field.validationRules.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Form Summary */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h6 className="font-medium text-blue-900 mb-2">Form Status Summary</h6>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-green-600">
                            {form.fieldMappings?.filter(f => f.status === 'approved').length || 0}/{form.fieldMappings?.length || 0}
                          </p>
                          <p className="text-green-700">Approved</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-yellow-600">
                            {form.fieldMappings?.filter(f => f.status === 'input_needed').length || 0}/{form.fieldMappings?.length || 0}
                          </p>
                          <p className="text-yellow-700">Input Needed</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-600">
                            {form.fieldMappings?.filter(f => f.status === 'pending').length || 0}/{form.fieldMappings?.length || 0}
                          </p>
                          <p className="text-gray-700">Pending Review</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-blue-600">
                            {Math.round((form.fieldMappings?.filter(f => f.status !== 'pending').length || 0) / (form.fieldMappings?.length || 1) * 100)}%
                          </p>
                          <p className="text-blue-700">Complete</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Floating CTA Bar */}
      {showFloatingCTA && (
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
                      {selectedForms.length} form{selectedForms.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-sm text-gray-600">
                      Ready to configure with AI auto-population
                    </p>
                  </div>
                </div>
                
                {/* Selected forms preview */}
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Selected:</span>
                  <div className="flex space-x-1">
                    {selectedForms.slice(0, 3).map((formId) => {
                      const form = recommendedForms.find(f => f.id === formId);
                      return (
                        <span key={formId} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {form?.formNumber}
                        </span>
                      );
                    })}
                    {selectedForms.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{selectedForms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedForms([])}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleGenerateForms}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Settings className="h-4 w-4" />
                  )}
                  <span>{isProcessing ? 'Generating...' : 'Configure Forms'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && renderAssignmentModal()}
    </div>
  );
};

export default FormTabContent;