import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="welcome-card">
        <div className="welcome-icon">🇨🇳</div>
        <h2>Welcome to China Visa Application Assistant</h2>
        <p>Let us help you prepare your visa application documents efficiently.</p>
        
        <div className="features">
          <div className="feature">
            <span className="feature-icon">📋</span>
            <span>Step-by-step guidance</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📄</span>
            <span>Document upload support</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <span>Interactive form filling</span>
          </div>
          <div className="feature">
            <span className="feature-icon">✅</span>
            <span>Review before submission</span>
          </div>
        </div>
        
        <Link to="/step/1" className="start-button">
          Start Application
        </Link>
      </div>
    </div>
  );
}

export default Home;