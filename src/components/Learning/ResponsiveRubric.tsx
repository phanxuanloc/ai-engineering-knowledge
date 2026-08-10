import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type RubricLevel = {description: ReactNode; score: number | string};
export type RubricRow = {dimension: string; levels: RubricLevel[]};

export function ResponsiveRubric({label, rows}: {label: string; rows: RubricRow[]}) {
  const scores = rows[0]?.levels.map((level) => level.score) ?? [];

  return (
    <div className={styles.rubric}>
      <div className={styles.rubricTableView}>
        <table className={styles.rubricTable}>
          <caption className={styles.visuallyHidden}>{label}</caption>
          <thead>
            <tr><th scope="col">Dimension</th>{scores.map((score) => <th key={score} scope="col">{score}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.dimension}>
                <th scope="row">{row.dimension}</th>
                {row.levels.map((level) => <td key={level.score}>{level.description}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div aria-label={label} className={styles.rubricCardView}>
        {rows.map((row) => (
          <section className={styles.rubricCard} key={row.dimension}>
            <h5>{row.dimension}</h5>
            <ol>
              {row.levels.map((level) => (
                <li key={level.score}>
                  <span aria-label={`Score ${level.score}`} className={styles.rubricScore}>{level.score}</span>
                  <span>{level.description}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
