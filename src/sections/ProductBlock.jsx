import { useState } from "react";
import AccordionItem from "../components/AccordionItem";
import Button from "../components/Button";
import Link from "../components/Link";
import styles from "./ProductBlock.module.css"

export default function ProductBlock() {
    const [ showConfig, setShowConfig ] = useState(true)

    return(
        <section className={`${styles.productSection} ${!showConfig ? styles.collapsed : ""}`}>
            <span className={styles.triggerContainer} onClick={() => setShowConfig(!showConfig)}>
                <span className="material-symbols-outlined">
                    {showConfig ? "chevron_right" : "chevron_left"}
                </span>
            </span>
            <div className={styles.clipper}>
            <div className={styles.collapseInner}>
                <article>
                    <span className={styles.caption}>Configurator</span>
                    <h2 className={styles.modelTitle}>Elegant Armchair</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                    <span className={styles.priceTag}>2 799 £</span>

                    <AccordionItem 
                        title="Armrest"
                    />
                    <AccordionItem 
                        title="Foot"
                    />            
                    <AccordionItem 
                        title="Material"
                    />            
                    <AccordionItem 
                        title="Colour"
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