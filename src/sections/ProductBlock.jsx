import AccordionItem from "../components/AccordionItem";
import Button from "../components/Button";
import Link from "../components/Link";
import styles from "./ProductBlock.module.css"

export default function ProductBlock() {
    return(
        <section className={styles.productSection}>
            <span>Configurator</span>
            <h2>Elegant Armchair</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
            <span>2 799 £</span>

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

            <Button title="Add to cart"/>

            <Link
                title="Specifications & Downloads"
            /> 
            <Link
                title="Upholstery"
            />
            <Link
                title="Find in-store"
            />
        </section>
    )
}