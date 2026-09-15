import styles from './VariantSwatches.module.css'

export default function VariantSwatches({ name, options = [], selected, onChange }) {
    return (
        <div>
            {options.map(({ id, value, label, image }) => (
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
                    <img className={styles.variantImg} src={image} alt={label ?? value} />
                </label>
            ))}
        </div>
    )
}
