// Meshes that carry the upholstery material, keyed the same as CHAIR_PARTS.
export const UPHOLSTERY_PARTS = ["body", "standardCushion", "singleCushion"];

// Object names as they exist in chair.glb, keyed by variant (see model description).
export const CHAIR_PARTS = {
  ES104: {
    root: "Chair_ES104_Root",
    base: "01_Base_metal_W_wheels_ES104",
    standardArmrest: "02_Armrest_Metal_ES104",
    singleArmrest: "03_Singel_Armrest_ES104",
    noArmrest: "04_Singel_NOarmrest_ES104",
    body: "05_Body_ES104",
    standardCushion: "06_Metal_Cushion_ES104",
    singleCushion: "07_Singel_Cushion_ES104",
  },
  ES108: {
    root: "Chair_ES108_Root",
    base: "01_Base_metal_ES108",
    standardArmrest: "02_Armrest_Metal_ES108",
    singleArmrest: "03_Singel_Armrest_ES108",
    noArmrest: "04_Singel_NOarmrest_ES108",
    body: "05_Body_ES108",
    standardCushion: "06_Metal_Cushion_ES108",
    singleCushion: "07_Singel_Cushion_ES108",
  },
};
