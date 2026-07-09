# Component Size Ranking — premium-ds

Lines of code across `src/` (`.tsx` + `.ts` + `.css`), measured with `wc -l`.

_Generated 2026-07-09._

---

## Biggest component folders

Aggregated across every file in the folder (component + core + CSS), since one
"component" often spans several files (e.g. `select` = Select + MultiSelect +
`select/core/*` + select.css).

| Rank | Folder                | Total LOC | code (tsx/ts) | css |
| ---: | --------------------- | --------: | ------------: | --: |
|    1 | `date-picker`         |     2,113 |         1,519 | 594 |
|    2 | `select` (incl. core) |     1,191 |           788 | 403 |
|    3 | `toast`               |       918 |           661 | 257 |
|    4 | `input`               |       767 |           434 | 333 |
|    5 | `table`               |       721 |           373 | 348 |
|    6 | `overlay`             |       568 |           545 |  23 |
|    7 | `radio-group`         |       511 |           212 | 299 |
|    8 | `tabs`                |       497 |           287 | 210 |
|    9 | `badge`               |       496 |           251 | 245 |
|   10 | `tooltip`             |       474 |           388 |  86 |
|   11 | `tag`                 |       447 |           199 | 248 |

`date-picker` is the largest by a wide margin — nearly 2× the whole `select`
subsystem. Its CSS alone (594 LOC) is bigger than most entire other components.
`select` is now physically split: thin `Select` / `MultiSelect` wrappers over a
`select/core/` of listbox mechanics (menu, panel, trigger, use-listbox, ~557 LOC).
`overlay` is 568 LOC of near-pure logic (96% code) — the lean primitives
(`layer`, `modal`, `panel`, `position`, `focus`) behind the floating surfaces;
the modal, popover and sheet components live in their own folders.

---

## Top 15 individual files

| Rank | File                             | LOC |
| ---: | -------------------------------- | --: |
|    1 | `date-picker/date-picker.css`    | 594 |
|    2 | `select/select.css`              | 403 |
|    3 | `date-picker/range-panel.tsx`    | 392 |
|    4 | `table/Table.tsx`                | 373 |
|    5 | `toast/Toast.tsx`                | 356 |
|    6 | `table/table.css`                | 348 |
|    7 | `input/input.css`                | 333 |
|    8 | `toast/toast-store.ts`           | 305 |
|    9 | `radio-group/radio-group.css`    | 299 |
|   10 | `date-picker/time-core.tsx`      | 299 |
|   11 | `tabs/Tabs.tsx`                  | 287 |
|   12 | `toast/toast.css`                | 257 |
|   13 | `tag/tag.css`                    | 248 |
|   14 | `date-picker/calendar-panel.tsx` | 244 |
|   15 | `button/button.css`              | 241 |

The largest single file is `date-picker.css` (594). No `select` file reaches the
upper list: the listbox mechanics spread across `select/core/` (menu, panel,
trigger, use-listbox), none over ~200 LOC. The largest source (non-CSS) file is
`range-panel.tsx` (392), which holds the range-calendar logic; `DateRangeField`
itself is a thin ~100-LOC field wrapper.

---

## How to regenerate

```bash
# Top individual files
find src -type f \( -name '*.tsx' -o -name '*.ts' -o -name '*.css' \) \
  | xargs wc -l | sort -rn | head -16

# Aggregate LOC per component folder (code vs css)
find src/components -type f \( -name '*.tsx' -o -name '*.ts' -o -name '*.css' \) \
  -exec wc -l {} + | grep -v ' total$' \
  | awk '{f=$2; sub(/\/[^/]+$/,"",f); a[f]+=$1} END{for(d in a) print a[d]"\t"d}' \
  | sort -rn
```
