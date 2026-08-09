import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type TopicPathItem = {
  href?: string;
  number: string;
  title: string;
};

export function TopicPath({items, title}: {items: TopicPathItem[]; title?: string}) {
  return (
    <nav className={styles.topicPath} aria-label={title ?? 'Topic reading path'}>
      {title && <h3 className={styles.topicPathTitle}>{title}</h3>}
      <ol>
        {items.map((item) => (
          <li className={styles.topicPathItem} key={`${item.number}-${item.title}`}>
            <span className={styles.topicPathNumber}>{item.number}</span>
            {item.href ? <Link to={item.href}>{item.title}</Link> : <span>{item.title}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

