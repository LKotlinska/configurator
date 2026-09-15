import styles from './FootVariant.module.css'
import preview104 from '../assets/previews/preview_ES104.jpg'
import preview108 from '../assets/previews/preview_ES108.jpg'

export default function FootVariant({ variant, onChange }) {
    return (
        <div>
            <label htmlFor="model-104">
                <input
                    className={styles.variantInput}
                    type="radio"
                    id="model-104"
                    name="model-variant"
                    value="ES104"
                    checked={variant === "ES104"}
                    onChange={() => onChange("ES104")}
                />
                    <img className={styles.variantImg} src={preview104} alt="ES104" />
            </label>
            <label htmlFor="model-108" className={styles.swatch}>
                <input
                    className={styles.variantInput}
                    type="radio"
                    id="model-108"
                    name="model-variant"
                    value="ES108"
                    checked={variant === "ES108"}
                    onChange={() => onChange("ES108")}
                />
                <img className={styles.variantImg} src={preview108} alt="ES108" />
            </label>
        </div>
    )
}