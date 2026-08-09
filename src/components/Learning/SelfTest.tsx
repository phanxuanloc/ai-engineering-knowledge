import type {ReactNode} from 'react';
import styles from './styles.module.css';
export type SelfTestItem = {question: string; answer: ReactNode};
export function SelfTest({items}: {items: SelfTestItem[]}) {
  return <section className={styles.selfTest} aria-label="Self-test questions"><div className={styles.selfTestHeader}><div><div className={styles.eyebrow}>Recall practice</div><h3>Self-test</h3></div><span>{items.length} questions</span></div><div className={styles.selfTestList}>{items.map((item, index) => <details className={styles.selfTestItem} key={item.question}><summary><span className={styles.questionNumber}>{String(index + 1).padStart(2, '0')}</span><span>{item.question}</span><span className={styles.reveal}>Show answer</span></summary><div className={styles.answer}>{item.answer}</div></details>)}</div></section>;
}
