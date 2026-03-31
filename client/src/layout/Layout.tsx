import { Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

const steps = [
  { path: '/step/1', label: 'Visa Type' },
  { path: '/step/2', label: 'Upload Docs' },
  { path: '/step/3', label: 'Fill Form' },
  { path: '/step/4', label: 'Review' },
  { path: '/step/5', label: 'Export' },
];

function Layout() {
  const location = useLocation();
  
  const currentStepIndex = steps.findIndex(s => s.path === location.pathname);
  
  const isStepPage = location.pathname.startsWith('/step/');

  return (
    <div className="layout">
      <header className="header">
        <h1 className="title">China Visa Application Assistant</h1>
      </header>
      
      {isStepPage && (
        <nav className="step-nav">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div 
                key={step.path} 
                className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <span className="step-icon">
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span className="step-label">{step.label}</span>
              </div>
            );
          })}
        </nav>
      )}
      
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;