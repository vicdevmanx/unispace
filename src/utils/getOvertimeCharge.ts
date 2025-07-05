export function getOvertimeCharge({ totalPrice, duration, durationUnit, secondsOvertime, fallbackUnitPrice }) {
  const perUnit = totalPrice > 0 ? totalPrice / duration : fallbackUnitPrice || 0;
  let overtimeUnits = 0;
  switch ((durationUnit || '').toLowerCase()) {
    case 'minute':
    case 'minutes':
      overtimeUnits = Math.ceil(secondsOvertime / 60);
      break;
    case 'hour':
    case 'hours':
      overtimeUnits = Math.ceil(secondsOvertime / 3600);
      break;
    case 'day':
    case 'days':
      overtimeUnits = Math.ceil(secondsOvertime / 86400);
      break;
    case 'week':
    case 'weeks':
      overtimeUnits = Math.ceil(secondsOvertime / (86400 * 7));
      break;
    case 'month':
    case 'months':
      overtimeUnits = Math.ceil(secondsOvertime / (86400 * 30.42));
      break;
    case 'year':
    case 'years':
      overtimeUnits = Math.ceil(secondsOvertime / (86400 * 365.25));
      break;
    default:
      overtimeUnits = Math.ceil(secondsOvertime / 60);
  }
  const charge = Math.max(0, Math.round(perUnit * overtimeUnits));
  return charge;
} 