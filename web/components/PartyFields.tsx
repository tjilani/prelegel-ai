import type { PartyInfo } from "@/lib/mnda/types";
import { fieldLabelClass, inputClass } from "./formStyles";

interface PartyFieldsProps {
  title: string;
  /** Prefix for this instance's field ids, so Party 1 and Party 2 don't collide. */
  idPrefix: string;
  party: PartyInfo;
  onChange: (party: PartyInfo) => void;
}

export default function PartyFields({
  title,
  idPrefix,
  party,
  onChange,
}: PartyFieldsProps) {
  function update<K extends keyof PartyInfo>(key: K, value: PartyInfo[K]) {
    onChange({ ...party, [key]: value });
  }

  const fieldId = (name: string) => `${idPrefix}-${name}`;

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-zinc-900">{title}</legend>

      <div>
        <label htmlFor={fieldId("companyName")} className={fieldLabelClass}>
          Company
        </label>
        <input
          type="text"
          id={fieldId("companyName")}
          className={inputClass}
          value={party.companyName}
          onChange={(e) => update("companyName", e.target.value)}
          placeholder="Acme, Inc."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={fieldId("printName")} className={fieldLabelClass}>
            Print Name
          </label>
          <input
            type="text"
            id={fieldId("printName")}
            className={inputClass}
            value={party.printName}
            onChange={(e) => update("printName", e.target.value)}
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label htmlFor={fieldId("title")} className={fieldLabelClass}>
            Title
          </label>
          <input
            type="text"
            id={fieldId("title")}
            className={inputClass}
            value={party.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="CEO"
          />
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("noticeAddress")} className={fieldLabelClass}>
          Notice Address <span className="text-zinc-400">(email or postal)</span>
        </label>
        <input
          type="text"
          id={fieldId("noticeAddress")}
          className={inputClass}
          value={party.noticeAddress}
          onChange={(e) => update("noticeAddress", e.target.value)}
          placeholder="jane@acme.com"
        />
      </div>
    </fieldset>
  );
}
