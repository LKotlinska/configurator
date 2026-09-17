// Base price for the default configuration: ES104 foot, standard armrest,
// fabric upholstery. Every *_PRICES table below is relative to this
// baseline and must have a 0 entry for whichever value is the App.jsx default.
export const BASE_PRICE = 2799;

export const VARIANT_PRICES = {
  ES104: 0,
  ES108: 120,
};

export const ARMREST_PRICES = {
  standard: 0,
  single: 40,
  none: -60,
};

export const MATERIAL_PRICES = {
  fabric: 0,
  velvet: 220,
  leather: 450,
};

// "2 799 £" - matches the existing static text's space-grouped format.
export function formatPrice(amount) {
  return `${amount.toLocaleString("en-GB").replace(/,/g, " ")} £`;
}

// Per-option price hint: 0 -> "Included", +150 -> "+150 £", -60 -> "−60 £".
export function formatPriceDelta(amount) {
  if (amount === 0) return "Included";
  const sign = amount > 0 ? "+" : "−";
  return `${sign}${Math.abs(amount).toLocaleString("en-GB").replace(/,/g, " ")} £`;
}
