'use client';

// Global Error must define its own html and body tags since it replaces the root layout
import styles from './error.module.css';

export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className={styles.container}>
                <h2 className={styles.title}>Critical System Failure</h2>
                <p className={styles.subtitle}>The foundation has been shaken.</p>
                <button onClick={() => reset()} className={styles.resetButton}>
                    Rebuild Foundation
                </button>
            </body>
        </html>
    );
}
