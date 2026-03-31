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
  onSectionChange,
}: SectionNavProps) {
  const isUnlock = (index: number) =>
    index <= currentSection || completedSections.includes(index);

  return (
    <nav className="section-nav">
      <div className="sn-header">
        <span className="sn-title">Progress</span>
      </div>
      <ol className="sn-track">
        {sections.map((section, index) => {
          const unlocked = isUnlock(index);
          const isCompleted = completedSections.includes(index);
          const isCurrent = index === currentSection;
          const isLast = index === sections.length - 1;

          let status = 'future';
          if (isCompleted) status = 'completed';
          else if (isCurrent) status = 'current';

          return (
            <li key={index} className={`sn-step ${status}`}>
              <button
                className="sn-step-btn"
                onClick={() => unlocked && onSectionChange?.(index)}
                disabled={!unlocked}
                type="button"
              >
                <div className="sn-indicator">
                  <span className="sn-dot">
                    {isCompleted && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  {!isLast && <span className="sn-line" />}
                </div>
                <span className="sn-label">{section}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default SectionNav;
