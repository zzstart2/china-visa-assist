import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisa } from '../context/VisaContext';
import { useI18n } from '../i18n/I18nContext';
import SectionNav from '../components/SectionNav';
import ChatBubble from '../components/ChatBubble';
import './Step3.css';

interface ChatMessage {
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface Question {
  question: string;
  type: 'text' | 'select' | 'date';
  options?: string[];
  field: string;
  section: number;
  progress: number;
  validation?: { error: string };
  prefill?: string;
}

function Step3() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { state, setFormData } = useVisa();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const SECTIONS = Array.from({ length: 9 }, (_, i) => t(`step3.sec.${i}`));

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [dateValue, setDateValue] = useState({ year: '', month: '', day: '' });

  const completedSections = Array.from({ length: currentSection }, (_, i) => i);

  // Translate a question string based on field name
  const tQuestion = (field: string, fallback: string) => {
    const key = `q.${field}`;
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  // Translate select option
  const tOption = (opt: string) => {
    const key = `opt.${opt}`;
    const translated = t(key);
    return translated === key ? opt : translated;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const startChat = async () => {
      if (!state.visaType) {
        navigate('/step/1');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/chat/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visaType: state.visaType }),
        });

        const data = await response.json();

        if (data.sessionId) {
          setSessionId(data.sessionId);
          setQuestionIndex(0);
          processQuestion(data);
        }
      } catch (error) {
        console.error('Failed to start chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    startChat();
  }, []);

  const processQuestion = (data: any) => {
    if (data.done) {
      if (data.summary) {
        setFormData(data.summary);
      }
      setCurrentQuestion(null);
      setProgress(100);
      return;
    }

    if (data.progress !== undefined) {
      setProgress(data.progress);
    }
    if (data.section !== undefined) {
      setCurrentSection(data.section);
    }

    let prefill: string | undefined;
    if (data.field && state.extractedPassport) {
      const fieldMap: Record<string, string> = {
        name: state.extractedPassport.name || '',
        passportNumber: state.extractedPassport.passportNumber || '',
        nationality: state.extractedPassport.nationality || '',
        birthDate: state.extractedPassport.birthDate || '',
        expiryDate: state.extractedPassport.expiryDate || '',
      };
      prefill = fieldMap[data.field];
    }

    if (prefill) {
      setUserInput(prefill);
    } else {
      setUserInput('');
    }

    const translatedQ = tQuestion(data.field, data.question);

    const question: Question = {
      question: translatedQ,
      type: data.type || 'text',
      options: data.options,
      field: data.field || '',
      section: data.section || 0,
      progress: data.progress || 0,
      validation: data.validation,
      prefill,
    };
    setCurrentQuestion(question);

    if (data.options) {
      setSelectOptions(data.options);
    }

    setDateValue({ year: '', month: '', day: '' });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: translatedQ, timestamp: new Date() },
      ]);
    }, 500);
  };

  const handleSubmit = async (answer: string) => {
    if (!sessionId || isLoading) return;

    setMessages(prev => [
      ...prev,
      { role: 'user', content: answer, timestamp: new Date() },
    ]);

    setCurrentQuestion(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answer, questionIndex }),
      });

      const data = await response.json();
      setQuestionIndex(prev => prev + 1);

      if (data.validation) {
        setMessages(prev => [
          ...prev,
          { role: 'ai', content: `\u26a0\ufe0f ${data.validation.error}`, timestamp: new Date() },
        ]);
        setCurrentQuestion(data.question || currentQuestion);
        setIsLoading(false);
        return;
      }

      processQuestion(data);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = () => {
    if (!userInput.trim()) return;
    handleSubmit(userInput.trim());
  };

  const handleSelectClick = (option: string) => {
    handleSubmit(option);
  };

  const handleDateSubmit = () => {
    const { year, month, day } = dateValue;
    if (!year || !month || !day) return;
    handleSubmit(`${year}-${month}-${day}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const handleComplete = () => {
    navigate('/step/4');
  };

  const isComplete = !currentQuestion && messages.length > 0 && progress === 100;

  return (
    <div className="step3-container">
      {/* ── Slim progress bar ── */}
      <div className="step3-progress-bar">
        <div className="step3-progress-fill" style={{ width: `${progress}%` }} />
        <span className="step3-progress-text">
          {t('step3.progress', { pct: String(progress) })}
        </span>
      </div>

      <div className="step3-layout">
        {/* ── Sidebar ── */}
        <aside className="step3-sidebar">
          <SectionNav
            sections={SECTIONS}
            currentSection={currentSection}
            completedSections={completedSections}
          />
        </aside>

        {/* ── Chat area ── */}
        <main className="step3-main">
          <div className="chat-scroll-area">
            {messages.map((msg, idx) => (
              <ChatBubble
                key={idx}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
            ))}

            {isTyping && (
              <div className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}

            {isLoading && !currentQuestion && !isTyping && (
              <div className="loading-indicator">{t('step3.processing')}</div>
            )}

            {isComplete && (
              <div className="complete-section">
                <div className="complete-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="complete-message">{t('step3.complete')}</div>
                <button onClick={handleComplete} className="review-button">
                  {t('step3.continue')}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input dock ── */}
          {currentQuestion && !isTyping && (
            <div className="input-dock">
              {currentQuestion.prefill && (
                <div className="prefill-notice">{t('step3.prefill')}</div>
              )}

              {currentQuestion.type === 'text' && (
                <div className="text-input-row">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('step3.placeholder')}
                    className="chat-input"
                  />
                  <button
                    onClick={handleTextSubmit}
                    disabled={!userInput.trim() || isLoading}
                    className="send-btn"
                    aria-label="Send"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              )}

              {currentQuestion.type === 'select' && (
                <div className="options-row">
                  {selectOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectClick(opt)}
                      disabled={isLoading}
                      className="option-pill"
                    >
                      {tOption(opt)}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'date' && (
                <div className="date-row">
                  <div className="date-segments">
                    <input
                      type="text"
                      value={dateValue.year}
                      onChange={(e) => setDateValue({ ...dateValue, year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="YYYY"
                      className="date-seg"
                      maxLength={4}
                    />
                    <span className="date-div">/</span>
                    <select
                      value={dateValue.month}
                      onChange={(e) => setDateValue({ ...dateValue, month: e.target.value })}
                      className="date-seg"
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <span className="date-div">/</span>
                    <select
                      value={dateValue.day}
                      onChange={(e) => setDateValue({ ...dateValue, day: e.target.value })}
                      className="date-seg"
                    >
                      <option value="">DD</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleDateSubmit}
                    disabled={!dateValue.year || !dateValue.month || !dateValue.day || isLoading}
                    className="send-btn"
                  >
                    {t('step3.confirm')}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Step3;
