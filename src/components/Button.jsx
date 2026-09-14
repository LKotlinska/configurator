import styles from './Button.module.css'

export default function Button({ title, type = 'button' }) {
    return(
        <button 
            type={type} 
            className={styles.btn}
        >
            {title}
        </button>
    )
}