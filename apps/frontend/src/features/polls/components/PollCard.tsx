import React, { useState } from 'react';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVote?: string;
  endsAt: string;
}

interface PollCardProps {
  poll: Poll;
  onVote: (optionId: string) => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onVote }) => {
  const [currentTime] = useState(() => Date.now());
  const hasVoted = !!poll.userVote;
  const timeLeft = new Date(poll.endsAt).getTime() - currentTime;
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const isExpired = timeLeft <= 0;

  return (
    <div className="bg-bg-secondary rounded-xl p-4 border border-border-primary">
      <h4 className="font-bold text-text-primary mb-4">{poll.question}</h4>

      <div className="space-y-2 mb-4">
        {poll.options.map((option) => {
          const percentage = poll.totalVotes > 0 
            ? Math.round((option.votes / poll.totalVotes) * 100) 
            : 0;
          const isVoted = poll.userVote === option.id;

          return (
            <button
              key={option.id}
              onClick={() => !hasVoted && !isExpired && onVote(option.id)}
              disabled={hasVoted || isExpired}
              className={`w-full relative overflow-hidden rounded-xl p-4 text-left transition-all ${
                hasVoted || isExpired
                  ? 'cursor-default'
                  : 'hover:bg-bg-tertiary cursor-pointer'
              } ${
                isVoted 
                  ? 'bg-primary/20 border-2 border-primary' 
                  : 'bg-bg-card border border-border-primary'
              }`}
            >
              {/* Progress Bar */}
              {(hasVoted || isExpired) && (
                <div
                  className={`absolute left-0 top-0 h-full transition-all ${
                    isVoted ? 'bg-primary/30' : 'bg-primary-light'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Content */}
              <div className="relative flex justify-between items-center">
                <span className={`font-medium ${isVoted ? 'text-primary' : 'text-text-primary'}`}>
                  {option.text}
                </span>
                {(hasVoted || isExpired) && (
                  <span className="text-sm font-bold text-text-primary">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>{poll.totalVotes} votes</span>
        <span>
          {isExpired ? (
            'Poll ended'
          ) : hoursLeft > 0 ? (
            `${hoursLeft}h left`
          ) : (
            'Less than 1h left'
          )}
        </span>
      </div>
    </div>
  );
};

export default PollCard;
