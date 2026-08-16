export interface NormalizedGroup<Item> {
  label: string | null | undefined;
  items: Item[];
}

export interface CollectionShape<Item, Group> {
  isGroup: (entry: Item | Group) => entry is Group;
  itemsOf: (group: Group) => Item[];
  labelOf: (group: Group) => string | undefined;
}

export function normalizeCollection<Item, Group>(
  source: Item[] | Group[],
  shape: CollectionShape<Item, Group>,
): { groups: NormalizedGroup<Item>[]; flat: Item[] } {
  const entries = source as (Item | Group)[];
  const groups: NormalizedGroup<Item>[] =
    entries.length > 0 && entries[0] && shape.isGroup(entries[0])
      ? (entries as Group[]).map((g) => ({ label: shape.labelOf(g), items: shape.itemsOf(g) || [] }))
      : [{ label: null, items: entries as Item[] }];
  return { groups, flat: groups.flatMap((g) => g.items) };
}

export interface Navigable {
  disabled?: boolean;
}

export const edgeEnabled = (items: readonly Navigable[], toEnd: boolean): number =>
  toEnd ? items.reduce((found, item, i) => (item.disabled ? found : i), -1) : items.findIndex((i) => !i.disabled);

export function stepEnabled(items: readonly Navigable[], from: number, dir: number): number {
  let i = from >= 0 ? from : dir > 0 ? -1 : 0;
  for (let taken = 0; taken < items.length; taken++) {
    i = (i + dir + items.length) % items.length;
    if (!items[i].disabled) return i;
  }
  return items.length ? from : -1;
}

export const matchPrefix = <Item extends Navigable>(
  items: readonly Item[],
  textOf: (item: Item) => string,
  prefix: string,
): number => items.findIndex((i) => !i.disabled && textOf(i).toLowerCase().startsWith(prefix));
