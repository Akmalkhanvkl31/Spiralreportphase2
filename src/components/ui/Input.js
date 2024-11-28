// src/components/ui/Input.js
export function Input({ ...props }) {
    return (
      <input
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring"
        {...props}
      />
    );
  }
  