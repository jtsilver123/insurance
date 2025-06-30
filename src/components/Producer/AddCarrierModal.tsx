import React, { useState } from 'react';
import { 
  X, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  DollarSign, 
  Target, 
  Shield, 
  FileText,
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCircle
} from 'lucide-react';

interface AddCarrierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (carrierData: any) => void;
}

const AddCarrierModal: React.FC<AddCarrierModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    status: 'active',
    rating: 'A',
    contact: {
      name: '',
      email: '',
      phone: '',
      underwritingEmail: ''
    },
    appetite: {
      maxPolicyLimit: 10000000,
      preferredIndustries: [] as string[],
      premiumRange: {
        min: 5000,
        max: 500000
      },
      geographicRestrictions: [] as string[],
      riskTolerance: 'moderate',
      specialConsiderations: [] as string[]
    },
    coverageLines: [] as string[],
    submissionRequirements: [] as string[],
    preferredSubmissionMethod: 'email',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const path = field.split('.');
    if (path.length === 1) {
      // Top level array
      const currentValues = [...formData[field as keyof typeof formData] as string[]];
      const index = currentValues.indexOf(value);
      
      if (index === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(index, 1);
      }
      
      setFormData(prev => ({
        ...prev,
        [field]: currentValues
      }));
    } else if (path.length === 2) {
      // Nested array
      const [parent, child] = path;
      const currentValues = [...(formData[parent as keyof typeof formData] as any)[child]];
      const index = currentValues.indexOf(value);
      
      if (index === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(index, 1);
      }
      
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: currentValues
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving carrier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Carrier</h2>
                <p className="text-blue-100">Configure carrier details, appetite, and submission requirements</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-8 px-4">
            {[
              { num: 1, title: "Basic Info" },
              { num: 2, title: "Appetite" },
              { num: 3, title: "Coverage" },
              { num: 4, title: "Review" }
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s.num ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
                  }`}>
                    {step > s.num ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="text-lg font-bold">{s.num}</span>
                    )}
                  </div>
                  <span className="text-sm mt-2 text-blue-100">{s.title}</span>
                </div>
                {i < 3 && (
                  <div className={`h-1 flex-1 mx-2 ${
                    step > i + 1 ? 'bg-white' : 'bg-blue-400'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carrier Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Liberty Mutual Insurance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carrier Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., LM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      A.M. Best Rating
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="A++">A++ (Superior)</option>
                      <option value="A+">A+ (Superior)</option>
                      <option value="A">A (Excellent)</option>
                      <option value="A-">A- (Excellent)</option>
                      <option value="B++">B++ (Good)</option>
                      <option value="B+">B+ (Good)</option>
                    </select>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="contact.name"
                        value={formData.contact.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Primary contact person"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="contact.email"
                          value={formData.contact.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="contact@carrier.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          name="contact.phone"
                          value={formData.contact.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Underwriting Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="contact.underwritingEmail"
                          value={formData.contact.underwritingEmail}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="underwriting@carrier.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Appetite */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Policy Limit
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        name="appetite.maxPolicyLimit"
                        value={formData.appetite.maxPolicyLimit}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk Tolerance
                    </label>
                    <select
                      name="appetite.riskTolerance"
                      value={formData.appetite.riskTolerance}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="conservative">Conservative</option>
                      <option value="moderate">Moderate</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Premium Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        name="appetite.premiumRange.min"
                        value={formData.appetite.premiumRange.min}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Minimum premium"
                      />
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        name="appetite.premiumRange.max"
                        value={formData.appetite.premiumRange.max}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Maximum premium"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Industries
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Technology', 'Manufacturing', 'Construction', 'Retail',
                      'Professional Services', 'Healthcare', 'Financial Services', 'Real Estate'
                    ].map(industry => (
                      <label key={industry} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.appetite.preferredIndustries.includes(industry)}
                          onChange={() => handleArrayChange('appetite.preferredIndustries', industry)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Geographic Restrictions
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'All US States'].map(state => (
                      <label key={state} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.appetite.geographicRestrictions.includes(state)}
                          onChange={() => handleArrayChange('appetite.geographicRestrictions', state)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{state}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Considerations
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter any special underwriting considerations, exclusions, or notes..."
                  />
                </div>
              </div>
            )}
            
            {/* Step 3: Coverage */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coverage Lines
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'General Liability', 'Professional Liability', 'Cyber Liability',
                      'Commercial Property', 'Workers Compensation', 'Commercial Auto',
                      'Directors & Officers', 'Employment Practices', 'Umbrella/Excess'
                    ].map(coverage => (
                      <label key={coverage} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.coverageLines.includes(coverage)}
                          onChange={() => handleArrayChange('coverageLines', coverage)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{coverage}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Requirements
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'ACORD 125', 'ACORD 126', 'ACORD 140', 'Loss Runs',
                      'Financial Statements', 'Safety Manual', 'Experience Mod',
                      'Supplemental Applications'
                    ].map(req => (
                      <label key={req} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.submissionRequirements.includes(req)}
                          onChange={() => handleArrayChange('submissionRequirements', req)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{req}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Submission Method
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'email', label: 'Email', icon: Mail },
                      { value: 'portal', label: 'Carrier Portal', icon: Globe },
                      { value: 'api', label: 'API Integration', icon: Shield }
                    ].map(method => (
                      <label 
                        key={method.value}
                        className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          formData.preferredSubmissionMethod === method.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="preferredSubmissionMethod"
                          value={method.value}
                          checked={formData.preferredSubmissionMethod === method.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <method.icon className={`h-5 w-5 ${
                          formData.preferredSubmissionMethod === method.value
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.preferredSubmissionMethod === method.value
                            ? 'text-blue-700'
                            : 'text-gray-700'
                        }`}>
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Ready to Add Carrier</h4>
                      <p className="text-blue-800 text-sm mt-1">
                        Please review the carrier information below before saving. You can go back to make changes if needed.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carrier Name:</span>
                        <span className="font-medium text-gray-900">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carrier Code:</span>
                        <span className="font-medium text-gray-900">{formData.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-gray-900 capitalize">{formData.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">A.M. Best Rating:</span>
                        <span className="font-medium text-gray-900">{formData.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Name:</span>
                        <span className="font-medium text-gray-900">{formData.contact.name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Email:</span>
                        <span className="font-medium text-gray-900">{formData.contact.email || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Phone:</span>
                        <span className="font-medium text-gray-900">{formData.contact.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Underwriting Email:</span>
                        <span className="font-medium text-gray-900">{formData.contact.underwritingEmail || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Appetite</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Policy Limit:</span>
                        <span className="font-medium text-gray-900">${formData.appetite.maxPolicyLimit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Premium Range:</span>
                        <span className="font-medium text-gray-900">
                          ${formData.appetite.premiumRange.min.toLocaleString()} - ${formData.appetite.premiumRange.max.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Tolerance:</span>
                        <span className="font-medium text-gray-900 capitalize">{formData.appetite.riskTolerance}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Preferred Industries:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {formData.appetite.preferredIndustries.length > 0 ? (
                            formData.appetite.preferredIndustries.map(industry => (
                              <span key={industry} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {industry}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">None selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Coverage & Submission</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Coverage Lines:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {formData.coverageLines.length > 0 ? (
                            formData.coverageLines.map(line => (
                              <span key={line} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                {line}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">None selected</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Submission Requirements:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {formData.submissionRequirements.length > 0 ? (
                            formData.submissionRequirements.map(req => (
                              <span key={req} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {req}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">None selected</span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Preferred Submission Method:</span>
                        <span className="font-medium text-gray-900 capitalize">{formData.preferredSubmissionMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {formData.notes && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                    <p className="text-sm text-gray-700">{formData.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            )}
            
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Carrier</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarrierModal;