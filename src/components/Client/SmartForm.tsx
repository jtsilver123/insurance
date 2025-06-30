import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Mic, 
  Camera, 
  FileText, 
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye,
  Clock,
  Star,
  ArrowRight,
  MessageSquare,
  Phone,
  Mail,
  User
} from 'lucide-react';

interface FormData {
  professionalServices: {
    primaryServices: string;
    clientTypes: string;
    projectValues: string;
    yearsExperience: number;
    professionalCertifications: string;
    subcontractors: string;
  };
  riskFactors: {
    priorClaims: string;
    currentLitigation: string;
    dataHandling: string;
    internationalWork: string;
    highRiskClients: string;
  };
  additionalInfo: {
    specialConsiderations: string;
    questionsForAgent: string;
  };
}

const SmartForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [recordingMode, setRecordingMode] = useState<'text' | 'voice' | 'photo'>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  const steps = [
    { 
      id: 'services', 
      title: 'Professional Services', 
      description: 'Tell us about the services you provide',
      icon: FileText,
      estimatedTime: '3 minutes'
    },
    { 
      id: 'risk', 
      title: 'Risk Assessment', 
      description: 'Help us understand your risk profile',
      icon: AlertCircle,
      estimatedTime: '2 minutes'
    },
    { 
      id: 'additional', 
      title: 'Additional Information', 
      description: 'Any other details we should know',
      icon: MessageSquare,
      estimatedTime: '1 minute'
    }
  ];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', data);
      // Show success message and redirect
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderServicesStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Professional Services Information</h3>
            <p className="text-blue-800 text-sm mt-1">
              This information helps us understand your professional liability exposure and recommend appropriate coverage limits.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Services Provided *
        </label>
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-600">Input method:</span>
            <button
              type="button"
              onClick={() => setRecordingMode('text')}
              className={`px-3 py-1 text-xs rounded-full ${
                recordingMode === 'text' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <FileText className="h-3 w-3 inline mr-1" />
              Text
            </button>
            <button
              type="button"
              onClick={() => setRecordingMode('voice')}
              className={`px-3 py-1 text-xs rounded-full ${
                recordingMode === 'voice' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Mic className="h-3 w-3 inline mr-1" />
              Voice
            </button>
          </div>
        </div>
        
        {recordingMode === 'text' && (
          <textarea
            {...register('professionalServices.primaryServices', { required: 'Please describe your primary services' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the main professional services your business provides (e.g., software development, consulting, design services, etc.)"
          />
        )}
        
        {recordingMode === 'voice' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Click to record your description of services provided</p>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              🎤 Start Recording
            </button>
            <p className="text-xs text-gray-500 mt-2">Speak clearly and describe your main services</p>
          </div>
        )}
        
        {errors.professionalServices?.primaryServices && (
          <p className="text-red-600 text-sm mt-1">{errors.professionalServices.primaryServices.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Typical Client Types *
          </label>
          <select
            {...register('professionalServices.clientTypes', { required: 'Please select client types' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select primary client type</option>
            <option value="small-business">Small Businesses (1-50 employees)</option>
            <option value="mid-market">Mid-Market Companies (51-500 employees)</option>
            <option value="enterprise">Enterprise Clients (500+ employees)</option>
            <option value="government">Government/Public Sector</option>
            <option value="non-profit">Non-Profit Organizations</option>
            <option value="individuals">Individual Consumers</option>
            <option value="mixed">Mixed Client Base</option>
          </select>
          {errors.professionalServices?.clientTypes && (
            <p className="text-red-600 text-sm mt-1">{errors.professionalServices.clientTypes.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Typical Project Values
          </label>
          <select
            {...register('professionalServices.projectValues')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select typical project range</option>
            <option value="under-10k">Under $10,000</option>
            <option value="10k-50k">$10,000 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-500k">$100,000 - $500,000</option>
            <option value="500k-1m">$500,000 - $1,000,000</option>
            <option value="over-1m">Over $1,000,000</option>
            <option value="varies">Varies significantly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience *
          </label>
          <input
            type="number"
            {...register('professionalServices.yearsExperience', { 
              required: 'Years of experience is required',
              min: { value: 0, message: 'Must be 0 or greater' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Years in business"
          />
          {errors.professionalServices?.yearsExperience && (
            <p className="text-red-600 text-sm mt-1">{errors.professionalServices.yearsExperience.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Certifications
          </label>
          <input
            {...register('professionalServices.professionalCertifications')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., CPA, PE, PMP, etc."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Use of Subcontractors
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              {...register('professionalServices.subcontractors')}
              value="none"
              className="mr-2"
            />
            <span className="text-sm">We do not use subcontractors</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              {...register('professionalServices.subcontractors')}
              value="occasional"
              className="mr-2"
            />
            <span className="text-sm">Occasional use of subcontractors (less than 25% of work)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              {...register('professionalServices.subcontractors')}
              value="regular"
              className="mr-2"
            />
            <span className="text-sm">Regular use of subcontractors (25% or more of work)</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderRiskStep = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900">Risk Assessment Questions</h3>
            <p className="text-yellow-800 text-sm mt-1">
              These questions help us understand your risk profile and ensure you have appropriate coverage. Please answer honestly.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Have you had any professional liability claims in the past 5 years? *
        </label>
        <div className="space-y-2">
          <label className="flex items-start">
            <input
              type="radio"
              {...register('riskFactors.priorClaims', { required: 'Please select an option' })}
              value="none"
              className="mr-2 mt-1"
            />
            <div>
              <span className="text-sm font-medium">No prior claims</span>
              <p className="text-xs text-gray-600">No professional liability claims or lawsuits</p>
            </div>
          </label>
          <label className="flex items-start">
            <input
              type="radio"
              {...register('riskFactors.priorClaims')}
              value="resolved"
              className="mr-2 mt-1"
            />
            <div>
              <span className="text-sm font-medium">Claims that were resolved</span>
              <p className="text-xs text-gray-600">Had claims but they were settled or dismissed</p>
            </div>
          </label>
          <label className="flex items-start">
            <input
              type="radio"
              {...register('riskFactors.priorClaims')}
              value="pending"
              className="mr-2 mt-1"
            />
            <div>
              <span className="text-sm font-medium">Pending claims or litigation</span>
              <p className="text-xs text-gray-600">Currently involved in legal proceedings</p>
            </div>
          </label>
        </div>
        {errors.riskFactors?.priorClaims && (
          <p className="text-red-600 text-sm mt-1">{errors.riskFactors.priorClaims.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Do you handle sensitive client data or personal information? *
        </label>
        <div className="space-y-2">
          <label className="flex items-start">
            <input
              type="radio"
              {...register('riskFactors.dataHandling', { required: 'Please select an option' })}
              value="none"
              className="mr-2 mt-1"
            />
            <div>
              <span className="text-sm font-medium">No sensitive data handling</span>
              <p className="text-xs text-gray-600">We do not collect or store sensitive client information</p>
            </div>
          </label>
          <label className="flex items-start">
            <input
              type="radio"
              {...register('riskFactors.dataHandling')}
              value="limited"
              className="mr-2 mt-1"
            />
            <div>
              <span className="text-sm font-medium">Limited data handling</span>
              <p className="text-xs text-gray-600">Basic contact and business information only</p>
            </div>
          </label>
          <label className="flex items-start">
            <input
              type="radio"
              {...register('riskFactors.dataHandling')}
              value="extensive"
              className="mr-2 mt-1"
            />
            <div>
              <span className="text-sm font-medium">Extensive data handling</span>
              <p className="text-xs text-gray-600">Financial, health, or other sensitive personal data</p>
            </div>
          </label>
        </div>
        {errors.riskFactors?.dataHandling && (
          <p className="text-red-600 text-sm mt-1">{errors.riskFactors.dataHandling.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Do you provide services internationally or to international clients?
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              {...register('riskFactors.internationalWork')}
              value="domestic-only"
              className="mr-2"
            />
            <span className="text-sm">Domestic clients only (US-based)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              {...register('riskFactors.internationalWork')}
              value="some-international"
              className="mr-2"
            />
            <span className="text-sm">Some international clients (less than 25% of business)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              {...register('riskFactors.internationalWork')}
              value="significant-international"
              className="mr-2"
            />
            <span className="text-sm">Significant international work (25% or more)</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Do you work with high-risk industries or clients?
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('riskFactors.highRiskClients')}
              value="financial"
              className="mr-2"
            />
            <span className="text-sm">Financial services or investment firms</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('riskFactors.highRiskClients')}
              value="healthcare"
              className="mr-2"
            />
            <span className="text-sm">Healthcare or pharmaceutical companies</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('riskFactors.highRiskClients')}
              value="government"
              className="mr-2"
            />
            <span className="text-sm">Government contracts or public sector</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('riskFactors.highRiskClients')}
              value="none"
              className="mr-2"
            />
            <span className="text-sm">None of the above</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAdditionalStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-900">Almost Done!</h3>
            <p className="text-green-800 text-sm mt-1">
              Just a few more details and we'll have everything we need to finalize your quotes.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Considerations or Unique Aspects of Your Business
        </label>
        <textarea
          {...register('additionalInfo.specialConsiderations')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Is there anything unique about your business operations, client relationships, or services that we should know about when evaluating your coverage needs?"
        />
        <p className="text-xs text-gray-500 mt-1">
          This helps us ensure your coverage is tailored to your specific business needs.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Questions for Your Agent
        </label>
        <textarea
          {...register('additionalInfo.questionsForAgent')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Do you have any questions about your coverage options, the application process, or anything else we can help clarify?"
        />
        <p className="text-xs text-gray-500 mt-1">
          Your agent will review these questions and follow up with you directly.
        </p>
      </div>

      {/* Summary of what happens next */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">What Happens Next</h3>
            <ul className="text-blue-800 text-sm mt-2 space-y-1">
              <li>• Your responses will be reviewed by our underwriting team</li>
              <li>• We'll finalize your insurance quotes within 24 hours</li>
              <li>• You'll receive an email when quotes are ready for review</li>
              <li>• Your agent will contact you to discuss your options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Get the current step's icon component
  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Professional Liability Questionnaire</h1>
            <p className="text-gray-600 mt-1">Help us understand your professional services to provide accurate quotes</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Estimated time remaining</p>
            <p className="font-semibold text-blue-600">{steps[currentStep].estimatedTime}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStep 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 ml-2 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <CurrentStepIcon className="h-5 w-5 text-blue-600" />
            <span>{steps[currentStep].title}</span>
          </h2>
          <p className="text-gray-600 mt-1">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {currentStep === 0 && renderServicesStep()}
          {currentStep === 1 && renderRiskStep()}
          {currentStep === 2 && renderAdditionalStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Save className="h-4 w-4" />
              <span>Save Draft</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit Questionnaire</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have questions about any of these topics, your agent is here to help.
            </p>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <Phone className="h-4 w-4" />
                <span>Call (555) 123-4567</span>
              </button>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </button>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <MessageSquare className="h-4 w-4" />
                <span>Live Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartForm;