import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type ChildrenProps = {
  children: ReactNode;
  className?: string;
};

export function TLDR({children, className}: ChildrenProps) {
  return (
    <aside className={clsx(styles.tldr, className)} aria-label="TL;DR summary">
      <div className={styles.tldrLabel}>In short</div>
      <div className={styles.tldrContent}>{children}</div>
    </aside>
  );
}

type PrincipleProps = ChildrenProps & {
  label?: string;
};

export function Principle({children, className, label = 'Principle'}: PrincipleProps) {
  return (
    <aside className={clsx(styles.principle, className)} aria-label={label}>
      <span className={styles.principleLabel}>{label}</span>
      <div className={styles.principleContent}>{children}</div>
    </aside>
  );
}

type ConceptCardProps = ChildrenProps & {
  title: string;
  eyebrow?: string;
};

export function ConceptCard({children, className, eyebrow, title}: ConceptCardProps) {
  return (
    <article className={clsx(styles.conceptCard, className)}>
      {eyebrow && <div className={styles.cardEyebrow}>{eyebrow}</div>}
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardContent}>{children}</div>
    </article>
  );
}

export function ConceptGrid({children, className}: ChildrenProps) {
  return <div className={clsx(styles.conceptGrid, className)}>{children}</div>;
}

export type ComparisonItem = {
  title: string;
  description: ReactNode;
  eyebrow?: string;
};

type ComparisonProps = {
  items: ComparisonItem[];
  className?: string;
  label?: string;
};

export function Comparison({items, className, label = 'Concept comparison'}: ComparisonProps) {
  return (
    <div className={clsx(styles.comparison, className)} aria-label={label}>
      {items.map((item) => (
        <div className={styles.comparisonItem} key={item.title}>
          {item.eyebrow && <div className={styles.cardEyebrow}>{item.eyebrow}</div>}
          <div className={styles.comparisonTitle}>{item.title}</div>
          <div className={styles.comparisonDescription}>{item.description}</div>
        </div>
      ))}
    </div>
  );
}

type PipelineProps = {
  steps: string[];
  className?: string;
  label?: string;
};

export function Pipeline({steps, className, label = 'Process pipeline'}: PipelineProps) {
  return (
    <ol className={clsx(styles.pipeline, className)} aria-label={label}>
      {steps.map((step, index) => (
        <li className={styles.pipelineStep} key={`${step}-${index}`}>
          <span className={styles.pipelineIndex} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}
