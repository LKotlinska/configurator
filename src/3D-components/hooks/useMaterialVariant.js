import { useEffect } from "react";

export function useMaterialVariant(
  partsRef,
  selectVariantRef,
  material,
  color,
  loaded,
  UPHOLSTERY_PARTS,
) {
  useEffect(() => {
    if (!loaded || !selectVariantRef.current) return;

    const variantName = `${material}_${color}`;

    for (const [, parts] of Object.entries(partsRef.current)) {
      for (const partKey of UPHOLSTERY_PARTS) {
        const mesh = parts[partKey];
        if (mesh) {
          selectVariantRef.current(mesh, variantName, false);
        }
      }
    }
  }, [material, color, loaded]);
}
