import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1 className={styles.title}>
          KABBALAH <span className={styles.gold}>PORTAL</span>
        </h1>
        <p className={styles.subtitle}>
          Premium. Transcendente. Versátil.
        </p>
        <a href="/ceremony" className={styles.cta}>
          Enter the Mystery
        </a>
      </div>

    </main>
  );
}
