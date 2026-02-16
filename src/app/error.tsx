'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>The Vessel Has Shattered</h2>
            <p className={styles.subtitle}>A runtime realignment is required.</p>

            <div className={styles.errorDetails}>
                <p>Error: {error.message || "Unknown dissonance"}</p>
                {error.digest && <small>Digest: {error.digest}</small>}
            </div>

            <button
                onClick={reset}
                className={styles.resetButton}
            >
                Attempt Tikkun (Reset)
            </button>
        </div>
    );
}
