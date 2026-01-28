import React, { useEffect, useState } from 'react';

interface VibeScoreProps {
  score: number;
  animate?: boolean;
}

const VibeScore: React.FC<VibeScoreProps> = ({ score, animate = false }) => {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (animate) {
      let current = 0;
      const increment = score / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(timer);
    }
    // When not animating, displayScore is already initialized correctly
  }, [score, animate]);

  const getVibeLevel = (score: number) => {
    if (score >= 2000) return { level: 'Elite', color: 'from-purple-500 to-pink-500' };
    if (score >= 1000) return { level: 'Pro', color: 'from-orange-500 to-red-500' };
    if (score >= 500) return { level: 'Rising', color: 'from-yellow-500 to-orange-500' };
    return { level: 'Newbie', color: 'from-blue-500 to-cyan-500' };
  };

  const { level, color } = getVibeLevel(score);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative bg-gradient-to-br ${color} rounded-2xl p-0.5 shadow-lg`}>
        <div className="bg-bg-primary rounded-2xl px-6 py-3 flex flex-col items-center">
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">
            {displayScore.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {level}
          </span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium text-text-secondary">Vibe Score</span>
    </div>
  );
};

export default VibeScore;
