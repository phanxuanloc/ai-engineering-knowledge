import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const docsRoot = path.join(root, 'docs');
const registryPath = path.join(root, 'knowledge-progress.yaml');
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

const registry = fs.readFileSync(registryPath, 'utf8');
const topicMatches = [...registry.matchAll(/^  ([a-z0-9-]+):\n/gm)];
const topics = topicMatches.map((match) => match[1]);

if (topics.length === 0) {
  errors.push('knowledge-progress.yaml: no topics found');
}

const registryPaths = new Set(
  [...registry.matchAll(/^ {6}(?:landing: |- )(docs\/[^\n]+\.mdx)\s*$/gm)].map((match) => match[1].trim()),
);

for (const note of registryPaths) {
  if (!fs.existsSync(path.join(root, note))) {
    errors.push(`knowledge-progress.yaml: missing published path ${note}`);
  }
}

for (const file of walk(docsRoot).filter((file) => file.endsWith('.mdx'))) {
  const source = fs.readFileSync(file, 'utf8');

  if (/<details\b[^>\n]*>[^\S\r\n]*<summary\b/u.test(source)) {
    errors.push(`${relative(file)}: put <details> and <summary> on separate physical lines for MDX`);
  }
  if (/<\/summary>[^\S\r\n]+\S/u.test(source)) {
    errors.push(`${relative(file)}: Markdown content after </summary> must start on a new block`);
  }
  if (/<\/summary>\r?\n(?!\r?\n|\s*<\/details>)/u.test(source)) {
    errors.push(`${relative(file)}: leave a blank line between </summary> and Markdown content`);
  }
  if (/\S[^\r\n]*<\/details>/u.test(source)) {
    errors.push(`${relative(file)}: put </details> on its own physical line for MDX`);
  }
  if (/[^\r\n]\r?\n<\/details>/u.test(source)) {
    errors.push(`${relative(file)}: leave a blank line before </details>`);
  }

  for (const match of source.matchAll(/\bto="([^\"]+\.mdx)"/g)) {
    errors.push(`${relative(file)}: component route must omit the .mdx extension: ${match[1]}`);
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

if (errors.length > 0) {
  console.error(`Documentation consistency check failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Documentation consistency check passed: ${topics.length} registry topics, ${registryPaths.size} published paths.`);
