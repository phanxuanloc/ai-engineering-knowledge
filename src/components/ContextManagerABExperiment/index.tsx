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
    outcome: 'Root cause found and fix verified.',
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
    outcome: 'Minimal fix applied; focused test passes.',
  },
];

const runs: Record<Mode, RunStep[]> = {raw: rawSteps, managed: managedSteps};

export default function ContextManagerABExperiment() {
  const [mode, setMode] = useState<Mode>('raw');
  const [stepIndex, setStepIndex] = useState(0);
  const steps = runs[mode];
  const step = steps[stepIndex];

  const metrics = useMemo(() => {
    const totalTokens = steps.reduce((sum, item) => sum + item.tokens, 0);
    const peakTokens = Math.max(...steps.map((item) => item.tokens));
    const noiseItems = steps.reduce((sum, item) => sum + item.noise.length, 0);
    return {totalTokens, peakTokens, noiseItems, calls: steps.length};
  }, [steps]);

  const changeMode = (next: Mode) => {
    setMode(next);
    setStepIndex(0);
  };

  return (
    <section className={styles.experiment} aria-label="Raw context versus managed context guided experiment">
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Guided A/B experiment · teaching fixture</div>
          <h3>Same bug, two ways to feed context</h3>
          <p>Bug cố định: login trả 401. Cùng outcome mục tiêu, chỉ khác cách context được đưa vào model.</p>
        </div>
        <div className={styles.modeSwitch} role="tablist" aria-label="Experiment mode">
          <button type="button" data-active={mode === 'raw'} onClick={() => changeMode('raw')}>A · Raw</button>
          <button type="button" data-active={mode === 'managed'} onClick={() => changeMode('managed')}>B · Managed</button>
        </div>
      </div>

      <div className={styles.metricGrid}>
        <div><span>Model calls</span><strong>{metrics.calls}</strong></div>
        <div><span>Total input</span><strong>{metrics.totalTokens.toLocaleString()} tok</strong></div>
        <div><span>Peak context</span><strong>{metrics.peakTokens.toLocaleString()} tok</strong></div>
        <div><span>Noise items</span><strong>{metrics.noiseItems}</strong></div>
      </div>

      <div className={styles.stepper}>
        {steps.map((candidate, index) => (
          <button
            type="button"
            key={candidate.title}
            data-active={index === stepIndex}
            onClick={() => setStepIndex(index)}>
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
            <h4>Noise in this call</h4>
            {step.noise.length > 0 ? (
              <ul>{step.noise.map((item) => <li key={item}>{item}</li>)}</ul>
            ) : (
              <p>No obvious noise for this decision.</p>
            )}
          </div>
        </div>

        <div className={styles.outcome}><strong>↓ Outcome</strong><span>{step.outcome}</span></div>
      </div>

      <div className={styles.comparison}>
        <div>
          <strong>Raw Context</strong>
          <span>Ít model call hơn, total token thấp hơn trong fixture này, nhưng peak context lớn và mang theo dữ liệu không cần cho decision.</span>
        </div>
        <div>
          <strong>Managed Context</strong>
          <span>Nhiều call hơn và total token có thể cao hơn, nhưng mỗi call nhỏ hơn, sạch hơn và chỉ mang state/evidence cần cho decision hiện tại.</span>
        </div>
      </div>

      <p className={styles.disclaimer}>
        Đây là deterministic teaching fixture, không phải benchmark model thật. Con số được cố định để học cách đọc trade-off; controlled benchmark thật cần chạy cùng model/tools/task nhiều lần rồi ghi số đo thực tế.
      </p>
    </section>
  );
}
