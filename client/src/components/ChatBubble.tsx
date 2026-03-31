import { useEffect, useRef } from 'react';
import './ChatBubble.css';

interface ChatBubbleProps {
  role: 'ai' | 'user';
  content: string;
  timestamp?: string;
}

function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isAI = role === 'ai';
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bubbleRef.current;
    if (el) {
      el.classList.add('bubble-enter');
    }
  }, []);

  return (
    <div className={`chat-bubble ${isAI ? 'ai' : 'user'}`} ref={bubbleRef}>
      <div className="bubble-avatar">
        {isAI ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="9" cy="16" r="1" />
            <circle cx="15" cy="16" r="1" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
      <div className="bubble-body">
        <div className="bubble-message">{content}</div>
        {timestamp && <span className="bubble-time">{timestamp}</span>}
      </div>
    </div>
  );
}

export default ChatBubble;
