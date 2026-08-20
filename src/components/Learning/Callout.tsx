import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type CalloutProps = {
  children: ReactNode;
  className?: string;
  label?: string;
  title?: string;
  tone?: 'insight' | 'remember' | 'distinction';
};

export function LearningCallout({
  children,
  className,
  label = 'Key insight',
  title,
  tone = 'insight',
}: CalloutProps) {
  return (
    <aside className={clsx(styles.callout, styles[`callout_${tone}`], className)} aria-label={label}>
      <div className={styles.calloutMarker} aria-hidden="true" />
      <div>
        <div className={styles.eyebrow}>{label}</div>
        {title && <div className={styles.calloutTitle}>{title}</div>}
        <div className={styles.calloutContent}>{children}</div>
      </div>
    </aside>
  );
}

export function TLDR({children, className}: Omit<CalloutProps, 'tone'>) {
  return (
    <LearningCallout className={className} label="TL;DR" tone="insight">
      {children}
    </LearningCallout>
  );
}

export function KeyInsight(props: Omit<CalloutProps, 'tone'>) {
  return <LearningCallout {...props} label={props.label ?? 'Key insight'} tone="insight" />;
}

export function Remember(props: Omit<CalloutProps, 'tone'>) {
  return <LearningCallout {...props} label={props.label ?? 'Remember'} tone="remember" />;
}

export function ImportantDistinction(props: Omit<CalloutProps, 'tone'>) {
  return <LearningCallout {...props} label={props.label ?? 'Important distinction'} tone="distinction" />;
}

export function Principle({children, className, label = 'Principle'}: CalloutProps) {
  return (
    <LearningCallout className={className} label={label} tone="remember">
      {children}
    </LearningCallout>
  );
}
