import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-black text-white px-12 py-4 rounded-pill hover:opacity-90", // Black Pill
    secondary:
      "bg-white text-black border border-gray-300 px-12 py-4 rounded-pill hover:bg-gray-100", // Outline Pill
    icon: "p-2 hover:bg-gray-100 rounded-full",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;