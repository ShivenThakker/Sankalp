import styles from './Loader.module.css';

export default function Loader({ size = 'md', text }) {
  return (
    <div className={styles.container}>
      <div className={`${styles.loader} ${styles[size]}`}></div>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
}
