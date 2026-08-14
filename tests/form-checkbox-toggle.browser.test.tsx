import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '@zyncat/ui/checkbox';
import { Toggle } from '@zyncat/ui/toggle';
import { renderApp } from './harness';

const CONSENT = 'Email me about product updates';
const AUTOSAVE = 'Auto-save drafts';

function ControlledCheckbox({ onFlip, initial = false }: { onFlip?: (checked: boolean) => void; initial?: boolean }) {
  const [checked, setChecked] = useState(initial);
  return (
    <Checkbox
      label={CONSENT}
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked);
        onFlip?.(e.target.checked);
      }}
    />
  );
}

function ControlledToggle({ onFlip, initial = false }: { onFlip?: (checked: boolean) => void; initial?: boolean }) {
  const [checked, setChecked] = useState(initial);
  return (
    <Toggle
      label={AUTOSAVE}
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked);
        onFlip?.(e.target.checked);
      }}
    />
  );
}

function box(): HTMLInputElement {
  return screen.getByRole('checkbox', { name: CONSENT }) as HTMLInputElement;
}

function toggleSwitch(): HTMLInputElement {
  return screen.getByRole('switch', { name: AUTOSAVE }) as HTMLInputElement;
}

describe('Checkbox', () => {
  test('clicking the label text checks the box and reports the new state once', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    renderApp(<ControlledCheckbox onFlip={onFlip} />);

    expect(box().checked).toBe(false);
    expect(onFlip).not.toHaveBeenCalled();

    await user.click(screen.getByText(CONSENT));

    expect(box().checked).toBe(true);
    expect(onFlip.mock.calls).toEqual([[true]]);
  });

  test('an uncontrolled box starts from defaultChecked and flips on every click', async () => {
    const user = userEvent.setup();
    renderApp(<Checkbox label={CONSENT} defaultChecked />);

    expect(box().checked).toBe(true);

    await user.click(screen.getByText(CONSENT));
    expect(box().checked).toBe(false);

    await user.click(screen.getByText(CONSENT));
    expect(box().checked).toBe(true);
  });

  test('a box pinned unchecked never appears checked, but still reports the attempt', async () => {
    const user = userEvent.setup();
    const seen: boolean[] = [];
    renderApp(<Checkbox label={CONSENT} checked={false} onChange={(e) => seen.push(e.target.checked)} />);

    await user.click(screen.getByText(CONSENT));

    expect(box().checked).toBe(false);
    expect(seen).toEqual([true]);
  });

  test('Space toggles the box that has focus and Enter leaves it alone', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    renderApp(<ControlledCheckbox onFlip={onFlip} />);

    await user.tab();
    expect(document.activeElement).toBe(box());

    await user.keyboard(' ');
    expect(box().checked).toBe(true);

    await user.keyboard('{Enter}');
    expect(box().checked).toBe(true);
    expect(onFlip.mock.calls).toEqual([[true]]);
  });

  test('a disabled box ignores clicks and keyboard and is skipped by Tab', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(
      <>
        <button type="button">before</button>
        <Checkbox label={CONSENT} disabled onChange={onChange} />
        <button type="button">after</button>
      </>,
    );

    await user.click(screen.getByText(CONSENT));
    expect(box().checked).toBe(false);

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'before' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'after' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('an indeterminate box says so on the control and reports a checked box when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<Checkbox label={CONSENT} indeterminate onChange={onChange} />);

    expect(box().indeterminate).toBe(true);

    await user.click(screen.getByText(CONSENT));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.checked).toBe(true);
  });

  test('the indeterminate state is dropped as soon as the prop goes away', () => {
    const view = renderApp(<Checkbox label={CONSENT} indeterminate />);
    expect(box().indeterminate).toBe(true);

    view.rerender(<Checkbox label={CONSENT} />);
    expect(box().indeterminate).toBe(false);
  });

  test('the description is shown under the label and the error state marks the box invalid', () => {
    const view = renderApp(<Checkbox label={CONSENT} description="No more than one email a week." />);

    expect(screen.getByText('No more than one email a week.')).toBeInstanceOf(HTMLElement);
    expect(screen.getByRole('checkbox', { name: /Email me about product updates/ }).getAttribute('aria-invalid')).toBe(
      null,
    );

    view.rerender(<Checkbox label={CONSENT} description="No more than one email a week." error />);
    expect(screen.getByRole('checkbox', { name: /Email me about product updates/ }).getAttribute('aria-invalid')).toBe(
      'true',
    );
  });
});

describe('Toggle', () => {
  test('the switch is exposed as a switch and named by its label', () => {
    renderApp(<Toggle label={AUTOSAVE} />);

    expect(toggleSwitch().checked).toBe(false);
  });

  test('clicking the label flips the switch and reports the new state once', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    renderApp(<ControlledToggle onFlip={onFlip} />);

    expect(onFlip).not.toHaveBeenCalled();

    await user.click(screen.getByText(AUTOSAVE));
    expect(toggleSwitch().checked).toBe(true);

    await user.click(screen.getByText(AUTOSAVE));
    expect(toggleSwitch().checked).toBe(false);

    expect(onFlip.mock.calls).toEqual([[true], [false]]);
  });

  test('an uncontrolled switch starts from defaultChecked', async () => {
    const user = userEvent.setup();
    renderApp(<Toggle label={AUTOSAVE} defaultChecked />);

    expect(toggleSwitch().checked).toBe(true);

    await user.click(screen.getByText(AUTOSAVE));
    expect(toggleSwitch().checked).toBe(false);
  });

  test('a switch pinned off never appears on, but still reports the attempt', async () => {
    const user = userEvent.setup();
    const seen: boolean[] = [];
    renderApp(<Toggle label={AUTOSAVE} checked={false} onChange={(e) => seen.push(e.target.checked)} />);

    await user.click(screen.getByText(AUTOSAVE));

    expect(toggleSwitch().checked).toBe(false);
    expect(seen).toEqual([true]);
  });

  test('Space flips the switch that has focus', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledToggle />);

    await user.tab();
    expect(document.activeElement).toBe(toggleSwitch());

    await user.keyboard(' ');
    expect(toggleSwitch().checked).toBe(true);
  });

  test('a disabled switch ignores clicks and keyboard and is skipped by Tab', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(
      <>
        <button type="button">before</button>
        <Toggle label={AUTOSAVE} disabled defaultChecked onChange={onChange} />
        <button type="button">after</button>
      </>,
    );

    await user.click(screen.getByText(AUTOSAVE));
    expect(toggleSwitch().checked).toBe(true);

    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'after' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('the description is shown beside the switch', () => {
    renderApp(<Toggle label={AUTOSAVE} description="Every 30 seconds." />);

    expect(screen.getByText('Every 30 seconds.')).toBeInstanceOf(HTMLElement);
  });
});
