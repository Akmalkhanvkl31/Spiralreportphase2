// src/components/ui/Button.js
export function Button({ children, variant, className, ...props }) {
    const baseStyle = "px-4 py-2 rounded-md focus:outline-none";
    const variantStyle = variant === "outline" ? "border" : "bg-blue-500 text-white";
    return (
      <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
        {children}
      </button>
    );
  }
  