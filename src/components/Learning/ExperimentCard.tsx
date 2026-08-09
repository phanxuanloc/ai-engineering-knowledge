import type {ReactNode} from 'react';
import styles from './styles.module.css';
const statusLabel = {'not-started': 'Not started', 'in-progress': 'In progress', completed: 'Completed'} as const;
export function ExperimentCard({children, status, title}: {children: ReactNode; status: keyof typeof statusLabel; title?: string}) {
  return <section className={styles.experimentCard} aria-label={`Experiment: ${statusLabel[status]}`}><div className={styles.experimentHeader}><div><div className={styles.eyebrow}>Experiment</div>{title && <h3>{title}</h3>}</div><span className={styles.experimentStatus} data-status={status}><span aria-hidden="true" />{statusLabel[status]}</span></div><div className={styles.experimentContent}>{children}</div></section>;
}

