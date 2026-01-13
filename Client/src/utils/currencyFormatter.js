/**
 * Format price in Bangladeshi Taka (BDT)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted price string
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "৳0";
  }

  // Format with commas for thousands
  const formatted = new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `৳${formatted}`;
};

/**
 * Format price without currency symbol
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0";
  }

  return new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
