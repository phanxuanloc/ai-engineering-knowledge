import {useEffect, useMemo, useState} from 'react';
import {
  getUsagePercent,
  lifecycleSteps,
  type ContextItemSnapshot,
  type ContextItemState,
} from './contextManager';
import styles from './styles.module.css';

const stateLabel: Record<ContextItemState, string> = {
  candidate: 'Candidate',
  pinned: 'Pinned',
  selected: 'Selected',
  preserved: 'Preserved',
  compressed: 'Compressed',
  evicted: 'Evicted',
  rejected: 'Rejected',
};

function ContextItem({item}: {item: ContextItemSnapshot}) {
  return (
    <article className={styles.contextItem} data-state={item.state}>
      <div className={styles.itemMain}>
        <div>
          <strong>{item.label}</strong>
          <span>{item.source}</span>
        </div>
        <div className={styles.itemMeta}>
          <span data-state={item.state}>{stateLabel[item.state]}</span>
          <b>{item.tokenCost.toLocaleString()} tok</b>
        </div>
      </div>
      <p>{item.reason}</p>
      {typeof item.score === 'number' && <small>selection score {item.score.toFixed(2)}</small>}
    </article>
  );
}

export default function ContextManagerPlayground() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = lifecycleSteps[stepIndex];
  const usage = getUsagePercent(step);
  const freeTokens = Math.max(0, step.budget - step.usedTokens);

  useEffect(() => {
    if (!playing) return;
    if (stepIndex >= lifecycleSteps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStepIndex((current) => current + 1), 1550);
    return () => window.clearTimeout(timer);
  }, [playing, stepIndex]);

  const visibleGroups = useMemo(() => {
    const active = step.items.filter((item) => ['pinned', 'selected', 'preserved', 'compressed'].includes(item.state));
    const outside = step.items.filter((item) => !['pinned', 'selected', 'preserved', 'compressed'].includes(item.state));
    return {active, outside};
  }, [step]);

  const reset = () => {
    setPlaying(false);
    setStepIndex(0);
  };

  const next = () => {
    setPlaying(false);
    setStepIndex((current) => Math.min(lifecycleSteps.length - 1, current + 1));
  };

  const previous = () => {
    setPlaying(false);
    setStepIndex((current) => Math.max(0, current - 1));
  };

  const togglePlay = () => {
    if (stepIndex >= lifecycleSteps.length - 1) setStepIndex(0);
    setPlaying((current) => !current);
  };

  return (
    <section className={styles.playground} aria-label="Context Manager lifecycle simulator">
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Interactive lab · Context lifecycle simulator</div>
          <h3>Fix login 401 — watch context evolve</h3>
          <p>
            Đi xuyên suốt một coding task qua nhiều model invocation. Theo dõi item nào được retrieve,
            giữ lại, compress hoặc evict và chuyện gì xảy ra khi Context Window gần đầy.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.secondaryButton} onClick={reset}>Reset</button>
          <button type="button" className={styles.primaryButton} onClick={togglePlay}>
            {playing ? 'Pause' : stepIndex === lifecycleSteps.length - 1 ? 'Replay flow' : 'Play flow'}
          </button>
        </div>
      </header>

      <div className={styles.timeline} aria-label="Task lifecycle">
        {lifecycleSteps.map((candidate, index) => (
          <button
            type="button"
            key={candidate.id}
            className={styles.timelineStep}
            data-state={index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'idle'}
            onClick={() => { setPlaying(false); setStepIndex(index); }}>
            <span>{index + 1}</span>
            <strong>{candidate.phase.replace(/^\d+ · /, '')}</strong>
          </button>
        ))}
      </div>

      <div className={styles.stepIntro}>
        <div>
          <div className={styles.eyebrow}>{step.phase}</div>
          <h4>{step.decision}</h4>
          <p>{step.narration}</p>
        </div>
        <div className={styles.callBadge}>{step.call ?? step.action}</div>
      </div>

      <div className={styles.windowMeter} data-pressure={usage >= 85 ? 'high' : usage >= 65 ? 'medium' : 'normal'}>
        <div className={styles.meterHeading}>
          <div>
            <span>Context Window</span>
            <strong>{step.usedTokens.toLocaleString()} / {step.budget.toLocaleString()} tokens</strong>
          </div>
          <b>{usage}%</b>
        </div>
        <div className={styles.usageTrack}><span style={{width: `${usage}%`}} /></div>
        <div className={styles.usageMeta}>
          <span>{freeTokens.toLocaleString()} tokens free</span>
          <span>{usage >= 85 ? 'Budget pressure: action required' : 'Capacity available'}</span>
        </div>
      </div>

      {step.event && (
        <div className={styles.event} data-tone={step.event.tone}>
          <strong>{step.event.title}</strong>
          <span>{step.event.detail}</span>
        </div>
      )}

      <div className={styles.flowGrid}>
        <section className={styles.contextColumn}>
          <div className={styles.sectionHeading}>
            <div>
              <div className={styles.eyebrow}>Inside the model input</div>
              <h4>Context Window now</h4>
            </div>
            <span className={styles.count}>{visibleGroups.active.length} active</span>
          </div>
          <div className={styles.itemList}>
            {visibleGroups.active.map((item) => <ContextItem key={item.id} item={item} />)}
          </div>
        </section>

        <aside className={styles.stateColumn}>
          <div className={styles.sectionHeading}>
            <div>
              <div className={styles.eyebrow}>Cross-invocation memory</div>
              <h4>Working State</h4>
            </div>
          </div>
          <ol className={styles.workingState}>
            {step.workingState.map((entry) => <li key={entry}>{entry}</li>)}
          </ol>
          <div className={styles.arrowNote}>↓ feeds the next decision, not the whole history</div>
        </aside>

        <section className={styles.outsideColumn}>
          <div className={styles.sectionHeading}>
            <div>
              <div className={styles.eyebrow}>Outside current window</div>
              <h4>Candidate / dropped context</h4>
            </div>
            <span className={styles.count}>{visibleGroups.outside.length} items</span>
          </div>
          {visibleGroups.outside.length > 0 ? (
            <div className={styles.itemList}>
              {visibleGroups.outside.map((item) => <ContextItem key={item.id} item={item} />)}
            </div>
          ) : (
            <p className={styles.empty}>Không có item ngoài window ở bước này.</p>
          )}
        </section>
      </div>

      <footer className={styles.controls}>
        <button type="button" onClick={previous} disabled={stepIndex === 0}>← Previous</button>
        <div>
          <strong>{stepIndex + 1} / {lifecycleSteps.length}</strong>
          <span>{step.action}</span>
        </div>
        <button type="button" onClick={next} disabled={stepIndex === lifecycleSteps.length - 1}>Next →</button>
      </footer>
    </section>
  );
}
