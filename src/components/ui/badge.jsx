import React from 'react';

export function Badge({ className = '', variant = 'default', ...props }) {
  const variants = {
    default: 'bg-[#eef2ff] text-[#3730a3] border-[#c7d2fe]',
    secondary: 'bg-[#f3f4f6] text-[#111827] border-[#e5e7eb]',
    outline: 'bg-white text-[#111827] border-[#d1d5db]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
}
