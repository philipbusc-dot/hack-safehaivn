import { DISCLAIMER } from "../lib/constants";

/** Mandatory disclaimer footer — present on every screen (scope guardrail). */
export default function Footer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-center text-[11.5px] text-faint ${className}`}
      role="note"
    >
      {DISCLAIMER}
    </p>
  );
}
