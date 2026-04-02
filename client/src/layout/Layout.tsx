import { Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useVisa } from '../context/VisaContext';
import './Layout.css';

function Layout() {
  const location = useLocation();
  const { t, toggleLang, lang } = useI18n();
  const { setLanguage: setVisaLang } = useVisa();

  const steps = [
    { path: '/step/1', label: t('step.1') },
    { path: '/step/2', label: t('step.2') },
    { path: '/step/3', label: t('step.3') },
    { path: '/step/4', label: t('step.4') },
    { path: '/step/5', label: t('step.5') },
  ];
  
  const currentStepIndex = steps.findIndex(s => s.path === location.pathname);
  const isStepPage = location.pathname.startsWith('/step/');

  return (
    <div className="layout">
      <header className="header">
        <h1 className="title">{t('app.title')}</h1>
        <button className="lang-toggle" onClick={() => {
          toggleLang();
          // Sync VisaContext language with I18nContext
          setVisaLang(lang === 'en' ? 'zh' : 'en');
        }}>{t('app.lang.toggle')}</button>
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