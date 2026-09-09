import { radioRowClass, yearsInputClass } from "./formStyles";

interface YearsRadioOptionProps {
  radioId: string;
  name: string;
  checked: boolean;
  onSelect: () => void;
  years: number;
  onYearsChange: (years: number) => void;
  yearsInputLabel: string;
  prefixLabel?: string;
  suffixLabel: string;
}

/**
 * A radio option paired with a number input (e.g. "Expires [2] year(s) from
 * Effective Date"). Shared between the MNDA Term and Term of
 * Confidentiality sections, which otherwise duplicated this exact markup.
 *
 * The number input gets its own (visually hidden) label rather than being
 * nested inside the radio's label, since a single <label> wrapping two
 * distinct form controls is ambiguous for assistive tech.
 */
export default function YearsRadioOption({
  radioId,
  name,
  checked,
  onSelect,
  years,
  onYearsChange,
  yearsInputLabel,
  prefixLabel,
  suffixLabel,
}: YearsRadioOptionProps) {
  const yearsInputId = `${radioId}-years`;

  return (
    <div className={radioRowClass}>
      <input
        type="radio"
        id={radioId}
        name={name}
        checked={checked}
        onChange={onSelect}
      />
      {prefixLabel && <label htmlFor={radioId}>{prefixLabel}</label>}
      <label htmlFor={yearsInputId} className="sr-only">
        {yearsInputLabel}
      </label>
      <input
        type="number"
        id={yearsInputId}
        min={1}
        className={yearsInputClass}
        value={years}
        onChange={(e) => onYearsChange(Number(e.target.value))}
        disabled={!checked}
      />
      <label htmlFor={radioId}>{suffixLabel}</label>
    </div>
  );
}
