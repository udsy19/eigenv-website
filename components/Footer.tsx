import { AUDIENCES, CONTACT_EMAIL, LOCATION, SERVICES } from '@/content';
import styles from './Footer.module.css';

const MORE = [
  { label: 'Inside an engagement', href: '#engagement' },
  { label: 'We buy companies', href: '#we-buy-companies' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <p className={styles.wordmark}>EIGENV</p>
          <p className={styles.tagline}>
            We build and operate companies for the long term, alongside the
            people who run them.
          </p>
        </div>

        {/* One nav landmark, three lists. Three sibling <nav>s all announced
            as "navigation" gave a screen reader no way to tell them apart. */}
        <nav className={styles.columns} aria-label="Footer">
          <div className={`${styles.column} meta`}>
            <span className={styles.heading} id="footer-what-we-do">
              What we do
            </span>
            {/* Deep links: five differently-named links all pointing at the
                same anchor is misleading navigation (WCAG 2.4.4). */}
            <ul role="list" aria-labelledby="footer-what-we-do">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <a href={`#${service.id}`} className={styles.link}>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.column} meta`}>
            <span className={styles.heading} id="footer-who">
              Who we work with
            </span>
            <ul role="list" aria-labelledby="footer-who">
              {AUDIENCES.map((audience) => (
                <li key={audience.id}>
                  <a href={`#${audience.id}`} className={styles.link}>
                    {audience.who}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.column} meta`}>
            <span className={styles.heading} id="footer-more">
              More
            </span>
            <ul role="list" aria-labelledby="footer-more">
              {MORE.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className={`${styles.bottom} meta`}>
        <a
          className={`${styles.link} ${styles.mail}`}
          href={`mailto:${CONTACT_EMAIL}`}
        >
          {CONTACT_EMAIL}
        </a>
        <span>{LOCATION}</span>
        {/* Hardcoded: this route is statically prerendered, so a computed year
            would freeze at build time and silently go stale. */}
        <span>© 2026 EIGENV</span>
        <span className={styles.privacy}>
          <a href="/privacy" className={styles.link}>
            Privacy
          </a>
          {' · '}
          <a href="/terms" className={styles.link}>
            Terms
          </a>
        </span>
      </div>
    </footer>
  );
}
