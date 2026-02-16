import CeremonialForm from '@/components/CeremonialForm';
import styles from './page.module.css';

export default function CeremonyPage() {
    return (
        <main className={styles.container}>
            <div className={styles.overlay} />
            <CeremonialForm />
        </main>
    );
}
