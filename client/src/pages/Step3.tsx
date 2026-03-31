import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisa } from '../context/VisaContext';
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

const SECTIONS = [
  'Personal Info',
  'Passport Details',
  'Travel History',
  'Accommodation',
  'Financial Info',
  'Employment',
  'Purpose of Visit',
  'Additional Info',
  'Declaration',
];

function Step3() {
  const navigate = useNavigate();
  const { state, setFormData } = useVisa();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Completed sections are those before current section
  const completedSections = Array.from({ length: currentSection }, (_, i) => i);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [dateValue, setDateValue] = useState({ year: '', month: '', day: '' });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Start chat on mount
  useEffect(() => {
    const startChat = async () => {
      if (!state.visaType) {
        navigate('/step/1');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/chat/start', {
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
    // Check if done
    if (data.done) {
      // Store form data in context
      if (data.summary) {
        setFormData(data.summary);
      }
      setCurrentQuestion(null);
      setProgress(100);
      return;
    }

    // Update progress and section
    if (data.progress !== undefined) {
      setProgress(data.progress);
    }
    if (data.section !== undefined) {
      setCurrentSection(data.section);
    }

    // Check for OCR prefill
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

    // Set prefilled value if available
    if (prefill) {
      setUserInput(prefill);
    } else {
      setUserInput('');
    }

    // Set question
    const question: Question = {
      question: data.question,
      type: data.type || 'text',
      options: data.options,
      field: data.field || '',
      section: data.section || 0,
      progress: data.progress || 0,
      validation: data.validation,
      prefill,
    };
    setCurrentQuestion(question);

    // Set select options
    if (data.options) {
      setSelectOptions(data.options);
    }

    // Reset date
    setDateValue({ year: '', month: '', day: '' });

    // Add AI message
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: data.question,
          timestamp: new Date(),
        },
      ]);
    }, 500);
  };

  const handleSubmit = async (answer: string) => {
    if (!sessionId || isLoading) return;

    // Add user message
    setMessages(prev => [
      ...prev,
      { role: 'user', content: answer, timestamp: new Date() },
    ]);

    // Clear current question while waiting for response
    setCurrentQuestion(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answer,
          questionIndex,
        }),
      });

      const data = await response.json();
      
      // Update question index
      setQuestionIndex(prev => prev + 1);

      // Check for validation error
      if (data.validation) {
        // Show validation error as AI message
        setMessages(prev => [
          ...prev,
          {
            role: 'ai',
            content: `⚠️ ${data.validation.error}`,
            timestamp: new Date(),
          },
        ]);
        // Restore the question for retry
        setCurrentQuestion(data.question || currentQuestion);
        setIsLoading(false);
        return;
      }

      processQuestion(data);
    } catch (error) {
      console.error('Failed to submit answer:', error);
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

  // Check if all questions are done
  const isComplete = !currentQuestion && messages.length > 0 && progress === 100;

  return (
    <div className="step3-container">
      <div className="step3-header">
        <div className="step3-progress">
          <div className="sp-bar">
            <div className="sp-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="sp-text">{progress}% Complete</span>
        </div>
      </div>

      <div className="step3-layout">
        <aside className="step3-sidebar">
          <SectionNav
            sections={SECTIONS}
            currentSection={currentSection}
            completedSections={completedSections}
          />
        </aside>

        <main className="step3-main">
          <div className="chat-container">
            <div className="chat-messages">
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
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              )}

              {isLoading && !currentQuestion && !isTyping && (
                <div className="loading-indicator">
                  Processing...
                </div>
              )}

              {currentQuestion && !isTyping && (
                <div className="question-input-area">
                  {currentQuestion.prefill && (
                    <div className="prefill-notice">
                      Pre-filled from your passport. Please confirm or edit.
                    </div>
                  )}
                  
                  {currentQuestion.type === 'text' && (
                    <div className="text-input-group">
                      <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your answer..."
                        className="chat-input"
                      />
                      <button 
                        onClick={handleTextSubmit}
                        disabled={!userInput.trim() || isLoading}
                        className="send-button"
                      >
                        Send
                      </button>
                    </div>
                  )}

                  {currentQuestion.type === 'select' && (
                    <div className="options-grid">
                      {selectOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectClick(opt)}
                          disabled={isLoading}
                          className="option-button"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'date' && (
                    <div className="date-input-group">
                      <input
                        type="text"
                        value={dateValue.year}
                        onChange={(e) => setDateValue({ ...dateValue, year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="YYYY"
                        className="date-input"
                        maxLength={4}
                      />
                      <span className="date-sep">/</span>
                      <select
                        value={dateValue.month}
                        onChange={(e) => setDateValue({ ...dateValue, month: e.target.value })}
                        className="date-select"
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      <span className="date-sep">/</span>
                      <select
                        value={dateValue.day}
                        onChange={(e) => setDateValue({ ...dateValue, day: e.target.value })}
                        className="date-select"
                      >
                        <option value="">DD</option>
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleDateSubmit}
                        disabled={!dateValue.year || !dateValue.month || !dateValue.day || isLoading}
                        className="send-button"
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isComplete && (
                <div className="complete-section">
                  <div className="complete-message">
                    🎉 All done! You've completed the form.
                  </div>
                  <button onClick={handleComplete} className="review-button">
                    Review Your Application →
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Step3;