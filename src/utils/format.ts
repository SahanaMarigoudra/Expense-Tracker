/**
 * Currency and Number Formatting Utilities for SpendWise (INR Currency)
 */

export const formatCurrency = (val: number): string => {
  if (val === null || val === undefined || isNaN(val)) {
    return '₹0.00';
  }
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absVal);

  return isNegative ? `-${formatted}` : formatted;
};

export const formatCompactINR = (val: number): string => {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  }
  if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(1)}k`;
  }
  return `${sign}₹${abs.toFixed(2)}`;
};
