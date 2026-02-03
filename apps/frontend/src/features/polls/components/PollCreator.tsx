import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface PollCreatorProps {
  onCreatePoll: (question: string, options: string[], duration: number) => void;
  onCancel?: () => void;
}

const PollCreator: React.FC<PollCreatorProps> = ({ onCreatePoll, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(24); // hours

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = () => {
    const validOptions = options.filter(opt => opt.trim());
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll(question.trim(), validOptions, duration);
    }
  };

  const isValid = question.trim() && options.filter(opt => opt.trim()).length >= 2;

  return (
    <div className="bg-bg-secondary rounded-xl p-4 border border-border-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary">Create Poll</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Question */}
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        className="w-full bg-bg-card border border-border-primary rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
        maxLength={200}
      />

      {/* Options */}
      <div className="space-y-2 mb-4">
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1 bg-bg-card border border-border-primary rounded-xl px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              maxLength={100}
            />
            {options.length > 2 && (
              <button
                onClick={() => removeOption(index)}
                className="p-2 text-text-muted hover:text-error transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Option Button */}
      {options.length < 4 && (
        <button
          onClick={addOption}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary-hover font-medium transition-colors mb-4"
        >
          <Plus size={18} />
          Add Option
        </button>
      )}

      {/* Duration */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-text-muted">Poll duration:</span>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="bg-bg-card border border-border-primary rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value={1}>1 hour</option>
          <option value={6}>6 hours</option>
          <option value={12}>12 hours</option>
          <option value={24}>1 day</option>
          <option value={72}>3 days</option>
          <option value={168}>1 week</option>
        </select>
      </div>

      {/* Create Button */}
      <button
        onClick={handleCreate}
        disabled={!isValid}
        className="w-full py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-bold rounded-xl transition-all"
      >
        Create Poll
      </button>
    </div>
  );
};

export default PollCreator;
