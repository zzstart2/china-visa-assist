import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import './Home.css';

function Home() {
  const { t } = useI18n();
  return (
    <div className="home">
      <div className="welcome-card">
        <div className="welcome-icon">🇨🇳</div>
        <h2>{t('home.title')}</h2>
        <p>{t('home.desc')}</p>
        
        <div className="features">
          <div className="feature">
            <span className="feature-icon">📋</span>
            <span>{t('home.step1.desc')}</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📄</span>
            <span>{t('home.step2.desc')}</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <span>{t('home.step3.desc')}</span>
          </div>
          <div className="feature">
            <span className="feature-icon">✅</span>
            <span>{t('home.step4.desc')}</span>
          </div>
        </div>
        
        <Link to="/step/1" className="start-button">
          {t('home.start')}
        </Link>
      </div>
    </div>
  );
}

export default Home;