export const MATERIALS = ["fabric", "leather", "velvet"];

// Internal values match the material variants baked into chair.glb (see
// model.md section 6) - "earth" and "green" are just how those variants are
// named in the model file.
export const COLORS = ["cream", "earth", "green"];

// Display name shown to the user for each internal color value.
export const COLOR_LABELS = {
  cream: "Cream",
  earth: "Expresso",
  green: "Sage",
};

// Swatch color shown in the Colour accordion.
export const COLOR_SWATCHES = {
  cream: "#FBF9F3",
  earth: "#3B291C",
  green: "#8A8E75",
};
