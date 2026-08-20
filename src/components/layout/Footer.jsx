import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
          <Link href="/privacy" className={styles.link}>Privacy</Link>
        </div>
        <div className={styles.badge}>
          Built for SIH 2026
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} ReliefNet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
