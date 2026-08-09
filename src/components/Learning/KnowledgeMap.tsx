import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type KnowledgeMapNode = {
  description?: string;
  href?: string;
  title: string;
};

export function KnowledgeMap({levels, label}: {levels: KnowledgeMapNode[][]; label: string}) {
  return (
    <figure className={styles.knowledgeMap} aria-label={label}>
      {levels.map((level, levelIndex) => (
        <div className={styles.mapLevelGroup} key={level.map((node) => node.title).join('-')}>
          <div className={styles.mapLevel}>
            {level.map((node) => {
              const content = <><strong>{node.title}</strong>{node.description && <span>{node.description}</span>}</>;
              return node.href ? <Link className={styles.mapNode} to={node.href} key={node.title}>{content}</Link> : <div className={styles.mapNode} key={node.title}>{content}</div>;
            })}
          </div>
          {levelIndex < levels.length - 1 && <div className={styles.mapConnection} aria-hidden="true">↓</div>}
        </div>
      ))}
    </figure>
  );
}

