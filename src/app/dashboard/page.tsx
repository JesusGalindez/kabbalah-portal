import TreeOfLife from '@/components/TreeOfLife';
import SoulBookGenerator from '@/components/SoulBookGenerator';
import styles from './page.module.css';

export default function DashboardPage() {
    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Your Tree of Life</h1>
            <TreeOfLife />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                <a href="/daily-gate" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontFamily: 'var(--font-serif)', border: '1px solid var(--color-gold)', padding: '0.5rem 1rem' }}>
                    Open Daily Gate
                </a>

                {/* Mock data for the prototype - In real app, this comes from Context/DB */}
                <SoulBookGenerator
                    name="Ari"
                    hebrewDate="20 Iyar, 5750"
                    tikkun="Your correction lies in the realm of Gevurah (Judgment). You must learn to temper your inner fire with Chesed (Mercy). Seek balance in all things."
                />
            </div>
        </main>
    );
}
