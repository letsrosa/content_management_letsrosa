import { NavLink } from 'react-router-dom';
import styles from './NavTabs.module.css';

const LINKS = [
  { to: '/', label: 'Ideias' },
  { to: '/publicidade', label: 'Publicidade' },
];

export function NavTabs() {
  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) => [styles.link, isActive ? styles.linkActive : ''].filter(Boolean).join(' ')}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
