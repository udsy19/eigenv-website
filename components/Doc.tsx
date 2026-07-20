import type { ReactNode } from 'react';
import Footer from './Footer';
import Masthead from './Masthead';
import styles from './Doc.module.css';

/** A readable prose page inside the site chrome, for privacy / terms. */
export default function Doc({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Masthead />
      <main id="top" tabIndex={-1} className={styles.page}>
        <article className={styles.doc}>
          <p className={`meta ${styles.updated}`}>Last updated {updated}</p>
          <h1 className={`display ${styles.title}`}>{title}</h1>
          <div className={styles.body}>{children}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
