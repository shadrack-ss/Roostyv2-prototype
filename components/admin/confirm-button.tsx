"use client";

/**
 * A submit button that asks first. Used inside small <form action={...}>
 * wrappers for deletes, so the destructive action still runs as a server
 * action and works without any client state.
 */
export function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
