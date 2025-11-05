import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
    success: "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400",
    outline:
      "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 disabled:border-gray-300 disabled:text-gray-400",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
