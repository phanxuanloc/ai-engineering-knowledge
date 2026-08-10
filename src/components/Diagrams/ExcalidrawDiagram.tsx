import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './diagrams.module.css';

export type ExcalidrawDiagramProps = {
  alt: string;
  aspectRatio: number;
  caption?: ReactNode;
  className?: string;
  darkSrc?: string;
  mobileSrc?: string;
  mobileAspectRatio?: number;
  src: string;
};

/** Renders an optimized export; the Excalidraw editor is intentionally not shipped to readers. */
export function ExcalidrawDiagram({alt, aspectRatio, caption, className, darkSrc, mobileAspectRatio, mobileSrc, src}: ExcalidrawDiagramProps) {
  const resolvedSrc = useBaseUrl(src);
  const resolvedDarkSrc = useBaseUrl(darkSrc ?? src);
  const resolvedMobileSrc = useBaseUrl(mobileSrc ?? src);
  return (
    <figure
      className={clsx(styles.excalidrawFigure, className)}
      aria-label={alt}
      style={{
        '--excalidraw-aspect': aspectRatio,
        '--excalidraw-mobile-aspect': mobileAspectRatio ?? aspectRatio,
      } as CSSProperties}
    >
      <picture>
        {mobileSrc && <source media="(max-width: 700px)" srcSet={resolvedMobileSrc} />}
        {resolvedDarkSrc && <source media="(prefers-color-scheme: dark)" srcSet={resolvedDarkSrc} />}
        <img alt={alt} loading="lazy" src={resolvedSrc} />
      </picture>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
