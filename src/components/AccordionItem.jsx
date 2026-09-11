import styles from './AccordionItem.module.css'

export default function AccordionItem({ title, children }) {
    return(
        <details className={styles.accordion}>
            <summary className={styles.summary}>
                <span className={styles.title}>{title}</span>
                <span aria-hidden='true' className="material-symbols-outlined">stat_minus_1</span>
            </summary>
            <div className={styles.content}>{children}
                <h2>This is some content</h2>
            </div>
        </details>
    )
}