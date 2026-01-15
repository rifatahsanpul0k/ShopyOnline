import React from "react";

/**
 * StatCard Component - Displays a KPI metric with icon and optional badge
 */
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor = "bg-gray-100", 
  iconColor = "text-black",
  badge,
  badgeVariant = "success", // 'success' | 'danger' | 'info'
  subtitle
}) => {
  const badgeStyles = {
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-white rounded-card p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${iconBgColor} rounded-xl`}>
          <Icon size={24} className={iconColor} />
        </div>
        {badge && (
          <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${badgeStyles[badgeVariant]}`}>
            {badge}
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
      <div className="text-3xl font-black text-black mb-1">{value}</div>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
