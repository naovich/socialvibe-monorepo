import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  userVote?: string;
  expiresAt?: string;
  onVote: (optionId: string) => void;
  allowMultiple?: boolean;
}

const Poll: React.FC<PollProps> = ({
  question,
  options,
  totalVotes,
  hasVoted,
  userVote,
  expiresAt,
  onVote,
  allowMultiple = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    userVote ? new Set([userVote]) : new Set()
  );

  const handleVote = (optionId: string) => {
    if (hasVoted) return;

    if (allowMultiple) {
      const newSelected = new Set(selectedOptions);
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId);
      } else {
        newSelected.add(optionId);
      }
      setSelectedOptions(newSelected);
    } else {
      setSelectedOptions(new Set([optionId]));
      onVote(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.size > 0) {
      onVote(Array.from(selectedOptions)[0]);
    }
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const isExpired = Boolean(
    expiresAt && new Date(expiresAt) < new Date()
  );

  const sortedOptions = hasVoted
    ? [...options].sort((a, b) => b.votes - a.votes)
    : options;

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-4">
      {/* Question */}
      <h3 className="font-semibold text-text-primary mb-4">{question}</h3>

      {/* Options */}
      <div className="space-y-3 mb-4">
        {sortedOptions.map((option, index) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOptions.has(option.id);
          const isUserVote = userVote === option.id;

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || isExpired}
              className={`w-full relative overflow-hidden rounded-xl transition-all ${
                hasVoted || isExpired
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-[1.02]'
              }`}
            >
              {/* Background Bar (Results) */}
              {(hasVoted || isExpired) && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`absolute inset-y-0 left-0 ${
                    isUserVote
                      ? 'bg-primary/20'
                      : 'bg-white/5'
                  }`}
                />
              )}

              {/* Content */}
              <div
                className={`relative flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                  isSelected && !hasVoted
                    ? 'border-primary bg-primary/10'
                    : 'border-border-primary'
                } ${
                  isUserVote
                    ? 'border-primary'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox/Radio */}
                  {!hasVoted && !isExpired && (
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-border-primary'
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-text-primary" />}
                    </div>
                  )}

                  <span className="font-medium text-text-primary text-left">
                    {option.text}
                  </span>
                </div>

                {/* Percentage (Results) */}
                {(hasVoted || isExpired) && (
                  <div className="flex items-center gap-2">
                    {isUserVote && (
                      <Check size={16} className="text-primary" />
                    )}
                    <span className="font-bold text-text-primary">
                      {percentage}%
                    </span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
        {expiresAt && (
          <span>
            {isExpired ? 'Poll ended' : `Ends ${new Date(expiresAt).toLocaleDateString()}`}
          </span>
        )}
      </div>

      {/* Submit Button (for multiple choice) */}
      {allowMultiple && !hasVoted && !isExpired && selectedOptions.size > 0 && (
        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-2 bg-primary hover:bg-primary-hover rounded-xl text-text-primary font-semibold transition-colors"
        >
          Submit Vote
        </button>
      )}
    </div>
  );
};

export default Poll;
