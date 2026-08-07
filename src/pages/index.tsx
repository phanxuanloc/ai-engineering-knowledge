import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={`hero hero--primary ${styles.heroBanner}`}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/ai-coding/context-engineering">
            Explore the knowledge base
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Practical AI engineering notes"
      description="Mental models, examples, experiments, and self-tests for AI engineering.">
      <HomepageHeader />
      <main>
        <section className={styles.intro}>
          <div className="container">
            <Heading as="h2">Learn by explaining and experimenting</Heading>
            <p>
              Each note turns a topic into an actionable mental model, a
              concrete example, common pitfalls, a personal experiment, and a
              self-test.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
