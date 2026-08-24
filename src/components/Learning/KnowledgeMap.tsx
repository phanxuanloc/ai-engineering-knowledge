import Link from '@docusaurus/Link';
import styles from './KnowledgeMap.module.css';

export type KnowledgeMapNode = {
  description?: string;
  href?: string;
  title: string;
};

type IndexedLevel = {
  index: number;
  level: KnowledgeMapNode[];
};

function chunkLevels(levels: KnowledgeMapNode[][], size: number): IndexedLevel[][] {
  const indexed = levels.map((level, index) => ({index, level}));
  const rows: IndexedLevel[][] = [];

  for (let start = 0; start < indexed.length; start += size) {
    rows.push(indexed.slice(start, start + size));
  }

  return rows;
}

export function KnowledgeMap({levels, label}: {levels: KnowledgeMapNode[][]; label: string}) {
  const nodeCount = levels.reduce((total, level) => total + level.length, 0);
  const shouldWrap = levels.length >= 5;
  const rows = shouldWrap ? chunkLevels(levels, 4) : [];

  const renderLevel = ({level, index}: IndexedLevel) => (
    <div className={styles.mapLevelGroup} key={level.map((node) => node.title).join('-')}>
      <div className={styles.mapIndexRow} aria-hidden="true">
        <span className={styles.mapIndexDot} />
        <span className={styles.mapIndex}>{String(index + 1).padStart(2, '0')}</span>
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
  );

  return (
    <figure className={styles.knowledgeMap} aria-label={label}>
      <div className={styles.mapHeader}>
        <span className={styles.mapHeaderLabel}>Topic map</span>
        <span className={styles.mapHeaderMeta}>{levels.length} layers · {nodeCount} concepts</span>
      </div>

      {shouldWrap ? (
        <div className={`${styles.mapTrack} ${styles.mapTrackWrapped}`}>
          {rows.map((row, rowIndex) => (
            <div
              className={`${styles.mapRow} ${rowIndex % 2 === 1 ? styles.mapRowReverse : ''}`}
              key={`row-${row[0].index}`}
            >
              {row.map(renderLevel)}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.mapTrack}>
          {levels.map((level, index) => renderLevel({level, index}))}
        </div>
      )}
    </figure>
  );
}
