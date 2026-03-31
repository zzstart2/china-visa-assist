import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';
import { useVisa } from '../context/VisaContext';
import { useI18n } from '../i18n/I18nContext';
import './Step1.css';

interface Option {
  label: string;
  value: string;
  action?: () => void;
}

interface ChatMessage {
  role: 'ai' | 'user';
  content: string;
  showOptions?: boolean;
  options?: Option[];
}

function Step1() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { setVisaType, setVisaEntry, setVisaDuration, state } = useVisa();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessage: ChatMessage = {
      role: 'ai',
      content: t('step1.welcome'),
      showOptions: true,
      options: [
        { label: t('step1.business'), value: 'business', action: () => handleBusinessSelect() },
        { label: t('step1.transit'), value: 'transit', action: () => handleTransitSelect() },
        { label: t('step1.tourism'), value: 'tourism', action: () => handleTourismSelect() },
        { label: t('step1.other'), value: 'other', action: () => handleTourismSelect() },
      ],
    };
    setMessages([initialMessage]);
    setCurrentOptions(initialMessage.options ?? []);
  }, [t]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAIMessage = (content: string, options?: Option[]) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: ChatMessage = { role: 'ai', content, showOptions: !!options, options };
      setMessages(prev => [...prev, newMessage]);
      setCurrentOptions(options ?? []);
      setIsTyping(false);
    }, 600);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.value);
    setMessages(prev => [...prev, { role: 'user', content: option.label }]);
    setCurrentOptions([]);
    setSelectedOption(null);
    option.action?.();
  };

  const handleBusinessSelect = () => {
    setVisaType('M');
    setTimeout(() => {
      addAIMessage(t('step1.howMany.m'), [
        { label: t('step1.single30'), value: 'single-30', action: () => handleMvisaSelect('Single', '30 days') },
        { label: t('step1.double60'), value: 'double-60', action: () => handleMvisaSelect('Double', '60 days') },
        { label: t('step1.multiple180'), value: 'multiple-180', action: () => handleMvisaSelect('Multiple', '180 days') },
      ]);
    }, 400);
  };

  const handleTransitSelect = () => {
    setVisaType('G');
    setTimeout(() => {
      addAIMessage(t('step1.howMany.g'), [
        { label: t('step1.transit24'), value: '24h', action: () => handleGvisaSelect('24 hours') },
        { label: t('step1.transit72'), value: '72h', action: () => handleGvisaSelect('72 hours') },
        { label: t('step1.transit144'), value: '144h', action: () => handleGvisaSelect('144 hours') },
      ]);
    }, 400);
  };

  const handleTourismSelect = () => {
    setTimeout(() => {
      addAIMessage(t('step1.notSupported'), [
        { label: t('step1.business'), value: 'business', action: () => handleBusinessSelect() },
        { label: t('step1.transit'), value: 'transit', action: () => handleTransitSelect() },
      ]);
    }, 400);
  };

  const handleMvisaSelect = (entry: string, duration: string) => {
    setVisaEntry(entry);
    setVisaDuration(duration);
    setTimeout(() => {
      addAIMessage(t('step1.result.m'), [
        { label: t('step1.continue'), value: 'continue', action: () => navigate('/step/2') },
      ]);
    }, 400);
  };

  const handleGvisaSelect = (duration: string) => {
    setVisaEntry('Transit');
    setVisaDuration(duration);
    setTimeout(() => {
      addAIMessage(t('step1.result.g'), [
        { label: t('step1.continue'), value: 'continue', action: () => navigate('/step/2') },
      ]);
    }, 400);
  };

  const getRequiredDocsList = () => {
    if (state.visaType === 'M') {
      return [
        t('step1.doc.passport'), t('step1.doc.photo'), t('step1.doc.invitation'),
        t('step1.doc.prevVisa'), t('step1.doc.residence'),
      ];
    }
    return [
      t('step1.doc.passport'), t('step1.doc.photo'), t('step1.doc.ticket'),
      t('step1.doc.prevVisa'), t('step1.doc.residence'),
    ];
  };

  const showDocList = state.visaType !== null;

  return (
    <div className="step1-container">
      <div className="step1-header">
        <h2>{t('step1.title')}</h2>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index}>
              <ChatBubble role={msg.role} content={msg.content} />
              {msg.showOptions && currentOptions.length > 0 && (
                <div className="options-container">
                  {currentOptions.map((opt, i) => (
                    <button
                      key={i}
                      className={`option-btn ${selectedOption === opt.value ? 'selected' : ''}`}
                      onClick={() => handleOptionClick(opt)}
                      disabled={isTyping}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator">
              <span>🤖</span>
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {showDocList && state.visaType !== null && (
          <div className="required-docs-card">
            <h3>📋 {t('step1.materials')}</h3>
            <ul>
              {getRequiredDocsList().map((doc, i) => (
                <li key={i} className={i < 3 ? 'mandatory' : 'optional'}>{doc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Step1;
