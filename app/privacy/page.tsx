import type { Metadata } from 'next';
import Doc from '@/components/Doc';

export const metadata: Metadata = { title: 'Privacy' };

/* Plain-language and accurate to what the site actually does. Have counsel
   review and add your legal entity, registration, and jurisdiction before
   relying on it. */

export default function Privacy() {
  return (
    <Doc title="Privacy" updated="20 July 2026">
      <p>
        This is a short, honest account of what EIGENV collects when you visit
        this site and what we do with it. We have tried to keep it to what is
        true rather than what is customary.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>What you send us.</strong> If you use the contact form, we
          receive your name, company email, and anything else you choose to add
          (role, company, timing, a link, or a PDF).
        </li>
        <li>
          <strong>Visit analytics.</strong> On each page we record the page
          path, where you arrived from, campaign tags in the link, your coarse
          location (country, region, city), and your device, browser, operating
          system, language, screen size, and timezone.
        </li>
        <li>
          <strong>Company, for business visitors.</strong> We may identify the
          organisation associated with your network. This is company-level, not
          about you personally.
        </li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not store your raw IP address.</li>
        <li>
          We set no cookie at all unless you accept analytics. There is no
          cross-site tracking, no advertising profile, and no fingerprint built
          to follow you after you clear your browser.
        </li>
        <li>
          We do not record what you type, replay your session, or buy data about
          you from third parties.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        The only cookie this site can set is a first-party analytics identifier,
        and only if you choose <strong>Accept analytics</strong>. It lets us
        recognise a returning visit so our numbers reflect people rather than
        page loads. Choose <strong>Necessary only</strong> and no cookie is set
        and no analytics beacon is sent. You can change your mind by clearing
        this site&rsquo;s data in your browser.
      </p>

      <h2>Why we are allowed to</h2>
      <p>
        We handle what you send us to respond to your enquiry. Anonymous,
        cookieless visit analytics run under our legitimate interest in
        understanding traffic. The analytics cookie and any company
        identification run on your consent.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Enquiries are kept for as long as we are in contact and a reasonable
        period after. Visit analytics are kept in aggregate. Ask us to delete
        anything relating to you at any time.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see, correct, or delete the information we hold about you,
        or object to how we use it. Write to{' '}
        <a href="mailto:ada@eigenv.ai">ada@eigenv.ai</a> and we will act on it.
      </p>

      <h2>Contact</h2>
      <p>
        EIGENV, San Francisco, California.{' '}
        <a href="mailto:ada@eigenv.ai">ada@eigenv.ai</a>.
      </p>
    </Doc>
  );
}
