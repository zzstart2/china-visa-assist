import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';
import { useVisa } from '../context/VisaContext';
import { useI18n } from '../i18n/I18nContext';
import './Step1.css';

type Step = 'purpose' | 'entry' | 'result';

function Step1() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { setVisaType, setVisaEntry, setVisaDuration, state } = useVisa();

  const [messages, setMessages] = useState<{role: 'ai' | 'user', content: string}[]>([]);
  const [step, setStep] = useState<Step>('purpose');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mount only — do NOT depend on [t] or language changes will reset the flow
  useEffect(() => {
    setMessages([{ role: 'ai', content: t('step1.welcome') }]);
    setStep('purpose');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSelect = (userLabel: string, aiContent: string, nextStep: Step, action?: () => void) => {
    // Add user selection
    setMessages(prev => [...prev, { role: 'user', content: userLabel }]);
    
    // Execute any state updates
    if (action) action();
    
    // Add AI response after delay
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: aiContent }]);
      setStep(nextStep);
      setIsTyping(false);
    }, 800);
  };

  const handleContinue = () => {
    navigate('/step/2');
  };

  const getOptions = () => {
    if (isTyping) return null;
    
    if (step === 'purpose') {
      return (
        <div className="options-container">
          <button className="option-btn" onClick={() => handleSelect(t('step1.business'), t('step1.howMany.m'), 'entry', () => setVisaType('M'))}>{t('step1.business')}</button>
          <button className="option-btn" onClick={() => handleSelect(t('step1.transit'), t('step1.howMany.g'), 'entry', () => setVisaType('G'))}>{t('step1.transit')}</button>
          <button className="option-btn" onClick={() => handleSelect(t('step1.tourism'), t('step1.notSupported'), 'purpose', () => {})}>{t('step1.tourism')}</button>
          <button className="option-btn" onClick={() => handleSelect(t('step1.other'), t('step1.notSupported'), 'purpose', () => {})}>{t('step1.other')}</button>
        </div>
      );
    }
    
    if (step === 'entry') {
      const isM = state.visaType === 'M';
      if (isM) {
        return (
          <div className="options-container">
            <button className="option-btn" onClick={() => handleSelect(t('step1.single30'), t('step1.result.m'), 'result', () => { setVisaEntry('Single'); setVisaDuration('30 days'); })}>{t('step1.single30')}</button>
            <button className="option-btn" onClick={() => handleSelect(t('step1.double60'), t('step1.result.m'), 'result', () => { setVisaEntry('Double'); setVisaDuration('60 days'); })}>{t('step1.double60')}</button>
            <button className="option-btn" onClick={() => handleSelect(t('step1.multiple180'), t('step1.result.m'), 'result', () => { setVisaEntry('Multiple'); setVisaDuration('180 days'); })}>{t('step1.multiple180')}</button>
          </div>
        );
      } else {
        return (
          <div className="options-container">
            <button className="option-btn" onClick={() => handleSelect(t('step1.transit24'), t('step1.result.g'), 'result', () => { setVisaEntry('Transit'); setVisaDuration('24 hours'); })}>{t('step1.transit24')}</button>
            <button className="option-btn" onClick={() => handleSelect(t('step1.transit72'), t('step1.result.g'), 'result', () => { setVisaEntry('Transit'); setVisaDuration('72 hours'); })}>{t('step1.transit72')}</button>
            <button className="option-btn" onClick={() => handleSelect(t('step1.transit144'), t('step1.result.g'), 'result', () => { setVisaEntry('Transit'); setVisaDuration('144 hours'); })}>{t('step1.transit144')}</button>
          </div>
        );
      }
    }
    
    if (step === 'result') {
      return (
        <div className="options-container">
          <button className="option-btn" onClick={handleContinue}>{t('step1.continue')}</button>
        </div>
      );
    }
    
    return null;
  };

  const getDocs = () => {
    if (state.visaType === 'M') {
      return [t('step1.doc.passport'), t('step1.doc.photo'), t('step1.doc.invitation'), t('step1.doc.prevVisa'), t('step1.doc.residence')];
    }
    return [t('step1.doc.passport'), t('step1.doc.photo'), t('step1.doc.ticket'), t('step1.doc.prevVisa'), t('step1.doc.residence')];
  };

  return (
    <div className="step1-container">
      <div className="step1-header">
        <h2>{t('step1.title')}</h2>
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => <ChatBubble key={i} role={msg.role} content={msg.content} />)}
          {isTyping && <div className="typing-indicator"><span>🤖</span><div className="typing-dots"><span></span><span></span><span></span></div></div>}
          {getOptions()}
          <div ref={chatEndRef} />
        </div>
        {state.visaType && (
          <div className="required-docs-card">
            <h3>📋 {t('step1.materials')}</h3>
            <ul>{getDocs().map((doc, i) => <li key={i} className={i < 3 ? 'mandatory' : 'optional'}>{doc}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Step1;