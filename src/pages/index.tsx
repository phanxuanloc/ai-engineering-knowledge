import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {KnowledgeMap, TopicPath} from '@site/src/components/Learning';
import {contextPath, featuredArticle, knowledgeAreas} from '@site/src/data/knowledge';
import styles from './index.module.css';

const mapLevels = [
  [{title: 'AI Fundamentals', description: 'Core ideas behind AI systems'}],
  [{title: 'AI Coding', description: 'AI inside software workflows'}],
  [{title: 'Context Engineering', description: 'Published guide', href: featuredArticle.href}],
  [
    {title: 'RAG', description: 'Retrieval and external knowledge'},
    {title: 'Coding Agents', description: 'Context in agentic development'},
    {title: 'AI Agents', description: 'Context across iterative decisions'},
  ],
  [{title: 'Experiments', description: 'Practical validation'}],
];

export default function Home(): ReactNode {
  return (
    <Layout title="Practical AI Engineering knowledge" description="Practical knowledge, mental models, and experiments for building AI-powered software.">
      <main>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div>
                <div className={styles.kicker}>Public engineering knowledge base</div>
                <Heading as="h1">AI Engineering<br />Knowledge</Heading>
                <p>Practical knowledge, mental models, and experiments<br className={styles.desktopBreak} /> for building AI-powered software.</p>
                <div className={styles.heroActions}>
                  <Link className={styles.primaryButton} to={featuredArticle.href}>Start Here <span aria-hidden="true">→</span></Link>
                  <Link className={styles.ghostButton} to="#find-knowledge-by-area">Explore Knowledge</Link>
                </div>
              </div>
              <aside className={styles.heroModel} aria-label="Knowledge article structure">
                <span>How knowledge is presented</span>
                <ol>
                  {['Concept', 'Mental Model', 'Practical Explanation', 'Example', 'Experiment', 'Self-Test'].map((item, index) => <li key={item}><small>{String(index + 1).padStart(2, '0')}</small><strong>{item}</strong></li>)}
                </ol>
              </aside>
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Explore AI Engineering</span><Heading as="h2" id="find-knowledge-by-area">Find knowledge by area</Heading><p>Browse the concepts, systems, and experiments that shape reliable AI-powered software.</p></div></div>
            <div className={styles.areaGrid}>
              {knowledgeAreas.map((area) => area.href ? (
                <Link className={styles.areaCard} to={area.href} key={area.title}><span className={styles.areaState}>Published knowledge</span><strong>{area.title}</strong><p>{area.description}</p><small>Explore area <span aria-hidden="true">→</span></small></Link>
              ) : (
                <article className={`${styles.areaCard} ${styles.areaCardQuiet}`} key={area.title}><span className={styles.areaState}>Knowledge area</span><strong>{area.title}</strong><p>{area.description}</p><small>No published articles yet</small></article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.mutedSection}`}>
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Start here</span><Heading as="h2">Build a better model of context</Heading><p>A practical entry point for understanding why the information given to an LLM shapes its reasoning, behavior, and output quality.</p></div></div>
            <div className={styles.startGrid}>
              <article className={styles.startCard}>
                <span className={styles.articleCategory}>{featuredArticle.category}</span>
                <Heading as="h3">{featuredArticle.title}</Heading>
                <p>{featuredArticle.description}</p>
                <Link className={styles.primaryButton} to={featuredArticle.href}>Read Context Engineering <span aria-hidden="true">→</span></Link>
              </article>
              <TopicPath title="Inside this guide" items={contextPath} />
            </div>
          </div>
        </section>

        <section className={styles.section} id="knowledge-map">
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Knowledge map</span><Heading as="h2">See how the areas connect</Heading><p>This map shows conceptual relationships across the knowledge base, helping readers move from foundations toward systems and practical validation.</p></div></div>
            <KnowledgeMap levels={mapLevels} label="AI Engineering knowledge relationships from foundations through practical experiments" />
          </div>
        </section>

        <section className={`${styles.section} ${styles.mutedSection}`}>
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Featured knowledge</span><Heading as="h2">A complete guide worth exploring</Heading></div></div>
            <Link className={styles.featuredCard} to={featuredArticle.href}>
              <div><span>{featuredArticle.category}</span><Heading as="h3">{featuredArticle.title}</Heading><p>{featuredArticle.description}</p></div>
              <span className={styles.featuredArrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
