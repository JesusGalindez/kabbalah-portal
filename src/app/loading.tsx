import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.container}>
            <div className={styles.loader}>
                <div className={styles.inner}></div>
            </div>
            <p className={styles.text}>Ascending...</p>
        </div>
    );
}
