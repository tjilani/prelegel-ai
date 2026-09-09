export interface PartyInfo {
  companyName: string;
  printName: string;
  title: string;
  noticeAddress: string;
}

export type MndaTermType = "expires" | "continues";
export type ConfidentialityTermType = "years" | "perpetuity";

export interface MndaFormData {
  party1: PartyInfo;
  party2: PartyInfo;
  purpose: string;
  effectiveDate: string; // yyyy-mm-dd, from <input type="date">
  mndaTermType: MndaTermType;
  mndaTermYears: number; // used when mndaTermType === "expires"
  confidentialityTermType: ConfidentialityTermType;
  confidentialityTermYears: number; // used when confidentialityTermType === "years"
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
}

export function createEmptyParty(): PartyInfo {
  return { companyName: "", printName: "", title: "", noticeAddress: "" };
}

export function createDefaultFormData(): MndaFormData {
  return {
    party1: createEmptyParty(),
    party2: createEmptyParty(),
    purpose: "Evaluating whether to enter into a business relationship with the other party.",
    effectiveDate: new Date().toISOString().slice(0, 10),
    mndaTermType: "expires",
    mndaTermYears: 1,
    confidentialityTermType: "years",
    confidentialityTermYears: 1,
    governingLaw: "",
    jurisdiction: "",
    modifications: "",
  };
}
