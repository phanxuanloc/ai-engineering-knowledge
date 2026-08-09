import type {CSSProperties, ReactNode} from 'react';
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

type DiagramProps = ChildrenProps & {
  label: string;
  variant?: 'default' | 'architecture';
};

export function Diagram({children, className, label, variant = 'default'}: DiagramProps) {
  return (
    <figure
      className={clsx(styles.diagram, variant === 'architecture' && styles.diagramArchitecture, className)}
      aria-label={label}>
      {children}
    </figure>
  );
}

type FlowProps = ChildrenProps & {
  branches?: number;
  compact?: boolean;
};

export function Flow({branches = 2, children, className, compact = false}: FlowProps) {
  return (
    <div
      className={clsx(styles.flow, compact && styles.flowCompact, className)}
      style={{'--flow-branches': branches} as CSSProperties}>
      {children}
    </div>
  );
}

type StepProps = {
  children?: ReactNode;
  className?: string;
  title: string;
  label?: string;
  compact?: boolean;
};

export function Step({children, className, compact = false, label, title}: StepProps) {
  return (
    <div className={clsx(styles.diagramStep, compact && styles.diagramStepCompact, className)}>
      {label && <span className={styles.cardEyebrow}>{label}</span>}
      <strong className={styles.diagramStepTitle}>{title}</strong>
      {children && <div className={styles.diagramStepContent}>{children}</div>}
    </div>
  );
}

type GroupProps = {
  children?: ReactNode;
  className?: string;
  title: string;
  label?: string;
};

export function Group({children, className, label, title}: GroupProps) {
  return (
    <section className={clsx(styles.diagramGroup, className)}>
      {label && <span className={styles.cardEyebrow}>{label}</span>}
      <h4 className={styles.diagramGroupTitle}>{title}</h4>
      <div className={styles.diagramGroupContent}>{children}</div>
    </section>
  );
}

type ConnectionProps = {
  className?: string;
  label?: string;
};

export function Connection({className, label}: ConnectionProps) {
  return (
    <div className={clsx(styles.connection, className)} aria-hidden={label ? undefined : 'true'}>
      {label && <span>{label}</span>}
    </div>
  );
}

export function Loop({children, className}: ChildrenProps) {
  return (
    <figcaption className={clsx(styles.diagramLoop, className)}>
      <span aria-hidden="true">↺</span>
      {children}
    </figcaption>
  );
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

export type PipelineStep = {
  title: string;
  description?: string;
  label?: string;
  optional?: boolean;
};

type PipelineProps = {
  steps: Array<string | PipelineStep>;
  className?: string;
  label?: string;
  loopLabel?: string;
};

function normalizePipelineStep(step: string | PipelineStep): PipelineStep {
  return typeof step === 'string' ? {title: step} : step;
}

export function Pipeline({
  steps,
  className,
  label = 'Process pipeline',
  loopLabel,
}: PipelineProps) {
  return (
    <figure className={clsx(styles.pipelineFigure, className)} aria-label={label}>
      <ol className={styles.pipeline}>
        {steps.map((rawStep, index) => {
          const step = normalizePipelineStep(rawStep);

          return (
            <li
              className={clsx(styles.pipelineStep, step.optional && styles.pipelineStepOptional)}
              key={`${step.title}-${index}`}>
              <span className={styles.pipelineMeta}>
                <span className={styles.pipelineIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step.label && <span className={styles.pipelineLabel}>{step.label}</span>}
              </span>
              <span className={styles.pipelineTitle}>{step.title}</span>
              {step.description && (
                <span className={styles.pipelineDescription}>{step.description}</span>
              )}
            </li>
          );
        })}
      </ol>
      {loopLabel && (
        <figcaption className={styles.pipelineLoop}>
          <span aria-hidden="true">↺</span>
          {loopLabel}
        </figcaption>
      )}
    </figure>
  );
}
