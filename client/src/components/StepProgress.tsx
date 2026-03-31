import './StepProgress.css';

interface StepProgressProps {
  currentStep: number;
  completedSteps?: number[];
  steps?: string[];
}

function StepProgress({ 
  currentStep = 1, 
  completedSteps = [],
  steps = ['Visa Type', 'Upload Docs', 'Fill Form', 'Review', 'Export']
}: StepProgressProps) {
  return (
    <div className="step-progress">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = completedSteps.includes(stepNum);
        const isCurrent = stepNum === currentStep;
        
        return (
          <div 
            key={index}
            className={`sp-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
          >
            <div className="sp-icon">
              {isCompleted ? '✓' : stepNum}
            </div>
            <span className="sp-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default StepProgress;