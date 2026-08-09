import clsx from 'clsx';
import styles from './styles.module.css';
export type LearningPathItem = {title: string; state: 'learned' | 'current' | 'next' | 'not-started'};
export function LearningPath({items, title}: {items: LearningPathItem[]; title?: string}) {
  return <section className={styles.learningPath} aria-label={title ? `${title} learning path` : 'Learning path'}>{title && <h3 className={styles.learningPathTitle}>{title}</h3>}<ol>{items.map((item) => <li className={clsx(styles.pathItem, styles[`path_${item.state}`])} key={item.title}><span className={styles.pathIcon} aria-hidden="true">{item.state === 'learned' ? '✓' : item.state === 'current' ? '•' : item.state === 'next' ? '→' : '○'}</span><span>{item.title}</span>{item.state === 'next' && <span className={styles.pathBadge}>Next</span>}<span className="sr-only"> — {item.state}</span></li>)}</ol></section>;
}

