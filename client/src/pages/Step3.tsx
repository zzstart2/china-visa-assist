import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisa } from '../context/VisaContext';
import ChatBubble from '../components/ChatBubble';
import './Step3.css';

const API = import.meta.env.VITE_API_URL || '';

interface ChatMessage {
  role: 'ai' | 'user';
  content: string;
}

interface FieldState {
  path: string;
  status: 'pending' | 'current' | 'filled';
  value?: string;
}

function Step3() {
  const navigate = useNavigate();
  const { state, updateField, markFieldFilled } = useVisa();
  const lang = state.language;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [currentField, setCurrentField] = useState('');
  const [inputType, setInputType] = useState<'text' | 'select' | 'date'>('text');
  const [options, setOptions] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [dateValue, setDateValue] = useState({ year: '', month: '', day: '' });
  const [fieldStates, setFieldStates] = useState<FieldState[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when question appears
  useEffect(() => {
    if (currentField && inputType === 'text' && !isTyping) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentField, isTyping, inputType]);

  // Initialize field states from pendingFields
  useEffect(() => {
    if (state.pendingFields.length > 0) {
      setFieldStates(state.pendingFields.map(path => ({ path, status: 'pending' })));
    }
  }, []);

  // Start chat on mount
  useEffect(() => {
    startChat();
  }, []);

  const startChat = async () => {
    setIsLoading(true);
    const pending = state.pendingFields;

    if (pending.length === 0) {
      setMessages([{ role: 'ai', content: lang === 'en'
        ? '✅ All fields are already filled! You can proceed to review.'
        : '✅ 所有字段已填写完毕！可以进入确认页面。' }]);
      setIsDone(true);
      setProgress(100);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/chat/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingFields: pending,
          language: lang,
        }),
      });
      const data = await res.json();
      handleResponse(data, true);
    } catch {
      // Fallback: use local mock
      fallbackStart(pending);
    }
    setIsLoading(false);
  };

  const fallbackStart = (pending: string[]) => {
    const sid = `local_${Date.now()}`;
    setSessionId(sid);
    if (pending.length === 0) {
      setIsDone(true);
      return;
    }
    const field = pending[0];
    showQuestion(field, getLocalQuestion(field), 'text', undefined, 0);
  };

  const handleResponse = (data: any, _isStart = false) => {
    if (data.sessionId) setSessionId(data.sessionId);
    if (data.progress !== undefined) setProgress(data.progress);

    if (data.done) {
      // Apply all filled data to form
      if (data.formData) {
        Object.entries(data.formData).forEach(([path, value]) => {
          updateField(path, value);
          markFieldFilled(path);
        });
      }
      setFieldStates(prev => prev.map(f => ({ ...f, status: 'filled' })));
      setIsDone(true);
      setProgress(100);
      addAIMessage(lang === 'en'
        ? '✅ All information collected! You can now review and confirm.'
        : '✅ 所有信息已收集完毕！请进入确认页面查看。');
      return;
    }

    // Validation failure — re-ask
    if (data.validation?.status === 'fail') {
      addAIMessage(`⚠️ ${data.validation.message}`);
    }

    if (data.field) {
      showQuestion(data.field, data.question, data.type || 'text', data.options, data.progress || 0);
      // Update field states
      setFieldStates(prev => prev.map(f => ({
        ...f,
        status: f.path === data.field ? 'current' : (f.status === 'filled' ? 'filled' : 'pending'),
      })));
    }
  };

  const showQuestion = (field: string, question: string, type: string, opts: string[] | undefined, prog: number) => {
    setCurrentField(field);
    setInputType(type as 'text' | 'select' | 'date');
    setOptions(opts || []);
    setProgress(prog);
    setUserInput('');
    setDateValue({ year: '', month: '', day: '' });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addAIMessage(question);
    }, 400);
  };

  const addAIMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'ai', content }]);
  };

  const handleSubmit = async (answer: string) => {
    if (!answer.trim() || isLoading) return;

    // User message
    setMessages(prev => [...prev, { role: 'user', content: answer }]);

    // Update field in context immediately
    updateField(currentField, answer);

    // Mark field as filled in sidebar
    setFieldStates(prev => prev.map(f =>
      f.path === currentField ? { ...f, status: 'filled', value: answer } : f
    ));

    setCurrentField('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API}/api/chat/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          field: currentField,
          value: answer,
          language: lang,
        }),
      });
      const data = await res.json();
      handleResponse(data);
    } catch {
      // Fallback: local progression
      fallbackReply(answer);
    }

    setIsLoading(false);
  };

  const fallbackReply = (_answer: string) => {
    markFieldFilled(currentField);
    const remaining = fieldStates.filter(f => f.status === 'pending');
    if (remaining.length === 0) {
      setIsDone(true);
      setProgress(100);
      addAIMessage(lang === 'en' ? '✅ All done!' : '✅ 全部完成！');
      return;
    }
    const next = remaining[0];
    showQuestion(next.path, getLocalQuestion(next.path), 'text', undefined,
      Math.round(((fieldStates.length - remaining.length) / fieldStates.length) * 100));
  };

  const getLocalQuestion = (field: string): string => {
    const map: Record<string, { en: string; zh: string }> = {
      'section5.currentAddress': { en: 'What is your current home address?', zh: '请输入您当前的居住地址：' },
      'section5.phone': { en: 'What is your phone number?', zh: '请输入您的电话号码：' },
      'section5.mobilePhone': { en: 'What is your mobile phone number?', zh: '请输入您的手机号码：' },
      'section5.email': { en: 'What is your email address?', zh: '请输入您的电子邮箱：' },
      'section6.inviter.name': { en: 'Name of the inviting person/organization in China?', zh: '在华邀请人/机构名称：' },
      'section6.inviter.phone': { en: 'Inviter phone number?', zh: '邀请人电话：' },
      'section6.inviter.relationship': { en: 'Your relationship with the inviter?', zh: '与邀请人关系：' },
      'section6.emergencyContact.familyName': { en: 'Emergency contact name?', zh: '紧急联系人姓名：' },
      'section6.emergencyContact.phone': { en: 'Emergency contact phone?', zh: '紧急联系人电话：' },
      'section6.emergencyContact.relationship': { en: 'Emergency contact relationship?', zh: '紧急联系人关系：' },
      'section6.travelPayBy': { en: 'Who will pay for this travel? (Self / Other / Organization)', zh: '旅行费用由谁承担？（Self / Other / Organization）' },
      'section4.entries': { en: 'Highest education level? (High school / Bachelor / Master / Doctoral / Other)', zh: '最高学历？（高中/本科/硕士/博士/其他）' },
    };
    return map[field]?.[lang] || field;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(userInput.trim());
    }
  };

  const handleDateSubmit = () => {
    const { year, month, day } = dateValue;
    if (!year || !month || !day) return;
    handleSubmit(`${year}-${month}-${day}`);
  };

  const getFieldLabel = (path: string): string => {
    const labels: Record<string, { en: string; zh: string }> = {
      'section5.currentAddress': { en: 'Address', zh: '地址' },
      'section5.phone': { en: 'Phone', zh: '电话' },
      'section5.mobilePhone': { en: 'Mobile', zh: '手机' },
      'section5.email': { en: 'Email', zh: '邮箱' },
      'section6.inviter.name': { en: 'Inviter', zh: '邀请人' },
      'section6.inviter.phone': { en: 'Inviter Tel', zh: '邀请人电话' },
      'section6.inviter.relationship': { en: 'Relationship', zh: '关系' },
      'section6.emergencyContact.familyName': { en: 'Emergency', zh: '紧急联系人' },
      'section6.emergencyContact.phone': { en: 'Emergency Tel', zh: '紧急电话' },
      'section6.emergencyContact.relationship': { en: 'Emergency Rel', zh: '紧急关系' },
      'section6.travelPayBy': { en: 'Travel Pay', zh: '费用承担' },
      'section4.entries': { en: 'Education', zh: '学历' },
    };
    return labels[path]?.[lang] || path.split('.').pop() || path;
  };

  return (
    <div className="step3-container">
      {/* Progress bar */}
      <div className="step3-progress-bar">
        <div className="step3-progress-fill" style={{ width: `${progress}%` }} />
        <span className="step3-progress-text">{progress}%</span>
      </div>

      <div className="step3-layout">
        {/* Field sidebar */}
        <aside className="step3-sidebar">
          <h4>{lang === 'en' ? 'Fields' : '字段进度'}</h4>
          <div className="field-list">
            {fieldStates.map((f, i) => (
              <div key={i} className={`field-item ${f.status}`}>
                <span className="field-icon">
                  {f.status === 'filled' ? '✅' : f.status === 'current' ? '✏️' : '○'}
                </span>
                <span className="field-label">{getFieldLabel(f.path)}</span>
                {f.value && <span className="field-value">{f.value.length > 15 ? f.value.slice(0, 15) + '…' : f.value}</span>}
              </div>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <main className="step3-main">
          <div className="chat-scroll-area">
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} content={msg.content} />
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            )}
            {isLoading && !isTyping && (
              <div className="loading-indicator">{lang === 'en' ? 'Thinking...' : '思考中...'}</div>
            )}
            {isDone && (
              <div className="complete-section">
                <button onClick={() => navigate('/step/4')} className="review-button">
                  {lang === 'en' ? 'Review & Confirm →' : '确认信息 →'}
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input dock */}
          {currentField && !isTyping && !isDone && (
            <div className="input-dock">
              {inputType === 'text' && (
                <div className="text-input-row">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={lang === 'en' ? 'Type your answer...' : '输入您的回答...'}
                    className="chat-input"
                  />
                  <button
                    onClick={() => handleSubmit(userInput.trim())}
                    disabled={!userInput.trim() || isLoading}
                    className="send-btn"
                  >
                    ➤
                  </button>
                </div>
              )}

              {inputType === 'select' && (
                <div className="options-row">
                  {options.map((opt, i) => (
                    <button key={i} onClick={() => handleSubmit(opt)} disabled={isLoading} className="option-pill">
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {inputType === 'date' && (
                <div className="date-row">
                  <input
                    type="text"
                    value={dateValue.year}
                    onChange={e => setDateValue({ ...dateValue, year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="YYYY"
                    className="date-seg"
                    maxLength={4}
                  />
                  <span>/</span>
                  <select value={dateValue.month} onChange={e => setDateValue({ ...dateValue, month: e.target.value })} className="date-seg">
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => <option key={i} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>)}
                  </select>
                  <span>/</span>
                  <select value={dateValue.day} onChange={e => setDateValue({ ...dateValue, day: e.target.value })} className="date-seg">
                    <option value="">DD</option>
                    {Array.from({ length: 31 }, (_, i) => <option key={i} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>)}
                  </select>
                  <button onClick={handleDateSubmit} disabled={!dateValue.year || !dateValue.month || !dateValue.day} className="send-btn">
                    ✓
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
