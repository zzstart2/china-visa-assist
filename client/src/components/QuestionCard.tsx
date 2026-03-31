import { useState } from 'react';
import FormField, { type FieldType } from './FormField';
import './QuestionCard.css';

interface Question {
  id: string;
  text: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

interface QuestionCardProps {
  question: Question;
  value?: string | string[] | boolean;
  onAnswer?: (value: string | string[] | boolean) => void;
  isAnswered?: boolean;
}

function QuestionCard({ question, value, onAnswer, isAnswered = false }: QuestionCardProps) {
  const [answer, setAnswer] = useState<string | string[] | boolean | undefined>(value);

  const handleChange = (newValue: string | string[] | boolean) => {
    setAnswer(newValue);
    onAnswer?.(newValue);
  };

  return (
    <div className={`question-card ${isAnswered ? 'answered' : ''}`}>
      <div className="qc-header">
        <span className="qc-avatar">🤖</span>
        <span className="qc-label">Question</span>
      </div>
      <div className="qc-question">{question.text}</div>
      <div className="qc-answer">
        <FormField
          type={question.type}
          name={question.id}
          value={answer}
          options={question.options}
          placeholder={question.placeholder}
          required={question.required}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default QuestionCard;