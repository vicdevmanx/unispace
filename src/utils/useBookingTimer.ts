import React from 'react';
import { differenceInSeconds, addMinutes, isAfter } from 'date-fns';

// Utility to convert duration and unit to minutes
export function durationToMinutes(duration: number, unit: string): number {
  switch (unit?.toLowerCase?.()) {
    case 'minute':
    case 'minutes':
      return duration;
    case 'hour':
    case 'hours':
      return duration * 60;
    case 'day':
    case 'days':
      return duration * 1440;
    case 'week':
    case 'weeks':
      return duration * 10080;
    case 'month':
    case 'months':
      return Math.round(duration * 43800); // average month
    case 'year':
    case 'years':
      return duration * 525600;
    default:
      return duration; // fallback to minutes
  }
}

export function useBookingTimer(startTime: string, duration: number, durationUnit?: string, paused?: boolean, pausedAt?: string | null) {
  const [now, setNow] = React.useState<Date>(new Date());
  React.useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [paused]);
  let start = new Date(startTime);
  // If paused and pausedAt is set, freeze timer at pausedAt
  let effectiveNow = now;
  if (paused && pausedAt) {
    effectiveNow = new Date(pausedAt);
  }
  // Use durationToMinutes for correct calculation
  const minutes = durationToMinutes(duration, durationUnit || 'minutes');
  const end = addMinutes(start, minutes);
  const graceEnd = addMinutes(end, 15);
  let phase: 'active' | 'grace' | 'overtime' = 'active';
  if (isAfter(effectiveNow, end) && !isAfter(effectiveNow, graceEnd)) phase = 'grace';
  if (isAfter(effectiveNow, graceEnd)) phase = 'overtime';
  const secondsLeft = phase === 'active'
    ? Math.max(0, differenceInSeconds(end, effectiveNow))
    : phase === 'grace'
    ? Math.max(0, differenceInSeconds(graceEnd, effectiveNow))
    : differenceInSeconds(effectiveNow, graceEnd);
  return { phase, secondsLeft, end, graceEnd, now };
}