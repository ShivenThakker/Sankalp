'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { useAuth, ROLE_LABELS } from '../../hooks/useAuth';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { role, isLoggedIn, logout } = useAuth();

  const allLinks = [
    { name: 'Disasters', href: '/disasters' },
    { name: 'Map', href: '/map' },
    { name: 'NGOs', href: '/ngos' },
    { name: 'Donate', href: '/donate' },
    { name: 'I Need Help', href: '/help', hideForRoles: ['ngo'] },
    { name: 'Volunteer', href: '/volunteer', hideForRoles: ['ngo'] },
    { name: 'Register NGO', href: '/register-ngo', hideForRoles: ['ngo'] },
    { name: 'Dashboard', href: '/dashboard/admin', showForRoles: ['ngo', 'dc', 'volunteer'] },
    { name: '⚡ God Mode', href: '/god-mode', showForRoles: ['dc'] },
  ];

  const navLinks = allLinks.filter(link => {
    if (link.showForRoles) {
      if (!role) return false;
      return link.showForRoles.includes(role);
    }
    if (!link.hideForRoles) return true;
    if (!role) return true;
    return !link.hideForRoles.includes(role);
  });

  if (pathname === '/login') {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.brandText}>Sankalp</span>
        </Link>
        
        <div className={styles.desktopLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.activeLink : styles.link}
            >
              {link.name}
              {pathname === link.href && <span className={styles.activeIndicator}></span>}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          {!isLoggedIn ? (
            <Link href="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                background: '#CCFBF1', 
                color: '#0F766E', 
                padding: '3px 10px', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: '600',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                border: '1px solid #99F6E4'
              }}>
                {ROLE_LABELS[role] || 'User'}
              </span>
              <button 
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="btn btn-outline btn-sm"
              >
                Logout
              </button>
            </div>
          )}
          <button className={styles.mobileMenuBtn} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.mobileActiveLink : styles.mobileLink}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
