import {useMemo, useState} from 'react';
import {
  defaultContextItems,
  selectContext,
  type ContextItem,
  type SelectionReason,
} from './contextManager';
import styles from './styles.module.css';

const reasonLabel: Record<SelectionReason, string> = {
  mandatory: 'Pinned / mandatory',
  selected: 'Selected for this decision',
  stale: 'Rejected: stale',
  'low-relevance': 'Rejected: low relevance',
  'over-budget': 'Rejected: over budget',
};

const stages = [
  'Retrieve candidates',
  'Pin mandatory context',
  'Filter stale / irrelevant',
  'Score and rank',
  'Spend token budget',
  'Assemble final context',
];

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function ContextManagerPlayground() {
  const [items, setItems] = useState<ContextItem[]>(defaultContextItems);
  const [budget, setBudget] = useState(2500);
  const [runVersion, setRunVersion] = useState(0);
  const [activeStage, setActiveStage] = useState(stages.length - 1);

  const result = useMemo(() => selectContext(items, budget), [items, budget, runVersion]);

  const updateItem = (id: string, field: 'relevance' | 'freshness', value: number) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? {...item, [field]: value} : item)),
    );
  };

  const runSelection = () => {
    setActiveStage(0);
    setRunVersion((version) => version + 1);
    stages.slice(1).forEach((_, index) => {
      window.setTimeout(() => setActiveStage(index + 1), 180 * (index + 1));
    });
  };

  const reset = () => {
    setItems(defaultContextItems);
    setBudget(2500);
    setActiveStage(stages.length - 1);
    setRunVersion((version) => version + 1);
  };

  const usage = Math.min(100, Math.round((result.usedTokens / budget) * 100));

  return (
    <section className={styles.playground} aria-label="Interactive Context Manager v0 playground">
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Interactive lab · Context Manager v0</div>
          <h3>Fix login 401</h3>
          <p>
            Chỉnh budget, relevance hoặc freshness rồi chạy lại selection để xem context nào
            thực sự được đưa vào model.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            Reset
          </button>
          <button type="button" className={styles.primaryButton} onClick={runSelection}>
            Run selection
          </button>
        </div>
      </div>

      <div className={styles.pipeline} aria-label="Context Manager selection pipeline">
        {stages.map((stage, index) => (
          <div
            key={stage}
            className={styles.stage}
            data-state={index < activeStage ? 'done' : index === activeStage ? 'active' : 'idle'}>
            <span>{index + 1}</span>
            <strong>{stage}</strong>
          </div>
        ))}
      </div>

      <div className={styles.controlsPanel}>
        <label htmlFor="context-budget" className={styles.budgetLabel}>
          <span>
            Token budget <strong>{budget.toLocaleString()}</strong>
          </span>
          <span className={styles.muted}>Ceiling, not a quota</span>
        </label>
        <input
          id="context-budget"
          className={styles.range}
          type="range"
          min="1200"
          max="3600"
          step="100"
          value={budget}
          onChange={(event) => setBudget(Number(event.target.value))}
        />
        <div className={styles.usageTrack} aria-label={`${usage}% of token budget used`}>
          <span style={{width: `${usage}%`}} />
        </div>
        <div className={styles.usageMeta}>
          <span>{result.usedTokens.toLocaleString()} used</span>
          <span>{Math.max(0, budget - result.usedTokens).toLocaleString()} free</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.candidates}>
          <div className={styles.sectionHeading}>
            <div>
              <div className={styles.eyebrow}>Retrieval output</div>
              <h4>Context candidates</h4>
            </div>
            <span className={styles.count}>{items.length} items</span>
          </div>

          <div className={styles.candidateList}>
            {result.items.map((item) => (
              <article key={item.id} className={styles.candidate} data-selected={item.selected}>
                <div className={styles.candidateTop}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.source}</span>
                  </div>
                  <div className={styles.badges}>
                    {item.kind === 'mandatory' && <span data-kind="mandatory">Pinned</span>}
                    <span>{item.tokenCost} tok</span>
                    <span>score {item.score.toFixed(2)}</span>
                  </div>
                </div>

                {item.kind === 'selectable' ? (
                  <div className={styles.signalGrid}>
                    <label>
                      <span>Relevance {formatPercent(item.relevance)}</span>
                      <input
                        className={styles.range}
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={item.relevance}
                        onChange={(event) =>
                          updateItem(item.id, 'relevance', Number(event.target.value))
                        }
                      />
                    </label>
                    <label>
                      <span>Freshness {formatPercent(item.freshness)}</span>
                      <input
                        className={styles.range}
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={item.freshness}
                        onChange={(event) =>
                          updateItem(item.id, 'freshness', Number(event.target.value))
                        }
                      />
                    </label>
                  </div>
                ) : (
                  <p className={styles.lockedSignal}>Mandatory context bypasses competitive ranking.</p>
                )}

                <div className={styles.reason} data-reason={item.reason}>
                  <span aria-hidden="true">{item.selected ? '✓' : '×'}</span>
                  {reasonLabel[item.reason]}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className={styles.resultPanel} aria-live="polite">
          <div className={styles.sectionHeading}>
            <div>
              <div className={styles.eyebrow}>Model input</div>
              <h4>Final context</h4>
            </div>
            <span className={styles.count}>{result.selected.length} selected</span>
          </div>

          <div className={styles.contextWindow}>
            {result.selected.map((item) => (
              <div key={item.id} className={styles.selectedItem}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.kind === 'mandatory' ? 'Pinned' : `score ${item.score.toFixed(2)}`}</span>
                </div>
                <b>{item.tokenCost}</b>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div>
              <span>Budget</span>
              <strong>{budget.toLocaleString()}</strong>
            </div>
            <div>
              <span>Used</span>
              <strong>{result.usedTokens.toLocaleString()}</strong>
            </div>
            <div>
              <span>Rejected</span>
              <strong>{result.rejected.length}</strong>
            </div>
          </div>

          <p className={styles.lesson}>
            Retrieval tạo candidates. Context Manager mới quyết định candidate nào đáng chiếm
            Context Window cho current decision.
          </p>
        </aside>
      </div>
    </section>
  );
}
