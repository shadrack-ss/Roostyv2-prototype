"use client";

import { useActionState } from "react";
import { inputClass } from "./field-renderer";
import type { FormAction } from "./resource-form";
import { buttonClass } from "./ui";

type Input = {
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  required?: boolean;
  defaultValue?: string;
  autoComplete?: string;
  help?: string;
};

/**
 * For the few account forms that aren't content (new admin, profile,
 * password). Content forms use ResourceForm and the field registry instead.
 * Clears itself after a successful save so a password never lingers.
 */
export function SimpleForm({
  action,
  inputs,
  submitLabel,
  successMessage = "Saved.",
  resetOnSuccess = false,
}: {
  action: FormAction;
  inputs: Input[];
  submitLabel: string;
  successMessage?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} key={resetOnSuccess ? state.saved : undefined} className="space-y-4">
      {inputs.map((input) => (
        <div key={input.name}>
          <label htmlFor={input.name} className="mb-1 block text-sm font-medium">{input.label}</label>
          <input
            id={input.name}
            name={input.name}
            type={input.type ?? "text"}
            required={input.required}
            defaultValue={input.defaultValue}
            autoComplete={input.autoComplete}
            className={inputClass}
          />
          {input.help && <p className="mt-1 text-xs text-muted">{input.help}</p>}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass.primary}>
          {pending ? "Saving..." : submitLabel}
        </button>
        {state.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}
        {!state.error && state.saved && !pending && <p className="text-sm text-brand" role="status">{successMessage}</p>}
      </div>
    </form>
  );
}
