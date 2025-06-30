import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Globe, User, Mail, Phone, Building2, MapPin, Sparkles, Zap, CheckCircle, RefreshCw, Search, LocateIcon as LocationIcon, UsersIcon, Briefcase, Clock, Star, Facebook, Instagram, Linkedin, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { US_STATES } from '../../utils/constants';

interface NewProspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prospectData: any) => void;
}

interface NewProspectForm {
  websiteUrl: string;
  ownerName: string;
  email: string;
  phone?: string;
  // Auto-extracted fields
  businessName?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  naicsCode?: string;
  businessDescription?: string;
  employeeCount?: number;
  yearsInBusiness?: number;
  notes?: string;
}

interface ExtractedData {
  businessName: string;
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
  businessCategory: string;
  naicsCode: string;
  businessDescription: string;
  operatingHours: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  additionalContacts: {
    phone?: string;
    email?: string;
  };
  estimatedEmployees: string;
  foundedYear?: string;
}

const NewProspectModal: React.FC<NewProspectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [extractionStep, setExtractionStep] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<NewProspectForm>();

  const websiteUrl = watch('websiteUrl');

  const extractBusinessInfo = async () => {
    if (!websiteUrl) {
      toast.error('Please enter a website URL first');
      return;
    }

    // Validate URL format
    try {
      new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
    } catch {
      toast.error('Please enter a valid website URL');
      return;
    }

    setIsExtracting(true);
    setExtractionStep('Analyzing website...');

    try {
      // Simulate AI extraction process with realistic steps
      const steps = [
        'Analyzing website structure...',
        'Extracting business information...',
        'Identifying physical address...',
        'Determining business category...',
        'Locating social media profiles...',
        'Finding operating hours...',
        'Detecting additional contacts...',
        'Finalizing extraction...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setExtractionStep(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Mock extracted data based on website URL
      const mockData: ExtractedData = {
        businessName: websiteUrl.includes('tech') ? 'TechSolutions Inc' :
                     websiteUrl.includes('restaurant') ? 'Downtown Bistro' :
                     websiteUrl.includes('construction') ? 'BuildRight Construction' :
                     websiteUrl.includes('medical') ? 'HealthCare Partners' :
                     'Business Solutions LLC',
        businessAddress: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        businessCategory: websiteUrl.includes('tech') ? 'Technology Services' :
                         websiteUrl.includes('restaurant') ? 'Food Service' :
                         websiteUrl.includes('construction') ? 'Construction' :
                         websiteUrl.includes('medical') ? 'Healthcare' :
                         'Professional Services',
        naicsCode: websiteUrl.includes('tech') ? '541511' :
                  websiteUrl.includes('restaurant') ? '722511' :
                  websiteUrl.includes('construction') ? '236220' :
                  websiteUrl.includes('medical') ? '621111' :
                  '541990',
        businessDescription: websiteUrl.includes('tech') ? 'Custom software development and IT consulting services for small to medium businesses.' :
                           websiteUrl.includes('restaurant') ? 'Contemporary American cuisine restaurant with full bar and catering services.' :
                           websiteUrl.includes('construction') ? 'Commercial and residential construction services including renovations and new builds.' :
                           websiteUrl.includes('medical') ? 'Primary care medical practice providing comprehensive healthcare services.' :
                           'Professional business consulting and advisory services.',
        operatingHours: 'Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 10:00 AM - 4:00 PM',
        socialMedia: {
          facebook: 'https://facebook.com/business',
          instagram: 'https://instagram.com/business',
          linkedin: 'https://linkedin.com/company/business'
        },
        additionalContacts: {
          phone: '(555) 123-4567',
          email: 'info@business.com'
        },
        estimatedEmployees: websiteUrl.includes('tech') ? '25-50' :
                           websiteUrl.includes('restaurant') ? '15-25' :
                           websiteUrl.includes('construction') ? '10-20' :
                           '5-15',
        foundedYear: '2018'
      };

      setExtractedData(mockData);

      // Auto-populate form fields
      setValue('businessName', mockData.businessName);
      setValue('businessAddress', mockData.businessAddress);
      setValue('city', mockData.city);
      setValue('state', mockData.state);
      setValue('zipCode', mockData.zipCode);
      setValue('naicsCode', mockData.naicsCode);
      setValue('businessDescription', mockData.businessDescription);
      setValue('employeeCount', parseInt(mockData.estimatedEmployees.split('-')[1]) || 25);
      setValue('yearsInBusiness', new Date().getFullYear() - parseInt(mockData.foundedYear || '2018'));

      toast.success('Business information extracted successfully!');
    } catch (error) {
      toast.error('Failed to extract business information. Please try again.');
    } finally {
      setIsExtracting(false);
      setExtractionStep('');
    }
  };

  const onSubmit = async (data: NewProspectForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSave(data);
      toast.success('Prospect created successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to create prospect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendPortalLink = async (data: NewProspectForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSave({ ...data, sendPortalLink: true });
      toast.success('Prospect created and portal link sent!');
      handleClose();
    } catch (error) {
      toast.error('Failed to send portal link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setExtractedData(null);
    setExtractionStep('');
    setIsExtracting(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI-Powered Prospect Creation</h2>
                <p className="text-blue-100">Enter basic information and let AI extract comprehensive business details</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-8">
              {/* AI Extraction Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Required Information</h4>
                        <p className="text-blue-800 text-sm mt-1">
                          Enter the business website URL and owner details. Our AI will automatically extract business name, address, industry, and more.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Website URL *
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        {...register('websiteUrl', { required: 'Website URL is required' })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://www.business.com"
                      />
                    </div>
                    {errors.websiteUrl && (
                      <p className="text-red-600 text-sm mt-1">{errors.websiteUrl.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Include https:// or http:// for optimal extraction results
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner's Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        {...register('ownerName', { required: 'Owner name is required' })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Smith"
                      />
                    </div>
                    {errors.ownerName && (
                      <p className="text-red-600 text-sm mt-1">{errors.ownerName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@business.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        {...register('phone')}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: XXX-XXX-XXXX
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={extractBusinessInfo}
                    disabled={!websiteUrl || isExtracting}
                    className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Extracting Information...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        <span>Extract Business Information</span>
                      </>
                    )}
                  </button>

                  {isExtracting && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin">
                          <Zap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-900">AI Processing</p>
                          <p className="text-blue-800 text-sm">{extractionStep}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Extraction Results */}
                <div className="space-y-6">
                  {!extractedData ? (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">AI Extraction Results</h3>
                      <p className="text-gray-600">
                        Enter the required information and click "Extract Business Information" to see AI-powered results here.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <h3 className="text-lg font-bold text-green-900">Extraction Complete!</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="flex items-center space-x-2 mb-1">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Business Name</span>
                            </div>
                            <p className="font-semibold text-gray-900">{extractedData.businessName}</p>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="flex items-center space-x-2 mb-1">
                              <LocationIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Address</span>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {extractedData.businessAddress}, {extractedData.city}, {extractedData.state} {extractedData.zipCode}
                            </p>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="flex items-center space-x-2 mb-1">
                              <Briefcase className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Industry</span>
                            </div>
                            <p className="font-semibold text-gray-900">{extractedData.businessCategory}</p>
                            <p className="text-sm text-gray-600">NAICS: {extractedData.naicsCode}</p>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="flex items-center space-x-2 mb-1">
                              <UsersIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Estimated Employees</span>
                            </div>
                            <p className="font-semibold text-gray-900">{extractedData.estimatedEmployees}</p>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Operating Hours</span>
                            </div>
                            <p className="text-sm text-gray-900">{extractedData.operatingHours}</p>
                          </div>

                          {Object.keys(extractedData.socialMedia).length > 0 && (
                            <div className="bg-white rounded-lg p-3 border border-green-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Social Media</span>
                              </div>
                              <div className="flex space-x-2">
                                {extractedData.socialMedia.facebook && (
                                  <a href={extractedData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="p-1 text-blue-600 hover:text-blue-800">
                                    <Facebook className="h-4 w-4" />
                                  </a>
                                )}
                                {extractedData.socialMedia.instagram && (
                                  <a href={extractedData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="p-1 text-pink-600 hover:text-pink-800">
                                    <Instagram className="h-4 w-4" />
                                  </a>
                                )}
                                {extractedData.socialMedia.linkedin && (
                                  <a href={extractedData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="p-1 text-blue-700 hover:text-blue-900">
                                    <Linkedin className="h-4 w-4" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-green-200">
                          <p className="text-sm text-green-800">
                            ✅ All available fields have been automatically populated below. Review and modify as needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Information - Auto-populated */}
              {extractedData && (
                <>
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center space-x-2 mb-6">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Business Information</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Auto-populated
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name *
                        </label>
                        <input
                          {...register('businessName', { required: 'Business name is required' })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter business name"
                        />
                        {errors.businessName && (
                          <p className="text-red-600 text-sm mt-1">{errors.businessName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          NAICS Code
                        </label>
                        <input
                          {...register('naicsCode')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 541511"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee Count
                        </label>
                        <input
                          type="number"
                          {...register('employeeCount')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years in Business
                        </label>
                        <input
                          type="number"
                          {...register('yearsInBusiness')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Description
                        </label>
                        <textarea
                          {...register('businessDescription')}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe the business operations..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Address - Auto-populated */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center space-x-2 mb-6">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Business Address</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Auto-populated
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          {...register('businessAddress')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          {...register('city')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <select
                          {...register('state')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select State</option>
                          {US_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          {...register('zipCode')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="12345"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center space-x-2 mb-6">
                      <User className="h-5 w-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Additional Information</h3>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any additional information or special requirements..."
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Portal link will be generated automatically after creation
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Draft'}</span>
              </button>
              
              <button
                type="button"
                onClick={handleSubmit(handleSendPortalLink)}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Creating...' : 'Create Prospect'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProspectModal;