import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  Circle,
  FileText,
  Upload,
  Send,
  DollarSign,
  Award,
  Eye,
  Mail,
  Phone,
  Users,
  MessageSquare
} from 'lucide-react';
import { PROSPECT_STAGES, STAGE_LABELS } from '../../utils/constants';

interface ProgressStep {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'completed' | 'current' | 'pending';
  tools: {
    name: string;
    icon: React.ComponentType<any>;
    description: string;
    enabled: boolean;
    primary?: boolean;
  }[];
}

interface ProspectProgressBarProps {
  currentStage: string;
  activeViewingStage?: string;
  prospectId?: string;
  prospectName?: string;
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'compact' | 'interactive';
  onStageClick?: (stageId: string) => void;
}


// Stage descriptions for tooltips
const STAGE_DESCRIPTIONS = {
  docs: 'Document collection and verification',
  form: 'Smart form completion',
  submitted: 'Submission sent to carriers',
  quotes: 'Carrier quotes received',
  bound: 'Policy bound and active'
} as const;

const ProspectProgressBar: React.FC<ProspectProgressBarProps> = ({
  currentStage,
  activeViewingStage,
  prospectId,
  prospectName,
  className = '',
  showLabels = false,
  size = 'md',
  variant = 'horizontal',
  onStageClick,
}) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null); 
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [showHoverMessage, setShowHoverMessage] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getStageStatus = (stepId: string, currentStage: string): 'completed' | 'current' | 'pending' => {
    const currentIndex = PROSPECT_STAGES.indexOf(currentStage as any);
    const stepIndex = PROSPECT_STAGES.indexOf(stepId as any);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  // Get the consistent icon for each stage
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
  const steps: ProgressStep[] = PROSPECT_STAGES.map(stage => ({
    id: stage,
    label: STAGE_LABELS[stage],
    shortLabel: STAGE_LABELS[stage].split(' ')[0],
    description: `${STAGE_LABELS[stage]} stage`,
    icon: getStageIcon(stage),
    status: getStageStatus(stage, currentStage),
    tools: [] // Simplified for performance
  }));

  const handleStageClick = (stageId: string) => {
    if (variant === 'interactive') {
      onStageClick?.(stageId);
    }
  };

  const handleStageHover = (stageId: string | null, event?: React.MouseEvent) => {
    setHoveredStage(stageId);
    setShowHoverMessage(!!stageId);
    
    if (stageId && event) {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      const containerRect = containerRef?.getBoundingClientRect();
      
      // Calculate position relative to the viewport for fixed positioning
      setTooltipPosition({
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top - 10
      });
    } else if (stageId && !event) {
      // Fallback for cases without event
      setTooltipPosition({
        x: 0,
        y: 0
      });
    }
  };

  const handleToolClick = (toolName: string, stageId: string) => {
  };

  const getStepIcon = (step: ProgressStep) => {
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    const StageIcon = step.icon;
    
    switch (step.status) {
      case 'completed':
        return <CheckCircle className={`${iconSize} text-white`} />;
      case 'current':
        return <StageIcon className={`${iconSize} text-white`} />;
      default:
        return <StageIcon className={`${iconSize} text-white opacity-60`} />;
    }
  };

  const getStepColor = (step: ProgressStep, isActiveViewing: boolean = false) => {
    // Active viewing stage gets a pulsing focus ring
    if (isActiveViewing) {
      return 'bg-purple-500 border-purple-500 ring-4 ring-purple-200 animate-pulse shadow-lg';
    }
    
    switch (step.status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'current':
        return 'bg-blue-500 border-blue-500 ring-2 ring-blue-200';
      default:
        return 'bg-gray-300 border-gray-300';
    }
  };

  const getConnectorColor = (index: number) => {
    const step = steps[index];
    return step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300';
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const currentStepProgress = steps.some(step => step.status === 'current') ? 0.5 : 0;
    return ((completedSteps + currentStepProgress) / steps.length) * 100;
  };

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-xs text-gray-500">{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {steps.map((step, index) => {
            const isActiveViewing = activeViewingStage === step.id && activeViewingStage !== null;
            return (
              <Link
                key={step.id}
                to={`/producer/prospects/${prospectId}?stage=${step.id}&highlight=true`}
                className="group relative cursor-pointer"
                onMouseEnter={(e) => handleStageHover(step.id, e)}
                onMouseLeave={() => handleStageHover(null)}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  step.status === 'completed' ? 'bg-green-500' :
                  step.status === 'current' ? 'bg-blue-500' :
                  'bg-gray-300'
                }`} />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const stepSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const connectorHeight = size === 'sm' ? 'h-0.5' : size === 'lg' ? 'h-1' : 'h-0.5';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div ref={setContainerRef} className={`relative ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActiveViewing = activeViewingStage === step.id && activeViewingStage !== null;
          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div className="flex flex-col items-center group relative">
                <Link
                  to={`/producer/prospects/${prospectId}?stage=${step.id}&highlight=true`}
                  className={`${stepSize} rounded-full border-2 flex items-center justify-center transition-all duration-300 transform ${getStepColor(step, isActiveViewing)} ${
                    variant === 'interactive' ? 'cursor-pointer hover:shadow-lg' : ''
                  } ${hoveredStage === step.id ? 'scale-110' : ''}`}
                  onClick={(e) => {
                    if (variant === 'interactive') {
                      e.preventDefault();
                      handleStageClick(step.id);
                    }
                  }}
                  onMouseEnter={(e) => handleStageHover(step.id, e)}
                  onMouseLeave={() => handleStageHover(null)}
                  aria-label={`${step.label} stage${isActiveViewing ? ' (currently viewing)' : ''}`}
                  role="button"
                  tabIndex={0}
                >
                  {getStepIcon(step)}
                </Link>
                
                {showLabels && (
                  <span className={`${textSize} font-medium mt-1 text-center transition-all duration-300 ${
                    isActiveViewing ? 'text-purple-700 font-bold' :
                    step.status === 'current' ? 'text-blue-700' :
                    step.status === 'completed' ? 'text-green-700' :
                    'text-gray-500'
                  }`}>
                    {step.shortLabel}
                  </span>
                )}
                
                {/* Active viewing indicator */}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 ${connectorHeight} mx-2 rounded-full transition-all duration-500 ${getConnectorColor(index)}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Custom Tooltip */}
      {hoveredStage && (
        <div
          className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {STAGE_DESCRIPTIONS[hoveredStage as keyof typeof STAGE_DESCRIPTIONS]}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(-100%);
          }
        }
      `}</style>
    </div> 
  );
};

export default ProspectProgressBar;