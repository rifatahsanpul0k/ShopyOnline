/**
 * Format price in US Dollars (USD)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted price string
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "$0";
  }

  // Format with commas for thousands
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `$${formatted}`;
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

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
