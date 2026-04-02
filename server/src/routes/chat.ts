import { Router, Request, Response } from 'express';
import { chatSessions, aiChatSessions } from '../services/chatSession';
import { generateQuestion } from '../services/llm';
import { runFieldValidation } from '../validation';
import { mVisaQuestions, gVisaQuestions } from '../data/questionBanks';
import { fieldMeta } from '../data/fieldMeta';

const router = Router();

// Legacy structured chat — start
router.post('/api/chat/start', (req: Request, res: Response) => {
  const { visaType } = req.body;
  const sessionId = `session_${Date.now()}`;
  const questions = visaType === 'G' ? gVisaQuestions : mVisaQuestions;

  chatSessions[sessionId] = {
    visaType: visaType || 'M',
    currentQuestionIndex: 0,
    answers: {},
    questions,
  };

  const firstQ = questions[0];
  res.json({
    sessionId,
    question: firstQ.question,
    type: firstQ.type,
    options: firstQ.options,
    field: firstQ.field,
    section: firstQ.section,
    progress: Math.round(100 / questions.length),
  });
});

// Legacy structured chat — reply
router.post('/api/chat/reply', (req: Request, res: Response) => {
  const { sessionId, answer } = req.body;
  const session = chatSessions[sessionId];

  if (!session) {
    return res.status(400).json({ error: 'Invalid session' });
  }

  const currentQ = session.questions[session.currentQuestionIndex];
  session.answers[currentQ.field] = answer;
  session.currentQuestionIndex++;

  if (session.currentQuestionIndex >= session.questions.length) {
    return res.json({
      done: true,
      complete: true,
      totalQuestions: session.questions.length,
      progress: 100,
      summary: session.answers,
    });
  }

  const nextQ = session.questions[session.currentQuestionIndex];
  res.json({
    question: nextQ.question,
    type: nextQ.type,
    options: nextQ.options,
    field: nextQ.field,
    section: nextQ.section,
    progress: Math.round(((session.currentQuestionIndex + 1) / session.questions.length) * 100),
  });
});

// AI chat — start or continue
router.post('/api/chat/ai', async (req: Request, res: Response) => {
  const { sessionId, pendingFields, language, field, value } = req.body;

  // ── Start new session ──
  if (!field && pendingFields) {
    const sid = sessionId || `ai_${Date.now()}`;
    aiChatSessions[sid] = {
      pendingFields: pendingFields || [],
      filledFields: {},
      currentFieldIdx: 0,
      language: language || 'en',
    };

    const session = aiChatSessions[sid];
    if (session.pendingFields.length === 0) {
      return res.json({ done: true, sessionId: sid, progress: 100 });
    }

    const firstField = session.pendingFields[0];
    const meta = fieldMeta[firstField];
    const question = await generateQuestion(firstField, meta, session, true);

    return res.json({
      sessionId: sid,
      field: firstField,
      question: question.text,
      type: meta?.type || 'text',
      options: meta?.options,
      progress: 0,
      totalFields: session.pendingFields.length,
    });
  }

  // ── Reply to a question ──
  const session = aiChatSessions[sessionId];
  if (!session) {
    return res.status(400).json({ error: 'Invalid session' });
  }

  const lang = (session.language === 'zh' ? 'zh' : 'en') as 'en' | 'zh';
  const validation = runFieldValidation(field, value, session.filledFields, lang);

  if (validation.status === 'fail') {
    const meta = fieldMeta[field];
    return res.json({
      field,
      question: validation.message,
      type: meta?.type || 'text',
      options: meta?.options,
      validation,
      progress: Math.round((Object.keys(session.filledFields).length / session.pendingFields.length) * 100),
      done: false,
    });
  }

  session.filledFields[field] = value;
  session.currentFieldIdx = session.pendingFields.indexOf(field) + 1;

  const remaining = session.pendingFields.filter(f => !session.filledFields[f]);
  if (remaining.length === 0) {
    return res.json({
      done: true,
      formData: session.filledFields,
      progress: 100,
      validation,
    });
  }

  const nextField = remaining[0];
  const meta = fieldMeta[nextField];
  const question = await generateQuestion(nextField, meta, session, false);

  res.json({
    field: nextField,
    question: question.text,
    type: meta?.type || 'text',
    options: meta?.options,
    validation,
    progress: Math.round((Object.keys(session.filledFields).length / session.pendingFields.length) * 100),
    done: false,
  });
});

export default router;
