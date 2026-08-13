import {useMemo, useState} from 'react';
import styles from './styles.module.css';

type Mode = 'raw' | 'managed';

type RunStep = {
  title: string;
  decision: string;
  tokens: number;
  context: string[];
  noise: string[];
  outcome: string;
};

const WINDOW_LIMIT = 5000;

const rawSteps: RunStep[] = [
  {
    title: 'One large model call',
    decision: 'Find and fix the login 401 with everything available.',
    tokens: 7600,
    context: [
      'Task goal + repository rules',
      'LoginController.ts',
      'AuthService.ts',
      'JWT config',
      'Latest 401 runtime log',
      'Full previous investigation history',
      'Old auth design note',
      'PaymentService.ts',
      'NotificationService.ts',
    ],
    noise: ['Old auth design note', 'PaymentService.ts', 'NotificationService.ts'],
    outcome: 'The ideal raw prompt is 7.6k tokens, so it does not fit a 5k Context Window without truncation or dropping information.',
  },
];

const managedSteps: RunStep[] = [
  {
    title: 'Call #1 · Locate failure path',
    decision: 'Where does the 401 happen?',
    tokens: 3100,
    context: ['Task goal + repository rules', 'LoginController.ts', 'Latest 401 runtime log'],
    noise: [],
    outcome: 'Finding preserved: request reaches JWT validation in AuthService.',
  },
  {
    title: 'Call #2 · Find root cause',
    decision: 'Why does JWT validation reject the token?',
    tokens: 3400,
    context: ['Task goal + rules', 'Preserved finding from Call #1', 'AuthService.ts', 'JWT config'],
    noise: [],
    outcome: 'Root cause preserved: issuer mismatch in JWT configuration.',
  },
  {
    title: 'Call #3 · Fix and verify',
    decision: 'What is the smallest correct fix, and does it pass?',
    tokens: 2700,
    context: ['Task goal + rules', 'Preserved root cause', 'JWT config patch', 'Focused auth test'],
    noise: [],
    outcome: 'Minimal fix applied; focused test passes while old investigation evidence stays outside the current window.',
  },
];

const runs: Record<Mode, RunStep[]> = {raw: rawSteps, managed: managedSteps};

export default function ContextManagerABExperiment() {
  const [mode, setMode] = useState<Mode>('raw');
  const [stepIndex, setStepIndex] = useState(0);
  const steps = runs[mode];
  const step = steps[stepIndex];

  const metrics = useMemo(() => {
    const cumulativeTokens = steps.reduce((sum, item) => sum + item.tokens, 0);
    const peakTokens = Math.max(...steps.map((item) => item.tokens));
    const noiseItems = steps.reduce((sum, item) => sum + item.noise.length, 0);
    return {
      cumulativeTokens,
      peakTokens,
      noiseItems,
      calls: steps.length,
      fitsWindow: peakTokens <= WINDOW_LIMIT,
    };
  }, [steps]);

  const changeMode = (next: Mode) => {
    setMode(next);
    setStepIndex(0);
  };

  const usage = Math.round((step.tokens / WINDOW_LIMIT) * 100);
  const overflow = Math.max(0, step.tokens - WINDOW_LIMIT);

  return (
    <section className={styles.experiment} aria-label="Raw context versus managed context guided experiment">
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Guided A/B experiment · teaching fixture</div>
          <h3>Same bug, same 5k Context Window</h3>
          <p>Khác biệt không nằm ở task. Khác biệt nằm ở việc model phải nhìn cả đống context cùng lúc hay chỉ context cho current decision.</p>
        </div>
        <div className={styles.modeSwitch} role="tablist" aria-label="Experiment mode">
          <button type="button" data-active={mode === 'raw'} onClick={() => changeMode('raw')}>A · Raw</button>
          <button type="button" data-active={mode === 'managed'} onClick={() => changeMode('managed')}>B · Managed</button>
        </div>
      </div>

      <div className={styles.benefitGrid}>
        <div data-result={metrics.fitsWindow ? 'good' : 'bad'}>
          <span>① FIT</span>
          <strong>{metrics.fitsWindow ? 'Fits every call' : 'Does not fit'}</strong>
          <small>Peak {metrics.peakTokens.toLocaleString()} / {WINDOW_LIMIT.toLocaleString()} tok</small>
        </div>
        <div data-result={metrics.noiseItems === 0 ? 'good' : 'bad'}>
          <span>② FOCUS</span>
          <strong>{metrics.noiseItems === 0 ? 'Decision-focused' : `${metrics.noiseItems} noise items`}</strong>
          <small>Only evidence useful now?</small>
        </div>
        <div data-result={mode === 'managed' ? 'good' : 'neutral'}>
          <span>③ CONTINUE</span>
          <strong>{mode === 'managed' ? 'State survives across calls' : 'Everything must coexist'}</strong>
          <small>Preserve findings, replace evidence</small>
        </div>
        <div data-result="neutral">
          <span>④ COST</span>
          <strong>{metrics.cumulativeTokens.toLocaleString()} tok</strong>
          <small>Cumulative input · not the primary goal</small>
        </div>
      </div>

      <div className={styles.windowCard} data-fit={step.tokens <= WINDOW_LIMIT}>
        <div className={styles.windowHeading}>
          <div>
            <span>Current Context Window</span>
            <strong>{step.tokens.toLocaleString()} / {WINDOW_LIMIT.toLocaleString()} tokens</strong>
          </div>
          <b>{step.tokens <= WINDOW_LIMIT ? `${usage}% used` : `+${overflow.toLocaleString()} overflow`}</b>
        </div>
        <div className={styles.windowTrack}><span style={{width: `${Math.min(100, usage)}%`}} /></div>
        <p>
          {step.tokens <= WINDOW_LIMIT
            ? 'This invocation fits. The model can reason with the selected context without exceeding the window.'
            : 'Raw context is larger than the window. You must truncate, drop information, or change the strategy before this call can run as designed.'}
        </p>
      </div>

      <div className={styles.metricGrid}>
        <div><span>Model calls</span><strong>{metrics.calls}</strong></div>
        <div><span>Peak context</span><strong>{metrics.peakTokens.toLocaleString()} tok</strong></div>
        <div><span>Decision noise</span><strong>{metrics.noiseItems}</strong></div>
        <div><span>Cumulative input</span><strong>{metrics.cumulativeTokens.toLocaleString()} tok</strong></div>
      </div>

      <div className={styles.stepper}>
        {steps.map((candidate, index) => (
          <button type="button" key={candidate.title} data-active={index === stepIndex} onClick={() => setStepIndex(index)}>
            <span>{index + 1}</span>{candidate.title}
          </button>
        ))}
      </div>

      <div className={styles.currentStep}>
        <div className={styles.decision}>
          <span>Current decision</span>
          <strong>{step.decision}</strong>
          <small>{step.tokens.toLocaleString()} input tokens</small>
        </div>

        <div className={styles.columns}>
          <div>
            <h4>Context sent to model</h4>
            <ul>{step.context.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className={styles.noiseColumn}>
            <h4>Does this help the current decision?</h4>
            {step.noise.length > 0 ? (
              <ul>{step.noise.map((item) => <li key={item}>✕ {item} · noise/stale</li>)}</ul>
            ) : (
              <p>✓ No obvious noise. Every listed item supports the current decision or carries essential state forward.</p>
            )}
          </div>
        </div>

        <div className={styles.outcome}><strong>↓ Consequence</strong><span>{step.outcome}</span></div>
      </div>

      <div className={styles.whyManage}>
        <div><strong>FIT</strong><span>Large task state can exceed one Context Window. Managed context keeps each invocation inside capacity.</span></div>
        <div><strong>FOCUS</strong><span>The model sees evidence for the current decision instead of every piece of information collected so far.</span></div>
        <div><strong>CONTINUE</strong><span>Old evidence can leave the window while important findings survive in Working State and feed the next call.</span></div>
        <div><strong>NOT NECESSARILY CHEAPER</strong><span>Managed context may use more cumulative tokens because state appears across multiple calls. That is a trade-off, not a failure.</span></div>
      </div>

      <p className={styles.disclaimer}>
        Đây là deterministic teaching fixture, không phải benchmark model thật. Con số được cố định để học cách đọc trade-off; benchmark thật cần chạy cùng model/tools/task nhiều lần rồi ghi outcome thực tế.
      </p>
    </section>
  );
}
