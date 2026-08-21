import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './Landing.module.css';

type GridProps = {children: ReactNode; columns?: 2 | 3; className?: string};

type LandingCardProps = {
  to: string;
  title: string;
  description: ReactNode;
  eyebrow?: string;
};

export function LandingCardGrid({children, columns = 2, className}: GridProps) {
  return (
    <div className={clsx(styles.grid, columns === 3 && styles.gridThree, className)}>
      {children}
    </div>
  );
}

export function LandingCard({to, title, description, eyebrow}: LandingCardProps) {
  return (
    <Link className={styles.card} to={to}>
      <article>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <h3>{title}</h3>
        <div className={styles.description}>{description}</div>
        <span className={styles.action} aria-hidden="true">Open topic →</span>
      </article>
    </Link>
  );
}
