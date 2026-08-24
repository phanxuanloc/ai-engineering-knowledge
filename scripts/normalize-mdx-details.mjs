import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const docsRoot = path.join(root, 'docs');

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function normalizeDetailsBlocks(source) {
  return source
    // MDX block tags must not be compacted onto the same physical line.
    .replace(/<details\b([^>\n]*)>[\t ]*<summary\b([^>\n]*)>/gu, '<details$1>\n<summary$2>')
    // Markdown content inside a disclosure block must start after a blank line.
    .replace(/<\/summary>[\t ]+(?=\S)/gu, '</summary>\n\n')
    .replace(/<\/summary>\r?\n(?!\r?\n)/gu, '</summary>\n\n')
    // Keep the closing block tag on its own line with a blank line before it.
    .replace(/([^\r\n])[\t ]*<\/details>/gu, '$1\n\n</details>')
    .replace(/([^\r\n])\r?\n<\/details>/gu, '$1\n\n</details>');
}

let changed = 0;

for (const file of walk(docsRoot).filter((file) => file.endsWith('.mdx'))) {
  const source = fs.readFileSync(file, 'utf8');
  const normalized = normalizeDetailsBlocks(source);
  if (normalized === source) continue;

  fs.writeFileSync(file, normalized);
  changed += 1;
  console.log(`Normalized MDX details block: ${path.relative(root, file)}`);
}

console.log(`MDX details normalization complete: ${changed} file(s) changed.`);
