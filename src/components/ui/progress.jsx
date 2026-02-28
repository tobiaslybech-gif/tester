import React from 'react';

export function Progress({ value = 0 }) {
  const safe = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2 w-full rounded-full bg-[#e5e7eb] overflow-hidden">
      <div className="h-full bg-[#111827]" style={{ width: `${safe}%` }} />
    </div>
  );
}
