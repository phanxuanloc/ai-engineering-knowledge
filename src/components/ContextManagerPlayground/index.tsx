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

type MobileTab = 'window' | 'state' | 'outside';

function ContextItem({item}: {item: ContextItemSnapshot}) {
  return (
    <details className={styles.contextItem} data-state={item.state}>
      <summary className={styles.itemMain}>
        <div className={styles.itemIdentity}>
          <strong>{item.label}</strong>
          <span data-state={item.state}>{stateLabel[item.state]}</span>
        </div>
        <b>{item.tokenCost.toLocaleString()} tok</b>
      </summary>
      <div className={styles.itemDetails}>
        <span>{item.source}</span>
        <p>{item.reason}</p>
        {typeof item.score === 'number' && <small>selection score {item.score.toFixed(2)}</small>}
      </div>
    </details>
  );
}

export default function ContextManagerPlayground() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showAllOutside, setShowAllOutside] = useState(false);
  const [showAllState, setShowAllState] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('window');
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

  useEffect(() => {
    setShowAllOutside(false);
    setShowAllState(false);
    setMobileTab('window');
  }, [stepIndex]);

  const visibleGroups = useMemo(() => {
    const active = step.items.filter((item) => ['pinned', 'selected', 'preserved', 'compressed'].includes(item.state));
    const outside = step.items.filter((item) => !['pinned', 'selected', 'preserved', 'compressed'].includes(item.state));
    return {active, outside};
  }, [step]);

  const outsideVisible = showAllOutside ? visibleGroups.outside : visibleGroups.outside.slice(0, 4);
  const stateVisible = showAllState ? step.workingState : step.workingState.slice(0, 4);

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
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.secondaryButton} onClick={reset}>Reset</button>
          <button type="button" className={styles.primaryButton} onClick={togglePlay}>
            {playing ? 'Pause' : stepIndex === lifecycleSteps.length - 1 ? 'Replay flow' : 'Play flow'}
          </button>
        </div>
      </header>

      <div className={styles.stickyOverview}>
        <div className={styles.timeline} aria-label="Task lifecycle">
          {lifecycleSteps.map((candidate, index) => (
            <button
              type="button"
              key={candidate.id}
              className={styles.timelineStep}
              data-state={index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'idle'}
              onClick={(event) => {
                setPlaying(false);
                setStepIndex(index);
                event.currentTarget.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
              }}>
              <span>{index + 1}</span>
              <strong>{candidate.phase.replace(/^\d+ · /, '')}</strong>
            </button>
          ))}
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
            <span>{freeTokens.toLocaleString()} free</span>
            <span>{usage >= 85 ? 'Budget pressure · action required' : 'Capacity available'}</span>
          </div>
        </div>
      </div>

      <div className={styles.stepIntro}>
        <div>
          <div className={styles.eyebrow}>{step.phase}</div>
          <h4>{step.decision}</h4>
          <p>{step.narration}</p>
        </div>
        <div className={styles.callBadge}>{step.call ?? step.action}</div>
      </div>

      {step.event && (
        <div className={styles.event} data-tone={step.event.tone}>
          <strong>{step.event.title}</strong>
          <span>{step.event.detail}</span>
        </div>
      )}

      <div className={styles.mobileTabs} role="tablist" aria-label="Context views">
        <button type="button" role="tab" aria-selected={mobileTab === 'window'} data-active={mobileTab === 'window'} onClick={() => setMobileTab('window')}>
          Window <span>{visibleGroups.active.length}</span>
        </button>
        <button type="button" role="tab" aria-selected={mobileTab === 'state'} data-active={mobileTab === 'state'} onClick={() => setMobileTab('state')}>
          State <span>{step.workingState.length}</span>
        </button>
        <button type="button" role="tab" aria-selected={mobileTab === 'outside'} data-active={mobileTab === 'outside'} onClick={() => setMobileTab('outside')}>
          Outside <span>{visibleGroups.outside.length}</span>
        </button>
      </div>

      <div className={styles.flowGrid} data-mobile-tab={mobileTab}>
        <section className={`${styles.contextColumn} ${styles.windowPanel}`}>
          <div className={styles.sectionHeading}>
            <div>
              <div className={styles.eyebrow}>Inside model input</div>
              <h4>Context Window now</h4>
            </div>
            <span className={styles.count}>{visibleGroups.active.length}</span>
          </div>
          <div className={styles.itemList}>
            {visibleGroups.active.map((item) => <ContextItem key={item.id} item={item} />)}
          </div>
        </section>

        <aside className={`${styles.stateColumn} ${styles.statePanel}`}>
          <div className={styles.sectionHeading}>
            <div>
              <div className={styles.eyebrow}>Cross-invocation memory</div>
              <h4>Working State</h4>
            </div>
            <span className={styles.count}>{step.workingState.length}</span>
          </div>
          <ol className={styles.workingState}>
            {stateVisible.map((entry) => <li key={entry}>{entry}</li>)}
          </ol>
          {step.workingState.length > 4 && (
            <button type="button" className={styles.revealButton} onClick={() => setShowAllState((current) => !current)}>
              {showAllState ? 'Show less' : `+${step.workingState.length - 4} preserved state`}
            </button>
          )}
          <div className={styles.arrowNote}>↓ feeds next decision, not whole history</div>
        </aside>

        <section className={`${styles.outsideColumn} ${styles.outsidePanel}`}>
          <div className={styles.sectionHeading}>
            <div>
              <div className={styles.eyebrow}>Outside current window</div>
              <h4>Candidate / dropped</h4>
            </div>
            <span className={styles.count}>{visibleGroups.outside.length}</span>
          </div>
          {visibleGroups.outside.length > 0 ? (
            <>
              <div className={styles.itemList}>
                {outsideVisible.map((item) => <ContextItem key={item.id} item={item} />)}
              </div>
              {visibleGroups.outside.length > 4 && (
                <button type="button" className={styles.revealButton} onClick={() => setShowAllOutside((current) => !current)}>
                  {showAllOutside ? 'Show less' : `+${visibleGroups.outside.length - 4} other items`}
                </button>
              )}
            </>
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
