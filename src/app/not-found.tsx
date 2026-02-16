import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <h2 className={styles.subtitle}>A Spark Lost in the Void</h2>
            <p className={styles.text}>
                Even in darkness, there is light. The path you seek is not here.
            </p>
            <Link href="/" className={styles.homeButton}>
                Return to the Source
            </Link>
        </div>
    );
}
