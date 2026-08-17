export const SECTION_RE = /^=+\s+(.+?)\s*$/;
export const HEADING_RE = /^([A-Za-z][\w /]*?) - @zyncat\/ui\/([a-z][a-z0-9-]*)\b.*$/;

const dropTrailingBlanks = (lines, textOf = (l) => l) => {
  while (lines.length && !textOf(lines[lines.length - 1]).trim()) lines.pop();
};

export function parseLlms(text) {
  const preamble = [];
  const sections = [];
  const entries = [];
  let section = null;
  let entry = null;

  text.split('\n').forEach((line, index) => {
    const sec = line.match(SECTION_RE);
    const head = line.match(HEADING_RE);
    if (sec) {
      entry = null;
      section = { title: sec[1], line: index + 1, body: [] };
      sections.push(section);
    } else if (head) {
      entry = {
        title: head[1].trim(),
        subpath: head[2],
        section: section?.title ?? '',
        line: index + 1,
        heading: line,
        body: [],
      };
      entries.push(entry);
    } else if (entry) {
      entry.body.push({ text: line, line: index + 1 });
    } else if (section) {
      section.body.push(line);
    } else {
      preamble.push(line);
    }
  });

  for (const e of entries) dropTrailingBlanks(e.body, (l) => l.text);
  for (const s of sections) {
    dropTrailingBlanks(s.body);
    while (s.body.length && !s.body[0].trim()) s.body.shift();
  }
  dropTrailingBlanks(preamble);

  return { preamble, sections, entries };
}

export const entryLines = (entry) => [entry.heading, ...entry.body.map((l) => l.text)];

export const PROP_COUNT_RE = /^\s*\+\d+ more props? - get_component\('[a-z0-9-]+'\)\s*$/;

export const formatPropCount = (count, subpath) =>
  `  +${count} more prop${count === 1 ? '' : 's'} - get_component('${subpath}')`;

export const entryProse = (entry) => entry.body.filter((l) => !PROP_COUNT_RE.test(l.text));
