'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Building2, HandHeart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleRoleSelect = (role, path) => {
    login(role);
    router.push(path);
  };

  const roles = [
    {
      id: 'ngo',
      title: 'NGO Admin',
      description: 'Manage your organization, view incoming help requests, coordinate relief',
      icon: Building2,
      accent: 'blue',
      path: '/dashboard/admin'
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      description: 'Register to help, view active disasters, join relief efforts',
      icon: HandHeart,
      accent: 'green',
      path: '/volunteer'
    }
  ];

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <h1 className={styles.title}>Choose Your Role</h1>
        <p className={styles.subtitle}>Select how you want to access Sankalp</p>
      </motion.div>

      <div className={styles.grid}>
        {roles.map((r, index) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.card + ' ' + styles[r.accent]}
            onClick={() => handleRoleSelect(r.id, r.path)}
          >
            <div className={styles.iconWrapper}>
              <r.icon size={32} />
            </div>
            <h2>{r.title}</h2>
            <p>{r.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={styles.note}
      >
        Citizens can access help directly from the homepage without logging in.
      </motion.p>
    </div>
  );
}
