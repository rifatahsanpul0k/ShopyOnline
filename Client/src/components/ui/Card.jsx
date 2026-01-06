import React from "react";

/**
 * Reusable Card Component
 * Standard rounded container with consistent styling (rounded-3xl / 1.5rem)
 * Variants: default, bordered, elevated
 */
const Card = ({
  children,
  className = "",
  variant = "default", // 'default' | 'bordered' | 'elevated'
  hover = false,
  ...props
}) => {
  // Base styles
  const baseStyles =
    "rounded-card bg-white transition-all duration-200 overflow-hidden";

  // Variant styles
  const variantStyles = {
    default: "shadow-sm",
    bordered: "border border-gray-200",
    elevated: "shadow-lg",
  };

  // Hover styles
  const hoverStyles = hover
    ? "hover:shadow-lg hover:border-gray-300 hover:-translate-y-1"
    : "";

  const finalClassName = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`;

  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  );
};

export default Card;
