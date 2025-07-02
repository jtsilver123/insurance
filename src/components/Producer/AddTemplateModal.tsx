import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  Save,
  CheckCircle,
  Calendar,
  Tag,
  Layers,
  Building,
  List,
  ToggleLeft,
  ToggleRight,
  AlertCircle
} from 'lucide-react';

interface AddTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: any) => void;
}

const AddTemplateModal: React.FC<AddTemplateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add/remove modal-open class to body when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup function to ensure we remove the class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);
  
  const [formData, setFormData] = useState({
    name: '',
    formNumber: '',
    version: '',
    versionDate: '',
    category: 'acord',
    lineOfBusiness: [] as string[],
    industryTypes: [] as string[],
    associatedCarriers: [] as string[],
    purpose: '',
    requiredFields: [] as string[],
    autoPopulate: true,
    presentationOrder: 1,
    fileUrl: '',
    fileSize: '',
    isActive: true
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field: string, value: string) => {
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
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Update form data with file info
      setFormData(prev => ({
        ...prev,
        fileSize: formatFileSize(selectedFile.size)
      }));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate file upload and API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would upload the file and get a URL back
      const submissionData = {
        ...formData,
        fileUrl: file ? URL.createObjectURL(file) : '',
        lastUpdated: new Date()
      };
      
      onSave(submissionData);
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
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
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add Document Template</h2>
                <p className="text-purple-100">Configure template details, field mapping, and carrier associations</p>
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
              { num: 1, title: "Template Info" },
              { num: 2, title: "Associations" },
              { num: 3, title: "File Upload" },
              { num: 4, title: "Review" }
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s.num ? 'bg-white text-purple-600' : 'bg-purple-400 text-white'
                  }`}>
                    {step > s.num ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="text-lg font-bold">{s.num}</span>
                    )}
                  </div>
                  <span className="text-sm mt-2 text-purple-100">{s.title}</span>
                </div>
                {i < 3 && (
                  <div className={`h-1 flex-1 mx-2 ${
                    step > i + 1 ? 'bg-white' : 'bg-purple-400'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Step 1: Template Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., General Liability Application"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form Number *
                    </label>
                    <input
                      type="text"
                      name="formNumber"
                      value={formData.formNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., ACORD 125"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Version
                    </label>
                    <input
                      type="text"
                      name="version"
                      value={formData.version}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 2023/01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Version Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        name="versionDate"
                        value={formData.versionDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: 'acord', label: 'ACORD Form', icon: FileText },
                      { value: 'supplemental', label: 'Supplemental', icon: Layers },
                      { value: 'carrier_specific', label: 'Carrier Specific', icon: Building },
                      { value: 'endorsement', label: 'Endorsement', icon: Tag }
                    ].map(category => (
                      <label 
                        key={category.value}
                        className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          formData.category === category.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={formData.category === category.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <category.icon className={`h-5 w-5 ${
                          formData.category === category.value
                            ? 'text-purple-600'
                            : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.category === category.value
                            ? 'text-purple-700'
                            : 'text-gray-700'
                        }`}>
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe the purpose of this document template..."
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="autoPopulate"
                      checked={formData.autoPopulate}
                      onChange={(e) => setFormData(prev => ({...prev, autoPopulate: e.target.checked}))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Auto-Population</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.checked}))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Template</span>
                  </label>
                </div>
              </div>
            )}
            
            {/* Step 2: Associations */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Line of Business
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'General Liability', 'Professional Liability', 'Cyber Liability',
                      'Commercial Property', 'Workers Compensation', 'Commercial Auto',
                      'Directors & Officers', 'Employment Practices', 'Umbrella/Excess'
                    ].map(line => (
                      <label key={line} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.lineOfBusiness.includes(line)}
                          onChange={() => handleArrayChange('lineOfBusiness', line)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{line}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry Types
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Technology', 'Manufacturing', 'Construction', 'Retail',
                      'Professional Services', 'Healthcare', 'Financial Services', 'Real Estate',
                      'Hospitality', 'Education', 'Non-Profit', 'All Industries'
                    ].map(industry => (
                      <label key={industry} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.industryTypes.includes(industry)}
                          onChange={() => handleArrayChange('industryTypes', industry)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Associated Carriers
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Liberty Mutual', 'Travelers', 'Chubb', 'Hartford', 'Nationwide',
                      'CNA', 'Zurich', 'AIG', 'All Carriers'
                    ].map(carrier => (
                      <label key={carrier} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.associatedCarriers.includes(carrier)}
                          onChange={() => handleArrayChange('associatedCarriers', carrier)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{carrier}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Fields
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Business Name', 'NAICS Code', 'Revenue', 'Employee Count',
                      'Business Address', 'Contact Information', 'Prior Coverage',
                      'Loss History', 'Operations Description'
                    ].map(field => (
                      <label key={field} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.requiredFields.includes(field)}
                          onChange={() => handleArrayChange('requiredFields', field)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Presentation Order
                  </label>
                  <input
                    type="number"
                    name="presentationOrder"
                    value={formData.presentationOrder}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Order in which this form appears"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first in the form sequence
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 3: File Upload */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Upload className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900">Upload Template File</h4>
                      <p className="text-purple-800 text-sm mt-1">
                        Upload the document template file. Supported formats: PDF, DOCX, XLSX.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  {file ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                        <FileText className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Replace file
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-8 w-8 text-purple-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Drag & drop file here
                      </p>
                      <p className="text-gray-600 mb-4">
                        or click to browse your computer
                      </p>
                      <input
                        type="file"
                        id="template-file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.docx,.xlsx"
                      />
                      <label
                        htmlFor="template-file"
                        className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Select File</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-4">
                        Maximum file size: 10MB
                      </p>
                    </>
                  )}
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Important Note</h4>
                      <p className="text-yellow-800 text-sm mt-1">
                        For ACORD forms, ensure you're using the latest version. For carrier-specific forms, 
                        verify you have permission to use and distribute these forms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900">Ready to Add Template</h4>
                      <p className="text-purple-800 text-sm mt-1">
                        Please review the template information below before saving. You can go back to make changes if needed.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Template Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Template Name:</span>
                        <span className="font-medium text-gray-900">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Form Number:</span>
                        <span className="font-medium text-gray-900">{formData.formNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Version:</span>
                        <span className="font-medium text-gray-900">{formData.version || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-gray-900 capitalize">{formData.category.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Auto-Populate:</span>
                        <span className="font-medium text-gray-900">{formData.autoPopulate ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-gray-900">{formData.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Associations</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Line of Business:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {formData.lineOfBusiness.length > 0 ? (
                            formData.lineOfBusiness.map(line => (
                              <span key={line} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {line}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">None selected</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Industry Types:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {formData.industryTypes.length > 0 ? (
                            formData.industryTypes.map(industry => (
                              <span key={industry} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                {industry}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">None selected</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Associated Carriers:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {formData.associatedCarriers.length > 0 ? (
                            formData.associatedCarriers.map(carrier => (
                              <span key={carrier} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {carrier}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Required Fields</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {formData.requiredFields.length > 0 ? (
                          formData.requiredFields.map(field => (
                            <span key={field} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                              {field}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No required fields specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">File Information</h4>
                    <div className="space-y-2 text-sm">
                      {file ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">File Name:</span>
                            <span className="font-medium text-gray-900">{file.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">File Size:</span>
                            <span className="font-medium text-gray-900">{formatFileSize(file.size)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">File Type:</span>
                            <span className="font-medium text-gray-900">{file.type}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-yellow-600">No file uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {formData.purpose && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Purpose</h4>
                    <p className="text-sm text-gray-700">{formData.purpose}</p>
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
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md"
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
                    <span>Save Template</span>
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

export default AddTemplateModal;