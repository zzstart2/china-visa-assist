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
  const hasStarted = useRef(false); // Guard against React StrictMode double-invoke

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

  // Initialize field states + start chat on mount (guarded)
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    if (state.pendingFields.length > 0) {
      setFieldStates(state.pendingFields.map(path => ({ path, status: 'pending' })));
    }
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
      // Section 1
      'section1.familyName': { en: 'What is your family name (as shown on passport)?', zh: '您的姓氏（护照上的）：' },
      'section1.givenName': { en: 'What is your given name (as shown on passport)?', zh: '您的名字（护照上的）：' },
      'section1.birthDate': { en: 'What is your date of birth?', zh: '您的出生日期：' },
      'section1.gender': { en: 'What is your gender?', zh: '您的性别：' },
      'section1.birthCountry': { en: 'Which country were you born in?', zh: '您的出生国家：' },
      'section1.birthProvince': { en: 'Which province/state were you born in?', zh: '出生省份/州：' },
      'section1.birthCity': { en: 'Which city were you born in?', zh: '出生城市：' },
      'section1.maritalStatus': { en: 'What is your marital status?', zh: '您的婚姻状况：' },
      'section1.currentNationality': { en: 'What is your current nationality?', zh: '您的当前国籍：' },
      'section1.nationalIdNumber': { en: 'What is your national ID number? (type N/A if not applicable)', zh: '您的国籍国身份证号（无则输入 N/A）：' },
      'section1.hasOtherNationality': { en: 'Do you have any other nationality?', zh: '您是否有其他国籍？' },
      'section1.hasPermanentResident': { en: 'Do you have permanent resident status in any other country?', zh: '您是否拥有其他国家的永久居留权？' },
      'section1.hadOtherNationalities': { en: 'Have you ever had any other nationalities or resident status?', zh: '您是否曾拥有其他国籍或居留身份？' },
      'section1.passportType': { en: 'What type of passport do you hold?', zh: '您的护照类型：' },
      'section1.passportNumber': { en: 'What is your passport number?', zh: '您的护照号码：' },
      'section1.issuingCountry': { en: 'Which country issued your passport?', zh: '护照签发国：' },
      'section1.placeOfIssue': { en: 'Where was your passport issued?', zh: '护照签发地：' },
      'section1.passportExpiry': { en: 'When does your passport expire?', zh: '护照有效期至：' },
      // Section 2
      'section2.serviceType': { en: 'Do you need express or normal service?', zh: '您需要加急还是普通服务？' },
      // Section 3
      'section3.currentOccupation': { en: 'What is your current occupation?', zh: '您当前的职业：' },
      'section3.workHistory': { en: 'Please provide your most recent employer name.', zh: '请提供您最近的雇主名称：' },
      // Section 4
      'section4.entries': { en: 'What is your highest education level?', zh: '您的最高学历：' },
      // Section 5
      'section5.currentAddress': { en: 'What is your current home address?', zh: '请输入您当前的居住地址：' },
      'section5.phone': { en: 'What is your phone number?', zh: '请输入您的电话号码：' },
      'section5.mobilePhone': { en: 'What is your mobile phone number?', zh: '请输入您的手机号码：' },
      'section5.father': { en: "What is your father's full name?", zh: '您父亲的姓名：' },
      'section5.mother': { en: "What is your mother's full name?", zh: '您母亲的姓名：' },
      'section5.hasRelativesInChina': { en: 'Do you have any immediate relatives (other than parents) in China?', zh: '除父母外，您是否有直系亲属在中国？' },
      // Section 6
      'section6.itinerary': { en: 'What is your planned arrival date in China?', zh: '您计划什么时候到达中国？' },
      'section6.inviter.name': { en: 'Name of the inviting company/person in China?', zh: '在华邀请公司/人名称：' },
      'section6.inviter.phone': { en: 'Inviter phone number?', zh: '邀请人电话：' },
      'section6.inviter.relationship': { en: 'Your relationship with the inviter?', zh: '与邀请人关系：' },
      'section6.emergencyContact.familyName': { en: "Emergency contact's family name?", zh: '紧急联系人姓氏：' },
      'section6.emergencyContact.givenName': { en: "Emergency contact's given name?", zh: '紧急联系人名字：' },
      'section6.emergencyContact.relationship': { en: 'Emergency contact relationship to you?', zh: '紧急联系人与您的关系：' },
      'section6.emergencyContact.phone': { en: 'Emergency contact phone?', zh: '紧急联系人电话：' },
      'section6.travelPayBy': { en: 'Who will pay for this travel? (Self / Other / Organization)', zh: '旅行费用由谁承担？（Self / Other / Organization）' },
      'section6.sharePassport': { en: 'Are you traveling with someone who shares the same passport?', zh: '是否有人与您共用同一本护照旅行？' },
      // Section 7
      'section7.hasBeenToChina': { en: 'Have you ever been to China?', zh: '您是否曾到访过中国？' },
      'section7.hasChineseVisa': { en: 'Have you ever obtained a Chinese visa?', zh: '您是否曾获得过中国签证？' },
      'section7.hasOtherValidVisa': { en: 'Do you have any valid visas issued by other countries?', zh: '您是否持有其他国家的有效签证？' },
      'section7.hasTraveledLast12Months': { en: 'Have you traveled to any other country in the past 12 months?', zh: '过去12个月您是否出访过其他国家？' },
      // Section 8
      'section8.refusedVisa': { en: 'Have you ever been refused a Chinese visa or denied entry into China?', zh: '您是否曾被拒签或拒绝入境中国？' },
      'section8.canceledVisa': { en: 'Has your Chinese visa ever been canceled?', zh: '您的中国签证是否曾被注销？' },
      'section8.illegalEntry': { en: 'Have you ever entered China illegally, overstayed, or worked illegally?', zh: '您是否曾非法入境、逾期居留或非法工作？' },
      'section8.criminalRecord': { en: 'Do you have any criminal record in China or any other country?', zh: '您是否有犯罪记录？' },
      'section8.mentalOrInfectious': { en: 'Do you have any serious mental disorders or infectious diseases?', zh: '您是否患有严重精神疾病或传染病？' },
      'section8.visitedEpidemic': { en: 'Have you visited any epidemic areas in the past 30 days?', zh: '过去30天您是否到访过疫区？' },
      'section8.specialSkills': { en: 'Do you have any training in firearms, explosives, or NBC fields?', zh: '您是否接受过枪械、爆炸物或核生化领域的培训？' },
      'section8.militaryService': { en: 'Are you serving or have you ever served in the military?', zh: '您是否正在服役或曾经服役？' },
      'section8.paramilitaryOrg': { en: 'Have you ever participated in any paramilitary or rebel organization?', zh: '您是否曾参与准军事或武装组织？' },
      'section8.charitableOrg': { en: 'Have you worked for any professional, social, or charitable organization?', zh: '您是否在专业/社会/慈善机构工作过？' },
      'section8.otherDeclaration': { en: 'Is there anything else you want to declare?', zh: '您是否有其他需要申报的事项？' },
      // Section 9
      'section9.filledBy': { en: 'Who is filling in this form? (applicant / representative)', zh: '谁在填写此表？（申请人本人 / 代填人）' },
      'section9.agreed': { en: 'Do you understand and agree with the declaration? (yes / no)', zh: '您是否理解并同意声明条款？（yes / no）' },
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
      // Section 1
      'section1.familyName': { en: 'Family Name', zh: '姓' },
      'section1.givenName': { en: 'Given Name', zh: '名' },
      'section1.birthDate': { en: 'Birth Date', zh: '出生日期' },
      'section1.gender': { en: 'Gender', zh: '性别' },
      'section1.birthCountry': { en: 'Birth Country', zh: '出生国' },
      'section1.birthProvince': { en: 'Birth Province', zh: '出生省' },
      'section1.birthCity': { en: 'Birth City', zh: '出生城市' },
      'section1.maritalStatus': { en: 'Marital Status', zh: '婚姻状况' },
      'section1.currentNationality': { en: 'Nationality', zh: '国籍' },
      'section1.nationalIdNumber': { en: 'National ID', zh: '身份证号' },
      'section1.hasOtherNationality': { en: 'Other Nationality', zh: '其他国籍' },
      'section1.hasPermanentResident': { en: 'Perm. Resident', zh: '永居' },
      'section1.hadOtherNationalities': { en: 'Former Nationality', zh: '曾有国籍' },
      'section1.passportType': { en: 'Passport Type', zh: '护照类型' },
      'section1.passportNumber': { en: 'Passport No.', zh: '护照号' },
      'section1.issuingCountry': { en: 'Issuing Country', zh: '签发国' },
      'section1.placeOfIssue': { en: 'Place of Issue', zh: '签发地' },
      'section1.passportExpiry': { en: 'Passport Expiry', zh: '护照有效期' },
      // Section 2
      'section2.serviceType': { en: 'Service Type', zh: '服务类型' },
      // Section 3
      'section3.currentOccupation': { en: 'Occupation', zh: '职业' },
      'section3.workHistory': { en: 'Work History', zh: '工作经历' },
      // Section 4
      'section4.entries': { en: 'Education', zh: '学历' },
      // Section 5
      'section5.currentAddress': { en: 'Address', zh: '地址' },
      'section5.phone': { en: 'Phone', zh: '电话' },
      'section5.mobilePhone': { en: 'Mobile', zh: '手机' },
      'section5.father': { en: 'Father', zh: '父亲' },
      'section5.mother': { en: 'Mother', zh: '母亲' },
      'section5.hasRelativesInChina': { en: 'Relatives in CN', zh: '在华亲属' },
      // Section 6
      'section6.itinerary': { en: 'Itinerary', zh: '行程' },
      'section6.inviter.name': { en: 'Inviter', zh: '邀请人' },
      'section6.inviter.phone': { en: 'Inviter Tel', zh: '邀请人电话' },
      'section6.inviter.relationship': { en: 'Inviter Rel.', zh: '邀请人关系' },
      'section6.emergencyContact.familyName': { en: 'Emergency Name', zh: '紧急联系人姓' },
      'section6.emergencyContact.givenName': { en: 'Emergency Given', zh: '紧急联系人名' },
      'section6.emergencyContact.relationship': { en: 'Emergency Rel.', zh: '紧急关系' },
      'section6.emergencyContact.phone': { en: 'Emergency Tel', zh: '紧急电话' },
      'section6.travelPayBy': { en: 'Travel Pay', zh: '费用承担' },
      'section6.sharePassport': { en: 'Share Passport', zh: '共用护照' },
      // Section 7
      'section7.hasBeenToChina': { en: 'Been to China', zh: '到访过中国' },
      'section7.hasChineseVisa': { en: 'Had CN Visa', zh: '曾获中国签证' },
      'section7.hasOtherValidVisa': { en: 'Other Visa', zh: '其他有效签证' },
      'section7.hasTraveledLast12Months': { en: 'Recent Travel', zh: '近期出访' },
      // Section 8
      'section8.refusedVisa': { en: '8.1 Refused', zh: '8.1 拒签' },
      'section8.canceledVisa': { en: '8.2 Canceled', zh: '8.2 注销' },
      'section8.illegalEntry': { en: '8.3 Illegal Entry', zh: '8.3 非法入境' },
      'section8.criminalRecord': { en: '8.4 Criminal', zh: '8.4 犯罪记录' },
      'section8.mentalOrInfectious': { en: '8.5 Health', zh: '8.5 健康' },
      'section8.visitedEpidemic': { en: '8.6 Epidemic', zh: '8.6 疫区' },
      'section8.specialSkills': { en: '8.7 Special Skills', zh: '8.7 特殊技能' },
      'section8.militaryService': { en: '8.8 Military', zh: '8.8 服役' },
      'section8.paramilitaryOrg': { en: '8.9 Paramilitary', zh: '8.9 武装组织' },
      'section8.charitableOrg': { en: '8.10 Charitable', zh: '8.10 慈善机构' },
      'section8.otherDeclaration': { en: '8.11 Other', zh: '8.11 其他' },
      // Section 9
      'section9.filledBy': { en: 'Filled By', zh: '填表人' },
      'section9.agreed': { en: 'Declaration', zh: '声明确认' },
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
