import './SectionNav.css';

interface SectionNavProps {
  sections: string[];
  currentSection: number;
  completedSections?: number[];
  onSectionChange?: (index: number) => void;
}

function SectionNav({ 
  sections, 
  currentSection, 
  completedSections = [],
  onSectionChange 
}: SectionNavProps) {
  const isUnlock = (index: number) => {
    return index <= currentSection || completedSections.includes(index);
  };

  return (
    <nav className="section-nav">
      <div className="sn-header">
        <span className="sn-title">Sections</span>
      </div>
      <ul className="sn-list">
        {sections.map((section, index) => {
          const unlocked = isUnlock(index);
          const isCompleted = completedSections.includes(index);
          const isCurrent = index === currentSection;
          
          return (
            <li key={index}>
              <button
                className={`sn-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`}
                onClick={() => unlocked && onSectionChange?.(index)}
                disabled={!unlocked}
              >
                <span className="sn-icon">
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span className="sn-label">{section}</span>
                {!unlocked && <span className="sn-lock">🔒</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SectionNav;