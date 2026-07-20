import EngageHero from '@/components/EngageHero';
import Draw from '@/components/Draw';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import HeatField from '@/components/HeatField';
import Masthead from '@/components/Masthead';
import NodeField from '@/components/NodeField';
import Poster from '@/components/Poster';
import Registration from '@/components/Registration';
import SmoothScroll from '@/components/SmoothScroll';
import Timeline from '@/components/Timeline';
import { AUDIENCES, CONTACT_EMAIL, SERVICES } from '@/content';
import styles from './page.module.css';

const ENGAGEMENT = [
  {
    group: 'Sales process',
    item: 'Pipeline stages, qualification, milestones, and handoffs, documented.',
  },
  {
    group: 'Strategy',
    item: 'Enterprise positioning, and the plays that fit your stage.',
  },
  {
    group: 'Enablement',
    item: 'CRM configured for tracking and forecasting. Materials and templates.',
  },
  {
    group: 'Deal support',
    item: 'Deal strategy, account planning, pricing, and packaging on live deals.',
  },
  {
    group: 'Reporting',
    item: 'Metrics, cadences, and honest reads to leadership.',
  },
];

const CASE_STEPS = [
  {
    index: '01',
    name: 'What we walked into',
    body: 'Founder-led selling. Deals living in inboxes, forecasting by feel.',
  },
  {
    index: '02',
    name: 'What we built',
    body: 'A documented process, the CRM as source of truth, playbooks, and OKRs tuned to growth.',
  },
  {
    index: '03',
    name: 'What the team kept',
    body: 'Reporting their leadership trusts, and the people trained to run it.',
  },
];

const PRINCIPLES = [
  { name: 'Owners and operators', body: 'For the long run, not the quarter.' },
];

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <a className="skip" href="#top">
        Skip to content
      </a>
      <Masthead />

      <main id="top" tabIndex={-1}>
        {/* 01 — the field. Headline, its second voice, and the candour line.
            Nothing else: the hero should not summarise the site. */}
        <Poster
          labelledBy="plate-01"
          tone="paper"
          meta={
            <>
              WE BUILD AND
              <br />
              OPERATE COMPANIES
              <br />
              PLATE 01 / 08
            </>
          }
          visual={<HeatField decayOnScroll={0.55} />}
        >
          <EngageHero headingId="plate-01" />
        </Poster>

        {/* 02 — what we do */}
        <Poster
          id="what-we-do"
          labelledBy="plate-02"
          layout="invert"
          tone="cobalt"
          bleed={false}
          captions={[
            'Engagements run about three months. Everything we build, you keep.',
          ]}
          meta={
            <>
              WHAT WE DO
              <br />
              PLATE 02 / 08
            </>
          }
          visual={
            <Draw rules={`.${styles.entry}`} stagger={0.06}>
              <ol role="list" className={styles.index}>
              {SERVICES.map((service) => (
                <li key={service.id} id={service.id} className={styles.entry}>
                  <span className={`meta ${styles.entryIndex}`}>{service.index}</span>
                  <div className={styles.entryBody}>
                    <h3 className={styles.entryName}>{service.name}</h3>
                    <p className={styles.entryText}>{service.body}</p>
                  </div>
                  <p className={styles.entryKeep}>
                    <span className="meta">You get</span>
                    <span className={styles.entryKeepValue}>{service.keep}</span>
                  </p>
                </li>
              ))}
              </ol>
            </Draw>
          }
        >
          <h2 id="plate-02" className={`display ${styles.quiet}`}>
            Built with your team.{' '}
            <span className={styles.accent}>Not handed over as a document.</span>
          </h2>
        </Poster>

        {/* 03 — who we work with */}
        <Poster
          id="who-we-work-with"
          labelledBy="plate-03"
          align="right"
          tone="paper"
          bleed={false}
          meta={
            <>
              WHO WE WORK WITH
              <br />
              PLATE 03 / 08
            </>
          }
          visual={
            <Draw className={styles.audiences} rules={`.${styles.audience}`} stagger={0.07}>
              {AUDIENCES.map((audience) => (
                <article
                  key={audience.id}
                  id={audience.id}
                  className={styles.audience}
                >
                  <h3 className={styles.audienceName}>{audience.who}</h3>
                  <p className={styles.audienceText}>{audience.body}</p>
                </article>
              ))}
            </Draw>
          }
        >
          <h2 id="plate-03" className={`display ${styles.quiet}`}>
            Different seats, <span className={styles.accent}>same work.</span>
          </h2>
        </Poster>

        {/* 04 — the specification */}
        <Poster
          id="engagement"
          labelledBy="plate-04"
          layout="invert" align="right"
          tone="ink"
          bleed={false}
          captions={[
            'What we ask of you: a deal owner, pipeline access, an hour a week.',
          ]}
          meta={
            <>
              INSIDE A CONSULTING
              <br />
              ENGAGEMENT
              <br />
              PLATE 04 / 08
            </>
          }
          visual={
            <div className={styles.spec}>
              <Timeline />
              <Draw className={styles.specGroups} rules={`.${styles.specGroup}`} stagger={0.06}>
                {ENGAGEMENT.map((group) => (
                  <section key={group.group} className={styles.specGroup}>
                    <h3 className={`meta ${styles.specHeading}`}>{group.group}</h3>
                    <p className={styles.specItem}>{group.item}</p>
                  </section>
                ))}
              </Draw>
            </div>
          }
          stubs={[
            { label: 'You keep', value: 'A documented process' },
            { label: 'You keep', value: 'A working CRM' },
            { label: 'You keep', value: 'A trained team' },
            { label: 'You keep', value: 'Metrics leadership trusts' },
          ]}
        >
          <h2 id="plate-04" className={`display ${styles.quiet}`}>
            We don&rsquo;t advise from the sidelines.
          </h2>
        </Poster>

        {/* 05 — a recent build */}
        <Poster
          labelledBy="plate-05"
          layout="invert"
          tone="paper"
          bleed={false}
          captions={[
            'Deliberately anonymous. No client names, no invented numbers.',
          ]}
          meta={
            <>
              A RECENT BUILD
              <br />
              PLATE 05 / 08
            </>
          }
          visual={
            <div className={styles.note}>
              <Registration className={styles.rule} />
              <Draw className={styles.steps} rules={`.${styles.step}`} stagger={0.08}>
              <ol role="list" style={{ display: 'contents' }}>
                {CASE_STEPS.map((step) => (
                  <li key={step.index} className={styles.step}>
                    <span className={`meta ${styles.stepIndex}`}>{step.index}</span>
                    <h3 className={styles.stepName}>{step.name}</h3>
                    <p className={styles.stepText}>{step.body}</p>
                  </li>
                ))}
              </ol>
              </Draw>
            </div>
          }
        >
          <h2 id="plate-05" className={`display ${styles.quiet}`}>
            Good companies rarely lack ambition.{' '}
            <span className={styles.accent}>They lack time.</span>
          </h2>
        </Poster>

        {/* 06 — ownership. The only plate that discusses buying. */}
        <Poster
          id="we-buy-companies"
          labelledBy="plate-06"
          layout="split"
          tone="cobalt"
          captions={[
            'We are owners, not a fund. No fund clock, no forced exit, no fixed horizon.',
          ]}
          meta={
            <>
              WE BUY COMPANIES
              <br />
              PLATE 06 / 08
            </>
          }
          visual={
            <NodeField
              node="var(--sky)"
              edge="var(--sky)"
              marker="square"
              arcs
              seed={19}
              clusters={4}
              perCluster={3}
              strays={4}
              neighbours={3}
            />
          }
        >
          <h2 id="plate-06" className={`display ${styles.quiet}`}>
            We buy to run.{' '}
            <span className={styles.accent}>A home, not an exit.</span>
          </h2>
          <div className={styles.buy}>
            <section>
              <h3 className={`meta ${styles.buyHeading}`}>What we buy</h3>
              <p className={styles.buyText}>
                A proven product customers already pay for. A durable niche. A
                team worth keeping, and an owner ready for what comes next.
              </p>
            </section>
            <section>
              <h3 className={`meta ${styles.buyHeading}`}>What you get</h3>
              <p className={styles.buyText}>
                A direct conversation, a fair price, and a clean close. The
                people who built it keep building it.
              </p>
            </section>
            <section>
              <h3 className={`meta ${styles.buyHeading}`}>Conduct</h3>
              <p className={styles.buyText}>
                When we are a buyer, we say so on day one. Never the adviser hat
                and the buyer hat at once. Size and sector ranges follow once the
                first deals set them.
              </p>
            </section>
          </div>
        </Poster>

        {/* 07 — about */}
        <Poster
          id="about"
          labelledBy="plate-07"
          layout="split-reverse"
          tone="paper"
          meta={
            <>
              ABOUT
              <br />
              PLATE 07 / 08
            </>
          }
          visual={
            <NodeField
              node="var(--cobalt)"
              edge="var(--ink)"
              seed={53}
              clusters={5}
              perCluster={4}
              strays={4}
              neighbours={2}
            />
          }
        >
          <h2 id="plate-07" className={`display ${styles.quiet}`}>
            Find the direction worth holding.
          </h2>
          <div className={styles.about}>
            <section>
              <h3 className={`meta ${styles.buyHeading}`}>The name</h3>
              <p className={styles.buyText}>
                An eigenvector is the direction a transformation does not turn.
                It only scales it. Everything around it changes; the direction
                holds.
              </p>
            </section>
            <section>
              <h3 className={`meta ${styles.buyHeading}`}>How we work</h3>
              <ul role="list" className={styles.principles}>
                {PRINCIPLES.map((principle) => (
                  <li key={principle.name}>
                    <span className={styles.principleName}>{principle.name}</span>
                    <span className={styles.principleText}>{principle.body}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className={`meta ${styles.buyHeading}`}>How we&rsquo;re built</h3>
              <p className={styles.buyText}>
                Operator-led. The go-to-market system described here is a
                playbook we have built and run inside companies at this stage.
              </p>
              <p className={`caption ${styles.pending}`}>
                The bench appears here as bios are confirmed.
              </p>
            </section>
          </div>
        </Poster>

        {/* 08 — contact */}
        <Poster
          id="contact"
          labelledBy="plate-08"
          layout="split"
          size="half"
          tone="cobalt"
          captions={[
            'If we can help, we will say so. If we cannot, we will say that.',
          ]}
          meta={
            <>
              CONTACT
              <br />
              PLATE 08 / 08
            </>
          }
          visual={<HeatField palette="cobalt" threshold={0.34} />}
        >
          <h2 id="plate-08" className={`display ${styles.quiet}`}>
            Tell us what you&rsquo;re building.
          </h2>
          <LeadForm />
          <p className={`meta ${styles.direct}`}>
            Or write directly at{' '}
            <a className={styles.mailto} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </Poster>
      </main>

      <Footer />
    </>
  );
}
