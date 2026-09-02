# Docs SEO — per-page progress

48 pages. One `docs-seo` run per page, three pages per round.

## Status

| Mark | Meaning                                                                               |
| ---- | ------------------------------------------------------------------------------------- |
| ☐    | not started                                                                           |
| ◐    | agent running                                                                         |
| ☑    | researched — `content/seo/<slug>.ts` + `docs/seo/<slug>.md` written, typecheck passes |
| ✔    | shipped — wired into `content/seo/index.ts`, verified in `apps/docs/out/<slug>.html`  |

The agent takes a page to ☑. The orchestrator takes it to ✔: add the import to
`content/seo/index.ts`, `pnpm --filter zyncat-ui-docs build`, then confirm the
`<title>`, `<meta name="description">`, `<meta name="keywords">` and the
`FAQPage` JSON-LD in the built HTML.

## Running a round

Start the token server once, then leave it up for the whole session:

```bash
kwr mint --widgets 5
```

Every agent's `kwr` call finds it automatically and makes no browser of its own,
so agents run in parallel without contending for a display or a port. Confirm
with `curl -s 127.0.0.1:9500/health`. Without it each `kwr` call falls back to
launching its own browser — correct, but ~10× slower and not safely parallel.

Size the pool to the agents. Three widgets against three agents ran fully
saturated — `served` tracking `minted` with a standing queue of 2-3, so every
query waited on a mint. Five clears the queue and the failure rate drops with
it: round 1 on three widgets was 18 failures in 283 mints with 5 rebuilds,
round 2 on five was 9 in 293 with none. Budget a widget or two per agent.

Give each agent one slug and its research directory. Update this file when a
round lands: the mark, the primary keyword, and the kept count.

## Order

Rounds run in descending order of what the page can realistically win. Tier A is
subject matter no component library owns yet and where the search intent is the
effect itself. Tier D is commodity control names where the title is decided by
domain authority, so those pages compete on the long tail and the FAQ instead.

### Tier A — expressive & replicas

Differentiated subjects, real volume, winnable. Do these first.

| #   | Slug           | Page          | Status | Primary keyword           | Kept |
| --- | -------------- | ------------- | ------ | ------------------------- | ---- |
| R1  | confetti       | Confetti      | ✔      | confetti animation        | 172  |
| R1  | morphing-text  | MorphingText  | ✔      | morphing text animation   | 135  |
| R1  | odometer       | Odometer      | ✔      | number counter animation  | 170  |
| R2  | typing-lines   | TypingLines   | ✔      | typing animation          | 143  |
| R2  | lens           | Lens          | ✔      | image zoom                | 156  |
| R2  | flow-field     | FlowField     | ✔      | react animated background | 131  |
| R3  | weight-field   | WeightField   | ✔      | variable font animation   | 162  |
| R3  | instagram-feed | InstagramFeed | ✔      | instagram ui              | 165  |
| R3  | facebook-feed  | FacebookFeed  | ✔      | facebook ui               | 136  |
| R4  | tiktok         | TikTok        | ☐      |                           |      |
| R4  | youtube        | YouTube       | ☐      |                           |      |

### Tier B — getting started

Brand and high-intent install queries. Guide pages: seeds are tasks, not names.

| #   | Slug         | Page                | Status | Primary keyword | Kept |
| --- | ------------ | ------------------- | ------ | --------------- | ---- |
| R5  | introduction | Introduction        | ☐      |                 |      |
| R5  | installation | Installation        | ☐      |                 |      |
| R5  | theming      | Theming & Overrides | ☐      |                 |      |
| R5  | mcp          | MCP Server          | ☐      |                 |      |

### Tier C — high-volume controls

Competitive head terms, but the React 19 / zero-dependency angle is a real
differentiator here. Expect to win on the long tail first.

| #   | Slug           | Page           | Status | Primary keyword | Kept |
| --- | -------------- | -------------- | ------ | --------------- | ---- |
| R6  | select         | Select         | ☐      |                 |      |
| R6  | multi-select   | MultiSelect    | ☐      |                 |      |
| R6  | otp-field      | OtpField       | ☐      |                 |      |
| R7  | date-field     | DateField      | ☐      |                 |      |
| R7  | datetime-field | DateTimeField  | ☐      |                 |      |
| R7  | date-range     | DateRangeField | ☐      |                 |      |
| R8  | time-field     | TimeField      | ☐      |                 |      |
| R8  | emoji-picker   | EmojiPicker    | ☐      |                 |      |
| R8  | table          | Table          | ☐      |                 |      |
| R8  | pagination     | Pagination     | ☐      |                 |      |

### Tier D — the rest

| #   | Slug         | Page        | Status | Primary keyword | Kept |
| --- | ------------ | ----------- | ------ | --------------- | ---- |
| R9  | button       | Button      | ☐      |                 |      |
| R9  | icon         | Icon        | ☐      |                 |      |
| R9  | collapse     | Collapse    | ☐      |                 |      |
| R10 | badge        | Badge       | ☐      |                 |      |
| R10 | status-badge | StatusBadge | ☐      |                 |      |
| R10 | count-badge  | CountBadge  | ☐      |                 |      |
| R11 | text-field   | TextField   | ☐      |                 |      |
| R11 | number-field | NumberField | ☐      |                 |      |
| R11 | textarea     | Textarea    | ☐      |                 |      |
| R12 | checkbox     | Checkbox    | ☐      |                 |      |
| R12 | toggle       | Toggle      | ☐      |                 |      |
| R12 | radio-group  | RadioGroup  | ☐      |                 |      |
| R13 | avatar       | Avatar      | ☐      |                 |      |
| R13 | tag          | Tag         | ☐      |                 |      |
| R13 | tabs         | Tabs        | ☐      |                 |      |
| R14 | alert        | Alert       | ☐      |                 |      |
| R14 | toast        | Toast       | ☐      |                 |      |
| R14 | tooltip      | Tooltip     | ☐      |                 |      |
| R15 | dialog       | Dialog      | ☐      |                 |      |
| R15 | popover      | Popover     | ☐      |                 |      |
| R15 | dropdown     | Dropdown    | ☐      |                 |      |
| R16 | sheet        | Sheet       | ☐      |                 |      |
| R16 | support-rail | SupportRail | ☐      |                 |      |

## Tally

| Tier           | Pages | ☑   | ✔   |
| -------------- | ----- | --- | --- |
| A — expressive | 11    | 9   | 9   |
| B — guides     | 4     | 0   | 0   |
| C — controls   | 10    | 0   | 0   |
| D — the rest   | 23    | 0   | 0   |
| **Total**      | 48    | 9   | 9   |
