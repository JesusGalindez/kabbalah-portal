import TreeOfLife from '@/components/TreeOfLife';
import styles from './page.module.css';

export default function DashboardPage() {
    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Your Tree of Life</h1>
            <TreeOfLife />
            <div style={{ marginTop: '2rem' }}>
                <a href="/daily-gate" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontFamily: 'var(--font-serif)', border: '1px solid var(--color-gold)', padding: '0.5rem 1rem' }}>
                    Open Daily Gate
                </a>
            </div>
        </main>
    );
}
