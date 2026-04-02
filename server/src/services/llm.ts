/**
 * LLM integration for conversational question generation.
 * Extension point: swap MiniMax for any Anthropic-compatible API.
 */
import { AIChatSession, FieldMetaEntry } from '../types';

/**
 * Generate a conversational question for the given field.
 * Falls back to static label when MiniMax API key is absent.
 */
export async function generateQuestion(
  field: string,
  meta: FieldMetaEntry | undefined,
  session: AIChatSession,
  isFirst: boolean,
): Promise<{ text: string }> {
  const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;

  if (!MINIMAX_API_KEY || !meta) {
    const text = session.language === 'zh' ? (meta?.labelZh || field) : (meta?.labelEn || field);
    return { text };
  }

  try {
    const filledSummary = Object.entries(session.filledFields)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    const systemPrompt = session.language === 'zh'
      ? `你是中国签证申请助手，正在帮助菲律宾商务签（M签）申请人补充申请表信息。
已填写的字段：
${filledSummary || '（暂无）'}
现在需要询问字段：${field}（${meta.labelZh}）
只问一个简短自然的问题（1-2句话）。不要列出选项，不要解释字段含义。像朋友聊天一样问。`
      : `You are a China visa application assistant helping a Philippine M-visa (business) applicant.
Already filled:
${filledSummary || '(none yet)'}
Now ask about: ${field} (${meta.labelEn})
Ask ONE short, natural question (1-2 sentences max). Do NOT list options or explain the field. Be conversational.`;

    const response = await fetch('https://api.minimaxi.com/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': MINIMAX_API_KEY,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.5',
        max_tokens: 200,
        system: systemPrompt,
        messages: [
          { role: 'user', content: isFirst ? 'Please start asking.' : 'Next question please.' },
        ],
      }),
    });

    const data: any = await response.json();
    const text = data?.content?.find((c: any) => c.type === 'text')?.text;
    if (text) return { text };
  } catch (e) {
    console.error('MiniMax API error:', e);
  }

  const text = session.language === 'zh' ? (meta?.labelZh || field) : (meta?.labelEn || field);
  return { text };
}
