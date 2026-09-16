import styles from './VariantSwatches.module.css'
import { formatPriceDelta } from '../config/pricing'

export default function VariantSwatches({ name, options = [], selected, onChange, captioned = false }) {
    return (
        <div>
            {options.map(({ id, value, label, image, color, priceDelta }) => {
                const hasPrice = priceDelta !== undefined;
                return (
                    <label key={id} htmlFor={id}>
                        <input
                            className={styles.variantInput}
                            type="radio"
                            id={id}
                            name={name}
                            value={value}
                            checked={selected === value}
                            onChange={() => onChange(value)}
                        />
                        {color ? (
                            <span className={styles.imageSwatch}>
                                <span
                                    className={styles.colorSwatch}
                                    style={{ backgroundColor: color }}
                                />
                                <span className={styles.variantCaption}>{label ?? value}</span>
                            </span>
                        ) : image ? (
                            captioned || hasPrice ? (
                                <span className={styles.imageSwatch}>
                                    <img className={styles.variantImg} src={image} alt={label ?? value} />
                                    {captioned && <span className={styles.variantCaption}>{label ?? value}</span>}
                                    {hasPrice && <span className={styles.variantPrice}>{formatPriceDelta(priceDelta)}</span>}
                                </span>
                            ) : (
                                <img className={styles.variantImg} src={image} alt={label ?? value} />
                            )
                        ) : (
                            <span className={styles.variantLabel}>{label ?? value}</span>
                        )}
                    </label>
                );
            })}
        </div>
    )
}
