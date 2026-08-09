import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type ChildrenProps = {children: ReactNode; className?: string};
export function Diagram({children, className, label, variant = 'default'}: ChildrenProps & {label: string; variant?: 'default' | 'architecture'}) {
  return <figure className={clsx(styles.diagram, variant === 'architecture' && styles.diagramArchitecture, className)} aria-label={label}>{children}</figure>;
}
export function Flow({branches = 2, children, className, compact = false}: ChildrenProps & {branches?: number; compact?: boolean}) {
  return <div className={clsx(styles.flow, compact && styles.flowCompact, className)} style={{'--flow-branches': branches} as CSSProperties}>{children}</div>;
}
export function Step({children, className, compact = false, label, title}: {children?: ReactNode; className?: string; title: string; label?: string; compact?: boolean}) {
  return <div className={clsx(styles.diagramStep, compact && styles.diagramStepCompact, className)}>{label && <span className={styles.eyebrow}>{label}</span>}<strong className={styles.diagramStepTitle}>{title}</strong>{children && <div className={styles.diagramStepContent}>{children}</div>}</div>;
}
export function Group({children, className, label, title}: {children?: ReactNode; className?: string; title: string; label?: string}) {
  return <section className={clsx(styles.diagramGroup, className)}>{label && <span className={styles.eyebrow}>{label}</span>}<h4 className={styles.diagramGroupTitle}>{title}</h4><div className={styles.diagramGroupContent}>{children}</div></section>;
}
export function Connection({className, label}: {className?: string; label?: string}) {
  return <div className={clsx(styles.connection, className)} aria-hidden={label ? undefined : 'true'}>{label && <span>{label}</span>}</div>;
}
export function Loop({children, className}: ChildrenProps) {
  return <figcaption className={clsx(styles.diagramLoop, className)}><span aria-hidden="true">↺</span>{children}</figcaption>;
}
export type PipelineStep = {title: string; description?: string; label?: string; optional?: boolean};
export function Pipeline({steps, className, label = 'Process pipeline', loopLabel}: {steps: Array<string | PipelineStep>; className?: string; label?: string; loopLabel?: string}) {
  return <figure className={clsx(styles.pipelineFigure, className)} aria-label={label}><ol className={styles.pipeline}>{steps.map((raw, index) => {const step = typeof raw === 'string' ? {title: raw} : raw; return <li className={clsx(styles.pipelineStep, step.optional && styles.pipelineStepOptional)} key={`${step.title}-${index}`}><span className={styles.pipelineMeta}><span className={styles.pipelineIndex} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{step.label && <span className={styles.pipelineLabel}>{step.label}</span>}</span><span className={styles.pipelineTitle}>{step.title}</span>{step.description && <span className={styles.pipelineDescription}>{step.description}</span>}</li>;})}</ol>{loopLabel && <figcaption className={styles.pipelineLoop}><span aria-hidden="true">↺</span>{loopLabel}</figcaption>}</figure>;
}

export function Architecture({managerItems, providers}: {managerItems: string[]; providers: string[]}) {
  return <Diagram label="Agent architecture: Context Manager builds the information; Model Adapter communicates with providers." variant="architecture"><Step title="Agent" /><Connection /><Group label="Decides what the model receives" title="Context Manager"><Flow compact>{managerItems.map((item) => <Step compact title={item} key={item} />)}</Flow></Group><Connection label="Model request" /><Group label="Decides how the request is sent" title="Model Adapter"><Flow compact>{providers.map((item) => <Step compact title={item} key={item} />)}</Flow></Group></Diagram>;
}

