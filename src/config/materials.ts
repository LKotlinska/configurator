import fabricCream from "../assets/previews/textures/fabric_cream.webp";
import fabricEarth from "../assets/previews/textures/fabric_earth.webp";
import fabricGreen from "../assets/previews/textures/fabric_green.webp";
import leatherCream from "../assets/previews/textures/leather_cream.webp";
import leatherEarth from "../assets/previews/textures/leather_earth.webp";
import leatherGreen from "../assets/previews/textures/leather_green.webp";
import velvetCream from "../assets/previews/textures/velvet_cream.webp";
import velvetEarth from "../assets/previews/textures/velvet_earth.webp";
import velvetGreen from "../assets/previews/textures/velvet_green.webp";

export const MATERIALS = ["fabric", "leather", "velvet"];

export const COLORS = ["cream", "earth", "green"];

// Base color (albedo) texture for each material/color combination, keyed to
// match the material names baked into chair.glb (see model.md section 6).
export const TEXTURES = {
  fabric: { cream: fabricCream, earth: fabricEarth, green: fabricGreen },
  leather: { cream: leatherCream, earth: leatherEarth, green: leatherGreen },
  velvet: { cream: velvetCream, earth: velvetEarth, green: velvetGreen },
};
