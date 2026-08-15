import { useState, type ReactNode } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '@zyncat/ui/textarea';
import { Modal } from '@zyncat/ui/modal';
import { renderApp, settle } from './harness';

const SIX_LINES = 'one\ntwo\nthree\nfour\nfive\nsix';
const FORTY_LINES = Array.from({ length: 40 }, (_, i) => `line ${i}`).join('\n');

interface ComposerProps {
  host: string;
  initial?: string;
  minRows?: number;
  maxRows?: number;
  max?: number;
  hint?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  onSubmit?: (value: string) => void;
  onValue?: (value: string) => void;
}

function Composer({ host, initial = '', onValue, ...rest }: ComposerProps) {
  const [value, setValue] = useState(initial);
  return (
    <div data-host={host} style={{ width: 320 }}>
      <Textarea
        id={`bio-${host}`}
        label="Bio"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onValue?.(e.target.value);
        }}
        {...rest}
      />
    </div>
  );
}

function host(name: string): HTMLElement {
  const el = document.querySelector(`[data-host="${name}"]`);
  if (!el) throw new Error(`no host named ${name}`);
  return el as HTMLElement;
}

function hostHeight(name: string): number {
  return host(name).offsetHeight;
}

function boxOf(name: string): HTMLTextAreaElement {
  return within(host(name)).getByRole('textbox') as HTMLTextAreaElement;
}

function scrollHost(el: HTMLElement): HTMLElement | null {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const overflowY = getComputedStyle(node).overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1) return node;
  }
  return null;
}

describe('Textarea auto-grow', () => {
  test('the box grows with the text and shrinks back when the text is removed', async () => {
    const user = userEvent.setup();
    renderApp(<Composer host="grow" />);
    await settle();
    const empty = hostHeight('grow');

    const box = boxOf('grow');
    await user.click(box);
    await user.paste(SIX_LINES);
    await settle();
    const grown = hostHeight('grow');
    expect(grown).toBeGreaterThan(empty);

    await user.clear(box);
    await settle();
    expect(Math.abs(hostHeight('grow') - empty)).toBeLessThanOrEqual(1);
  });

  test('a box that mounts holding a long value is already as tall as the same text typed into it', async () => {
    const user = userEvent.setup();
    renderApp(
      <>
        <Composer host="mounted" initial={SIX_LINES} />
        <Composer host="typed" />
        <Composer host="untouched" />
      </>,
    );
    await settle();

    await user.click(boxOf('typed'));
    await user.paste(SIX_LINES);
    await settle();

    expect(hostHeight('mounted')).toBe(hostHeight('typed'));
    expect(hostHeight('mounted')).toBeGreaterThan(hostHeight('untouched'));
  });

  test('the number of rows shown before growing follows minRows', async () => {
    renderApp(
      <>
        <Composer host="short" minRows={3} />
        <Composer host="tall" minRows={8} />
      </>,
    );
    await settle();

    expect(hostHeight('tall')).toBeGreaterThan(hostHeight('short'));
  });

  test('growth stops at the row cap, and a lower cap gives a shorter box', async () => {
    renderApp(
      <>
        <Composer host="cap4" initial={FORTY_LINES} maxRows={4} />
        <Composer host="cap10" initial={FORTY_LINES} maxRows={10} />
        <Composer host="cap4empty" maxRows={4} />
      </>,
    );
    await settle();

    expect(hostHeight('cap4')).toBeLessThan(hostHeight('cap10'));
    expect(hostHeight('cap4')).toBeGreaterThan(hostHeight('cap4empty'));
  });

  test('text past the row cap can be reached by scrolling', async () => {
    renderApp(<Composer host="capped" initial={FORTY_LINES} maxRows={4} />);
    await settle();

    expect(scrollHost(boxOf('capped')), 'nothing around the textarea scrolls').not.toBeNull();
  });

  test('the box becomes scrollable once it has settled at the cap and the text keeps growing', async () => {
    const user = userEvent.setup();
    renderApp(<Composer host="typedcap" maxRows={4} />);
    await settle();

    const box = boxOf('typedcap');
    await user.click(box);
    await user.paste(FORTY_LINES);
    await settle();

    await user.keyboard('!');
    await settle();

    expect(scrollHost(box)).not.toBeNull();
  });

  test('a box that mounts inside an already open modal is sized for its content', async () => {
    renderApp(
      <>
        <Composer host="onpage" initial={SIX_LINES} />
        <Modal open>
          <div role="dialog" aria-label="Compose">
            <Composer host="inmodal" initial={SIX_LINES} />
          </div>
        </Modal>
      </>,
    );
    await settle();

    expect(hostHeight('inmodal')).toBe(hostHeight('onpage'));
  });
});

describe('Textarea value contract', () => {
  test('onChange reports every keystroke with the text after it, and nothing on mount', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<Composer host="v" onValue={onValue} />);
    expect(onValue).not.toHaveBeenCalled();

    await user.type(boxOf('v'), 'hey');

    expect(onValue.mock.calls.map(([value]) => value)).toEqual(['h', 'he', 'hey']);
  });

  test('a box whose value prop is pinned never changes on screen but still reports the attempt', async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    renderApp(
      <div data-host="pinned" style={{ width: 320 }}>
        <Textarea id="pinned" label="Bio" value="fixed" onChange={(e) => seen.push(e.target.value)} />
      </div>,
    );

    const box = boxOf('pinned');
    await user.click(box);
    await user.keyboard('!');

    expect(box.value).toBe('fixed');
    expect(seen).toEqual(['fixed!']);
  });

  test('Ctrl+Enter hands the current text to onSubmit while a plain Enter starts a new line', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderApp(<Composer host="s" onSubmit={onSubmit} />);

    const box = boxOf('s');
    await user.type(box, 'ship it');
    await user.keyboard('{Control>}{Enter}{/Control}');

    expect(onSubmit.mock.calls).toEqual([['ship it']]);
    expect(box.value).toBe('ship it');

    await user.keyboard('{Enter}');
    expect(box.value).toBe('ship it\n');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('a disabled box refuses typing and a read-only box takes focus but no edits', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(
      <>
        <Composer host="off" initial="locked" disabled onValue={onValue} />
        <Composer host="ro" initial="frozen" readOnly onValue={onValue} />
      </>,
    );

    await user.click(boxOf('off'));
    await user.keyboard('x');
    expect(document.activeElement).not.toBe(boxOf('off'));
    expect(boxOf('off').value).toBe('locked');

    await user.click(boxOf('ro'));
    await user.keyboard('x');
    expect(document.activeElement).toBe(boxOf('ro'));
    expect(boxOf('ro').value).toBe('frozen');

    expect(onValue).not.toHaveBeenCalled();
  });
});

describe('Textarea meter and messaging', () => {
  test('the meter counts what has been typed and switches to how far over the limit it is', async () => {
    const user = userEvent.setup();
    renderApp(<Composer host="meter" max={280} />);

    const box = boxOf('meter');
    await user.type(box, 'hello');
    expect(screen.getByText('5 / 280')).toBeInstanceOf(HTMLElement);

    await user.clear(box);
    await user.click(box);
    await user.paste('x'.repeat(285));

    expect(screen.getByText('-5')).toBeInstanceOf(HTMLElement);
    expect(box.value).toHaveLength(285);
  });

  test('the footer hint is shown alongside the meter', () => {
    renderApp(<Composer host="hint" max={280} hint="Ctrl+Enter to send" />);

    expect(screen.getByText('Ctrl+Enter to send')).toBeInstanceOf(HTMLElement);
  });

  test('the label names the box, and an error marks it invalid and replaces the helper', async () => {
    const view = renderApp(
      <div data-host="msg" style={{ width: 320 }}>
        <Textarea id="msg" label="Bio" helper="A short intro." value="" onChange={() => {}} />
      </div>,
    );

    const box = screen.getByRole('textbox', { name: 'Bio' }) as HTMLTextAreaElement;
    expect(box.getAttribute('aria-invalid')).toBeNull();
    expect(screen.getByText('A short intro.')).toBeInstanceOf(HTMLElement);

    view.rerender(
      <div data-host="msg" style={{ width: 320 }}>
        <Textarea id="msg" label="Bio" helper="A short intro." error="Too long." value="" onChange={() => {}} />
      </div>,
    );
    await settle();

    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(getComputedStyle(screen.getByText('Too long.')).visibility).toBe('visible');
    expect(screen.queryByText('A short intro.')).toBeNull();
  });

  test('required reaches the real textarea', () => {
    renderApp(
      <div data-host="req" style={{ width: 320 }}>
        <Textarea id="req" label="Bio" required value="" onChange={() => {}} />
      </div>,
    );

    expect((screen.getByRole('textbox', { name: 'Bio' }) as HTMLTextAreaElement).required).toBe(true);
  });
});
