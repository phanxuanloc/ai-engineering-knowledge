import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {featuredPaths, knowledgeAreas, knowledgeStats, latestKnowledge} from '@site/src/data/knowledge';
import styles from './index.module.css';

export default function Home(): ReactNode {
  return (
    <Layout
      title="AI Engineering Knowledge"
      description="Knowledge base về AI Engineering, Context Engineering, Evaluation và Software Engineering."
    >
      <main>
        <header className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>Learn · Connect · Apply</span>
              <Heading as="h1">Engineering knowledge<br />for the AI era.</Heading>
              <p>Mental models, decision frameworks và practical notes để xây AI-powered software đáng tin cậy — được tổ chức từ foundation tới application.</p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} to="/docs/ai-fundamentals">Khám phá knowledge base <span aria-hidden="true">↗</span></Link>
                <Link className={styles.textButton} to="/#paths-title">Xem learning paths <span aria-hidden="true">↓</span></Link>
              </div>
            </div>

            <aside className={styles.heroOverview} aria-label="Tổng quan knowledge base">
              <div className={styles.overviewHeader}><span>Knowledge index</span><span className={styles.liveDot}>Current</span></div>
              <div className={styles.statsGrid}>
                {knowledgeStats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
              </div>
              <div className={styles.coverageList}>
                {knowledgeAreas.map((area) => (
                  <Link to={area.href} key={area.title}><span>{area.accent}</span><strong>{area.title}</strong><small>{area.articleCount} indexed</small></Link>
                ))}
              </div>
            </aside>
          </div>
        </header>

        <section className={styles.section} aria-labelledby="domains-title">
          <div className="container">
            <div className={styles.sectionHeading}>
              <div><span className={styles.kicker}>Knowledge domains</span><Heading as="h2" id="domains-title">Bắt đầu từ đúng lớp kiến thức</Heading></div>
              <p>Ba domain hiện có phản ánh đúng knowledge đã được capture. Mỗi domain dẫn tới các topic và article thực sự tồn tại.</p>
            </div>
            <div className={styles.domainGrid}>
              {knowledgeAreas.map((area) => (
                <Link className={styles.domainCard} to={area.href} key={area.title}>
                  <div className={styles.cardTop}><span>{area.accent}</span><small>{area.articleCount} indexed notes</small></div>
                  <Heading as="h3">{area.title}</Heading>
                  <p>{area.description}</p>
                  <ul>{area.paths.map((path) => <li key={path}>{path}</li>)}</ul>
                  <strong className={styles.cardLink}>Explore domain <span aria-hidden="true">→</span></strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.contrastSection}`} id="learning-paths" aria-labelledby="paths-title">
          <div className="container">
            <div className={styles.sectionHeading}>
              <div><span className={styles.kicker}>Curated learning paths</span><Heading as="h2" id="paths-title">Đi theo một mental model hoàn chỉnh</Heading></div>
              <p>Mỗi path gom các note có cùng reader question thành một hành trình ngắn, tránh đọc knowledge base như danh sách rời rạc.</p>
            </div>
            <div className={styles.pathList}>
              {featuredPaths.map((path, index) => (
                <Link className={styles.pathRow} to={path.href} key={path.title}>
                  <span className={styles.pathIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <div><small>{path.eyebrow}</small><Heading as="h3">{path.title}</Heading><p>{path.description}</p></div>
                  <div className={styles.pathMeta}><span>{path.meta}</span><strong aria-hidden="true">↗</strong></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="latest-title">
          <div className="container">
            <div className={styles.sectionHeading}>
              <div><span className={styles.kicker}>Recently captured</span><Heading as="h2" id="latest-title">Knowledge mới nhất</Heading></div>
              <Link className={styles.textButton} to="/docs/ai-fundamentals">Browse all docs <span aria-hidden="true">→</span></Link>
            </div>
            <div className={styles.latestGrid}>
              {latestKnowledge.map((item) => (
                <Link className={styles.latestCard} to={item.href} key={item.title}>
                  <time>{item.date}</time><Heading as="h3">{item.title}</Heading><p>{item.description}</p><span>Read note →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
