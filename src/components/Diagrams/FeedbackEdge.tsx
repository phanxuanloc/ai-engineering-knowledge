import {BaseEdge, EdgeLabelRenderer, Position, type EdgeProps} from '@xyflow/react';
import styles from './diagrams.module.css';

export function FeedbackEdge({
  data,
  label,
  markerEnd,
  sourcePosition,
  sourceX,
  sourceY,
  targetPosition,
  targetX,
  targetY,
}: EdgeProps) {
  const labelPlacement = (data as {labelPlacement?: 'endpoint' | 'outer'} | undefined)?.labelPlacement ?? 'endpoint';
  const isVerticalReturn = sourcePosition === Position.Right && targetPosition === Position.Right;
  const clearance = 140;
  const path = isVerticalReturn
    ? `M ${sourceX} ${sourceY} C ${Math.max(sourceX, targetX) + clearance} ${sourceY}, ${Math.max(sourceX, targetX) + clearance} ${targetY}, ${targetX} ${targetY}`
    : `M ${sourceX} ${sourceY} C ${sourceX} ${Math.max(sourceY, targetY) + clearance}, ${targetX} ${Math.max(sourceY, targetY) + clearance}, ${targetX} ${targetY}`;
  const labelX = isVerticalReturn
    ? labelPlacement === 'outer' ? Math.max(sourceX, targetX) + clearance - 36 : targetX + 36
    : targetX - 42;
  const labelY = isVerticalReturn
    ? labelPlacement === 'outer' ? (sourceY + targetY) / 2 : targetY
    : Math.max(sourceY, targetY) + clearance - 8;

  return (
    <>
      <BaseEdge className={styles.feedbackEdgePath} markerEnd={markerEnd} path={path} />
      {label && (
        <EdgeLabelRenderer>
          <span
            className={styles.feedbackEdgeLabel}
            style={{transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`}}
          >
            {label}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
