export const VND_TO_USD_RATE = 25000;

export const convertToUSD = (amount: number): number => {
  return amount / VND_TO_USD_RATE;
};

/**
 * Formats a price based on the locale.
 * If locale is 'en', converts the amount from VND to USD and formats as USD.
 * If locale is 'vi', formats the amount as VND.
 */
export const formatPrice = (amount: number | string, locale: string): string => {
  const numAmount = typeof amount === 'string' ? Number(amount) : amount;
  
  if (locale === 'en') {
    const usdAmount = convertToUSD(numAmount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdAmount);
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(numAmount);
};
