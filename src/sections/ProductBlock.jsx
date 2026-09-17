import { useMemo } from "react";
import AccordionItem from "../components/AccordionItem";
import Button from "../components/Button";
import Link from "../components/Link";
import styles from "./ProductBlock.module.css"
import VariantSwatches from "../components/VariantSwatches";
import wheels104 from "../assets/previews/wheels_ES104.png";
import base108 from "../assets/previews/base_ES108.png";
import armrestStandard104 from "../assets/previews/armrest_104/02_Armrest_Metal_ES104.png";
import armrestSingle104 from "../assets/previews/armrest_104/03_Singel_Armrest_ES104.png";
import armrestNone104 from "../assets/previews/armrest_104/04_Singel_NOarmrest_ES104.png";
import armrestStandard108 from "../assets/previews/armrest_108/02_Armrest_Metal_ES108.png";
import armrestSingle108 from "../assets/previews/armrest_108/03_Singel_Armrest_ES108.png";
import armrestNone108 from "../assets/previews/armrest_108/04_Singel_NOarmrest_ES108.png";
import materialFabric from "../assets/previews/materials/fabric.webp";
import materialLeather from "../assets/previews/materials/leather.webp";
import materialVelvet from "../assets/previews/materials/velvet.webp";
import { MATERIALS, COLORS, COLOR_LABELS, COLOR_SWATCHES } from "../config/materials";
import { BASE_PRICE, VARIANT_PRICES, ARMREST_PRICES, MATERIAL_PRICES, formatPrice } from "../config/pricing";

const MATERIAL_PREVIEWS = {
    fabric: materialFabric,
    leather: materialLeather,
    velvet: materialVelvet,
};

const FOOT_OPTIONS = [
    { id: "model-104", value: "ES104", label: "ES104", image: wheels104, priceDelta: VARIANT_PRICES.ES104 },
    { id: "model-108", value: "ES108", label: "ES108", image: base108, priceDelta: VARIANT_PRICES.ES108 },
];

const ARMREST_OPTIONS_BY_VARIANT = {
    ES104: [
        { id: "armrest-standard", value: "standard", label: "Standard", image: armrestStandard104, priceDelta: ARMREST_PRICES.standard },
        { id: "armrest-single", value: "single", label: "Single", image: armrestSingle104, priceDelta: ARMREST_PRICES.single },
        { id: "armrest-none", value: "none", label: "None", image: armrestNone104, priceDelta: ARMREST_PRICES.none },
    ],
    ES108: [
        { id: "armrest-standard", value: "standard", label: "Standard", image: armrestStandard108, priceDelta: ARMREST_PRICES.standard },
        { id: "armrest-single", value: "single", label: "Single", image: armrestSingle108, priceDelta: ARMREST_PRICES.single },
        { id: "armrest-none", value: "none", label: "None", image: armrestNone108, priceDelta: ARMREST_PRICES.none },
    ],
};

const MATERIAL_OPTIONS = MATERIALS.map((name) => ({
    id: `material-${name}`,
    value: name,
    label: name.charAt(0).toUpperCase() + name.slice(1),
    image: MATERIAL_PREVIEWS[name],
    priceDelta: MATERIAL_PRICES[name],
}));

const colorOptionsForMaterial = (material) =>
    COLORS.map((name) => ({
        id: `color-${material}-${name}`,
        value: name,
        label: COLOR_LABELS[name],
        color: COLOR_SWATCHES[name],
    }));

export default function ProductBlock({
    variant, onVariantChange,
    armrestOption, onArmrestChange,
    material, onMaterialChange,
    color, onColorChange,
    showConfig, onToggle,
}) {
    const totalPrice = useMemo(
        () => BASE_PRICE + VARIANT_PRICES[variant] + ARMREST_PRICES[armrestOption] + MATERIAL_PRICES[material],
        [variant, armrestOption, material]
    );

    return(
        <section className={`${styles.productSection} ${!showConfig ? styles.collapsed : ""}`}>
            <span className={styles.triggerContainer} onClick={onToggle}>
                <span className="material-symbols-outlined">
                    {showConfig ? "chevron_right" : "chevron_left"}
                </span>
            </span>
            <div className={styles.clipper}>
            <div className={styles.collapseInner}>
                <article>
                    <span className={styles.caption}>Configurator</span>
                    <h2 className={styles.modelTitle}>Meridian Chair</h2>
                    <p className={styles.description}>Clean lines and a balanced silhouette make the Meridian equally at home in the boardroom or the home office. A sculpted frame and supportive seat keep you comfortable through long working days, while a smooth-rolling base or a sturdy fixed foot make it easy to move between meetings or settle in for focused work. Choose your base, armrests, and upholstery to match the room.</p>
                    <span className={styles.priceTag}>
                        <span className={styles.priceNumber}>{formatPrice(totalPrice).replace(" £", "")} £</span>
                    </span>

                    <AccordionItem 
                        title="Foot"
                        children={
                            <VariantSwatches
                                name={"foot-variant"}
                                options={FOOT_OPTIONS}
                                selected={variant}
                                onChange={onVariantChange}
                            />
                        }
                    />
                    <AccordionItem
                        title="Armrest"
                        children={
                            <VariantSwatches
                                name={"armrest-variant"}
                                options={ARMREST_OPTIONS_BY_VARIANT[variant]}
                                selected={armrestOption}
                                onChange={onArmrestChange}
                            />
                        }
                    />
                    <AccordionItem
                        title="Material"
                        children={
                            <VariantSwatches
                                name={"material-variant"}
                                options={MATERIAL_OPTIONS}
                                selected={material}
                                onChange={onMaterialChange}
                                captioned
                            />
                        }
                    />
                    <AccordionItem
                        title="Colour"
                        children={
                            <VariantSwatches
                                name={"color-variant"}
                                options={colorOptionsForMaterial(material)}
                                selected={color}
                                onChange={onColorChange}
                            />
                        }
                    />

                    <div className={styles.statusContainer}>
                        <span className={styles.status}>In stock</span>
                        <span className={styles.status}>Delievery in 1-3 weeks</span>
                    </div>

                    <Button title="Add to cart"/>
                    <div className={styles.linkContainer}>
                        <Link
                            title="Specifications & Downloads"
                        /> 
                        <Link
                            title="Upholstery"
                        />
                        <Link
                            title="Find in-store"
                        />
                    </div>
                </article>
            </div>
            </div>
        </section>
    )
}