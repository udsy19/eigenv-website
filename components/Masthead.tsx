import styles from './Masthead.module.css';

export const NAV = [
  { label: 'What we do', href: '#what-we-do' },
  { label: 'Who we work with', href: '#who-we-work-with' },
  { label: 'We buy companies', href: '#we-buy-companies' },
  { label: 'About', href: '#about' },
];

export default function Masthead() {
  return (
    <header className={styles.bar}>
      <a href="#top" className={styles.wordmark}>
        EIGENV
      </a>
      {/* The section links scroll; the CTA never does. Keeping the primary
          action inside the scrollable rail put it 253px off-screen at 360px. */}
      <nav className={`${styles.nav} meta`} aria-label="Primary">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} className={styles.link}>
            {item.label}
          </a>
        ))}
      </nav>
      <a href="#contact" className={`${styles.cta} meta`}>
        Talk to us →
      </a>
    </header>
  );
}
