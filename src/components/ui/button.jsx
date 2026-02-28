import React from 'react';

function getStyles(variant, size) {
  const base =
    'inline-flex items-center justify-center rounded-xl border cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed';
  const variantMap = {
    default: 'bg-[#111827] text-white border-[#111827]',
    outline: 'bg-white text-[#111827] border-[#d1d5db]',
    secondary: 'bg-[#f3f4f6] text-[#111827] border-[#e5e7eb]',
  };
  const sizeMap = {
    sm: 'text-xs px-3 py-2',
    default: 'text-sm px-4 py-2',
  };

  return `${base} ${variantMap[variant || 'default']} ${sizeMap[size || 'default']}`;
}

export function Button({ className = '', variant = 'default', size = 'default', ...props }) {
  return <button className={`${getStyles(variant, size)} ${className}`} {...props} />;
}
