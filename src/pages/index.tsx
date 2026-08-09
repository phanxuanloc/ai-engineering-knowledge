import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {LearningPath} from '@site/src/components/Learning';
import {currentLearning, knowledgeAreas} from '@site/src/data/learning';
import styles from './index.module.css';

export default function Home(): ReactNode {
  return (
    <Layout title="AI Engineering learning dashboard" description="Practical notes, mental models, and experiments for building AI systems.">
      <main>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div>
                <div className={styles.kicker}>Personal learning knowledge base</div>
                <Heading as="h1">AI Engineering<br />Knowledge</Heading>
                <p>Practical notes, mental models, and experiments<br className={styles.desktopBreak} /> for building AI systems.</p>
                <div className={styles.learningLoop} aria-label="Learning loop">Learn <span>→</span> Understand <span>→</span> Experiment <span>→</span> Retain</div>
                <Link className={styles.primaryButton} to={currentLearning.href}>Continue Learning <span aria-hidden="true">→</span></Link>
              </div>
              <aside className={styles.heroStatus} aria-label="Current learning status">
                <span>Current focus</span>
                <strong>{currentLearning.title}</strong>
                <p>Next: Context budgeting</p>
                <div><span>{currentLearning.checkpoints.filter((item) => item.state === 'learned').length} checkpoints captured</span><span>Status: {currentLearning.status}</span></div>
              </aside>
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Current learning</span><Heading as="h2">Keep the thread, deepen the model</Heading></div><Link to={currentLearning.href}>Open note <span aria-hidden="true">→</span></Link></div>
            <div className={styles.currentGrid}>
              <div className={styles.currentSummary}><span className={styles.statusPill}>{currentLearning.status}</span><Heading as="h3">{currentLearning.title}</Heading><p>Thiết kế và quản lý thông tin mà LLM hoặc AI agent cần tại đúng thời điểm.</p><dl><div><dt>Learned since</dt><dd>08 Aug 2026</dd></div><div><dt>Confidence</dt><dd>{currentLearning.confidence}/5 · Can explain</dd></div></dl><Link className={styles.secondaryButton} to={currentLearning.href}>Continue Context Engineering</Link></div>
              <LearningPath title="Learning path" items={currentLearning.checkpoints} />
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.mutedSection}`}>
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Recently learned</span><Heading as="h2">Ideas worth revisiting</Heading></div></div>
            <div className={styles.recentGrid}>{['Context fundamentals','Retrieve vs Select','Context compression'].map((title, index) => <Link className={styles.recentCard} to={`${currentLearning.href}${index === 0 ? '#mental-model' : index === 1 ? '#context-lifecycle--retrieve-vs-select' : '#context-compression'}`} key={title}><span>0{index + 1}</span><strong>{title}</strong><small>Context Engineering</small></Link>)}</div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Knowledge areas</span><Heading as="h2">A map that grows with evidence</Heading><p>Only captured learning is marked available. Empty areas remain intentionally unclaimed.</p></div></div>
            <div className={styles.areaGrid}>{knowledgeAreas.map((area) => area.available ? <Link className={styles.areaCard} to={area.href} key={area.title}><span className={styles.areaState}>Learned knowledge available</span><strong>{area.title}</strong><p>{area.description}</p><small>Explore <span aria-hidden="true">→</span></small></Link> : <div className={`${styles.areaCard} ${styles.areaCardMuted}`} key={area.title}><span className={styles.areaState}>Not learned yet</span><strong>{area.title}</strong><p>{area.description}</p></div>)}</div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
