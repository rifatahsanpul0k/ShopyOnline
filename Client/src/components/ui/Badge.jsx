import React from "react";

const Badge = ({ children, variant = "discount" }) => {
  const styles =
    variant === "discount" || variant === "destructive"
      ? "bg-brand-red text-white px-3 py-1 rounded-pill text-xs font-medium"
      : "bg-black text-white px-3 py-1 rounded-pill text-xs";

  return <span className={styles}>{children}</span>;
};

export default Badge;