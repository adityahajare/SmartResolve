import React, { useState, useEffect } from 'react';
import { differenceInMinutes, differenceInHours } from 'date-fns';

export const SLACountdown = ({ deadline, breached = false }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!deadline) {
      setTimeLeft('No SLA');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const target = new Date(deadline);
      const minsDiff = differenceInMinutes(target, now);
      const hoursDiff = differenceInHours(target, now);

      if (minsDiff <= 0 || breached) {
        setTimeLeft('SLA Breached');
        setIsUrgent(true);
      } else if (hoursDiff < 2) {
        setTimeLeft(`${minsDiff}m left`);
        setIsUrgent(true);
      } else {
        setTimeLeft(`${hoursDiff}h left`);
        setIsUrgent(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [deadline, breached]);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
        isUrgent ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-slate-100 text-slate-700'
      }`}
    >
      ⏱️ {timeLeft}
    </span>
  );
};
