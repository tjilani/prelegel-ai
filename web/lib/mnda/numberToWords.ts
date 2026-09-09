const ONES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];

/**
 * Renders a positive integer as contract-style prose, e.g. `2` -> "two (2)".
 * Falls back to the numeral alone outside the small range contracts
 * typically spell out.
 */
export function numberToWords(n: number): string {
  const rounded = Math.max(1, Math.round(n));
  const word = ONES[rounded];
  return word ? `${word} (${rounded})` : `${rounded}`;
}
