import React, { createContext, useContext } from 'react';

const DialogContext = createContext({ open: false, onOpenChange: () => {} });

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open: Boolean(open), onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({ className = '', children }) {
  const { open, onOpenChange } = useContext(DialogContext);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(17, 24, 39, 0.4)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
        padding: '1rem',
      }}
      onClick={() => onOpenChange?.(false)}
    >
      <div
        className={`border bg-white p-4 rounded-xl w-full max-w-[680px] ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className = '', ...props }) {
  return <div className={`mb-3 ${className}`} {...props} />;
}

export function DialogTitle({ className = '', ...props }) {
  return <h2 className={`text-lg font-semibold ${className}`} {...props} />;
}

export function DialogFooter({ className = '', ...props }) {
  return <div className={`mt-4 flex justify-end gap-2 ${className}`} {...props} />;
}
