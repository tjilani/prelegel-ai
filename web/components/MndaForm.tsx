import type { MndaFormData, PartyInfo } from "@/lib/mnda/types";
import PartyFields from "./PartyFields";
import { fieldLabelClass, inputClass, radioRowClass, sectionHeadingClass } from "./formStyles";
import YearsRadioOption from "./YearsRadioOption";

interface MndaFormProps {
  data: MndaFormData;
  onChange: (data: MndaFormData) => void;
}

export default function MndaForm({ data, onChange }: MndaFormProps) {
  function update<K extends keyof MndaFormData>(
    key: K,
    value: MndaFormData[K],
  ) {
    onChange({ ...data, [key]: value });
  }

  function updateParty(key: "party1" | "party2", party: PartyInfo) {
    onChange({ ...data, [key]: party });
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>Parties</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <PartyFields
            title="Party 1"
            idPrefix="party1"
            party={data.party1}
            onChange={(party) => updateParty("party1", party)}
          />
          <PartyFields
            title="Party 2"
            idPrefix="party2"
            party={data.party2}
            onChange={(party) => updateParty("party2", party)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>Purpose</h2>
        <div>
          <label htmlFor="purpose" className={fieldLabelClass}>
            How may Confidential Information be used?
          </label>
          <textarea
            id="purpose"
            className={inputClass}
            rows={2}
            value={data.purpose}
            onChange={(e) => update("purpose", e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>Term</h2>

        <div>
          <label htmlFor="effectiveDate" className={fieldLabelClass}>
            Effective Date
          </label>
          <input
            type="date"
            id="effectiveDate"
            className={inputClass}
            value={data.effectiveDate}
            onChange={(e) => update("effectiveDate", e.target.value)}
          />
        </div>

        <div>
          <span className={fieldLabelClass}>MNDA Term</span>
          <div className="mt-1 space-y-2">
            <YearsRadioOption
              radioId="mndaTerm-expires"
              name="mndaTermType"
              checked={data.mndaTermType === "expires"}
              onSelect={() => update("mndaTermType", "expires")}
              years={data.mndaTermYears}
              onYearsChange={(years) => update("mndaTermYears", years)}
              yearsInputLabel="MNDA Term, in years"
              prefixLabel="Expires"
              suffixLabel="year(s) from Effective Date"
            />
            <label className={radioRowClass}>
              <input
                type="radio"
                name="mndaTermType"
                checked={data.mndaTermType === "continues"}
                onChange={() => update("mndaTermType", "continues")}
              />
              Continues until terminated in accordance with the MNDA
            </label>
          </div>
        </div>

        <div>
          <span className={fieldLabelClass}>Term of Confidentiality</span>
          <div className="mt-1 space-y-2">
            <YearsRadioOption
              radioId="confidentialityTerm-years"
              name="confidentialityTermType"
              checked={data.confidentialityTermType === "years"}
              onSelect={() => update("confidentialityTermType", "years")}
              years={data.confidentialityTermYears}
              onYearsChange={(years) =>
                update("confidentialityTermYears", years)
              }
              yearsInputLabel="Term of Confidentiality, in years"
              suffixLabel="year(s) from Effective Date (trade secrets excepted)"
            />
            <label className={radioRowClass}>
              <input
                type="radio"
                name="confidentialityTermType"
                checked={data.confidentialityTermType === "perpetuity"}
                onChange={() =>
                  update("confidentialityTermType", "perpetuity")
                }
              />
              In perpetuity
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>Governing Law &amp; Jurisdiction</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="governingLaw" className={fieldLabelClass}>
              Governing Law (state)
            </label>
            <input
              type="text"
              id="governingLaw"
              className={inputClass}
              value={data.governingLaw}
              onChange={(e) => update("governingLaw", e.target.value)}
              placeholder="Delaware"
            />
          </div>
          <div>
            <label htmlFor="jurisdiction" className={fieldLabelClass}>
              Jurisdiction (city/county and state)
            </label>
            <input
              type="text"
              id="jurisdiction"
              className={inputClass}
              value={data.jurisdiction}
              onChange={(e) => update("jurisdiction", e.target.value)}
              placeholder="New Castle, DE"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>Modifications (optional)</h2>
        <div>
          <label htmlFor="modifications" className={fieldLabelClass}>
            List any modifications to the MNDA
          </label>
          <textarea
            id="modifications"
            className={inputClass}
            rows={2}
            value={data.modifications}
            onChange={(e) => update("modifications", e.target.value)}
          />
        </div>
      </section>
    </div>
  );
}
