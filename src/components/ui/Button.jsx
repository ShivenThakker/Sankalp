'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  href,
  ...props
}) {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className} ${disabled || loading ? styles.disabled : ''}`;

  const content = (
    <>
      {loading ? (
        <Loader2 className={styles.spinner} size={18} />
      ) : Icon ? (
        <Icon className={styles.icon} size={18} />
      ) : null}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClass} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClass}
      {...props}
    >
      {content}
    </motion.button>
  );
}
