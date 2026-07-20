import type { Metadata } from 'next';
import Doc from '@/components/Doc';

export const metadata: Metadata = { title: 'Terms' };

/* Baseline terms for a marketing site. Have counsel review and add your legal
   entity and governing law before relying on it. */

export default function Terms() {
  return (
    <Doc title="Terms" updated="20 July 2026">
      <p>
        These terms cover your use of this website. By using it you accept them.
      </p>

      <h2>The site</h2>
      <p>
        This site describes what EIGENV does. We keep it accurate but provide it
        as is, without warranties, and we may change or take down any part of it
        at any time.
      </p>

      <h2>Enquiries</h2>
      <p>
        Sending us an enquiry, a link, or a document starts a conversation. It
        is not an offer, an agreement, or a commitment by either side, and it
        creates no obligation for us to act. Do not send anything confidential
        that you are not comfortable sharing before terms are in place.
      </p>

      <h2>What you send</h2>
      <p>
        You confirm you are entitled to share whatever you send us, and that it
        contains nothing unlawful or harmful. We handle it as described in our{' '}
        <a href="/privacy">Privacy</a> notice.
      </p>

      <h2>Our content</h2>
      <p>
        The text, design, and code of this site belong to EIGENV. Please do not
        copy or reuse them without permission.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent the law allows, we are not liable for any loss arising
        from your use of, or reliance on, this site.
      </p>

      <h2>Contact</h2>
      <p>
        EIGENV, San Francisco, California.{' '}
        <a href="mailto:ada@eigenv.ai">ada@eigenv.ai</a>.
      </p>
    </Doc>
  );
}
