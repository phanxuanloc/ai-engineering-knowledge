import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {KnowledgeMap, TopicPath} from '@site/src/components/Learning';
import {contextPath, featuredArticle, knowledgeAreas} from '@site/src/data/knowledge';
import styles from './index.module.css';

const mapLevels = [
  [{title: 'AI Fundamentals', description: 'Nền tảng của AI systems'}],
  [{title: 'AI Coding', description: 'AI trong software workflows'}],
  [{title: 'Context Engineering', description: 'Knowledge đã xuất bản', href: featuredArticle.href}],
  [
    {title: 'RAG', description: 'Retrieval và external knowledge'},
    {title: 'Coding Agents', description: 'Context trong agentic development'},
    {title: 'AI Agents', description: 'Context qua các iterative decisions'},
  ],
  [{title: 'Experiments', description: 'Kiểm chứng thực tế'}],
];

export default function Home(): ReactNode {
  return (
    <Layout title="Kiến thức AI Engineering thực tiễn" description="Mental model, kiến thức và experiment thực tiễn để xây dựng AI-powered software.">
      <main>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div>
                <div className={styles.kicker}>Kho kiến thức engineering công khai</div>
                <Heading as="h1">AI Engineering<br />Knowledge</Heading>
                <p>Kiến thức, mental model và experiment thực tiễn<br className={styles.desktopBreak} /> để xây dựng AI-powered software.</p>
                <div className={styles.heroActions}>
                  <Link className={styles.primaryButton} to={featuredArticle.href}>Bắt đầu tại đây <span aria-hidden="true">→</span></Link>
                  <Link className={styles.ghostButton} to="#find-knowledge-by-area">Khám phá kiến thức</Link>
                </div>
              </div>
              <aside className={styles.heroModel} aria-label="Cấu trúc learning note">
                <span>Cách kiến thức được trình bày</span>
                <ol>
                  {['Concept', 'Mental Model', 'Practical Explanation', 'Example', 'Experiment', 'Self-Test'].map((item, index) => <li key={item}><small>{String(index + 1).padStart(2, '0')}</small><strong>{item}</strong></li>)}
                </ol>
              </aside>
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Khám phá AI Engineering</span><Heading as="h2" id="find-knowledge-by-area">Tìm kiến thức theo lĩnh vực</Heading><p>Duyệt các concept, system và experiment hỗ trợ xây dựng AI-powered software đáng tin cậy.</p></div></div>
            <div className={styles.areaGrid}>
              {knowledgeAreas.map((area) => area.href ? (
                <Link className={styles.areaCard} to={area.href} key={area.title}><span className={styles.areaState}>Knowledge đã xuất bản</span><strong>{area.title}</strong><p>{area.description}</p><small>Khám phá lĩnh vực <span aria-hidden="true">→</span></small></Link>
              ) : (
                <article className={`${styles.areaCard} ${styles.areaCardQuiet}`} key={area.title}><span className={styles.areaState}>Lĩnh vực kiến thức</span><strong>{area.title}</strong><p>{area.description}</p><small>Chưa có article được xuất bản</small></article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.mutedSection}`}>
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Bắt đầu tại đây</span><Heading as="h2">Xây mental model tốt hơn về context</Heading><p>Entry point thực tiễn để hiểu vì sao information được cung cấp cho LLM ảnh hưởng tới reasoning, behavior và output quality.</p></div></div>
            <div className={styles.startGrid}>
              <article className={styles.startCard}>
                <span className={styles.articleCategory}>{featuredArticle.category}</span>
                <Heading as="h3">{featuredArticle.title}</Heading>
                <p>{featuredArticle.description}</p>
                <Link className={styles.primaryButton} to={featuredArticle.href}>Đọc Context Engineering <span aria-hidden="true">→</span></Link>
              </article>
              <TopicPath title="Learning path" items={contextPath} />
            </div>
          </div>
        </section>

        <section className={styles.section} id="knowledge-map">
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Learning Map</span><Heading as="h2">Các lĩnh vực dự kiến kết nối thế nào</Heading><p>Map này thể hiện learning journey dự kiến; chỉ node có link mới đại diện cho knowledge đã được xuất bản.</p></div></div>
            <KnowledgeMap levels={mapLevels} label="Learning Map dự kiến từ AI Engineering foundations tới practical experiments" />
          </div>
        </section>

        <section className={`${styles.section} ${styles.mutedSection}`}>
          <div className="container">
            <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>Knowledge nổi bật</span><Heading as="h2">Learning path nên khám phá</Heading></div></div>
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
