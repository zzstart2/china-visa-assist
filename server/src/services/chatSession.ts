/**
 * In-memory chat session storage.
 * Extension point: replace with database (Redis, Postgres, etc.).
 */
import { ChatSession, AIChatSession } from '../types';

/** Legacy structured-chat sessions (Step 3 Q&A flow) */
export const chatSessions: Record<string, ChatSession> = {};

/** AI chat sessions (MiniMax-powered conversational flow) */
export const aiChatSessions: Record<string, AIChatSession> = {};
