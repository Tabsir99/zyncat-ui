import { useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { Tabs, TabPanel, type TabItem } from '@zyncat/ui/tabs';
import { Modal } from '@zyncat/ui/modal';
import { Probe, ledger, renderApp, settle, useOpenProbe, type Ledger } from './harness';

type Direction = -1 | 0 | 1;

const VIEWS: TabItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
];

const WITH_DISABLED: TabItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity', disabled: true },
  { value: 'settings', label: 'Settings' },
];

const press = (keys: string) =>
  act(async () => {
    await userEvent.keyboard(keys);
  });

const tab = () =>
  act(async () => {
    await userEvent.tab();
  });

const click = (el: HTMLElement) =>
  act(async () => {
    await userEvent.click(el);
  });

const tabs = () => screen.getAllByRole('tab');
const named = (name: string) => screen.getByRole('tab', { name });

function Workspace({
  items = VIEWS,
  start = 'overview',
  onChange,
}: {
  items?: TabItem[];
  start?: string;
  onChange?: (value: string, dir: 1 | -1) => void;
}) {
  const [view, setView] = useState(start);
  const [dir, setDir] = useState<Direction>(0);
  return (
    <div>
      <button type="button">before</button>
      <Tabs
        name="views"
        ariaLabel="Workspace views"
        items={items}
        value={view}
        onChange={(value, direction) => {
          onChange?.(value, direction);
          setView(value);
          setDir(direction);
        }}
      />
      <TabPanel name="views" tab={view} dir={dir}>
        the {view} panel
      </TabPanel>
    </div>
  );
}

test('the arrow keys travel the row, activate as they go, and wrap at both ends', async () => {
  const onChange = vi.fn();
  renderApp(<Workspace onChange={onChange} />);
  await settle();

  await tab();
  await tab();
  expect(document.activeElement).toBe(named('Overview'));

  await press('{ArrowRight}');
  await settle();
  expect(onChange).toHaveBeenLastCalledWith('activity', 1);
  expect(named('Activity').getAttribute('aria-selected')).toBe('true');
  expect(named('Overview').getAttribute('aria-selected')).toBe('false');
  expect(document.activeElement).toBe(named('Activity'));

  await press('{ArrowLeft}');
  await settle();
  expect(onChange).toHaveBeenLastCalledWith('overview', -1);
  expect(document.activeElement).toBe(named('Overview'));

  await press('{ArrowLeft}');
  await settle();
  expect(named('Settings').getAttribute('aria-selected')).toBe('true');
  expect(document.activeElement).toBe(named('Settings'));

  await press('{ArrowRight}');
  await settle();
  expect(named('Overview').getAttribute('aria-selected')).toBe('true');

  const calls = onChange.mock.calls.length;
  await press('{ArrowDown}');
  await settle();
  expect(onChange, 'a vertical arrow moved a horizontal tab row').toHaveBeenCalledTimes(calls);
  expect(named('Overview').getAttribute('aria-selected')).toBe('true');
});

test('Home and End jump to the first and last enabled tabs', async () => {
  renderApp(<Workspace start="activity" />);
  await settle();

  await tab();
  await tab();
  expect(document.activeElement).toBe(named('Activity'));

  await press('{End}');
  await settle();
  expect(named('Settings').getAttribute('aria-selected')).toBe('true');
  expect(document.activeElement).toBe(named('Settings'));

  await press('{Home}');
  await settle();
  expect(named('Overview').getAttribute('aria-selected')).toBe('true');
  expect(document.activeElement).toBe(named('Overview'));
});

test('a disabled tab is skipped by arrow travel and refuses focus', async () => {
  const onChange = vi.fn();
  renderApp(<Workspace items={WITH_DISABLED} onChange={onChange} />);
  await settle();

  await tab();
  await tab();
  expect(document.activeElement).toBe(named('Overview'));

  await press('{ArrowRight}');
  await settle();
  expect(onChange).toHaveBeenLastCalledWith('settings', 1);
  expect(named('Settings').getAttribute('aria-selected')).toBe('true');
  expect(named('Activity').getAttribute('aria-selected')).toBe('false');

  const skipped = named('Activity');
  skipped.focus();
  expect(document.activeElement).not.toBe(skipped);

  await press('{End}');
  await settle();
  expect(named('Settings').getAttribute('aria-selected')).toBe('true');
});

test('exactly one tab is in the tab order, and Tab steps over the rest of the row', async () => {
  renderApp(<Workspace start="settings" />);
  await settle();

  const inOrder = tabs().filter((el) => el.tabIndex === 0);
  expect(inOrder).toHaveLength(1);
  expect(inOrder[0]).toBe(named('Settings'));

  await tab();
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'before' }));

  await tab();
  expect(document.activeElement).toBe(named('Settings'));

  await tab();
  expect(tabs()).not.toContain(document.activeElement);
});

test('onChange fires once per real change and never on mount', async () => {
  const onChange = vi.fn();
  renderApp(<Workspace onChange={onChange} />);
  await settle();
  expect(onChange).not.toHaveBeenCalled();

  await click(named('Settings'));
  await settle();
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('settings', 1);

  await click(named('Settings'));
  await settle();
  expect(onChange, 'selecting the already-selected tab reported a change').toHaveBeenCalledTimes(1);

  await click(named('Overview'));
  await settle();
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(onChange).toHaveBeenLastCalledWith('overview', -1);
});

test('a controlled Tabs keeps its selection until the value prop changes', async () => {
  const onChange = vi.fn();
  renderApp(<Tabs name="views" ariaLabel="Workspace views" items={VIEWS} value="overview" onChange={onChange} />);
  await settle();

  await click(named('Settings'));
  await settle();

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(named('Overview').getAttribute('aria-selected')).toBe('true');
  expect(named('Settings').getAttribute('aria-selected')).toBe('false');
});

test('the tablist is named, and only the selected tab owns the one exposed panel', async () => {
  renderApp(<Workspace />);
  await settle();

  expect(screen.getByRole('tablist', { name: 'Workspace views' })).toBeDefined();
  expect(screen.getAllByRole('tabpanel')).toHaveLength(1);

  const panel = screen.getByRole('tabpanel');
  expect(named('Overview').getAttribute('aria-controls')).toBe(panel.id);
  expect(panel.getAttribute('aria-labelledby')).toBe(named('Overview').id);
  expect(panel.textContent).toContain('overview');

  await click(named('Activity'));
  await settle();

  const next = screen.getByRole('tabpanel');
  expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  expect(named('Activity').getAttribute('aria-controls')).toBe(next.id);
  expect(next.getAttribute('aria-labelledby')).toBe(named('Activity').id);
  expect(next.textContent).toContain('activity');
});

test('selecting a tab that sits outside the scrolled row brings it into view', async () => {
  const many: TabItem[] = Array.from({ length: 12 }, (_, index) => ({
    value: `section-${index}`,
    label: `Section ${index}`,
  }));

  function Narrow() {
    const [view, setView] = useState('section-0');
    return (
      <div style={{ width: 260 }}>
        <Tabs name="sections" ariaLabel="Sections" items={many} value={view} onChange={(value) => setView(value)} />
      </div>
    );
  }

  renderApp(<Narrow />);
  await settle();

  const list = screen.getByRole('tablist');
  const last = named('Section 11');
  expect(list.scrollWidth, 'the row did not overflow, so nothing had to scroll').toBeGreaterThan(list.clientWidth);
  expect(last.getBoundingClientRect().right).toBeGreaterThan(list.getBoundingClientRect().right);

  await tab();
  await press('{End}');
  await settle();

  expect(last.getAttribute('aria-selected')).toBe('true');
  await waitFor(() => {
    const listBox = list.getBoundingClientRect();
    const tabBox = last.getBoundingClientRect();
    expect(tabBox.right).toBeLessThanOrEqual(listBox.right + 1);
    expect(tabBox.left).toBeGreaterThanOrEqual(listBox.left - 1);
  });

  await press('{Home}');
  await settle();

  const first = named('Section 0');
  await waitFor(() => {
    const listBox = list.getBoundingClientRect();
    const tabBox = first.getBoundingClientRect();
    expect(tabBox.left).toBeGreaterThanOrEqual(listBox.left - 1);
    expect(tabBox.right).toBeLessThanOrEqual(listBox.right + 1);
  });
});

test('a consumer measuring the panel on a tab change sees connected, laid-out content', async () => {
  function Watched({ on }: { on: Ledger }) {
    const [view, setView] = useState('overview');
    const [dir, setDir] = useState<Direction>(0);
    const panelRef = useRef<HTMLDivElement>(null);
    useOpenProbe(view === 'activity', panelRef, on);
    return (
      <div>
        <Tabs
          name="views"
          ariaLabel="Workspace views"
          items={VIEWS}
          value={view}
          onChange={(value, direction) => {
            setView(value);
            setDir(direction);
          }}
        />
        <TabPanel name="views" tab={view} dir={dir}>
          <div ref={panelRef}>
            <Probe on={on}>the {view} panel</Probe>
          </div>
        </TabPanel>
      </div>
    );
  }

  const on = ledger();
  renderApp(<Watched on={on} />);
  await settle();

  await click(named('Activity'));
  await settle();

  expect(on.sightings.length).toBeGreaterThan(0);
  for (const sighting of on.sightings) {
    expect(sighting.connected, `detached during ${sighting.phase}`).toBe(true);
    expect(sighting.height, `no layout during ${sighting.phase}`).toBeGreaterThan(0);
    expect(sighting.tokens['--duration-base'], `unresolved token during ${sighting.phase}`).not.toBe('');
    expect(sighting.tokens['--ease-entrance'], `unresolved token during ${sighting.phase}`).not.toBe('');
  }
});

test('tabs inside an open modal still travel with the arrow keys', async () => {
  const onChange = vi.fn();
  renderApp(
    <Modal open>
      <div role="dialog" aria-label="settings">
        <Workspace onChange={onChange} />
      </div>
    </Modal>,
  );
  await settle();

  named('Overview').focus();
  await press('{ArrowRight}');
  await settle();

  expect(onChange).toHaveBeenCalledWith('activity', 1);
  expect(named('Activity').getAttribute('aria-selected')).toBe('true');
  expect(document.activeElement).toBe(named('Activity'));
});
