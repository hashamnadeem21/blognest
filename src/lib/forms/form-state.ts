/** Shared between Server Actions and Client Components — keep this file dependency-free. */
export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /** Echoed back on validation errors so React's automatic form reset doesn't wipe user input. */
  values?: Record<string, string>;
}

export const initialFormState: FormState = { status: "idle", message: "" };
