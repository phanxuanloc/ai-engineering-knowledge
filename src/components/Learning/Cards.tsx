import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type ChildrenProps = {children: ReactNode; className?: string};

export function ConceptCard({children, className, eyebrow, title}: ChildrenProps & {title: string; eyebrow?: string}) {
  return <article className={clsx(styles.conceptCard, className)}>{eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}<h3 className={styles.cardTitle}>{title}</h3><div className={styles.cardContent}>{children}</div></article>;
}

export function ConceptGrid({children, className, columns}: ChildrenProps & {columns?: 2 | 3}) {
  return <div className={clsx(styles.conceptGrid, columns === 2 && styles.conceptGridTwo, columns === 3 && styles.conceptGridThree, className)}>{children}</div>;
}

export type ComparisonItem = {title: string; description: ReactNode; eyebrow?: string};
export function Comparison({items, className, columns, label = 'Concept comparison'}: {items: ComparisonItem[]; className?: string; columns?: 2; label?: string}) {
  return <div className={clsx(styles.comparison, columns === 2 && styles.comparisonTwo, className)} aria-label={label}>{items.map((item) => <div className={styles.comparisonItem} key={item.title}>{item.eyebrow && <div className={styles.eyebrow}>{item.eyebrow}</div>}<div className={styles.comparisonTitle}>{item.title}</div><div className={styles.comparisonDescription}>{item.description}</div></div>)}</div>;
}
