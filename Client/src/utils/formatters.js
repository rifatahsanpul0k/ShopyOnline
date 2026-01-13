/**
 * Format price to BDT currency (Bangladeshi Taka)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount) => {
  if (!amount) return "৳0";
  return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {number} Discount percentage
 */
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Format number to short notation (1.5K, 2.3M, etc)
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};
