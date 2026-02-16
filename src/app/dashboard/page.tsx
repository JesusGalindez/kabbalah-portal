import TreeOfLife from '@/components/TreeOfLife';
import styles from './page.module.css';

export default function DashboardPage() {
    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Your Tree of Life</h1>
            <TreeOfLife />
        </main>
    );
}
