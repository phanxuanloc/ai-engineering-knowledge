import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const docsRoot = path.join(root, 'docs');
const progressPath = path.join(root, 'learning-progress.yaml');
const requiredHeadings = [
  'TL;DR',
  'Mental Model',
  'Core Concepts',
  'Example',
  'When to Use',
  'Common Mistakes',
  'Related Knowledge',
  'Self-test',
];
const errors = [];

function relative(file) {
  return path.relative(root, file);
}

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const progress = fs.readFileSync(progressPath, 'utf8');
const topicMatches = [...progress.matchAll(/^  ([a-z0-9-]+):\n(?:(?: {4,}.*|\s*)\n)*? {4}note: ([^\n]+)$/gm)];
const topics = topicMatches.map((match) => ({key: match[1], note: match[2].trim()}));

if (topics.length === 0) {
  errors.push('learning-progress.yaml: no top-level topics found');
}

for (const topic of topics) {
  const notePath = path.join(root, topic.note);
  if (!fs.existsSync(notePath)) {
    errors.push(`learning-progress.yaml: ${topic.key} points to missing note ${topic.note}`);
  }
}

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const countMatch = readme.match(/Knowledge learned: (\d+)/);
if (!countMatch || Number(countMatch[1]) !== topics.length) {
  errors.push(`README.md: Knowledge learned count must be ${topics.length}`);
}

for (const file of walk(docsRoot).filter((file) => file.endsWith('.mdx'))) {
  const source = fs.readFileSync(file, 'utf8');

  if (/<details><summary>/u.test(source)) {
    errors.push(`${relative(file)}: put <details> and <summary> on separate lines for MDX`);
  }

  for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+\.mdx(?:#[^)]+)?)\)/g)) {
    const link = match[1].split('#')[0];
    if (/^(?:https?:|\/)/u.test(link)) continue;
    const target = path.resolve(path.dirname(file), link);
    if (!fs.existsSync(target)) {
      errors.push(`${relative(file)}: broken internal link ${link}`);
    }
  }
}

const checkpointNotes = new Set(
  [...progress.matchAll(/^ {8}note: (docs\/[^^\n]+\.mdx)$/gm)].map((match) => match[1].trim()),
);
for (const note of checkpointNotes) {
  const notePath = path.join(root, note);
  if (!fs.existsSync(notePath)) continue;
  const source = fs.readFileSync(notePath, 'utf8');
  for (const heading of requiredHeadings) {
    if (!source.includes(`## ${heading}`)) {
      errors.push(`${note}: missing required heading "${heading}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Documentation consistency check failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Documentation consistency check passed: ${topics.length} topics, ${checkpointNotes.size} checkpoint notes.`);
