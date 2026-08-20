import styles from './Badge.module.css';

export default function Badge({ variant = 'neutral', size = 'md', children }) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {children}
    </span>
  );
}
