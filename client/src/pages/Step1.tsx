import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';
import { useVisa } from '../context/VisaContext';
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
  const { setVisaType, setVisaEntry, setVisaDuration, state } = useVisa();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial message
  useEffect(() => {
    const initialMessage: ChatMessage = {
      role: 'ai',
      content: "Welcome! What is the main purpose of your trip to China?",
      showOptions: true,
      options: [
        { label: 'Business / Commercial activities', value: 'business', action: () => handleBusinessSelect() },
        { label: 'Transit through China to a third country', value: 'transit', action: () => handleTransitSelect() },
        { label: 'Tourism', value: 'tourism', action: () => handleTourismSelect() },
        { label: 'Other', value: 'other', action: () => handleTourismSelect() },
      ],
    };
    setMessages([initialMessage]);
    setCurrentOptions(initialMessage.options ?? []);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAIMessage = (content: string, options?: Option[]) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: ChatMessage = {
        role: 'ai',
        content,
        showOptions: !!options,
        options,
      };
      setMessages(prev => [...prev, newMessage]);
      setCurrentOptions(options ?? []);
      setIsTyping(false);
    }, 600);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.value);
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: option.label }]);
    setCurrentOptions([]);
    setSelectedOption(null);
    
    // Execute action
    option.action?.();
  };

  const handleBusinessSelect = () => {
    setVisaType('M');
    setTimeout(() => {
      addAIMessage("How many entries do you need, and how long do you plan to stay?", [
        { label: 'Single entry, up to 30 days', value: 'single-30', action: () => handleMvisaSelect('Single', '30 days') },
        { label: 'Double entry, up to 60 days', value: 'double-60', action: () => handleMvisaSelect('Double', '60 days') },
        { label: 'Multiple entry, up to 180 days', value: 'multiple-180', action: () => handleMvisaSelect('Multiple', '180 days') },
      ]);
    }, 400);
  };

  const handleTransitSelect = () => {
    setVisaType('G');
    setTimeout(() => {
      addAIMessage("How long will your transit in China last?", [
        { label: 'Up to 24 hours (airport transit)', value: '24h', action: () => handleGvisaSelect('24 hours') },
        { label: 'Up to 72 hours', value: '72h', action: () => handleGvisaSelect('72 hours') },
        { label: 'Up to 144 hours', value: '144h', action: () => handleGvisaSelect('144 hours') },
      ]);
    }, 400);
  };

  const handleTourismSelect = () => {
    setTimeout(() => {
      addAIMessage("This demo only covers M (Business) and G (Transit) visas. Please select one of those options or restart the process.", [
        { label: 'Business / Commercial activities', value: 'business', action: () => handleBusinessSelect() },
        { label: 'Transit through China to a third country', value: 'transit', action: () => handleTransitSelect() },
      ]);
    }, 400);
  };

  const handleMvisaSelect = (entry: string, duration: string) => {
    setVisaEntry(entry);
    setVisaDuration(duration);
    setTimeout(() => {
      addAIMessage(
        "Great! You'll need an **M Visa (Business)**. Let me check your documents next.",
        [
          { 
            label: 'Continue to Document Upload →', 
            value: 'continue', 
            action: () => navigate('/step/2') 
          },
        ]
      );
    }, 400);
  };

  const handleGvisaSelect = (duration: string) => {
    setVisaEntry('Transit');
    setVisaDuration(duration);
    setTimeout(() => {
      addAIMessage(
        "Great! You'll need a **G Visa (Transit)**. Let me check your documents next.",
        [
          { 
            label: 'Continue to Document Upload →', 
            value: 'continue', 
            action: () => navigate('/step/2') 
          },
        ]
      );
    }, 400);
  };

  const getRequiredDocsList = () => {
    if (state.visaType === 'M') {
      return [
        'Passport photo page (mandatory)',
        'Application photo (mandatory)',
        'Business invitation letter (mandatory)',
        'Previous Chinese visa copy (optional - if you have had a Chinese visa before)',
        'Residence permit (optional - if you are not a Philippine citizen)',
      ];
    }
    return [
      'Passport photo page (mandatory)',
      'Application photo (mandatory)',
      'Onward ticket to third country (mandatory)',
      'Previous Chinese visa copy (optional - if you have had a Chinese visa before)',
      'Residence permit (optional - if you are not a Philippine citizen)',
    ];
  };

  const showDocList = state.visaType !== null;

  return (
    <div className="step1-container">
      <div className="step1-header">
        <h2>Step 1: Visa Type Selection</h2>
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
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
        
        {showDocList && state.visaType !== null && (
          <div className="required-docs-card">
            <h3>📋 Required Documents</h3>
            <ul>
              {getRequiredDocsList().map((doc, i) => (
                <li key={i} className={doc.includes('(mandatory)') ? 'mandatory' : 'optional'}>
                  {doc}
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