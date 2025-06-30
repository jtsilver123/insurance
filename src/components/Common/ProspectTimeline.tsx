import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Circle, 
  FileText, 
  Send, 
  DollarSign, 
  Award, 
  X,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  Upload,
  Download,
  Eye,
  AlertTriangle,
  TrendingUp,
  Target,
  Users,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

interface TimelineStage {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  completedDate?: Date;
  estimatedDuration?: string;
  successCriteria: string[];
  keyActions: string[];
  stageData?: any;
}

interface ProspectTimelineProps {
  prospectId: string;
  prospectName: string;
  currentStage: string;
  activeViewingStage?: string;
  className?: string;
  onStageClick?: (stageId: string) => void;
}

const ProspectTimeline: React.FC<ProspectTimelineProps> = ({
  prospectId,
  prospectName,
  currentStage,
  activeViewingStage,
  className = '',
  onStageClick
}) => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  // Get the consistent icon for each stage (matching ProspectProgressBar)
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'docs': return Upload;
      case 'form': return FileText;
      case 'submitted': return Send;
      case 'quotes': return DollarSign;
      case 'bound': return Award;
      default: return FileText;
    }
  };
  const stages: TimelineStage[] = [
    {
      id: 'docs',
      title: 'Docs',
      description: 'Required documentation phase complete',
      status: getStageStatus('docs', currentStage),
      completedDate: ['form', 'submitted', 'quotes', 'bound'].includes(currentStage) ? new Date('2024-01-17T16:45:00') : undefined,
      estimatedDuration: '2-5 days',
      successCriteria: [
        'Required documents collected and verified',
        'All required documents collected',
        'Document verification completed'
      ],
      keyActions: [
        'Document collection and verification',
        'OCR processing of uploaded files',
        'Request missing documents'
      ],
      stageData: {
        documentsUploaded: 4,
        documentsRequired: 5,
        lastUpload: new Date('2024-01-17T11:20:00'),
        missingDocuments: ['Financial Statements']
      }
    },
    {
      id: 'form',
      title: 'Form',
      description: 'Smart intake information gathered',
      status: getStageStatus('form', currentStage),
      completedDate: ['submitted', 'quotes', 'bound'].includes(currentStage) ? new Date('2024-01-18T09:15:00') : undefined,
      estimatedDuration: '1-3 days',
      successCriteria: [
        'All required form fields completed with valid data',
        'Branching logic questionnaire finished',
        'Data validation passed'
      ],
      keyActions: [
        'Complete branching logic questionnaire',
        'Review and validate form data',
        'Assist client with complex questions'
      ],
      stageData: {
        formsCompleted: currentStage === 'form' ? 2 : isStageCompleted('form', currentStage) ? 3 : 0,
        formsTotal: 3,
        completionPercentage: currentStage === 'form' ? 67 : isStageCompleted('form', currentStage) ? 100 : 0,
        lastFormUpdate: new Date('2024-01-18T09:15:00')
      }
    },
    {
      id: 'submitted',
      title: 'Submit',
      description: 'Package prepared and sent to carriers',
      status: getStageStatus('submitted', currentStage),
      completedDate: ['quotes', 'bound'].includes(currentStage) ? new Date('2024-01-19T14:30:00') : undefined,
      estimatedDuration: '1-2 days',
      successCriteria: [
        'Producer has finalized and submitted package',
        'Submission sent to selected carriers',
        'Carrier acknowledgment received'
      ],
      keyActions: [
        'Producer submission confirmation',
        'Carrier distribution tracking',
        'Monitor submission status'
      ],
      stageData: {
        carriersSubmitted: ['quotes', 'bound'].includes(currentStage) ? 3 : currentStage === 'submitted' ? 2 : 0,
        carriersTotal: 3,
        acknowledgedCarriers: ['quotes', 'bound'].includes(currentStage) ? 3 : currentStage === 'submitted' ? 1 : 0,
        submissionDate: new Date('2024-01-19T14:30:00')
      }
    },
    {
      id: 'quotes',
      title: 'Quote',
      description: 'Carrier responses received',
      status: getStageStatus('quotes', currentStage),
      completedDate: currentStage === 'bound' ? new Date('2024-01-22T11:45:00') : undefined,
      estimatedDuration: '3-7 days',
      successCriteria: [
        'Quotes uploaded or received via email',
        'Quote comparison analysis complete',
        'AI recommendations generated'
      ],
      keyActions: [
        'Quote processing and parsing',
        'AI-powered recommendation generation',
        'Client quote presentation'
      ],
      stageData: {
        quotesReceived: currentStage === 'quotes' ? 2 : currentStage === 'bound' ? 3 : 0,
        quotesExpected: 3,
        bestQuote: currentStage === 'quotes' || currentStage === 'bound' ? {
          carrier: 'Liberty Mutual',
          premium: 45000,
          aiScore: 92
        } : null,
        lastQuoteReceived: new Date('2024-01-22T11:45:00')
      }
    },
    {
      id: 'bound',
      title: 'Bound',
      description: 'Coverage selection and activation (Final Stage)',
      status: getStageStatus('bound', currentStage),
      completedDate: currentStage === 'bound' ? new Date('2024-01-24T15:20:00') : undefined,
      estimatedDuration: '1-3 days',
      successCriteria: [
        'Policy binding completed and confirmed',
        'Policy documents finalized',
        'Coverage activated'
      ],
      keyActions: [
        'Client quote selection and binding',
        'Policy activation and confirmation',
        'Final documentation delivery'
      ],
      stageData: {
        selectedQuote: currentStage === 'bound' ? {
          carrier: 'Liberty Mutual',
          premium: 45000,
          effectiveDate: new Date('2024-02-01')
        } : null,
        bindingStatus: currentStage === 'bound' ? 'completed' : 'pending',
        policyNumber: currentStage === 'bound' ? 'LM-2024-789456' : null
      }
    }
  ];

  function getStageStatus(stageId: string, currentStage: string): 'completed' | 'current' | 'pending' {
    const stageOrder = ['docs', 'form', 'submitted', 'quotes', 'bound'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const stageIndex = stageOrder.indexOf(stageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  }

  function isStageCompleted(stageId: string, currentStage: string): boolean {
    return getStageStatus(stageId, currentStage) === 'completed';
  }

  const handleStageClick = (stageId: string) => {
    console.log('Stage clicked:', stageId);
    onStageClick?.(stageId);
  };

  const getStageIconDisplay = (stage: TimelineStage) => {
    const StageIcon = getStageIcon(stage.id);
    const status = stage.status;
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-white" />;
      case 'current':
        return <StageIcon className="h-6 w-6 text-white" />;
      default:
        return <StageIcon className="h-6 w-6 text-white opacity-60" />;
    }
  };

  const getStageColor = (stage: TimelineStage, isActiveViewing: boolean = false) => {
    const status = stage.status;
    
    // Active viewing stage gets a distinct pulsing focus ring
    if (isActiveViewing) {
      return 'bg-purple-500 border-purple-500 ring-4 ring-purple-200 animate-pulse shadow-lg';
    }
    
    // Current stage (progress indicator)
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'current':
        return 'bg-blue-500 border-blue-500 ring-2 ring-blue-200';
      default:
        return 'bg-gray-300 border-gray-300';
    }
  };

  const getConnectorColor = (index: number) => {
    const stage = stages[index];
    return stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-300';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Timeline */}
      <div className="relative">
        {/* Desktop Timeline */}
        <div className="hidden md:flex items-center justify-between px-4">
          {stages.map((stage, index) => {
            const isActiveViewing = activeViewingStage === stage.id && activeViewingStage !== null;
            return (
              <React.Fragment key={stage.id}>
                {/* Stage Node */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleStageClick(stage.id)}
                    onMouseEnter={() => setHoveredStage(stage.id)}
                    onMouseLeave={() => setHoveredStage(null)}
                    className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${getStageColor(stage, isActiveViewing)} ${
                      hoveredStage === stage.id ? 'transform scale-110' : ''
                    }`}
                    aria-label={`${stage.title} stage${isActiveViewing ? ' (currently viewing)' : ''}`}
                  >
                    {getStageIconDisplay(stage)}
                  </button>
                  <div className="mt-3 text-center">
                    <p className={`font-medium ${
                      isActiveViewing ? 'text-purple-700 font-bold' :
                      stage.status === 'current' ? 'text-blue-700' :
                      stage.status === 'completed' ? 'text-green-700' :
                      'text-gray-500'
                    }`}>
                      {stage.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 max-w-24">
                      {stage.description.split(' ').slice(0, 3).join(' ')}...
                    </p>
                    {stage.completedDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        {format(stage.completedDate, 'MMM d')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < stages.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${getConnectorColor(index)}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-4">
          {stages.map((stage, index) => {
            const isActiveViewing = activeViewingStage === stage.id && activeViewingStage !== null;
            return (
              <div key={stage.id} className="flex items-start space-x-4">
                {/* Stage Node */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleStageClick(stage.id)}
                    onMouseEnter={() => setHoveredStage(stage.id)}
                    onMouseLeave={() => setHoveredStage(null)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${getStageColor(stage, isActiveViewing)} ${
                      hoveredStage === stage.id ? 'transform scale-110' : ''
                    }`}
                    aria-label={`${stage.title} stage${isActiveViewing ? ' (currently viewing)' : ''}`}
                  >
                    {getStageIconDisplay(stage)}
                  </button>
                  {index < stages.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${getConnectorColor(index)}`} />
                  )}
                </div>

                {/* Stage Content */}
                <div className="flex-1 pb-8">
                  <h4 className={`font-medium ${
                    isActiveViewing ? 'text-purple-700 font-bold' :
                    stage.status === 'current' ? 'text-blue-700' :
                    stage.status === 'completed' ? 'text-green-700' :
                    'text-gray-500'
                  }`}>
                    {stage.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                  {stage.completedDate && (
                    <p className="text-xs text-gray-400 mt-2">
                      Completed {format(stage.completedDate, 'MMM d, yyyy \'at\' h:mm a')}
                    </p>
                  )}
                  {isActiveViewing && (
                    <div className="mt-2 flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-purple-600 font-medium">Currently Viewing</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Message */}
        {hoveredStage && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Click to view detailed stage management</p>
          </div>
        )}
      </div>

      {/* Important Note */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Eye className="h-6 w-6 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Interactive Timeline:</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Click on any stage to navigate to the detailed prospect view with that stage highlighted. 
              Each stage has its own comprehensive interface with all the functionality needed to complete 
              that phase of the submission process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectTimeline;