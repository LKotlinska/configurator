import styles from './Link.module.css'

export default function Link({ title }) {
    return(
        <a className={`${styles.link} ${styles.underlineAnimation}`} href="#">{title}</a>
    )
}