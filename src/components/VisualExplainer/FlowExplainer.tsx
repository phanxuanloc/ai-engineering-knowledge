import {useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type FlowExplainerNode = {
  id: string;
  label: string;
  detail?: string;
  role?: 'client' | 'service' | 'database' | 'network' | 'model' | 'tool' | 'data';
};

export type FlowExplainerStep = {
  title: string;
  description: string;
  from?: string;
  to?: string;
  message?: string;
  active?: string[];
  repeat?: boolean;
};

export type FlowExplainerScenario = {
  id: string;
  label: string;
  nodes: FlowExplainerNode[];
  steps: FlowExplainerStep[];
};

export type FlowExplainerProps = {
  title: string;
  description?: string;
  scenarios: FlowExplainerScenario[];
  stepDurationMs?: number;
};

export function FlowExplainer({title, description, scenarios, stepDurationMs = 1700}: FlowExplainerProps) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? '');
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0],
    [scenarioId, scenarios],
  );
  const step = scenario?.steps[stepIndex];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [scenarioId]);

  useEffect(() => {
    if (!playing || !scenario?.steps.length) return undefined;
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= scenario.steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, stepDurationMs);
    return () => window.clearInterval(timer);
  }, [playing, scenario, stepDurationMs]);

  if (!scenario || !step) return null;

  const nodeIndex = new Map(scenario.nodes.map((node, index) => [node.id, index]));
  const fromIndex = step.from ? nodeIndex.get(step.from) : undefined;
  const toIndex = step.to ? nodeIndex.get(step.to) : undefined;
  const active = new Set([...(step.active ?? []), step.from, step.to].filter(Boolean));
  const edgeIndex = fromIndex !== undefined && toIndex !== undefined ? Math.min(fromIndex, toIndex) : -1;
  const reverse = fromIndex !== undefined && toIndex !== undefined && fromIndex > toIndex;

  const next = () => setStepIndex((current) => Math.min(current + 1, scenario.steps.length - 1));
  const replay = () => {
    setStepIndex(0);
    setPlaying(true);
  };

  return (
    <figure className={styles.figure}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Runtime Visual Explainer</span>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        <div className={styles.tabs} role="tablist" aria-label={`${title} scenarios`}>
          {scenarios.map((item) => (
            <button
              aria-selected={item.id === scenario.id}
              className={clsx(styles.tab, item.id === scenario.id && styles.tabActive)}
              key={item.id}
              onClick={() => setScenarioId(item.id)}
              role="tab"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.stage}>
        <div className={styles.flow}>
          {scenario.nodes.map((node, index) => {
            const isActive = active.has(node.id);
            const edgeActive = edgeIndex === index;
            return (
              <div className={styles.segment} key={node.id}>
                <div className={clsx(styles.node, styles[`node_${node.role ?? 'service'}`], isActive && styles.nodeActive)}>
                  <span>{node.role ?? 'service'}</span>
                  <strong>{node.label}</strong>
                  {node.detail && <small>{node.detail}</small>}
                </div>
                {index < scenario.nodes.length - 1 && (
                  <div className={clsx(styles.edge, edgeActive && styles.edgeActive, reverse && edgeActive && styles.edgeReverse)}>
                    {edgeActive && (
                      <>
                        <span className={clsx(styles.packet, step.repeat && styles.packetRepeat)} aria-hidden="true" />
                        {step.message && <span className={styles.message}>{step.message}</span>}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.story} aria-live="polite">
          <div className={styles.stepMeta}>Step {stepIndex + 1} / {scenario.steps.length}</div>
          <strong>{step.title}</strong>
          <p>{step.description}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <button onClick={() => setPlaying((value) => !value)} type="button">{playing ? 'Pause' : 'Play'}</button>
        <button disabled={stepIndex >= scenario.steps.length - 1} onClick={next} type="button">Step</button>
        <button onClick={replay} type="button">Replay</button>
        <div className={styles.dots} aria-label="Step progress">
          {scenario.steps.map((item, index) => (
            <button
              aria-label={`Go to step ${index + 1}: ${item.title}`}
              className={clsx(styles.dot, index === stepIndex && styles.dotActive)}
              key={`${scenario.id}-${item.title}-${index}`}
              onClick={() => { setPlaying(false); setStepIndex(index); }}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </figure>
  );
}
