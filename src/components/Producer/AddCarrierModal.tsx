import React, { useState } from 'react';
import { 
  X, Building, Mail, Phone, Globe, DollarSign, Target, Shield, FileText,
  ChevronRight, ChevronLeft, Save, CheckCircle, User, Users, Percent
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
    // Basic Information
    name: '',
    website: '',
    email: '',
    phone: '',
    
    // Financial Information
    amBestRating: '',
    financialStrength: '',
    
    // Coverage Information
    coverageTypes: [] as string[],
    specialties: [] as string[],
    
    // Requirements
    minimumPremium: '',
    commissionRate: '',
    bindingAuthority: false,
    
    // Documentation
    applicationRequirements: [] as string[],
    underwritingGuidelines: '',
    
    // Contact Information
    underwriterName: '',
    underwriterEmail: '',
    underwriterPhone: '',
    producerContactName: '',
    producerContactEmail: '',
    producerContactPhone: ''
  });

  const coverageOptions = [
    'General Liability',
    'Professional Liability',
    'Workers Compensation',
    'Commercial Auto',
    'Property Insurance',
    'Cyber Liability',
    'Directors & Officers',
    'Employment Practices',
    'Commercial Umbrella',
    'Product Liability'
  ];

  const specialtyOptions = [
    'Technology',
    'Healthcare',
    'Construction',
    'Manufacturing',
    'Retail',
    'Hospitality',
    'Professional Services',
    'Non-Profit',
    'Real Estate',
    'Transportation'
  ];

  const applicationRequirements = [
    'ACORD Application',
    'Loss Runs (5 years)',
    'Financial Statements',
    'Certificate of Good Standing',
    'Safety Manual',
    'Driver Records (MVRs)',
    'Property Inspection',
    'Payroll Records',
    'Contract Samples',
    'Safety Training Records'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving carrier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Add New Carrier</h2>
              <p className="text-blue-100 mt-1">Step {step} of 5</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step ? 'bg-white text-blue-600' : 'bg-blue-800 text-blue-300'
                  }`}>
                    {stepNum < step ? <CheckCircle className="h-5 w-5" /> : stepNum}
                  </div>
                  {stepNum < 5 && (
                    <div className={`w-12 h-1 ${stepNum < step ? 'bg-white' : 'bg-blue-800'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-blue-100">
              <span>Basic Info</span>
              <span>Financial</span>
              <span>Coverage</span>
              <span>Requirements</span>
              <span>Review</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Building className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                  <p className="text-gray-600">Enter the carrier's basic details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carrier Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter carrier name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="contact@carrier.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Financial Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <DollarSign className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Financial Information</h3>
                  <p className="text-gray-600">Carrier's financial strength and ratings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      A.M. Best Rating
                    </label>
                    <select
                      value={formData.amBestRating}
                      onChange={(e) => handleInputChange('amBestRating', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select rating</option>
                      <option value="A++">A++ (Superior)</option>
                      <option value="A+">A+ (Superior)</option>
                      <option value="A">A (Excellent)</option>
                      <option value="A-">A- (Excellent)</option>
                      <option value="B++">B++ (Good)</option>
                      <option value="B+">B+ (Good)</option>
                      <option value="B">B (Fair)</option>
                      <option value="B-">B- (Fair)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Financial Strength
                    </label>
                    <input
                      type="text"
                      value={formData.financialStrength}
                      onChange={(e) => handleInputChange('financialStrength', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., $500M surplus"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Coverage Information */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Shield className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Coverage Information</h3>
                  <p className="text-gray-600">Select coverage types and specialties</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Coverage Types
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {coverageOptions.map((coverage) => (
                        <label key={coverage} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.coverageTypes.includes(coverage)}
                            onChange={() => handleArrayToggle('coverageTypes', coverage)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{coverage}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Industry Specialties
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {specialtyOptions.map((specialty) => (
                        <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.specialties.includes(specialty)}
                            onChange={() => handleArrayToggle('specialties', specialty)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{specialty}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Requirements */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <FileText className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Requirements</h3>
                  <p className="text-gray-600">Set minimum requirements and documentation</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Premium
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.minimumPremium}
                          onChange={(e) => handleInputChange('minimumPremium', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="5,000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Commission Rate
                      </label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.commissionRate}
                          onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="15"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.bindingAuthority}
                        onChange={(e) => handleInputChange('bindingAuthority', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Binding Authority Available</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Application Requirements
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {applicationRequirements.map((requirement) => (
                        <label key={requirement} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.applicationRequirements.includes(requirement)}
                            onChange={() => handleArrayToggle('applicationRequirements', requirement)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{requirement}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Underwriting Guidelines
                    </label>
                    <textarea
                      value={formData.underwritingGuidelines}
                      onChange={(e) => handleInputChange('underwritingGuidelines', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter any specific underwriting guidelines or notes..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Review & Confirm</h3>
                  <p className="text-gray-600">Please review all information before saving</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-blue-600" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{formData.name || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Website:</span>
                        <span className="ml-2 font-medium">{formData.website || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{formData.email || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">{formData.phone || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                      Financial Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">A.M. Best Rating:</span>
                        <span className="ml-2 font-medium">{formData.amBestRating || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Financial Strength:</span>
                        <span className="ml-2 font-medium">{formData.financialStrength || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Coverage Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-purple-600" />
                      Coverage Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Coverage Types:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {formData.coverageTypes.length > 0 ? (
                            formData.coverageTypes.map((type) => (
                              <span key={type} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {type}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">None selected</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Specialties:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {formData.specialties.length > 0 ? (
                            formData.specialties.map((specialty) => (
                              <span key={specialty} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {specialty}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">None selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-orange-600" />
                      Requirements
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600">Minimum Premium:</span>
                          <span className="ml-2 font-medium">${formData.minimumPremium || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Commission Rate:</span>
                          <span className="ml-2 font-medium">{formData.commissionRate || 'Not specified'}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Binding Authority:</span>
                        <span className="ml-2 font-medium">{formData.bindingAuthority ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Application Requirements:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {formData.applicationRequirements.length > 0 ? (
                            formData.applicationRequirements.map((req) => (
                              <span key={req} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {req}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">None selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center justify-between">
              <div>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
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
              </div>
              
              <div>
                {step < 5 ? (
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarrierModal;