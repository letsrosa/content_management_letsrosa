import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Diário de Conteúdo</h1>
      <p className={styles.eyebrow}>girls in tech &amp; lifestyle</p>
    </header>
  );
}
