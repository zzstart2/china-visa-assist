import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';
import { useVisa } from '../context/VisaContext';
import { useI18n } from '../i18n/I18nContext';
import type { Language } from '../types/application';
import './Step1.css';

type Step = 'language' | 'confirm' | 'entry' | 'result';

function Step1() {
  const navigate = useNavigate();
  const { setLanguage: setI18nLang } = useI18n();
  const { setLanguage, setVisaType, state } = useVisa();

  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([]);
  const [step, setStep] = useState<Step>('language');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initial message
  useEffect(() => {
    setMessages([{ role: 'ai', content: '🌐 Please select your language / 请选择语言' }]);
    setStep('language');
  }, []);

  const addMessages = (userMsg: string, aiMsg: string, nextStep: Step, action?: () => void) => {
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    if (action) action();
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: aiMsg }]);
      setStep(nextStep);
      setIsTyping(false);
    }, 600);
  };

  const handleLanguageSelect = (lang: Language) => {
    const label = lang === 'en' ? 'English' : '中文';
    setLanguage(lang);
    setI18nLang(lang);

    // After language selected, auto-assign M visa and ask entry
    const welcomeMsg = lang === 'en'
      ? '✅ Great! This system assists with **M Visa (Business/Commercial)** applications for China.\n\nHow many entries do you need?'
      : '✅ 好的！本系统协助办理中国 **M签（商务/商贸）** 签证申请。\n\n您需要几次入境？';

    setMessages(prev => [...prev, { role: 'user', content: label }]);
    setVisaType('M');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: welcomeMsg }]);
      setStep('entry');
      setIsTyping(false);
    }, 600);
  };

  const handleEntry = (label: string, entries: string) => {
    const resultMsg = state.language === 'en'
      ? `📋 M Visa — ${entries}. Here are the documents you'll need:`
      : `📋 M签 — ${entries}。以下是您需要准备的材料：`;

    addMessages(label, resultMsg, 'result');
  };

  const handleContinue = () => {
    navigate('/step/2');
  };

  const renderOptions = () => {
    if (isTyping) return null;
    const lang = state.language;

    if (step === 'language') {
      return (
        <div className="options-container language-options">
          <button className="option-btn lang-btn" onClick={() => handleLanguageSelect('en')}>
            🇬🇧 English
          </button>
          <button className="option-btn lang-btn" onClick={() => handleLanguageSelect('zh')}>
            🇨🇳 中文
          </button>
        </div>
      );
    }

    if (step === 'entry') {
      return (
        <div className="options-container">
          <button className="option-btn" onClick={() => handleEntry(
            lang === 'en' ? 'Single entry, up to 30 days' : '单次入境，最多 30 天',
            lang === 'en' ? 'Single Entry' : '单次入境'
          )}>
            {lang === 'en' ? '🔹 Single entry, up to 30 days' : '🔹 单次入境，最多 30 天'}
          </button>
          <button className="option-btn" onClick={() => handleEntry(
            lang === 'en' ? 'Double entry, up to 60 days' : '两次入境，最多 60 天',
            lang === 'en' ? 'Double Entry' : '两次入境'
          )}>
            {lang === 'en' ? '🔹 Double entry, up to 60 days' : '🔹 两次入境，最多 60 天'}
          </button>
          <button className="option-btn" onClick={() => handleEntry(
            lang === 'en' ? 'Multiple entry, up to 180 days' : '多次入境，最多 180 天',
            lang === 'en' ? 'Multiple Entry' : '多次入境'
          )}>
            {lang === 'en' ? '🔹 Multiple entry, up to 180 days' : '🔹 多次入境，最多 180 天'}
          </button>
        </div>
      );
    }

    if (step === 'result') {
      return (
        <div className="options-container">
          <button className="continue-btn" onClick={handleContinue}>
            {lang === 'en' ? 'Continue to Document Upload →' : '继续上传材料 →'}
          </button>
        </div>
      );
    }

    return null;
  };

  const getMDocs = () => {
    const lang = state.language;
    if (lang === 'en') {
      return [
        { text: 'Passport photo page', mandatory: true },
        { text: 'Application photo (white background)', mandatory: true },
        { text: 'Business invitation letter', mandatory: true },
        { text: 'Employment certificate', mandatory: false },
        { text: 'Previous Chinese visa copy', mandatory: false },
      ];
    }
    return [
      { text: '护照信息页', mandatory: true },
      { text: '申请照片（白底）', mandatory: true },
      { text: '商务邀请函', mandatory: true },
      { text: '在职证明', mandatory: false },
      { text: '旧中国签证复印件', mandatory: false },
    ];
  };

  return (
    <div className="step1-container">
      <div className="step1-header">
        <h2>{state.language === 'en' ? 'Step 1: Visa Type' : '第一步：签证类型'}</h2>
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <span>🤖</span>
              <div className="typing-dots"><span /><span /><span /></div>
            </div>
          )}
          {renderOptions()}
          <div ref={messagesEndRef} />
        </div>
        {step === 'result' && (
          <div className="required-docs-card">
            <h3>{state.language === 'en' ? 'Required Materials:' : '所需材料：'}</h3>
            <ul>
              {getMDocs().map((doc, i) => (
                <li key={i} className={doc.mandatory ? 'mandatory' : 'optional'}>
                  {doc.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Step1;
