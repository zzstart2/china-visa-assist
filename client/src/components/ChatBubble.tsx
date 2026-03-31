import './ChatBubble.css';

interface ChatBubbleProps {
  role: 'ai' | 'user';
  content: string;
  timestamp?: string;
}

function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isAI = role === 'ai';
  
  return (
    <div className={`chat-bubble ${isAI ? 'ai' : 'user'}`}>
      <div className="bubble-avatar">
        {isAI ? '🤖' : '👤'}
      </div>
      <div className="bubble-content">
        <div className="bubble-message">{content}</div>
        {timestamp && <div className="bubble-time">{timestamp}</div>}
      </div>
    </div>
  );
}

export default ChatBubble;