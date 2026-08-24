import Link from '@docusaurus/Link';
import styles from './KnowledgeMap.module.css';

export type KnowledgeMapNode = {
  description?: string;
  href?: string;
  title: string;
};

export function KnowledgeMap({levels, label}: {levels: KnowledgeMapNode[][]; label: string}) {
  const nodeCount = levels.reduce((total, level) => total + level.length, 0);

  return (
    <figure className={styles.knowledgeMap} aria-label={label}>
      <div className={styles.mapHeader}>
        <span className={styles.mapHeaderLabel}>Topic map</span>
        <span className={styles.mapHeaderMeta}>{levels.length} layers · {nodeCount} concepts</span>
      </div>

      <div className={styles.mapTrack}>
        {levels.map((level, levelIndex) => (
          <div className={styles.mapLevelGroup} key={level.map((node) => node.title).join('-')}>
            <div className={styles.mapIndexRow} aria-hidden="true">
              <span className={styles.mapIndexDot} />
              <span className={styles.mapIndex}>{String(levelIndex + 1).padStart(2, '0')}</span>
            </div>

            <div className={styles.mapLevel}>
              {level.map((node) => {
                const content = (
                  <>
                    <strong>{node.title}</strong>
                    {node.description && <span>{node.description}</span>}
                  </>
                );

                return node.href ? (
                  <Link className={styles.mapNode} to={node.href} key={node.title}>{content}</Link>
                ) : (
                  <div className={styles.mapNode} key={node.title}>{content}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
