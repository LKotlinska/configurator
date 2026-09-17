import { useEffect } from "react";

// Applies variant/armrest selection to the loaded model. Runs for every variant in CHIAR_PARTS
export function useVariantVisibility(partsRef, variant, armrestOption, loaded) {
  useEffect(() => {
    if (!loaded) return;

    for (const [variantKey, parts] of Object.entries(partsRef.current)) {
      const isActiveVariant = variantKey === variant;

      // Show only the active variant root
      parts.root.visible = isActiveVariant;
      if (!isActiveVariant) continue;

      // Armrests
      parts.standardArmrest.visible = armrestOption === "standard";
      parts.singleArmrest.visible = armrestOption === "single";
      parts.noArmrest.visible = armrestOption === "none";

      // Cushion height depends on the armrest variant (see model.md).
      // No armrest means no armrest cushion either.
      parts.standardCushion.visible = armrestOption === "standard";
      parts.singleCushion.visible = armrestOption === "single";
    }
  }, [partsRef, variant, armrestOption, loaded]);
}
