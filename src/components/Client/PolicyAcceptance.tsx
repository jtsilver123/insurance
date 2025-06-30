import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  DollarSign, 
  Calendar, 
  FileText, 
  Download, 
  Star,
  Award,
  TrendingDown,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  Building,
  User,
  ArrowRight,
  Eye,
  PenTool
} from 'lucide-react';

interface PolicyOption {
  id: string;
  carrier: string;
  carrierLogo?: string;
  annualPremium: number;
  monthlyPremium: number;
  deductible: number;
  effectiveDate: Date;
  expirationDate: Date;
  isRecommended: boolean;
  aiScore: number;
  coverageDetails: {
    generalLiability: string;
    professionalLiability: string;
    cyberLiability: string;
    additionalCoverages: string[];
  };
  keyBenefits: string[];
  exclusions: string[];
  paymentOptions: {
    annual: { discount: number; total: number };
    monthly: { fee: number; total: number };
    quarterly: { fee: number; total: number };
  };
  bindingDeadline: Date;
  agentNotes: string;
}

const PolicyAcceptance: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('monthly');
  const [showBindingModal, setShowBindingModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Mock policy data
  const recommendedPolicy: PolicyOption = {
    id: 'liberty-mutual-001',
    carrier: 'Liberty Mutual',
    annualPremium: 45000,
    monthlyPremium: 3750,
    deductible: 5000,
    effectiveDate: new Date('2024-02-01'),
    expirationDate: new Date('2025-02-01'),
    isRecommended: true,
    aiScore: 92,
    coverageDetails: {
      generalLiability: '$2,000,000 per occurrence / $4,000,000 aggregate',
      professionalLiability: '$1,000,000 per claim / $3,000,000 aggregate',
      cyberLiability: '$1,000,000 per incident',
      additionalCoverages: [
        'Employment Practices Liability',
        'Directors & Officers (Side A)',
        'Crime Coverage ($100,000)',
        'Business Personal Property'
      ]
    },
    keyBenefits: [
      '24/7 claims hotline with dedicated tech industry specialists',
      'Risk management resources and cybersecurity training',
      'Premium financing available with 0% down',
      'Worldwide coverage for business travel',
      'Prior acts coverage included',
      'Defense cost coverage outside policy limits'
    ],
    exclusions: [
      'Intentional criminal acts',
      'Nuclear risks',
      'War and terrorism (separate coverage available)',
      'Pollution (separate coverage available)'
    ],
    paymentOptions: {
      annual: { discount: 5, total: 42750 },
      monthly: { fee: 25, total: 45300 },
      quarterly: { fee: 15, total: 45180 }
    },
    bindingDeadline: new Date('2024-01-30'),
    agentNotes: 'This policy provides excellent coverage for your technology business with competitive pricing. The carrier has strong financial ratings and excellent claims service.'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentTotal = (option: string) => {
    switch (option) {
      case 'annual':
        return recommendedPolicy.paymentOptions.annual.total;
      case 'quarterly':
        return recommendedPolicy.paymentOptions.quarterly.total;
      case 'monthly':
        return recommendedPolicy.paymentOptions.monthly.total;
      default:
        return recommendedPolicy.annualPremium;
    }
  };

  const getPaymentDescription = (option: string) => {
    switch (option) {
      case 'annual':
        return `${formatCurrency(recommendedPolicy.paymentOptions.annual.total)} paid annually (5% discount)`;
      case 'quarterly':
        return `${formatCurrency(recommendedPolicy.paymentOptions.quarterly.total / 4)} per quarter ($15 fee per payment)`;
      case 'monthly':
        return `${formatCurrency(recommendedPolicy.paymentOptions.monthly.total / 12)} per month ($25 fee per payment)`;
      default:
        return '';
    }
  };

  const handleBindPolicy = () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions to proceed');
      return;
    }
    setShowBindingModal(true);
  };

  const renderBindingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Bind Your Policy</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900">Ready to Bind</h3>
                <p className="text-green-800 text-sm mt-1">
                  Your policy documents will be prepared and sent for electronic signature. 
                  Coverage will be effective {formatDate(recommendedPolicy.effectiveDate)}.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Carrier</p>
              <p className="font-semibold text-gray-900">{recommendedPolicy.carrier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Annual Premium</p>
              <p className="font-semibold text-gray-900">{formatCurrency(recommendedPolicy.annualPremium)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Plan</p>
              <p className="font-semibold text-gray-900 capitalize">{selectedPayment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="font-semibold text-gray-900">{formatCurrency(getPaymentTotal(selectedPayment))}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
            <ol className="text-blue-800 text-sm space-y-1">
              <li>1. Policy documents will be generated within 2 hours</li>
              <li>2. You'll receive an email with documents to e-sign</li>
              <li>3. Coverage becomes effective once documents are signed</li>
              <li>4. Certificate of insurance will be issued immediately</li>
            </ol>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowBindingModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <PenTool className="h-4 w-4" />
              <span>Proceed to E-Signature</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Recommended Policy</h1>
            <p className="text-gray-600 mt-1">Review and accept your insurance coverage</p>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-green-500" />
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              AI Recommended
            </span>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Award className="h-6 w-6 text-green-600 mt-1" />
          <div className="flex-1">
            <h2 className="font-semibold text-green-900 mb-2">🎯 Why We Recommend This Policy</h2>
            <p className="text-green-800 mb-3">
              Based on your business profile, coverage needs, and budget, this Liberty Mutual policy 
              offers the best combination of comprehensive protection and value for your technology company.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-green-700">
                <TrendingDown className="h-4 w-4" />
                <span>7% below market average</span>
              </div>
              <div className="flex items-center space-x-2 text-green-700">
                <Shield className="h-4 w-4" />
                <span>Excellent tech industry expertise</span>
              </div>
              <div className="flex items-center space-x-2 text-green-700">
                <Star className="h-4 w-4" />
                <span>92% AI match score</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Coverage Summary */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Coverage Summary</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(recommendedPolicy.annualPremium)}</span>
                  <span className="text-gray-600">/year</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">General Liability</p>
                  <p className="text-gray-900">{recommendedPolicy.coverageDetails.generalLiability}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Professional Liability</p>
                  <p className="text-gray-900">{recommendedPolicy.coverageDetails.professionalLiability}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Cyber Liability</p>
                  <p className="text-gray-900">{recommendedPolicy.coverageDetails.cyberLiability}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Deductible</p>
                  <p className="text-gray-900">{formatCurrency(recommendedPolicy.deductible)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Additional Coverages Included</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recommendedPolicy.coverageDetails.additionalCoverages.map((coverage, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{coverage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Key Benefits & Features</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedPolicy.keyBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Star className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Options</h2>
              <p className="text-sm text-gray-600 mt-1">Choose how you'd like to pay for your coverage</p>
            </div>
            
            <div className="p-6 space-y-4">
              {[
                { id: 'annual', label: 'Annual Payment', savings: 'Save 5%', recommended: true },
                { id: 'quarterly', label: 'Quarterly Payment', savings: 'Small fee', recommended: false },
                { id: 'monthly', label: 'Monthly Payment', savings: 'Convenience fee', recommended: false }
              ].map((option) => (
                <label key={option.id} className="relative">
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={selectedPayment === option.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedPayment === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPayment === option.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedPayment === option.id && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{option.label}</p>
                          <p className="text-sm text-gray-600">{getPaymentDescription(option.id)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {option.recommended && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mb-1 block">
                            Recommended
                          </span>
                        )}
                        <span className={`text-sm font-medium ${
                          option.savings === 'Save 5%' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {option.savings}
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                  I acknowledge that I have reviewed the policy terms, coverage details, and exclusions. 
                  I understand that this policy will be bound upon electronic signature and payment processing. 
                  I agree to the <a href="#" className="text-blue-600 hover:text-blue-800">terms and conditions</a> and 
                  <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">privacy policy</a>.
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Policy Summary Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{recommendedPolicy.carrier}</h3>
                <p className="text-sm text-gray-600">A.M. Best Rating: A</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Premium:</span>
                <span className="font-semibold">{formatCurrency(recommendedPolicy.annualPremium)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Cost ({selectedPayment}):</span>
                <span className="font-semibold">{formatCurrency(getPaymentTotal(selectedPayment))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Effective Date:</span>
                <span className="font-semibold">{formatDate(recommendedPolicy.effectiveDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Binding Deadline:</span>
                <span className="font-semibold text-red-600">{formatDate(recommendedPolicy.bindingDeadline)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleBindPolicy}
                disabled={!acceptedTerms}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Bind This Policy
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Secure binding with electronic signature
              </p>
            </div>
          </div>

          {/* Urgency Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Time Sensitive</h3>
                <p className="text-yellow-800 text-sm mt-1">
                  This quote expires on {formatDate(recommendedPolicy.bindingDeadline)}. 
                  Bind your policy today to secure this rate and coverage.
                </p>
              </div>
            </div>
          </div>

          {/* Agent Contact */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                <p className="text-sm text-gray-600">Your Insurance Agent</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Call (555) 123-4567</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Send Email</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Live Chat</span>
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Agent Note:</strong> {recommendedPolicy.agentNotes}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Download Quote Summary</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="h-4 w-4 text-gray-400" />
                <span className="text-sm">View Policy Terms</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Download Application</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Binding Modal */}
      {showBindingModal && renderBindingModal()}
    </div>
  );
};

export default PolicyAcceptance;