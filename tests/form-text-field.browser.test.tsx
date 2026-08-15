import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from '@zyncat/ui/text-field';
import { Modal } from '@zyncat/ui/modal';
import { renderApp, settle } from './harness';

function isRevealed(el: Element | null): boolean {
  return !!el && getComputedStyle(el).visibility === 'visible';
}

function ControlledTextField({ onValue, ...props }: { onValue?: (v: string) => void } & Record<string, unknown>) {
  const [value, setValue] = useState('');
  return (
    <TextField
      id="field"
      label="Workspace name"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onValue?.(e.target.value);
      }}
      {...props}
    />
  );
}

describe('TextField value contract', () => {
  test('an uncontrolled field keeps every character the user types', async () => {
    const user = userEvent.setup();
    renderApp(<TextField id="f" label="Workspace name" />);

    const input = screen.getByLabelText('Workspace name') as HTMLInputElement;
    await user.type(input, 'acme corp');

    expect(input.value).toBe('acme corp');
  });

  test('an uncontrolled field starts from the default value it was given and stays editable', async () => {
    const user = userEvent.setup();
    renderApp(<TextField id="f" label="Workspace name" htmlProps={{ defaultValue: 'acme' }} />);

    const input = screen.getByLabelText('Workspace name') as HTMLInputElement;
    expect(input.value).toBe('acme');

    await user.type(input, ' corp');
    expect(input.value).toBe('acme corp');
  });

  test('a field whose value prop is pinned never changes on screen, but still reports what was typed', async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    renderApp(<TextField id="f" label="Workspace name" value="pinned" onChange={(e) => seen.push(e.target.value)} />);

    const input = screen.getByLabelText('Workspace name') as HTMLInputElement;
    await user.type(input, 'x');

    expect(input.value).toBe('pinned');
    expect(seen).toEqual(['pinnedx']);
  });

  test('onChange fires once per keystroke with the text after that keystroke, and not on mount', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledTextField onValue={onValue} />);

    expect(onValue).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText('Workspace name'), 'abc');

    expect(onValue.mock.calls.map((c) => c[0])).toEqual(['a', 'ab', 'abc']);
  });

  test('backspace deletes the last character and a selection is replaced by what is typed over it', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledTextField />);

    const input = screen.getByLabelText('Workspace name') as HTMLInputElement;
    await user.type(input, 'acme');
    await user.keyboard('{Backspace}{Backspace}');
    expect(input.value).toBe('ac');

    await user.tripleClick(input);
    await user.keyboard('zed');
    expect(input.value).toBe('zed');
  });

  test('pasting text reports it as a single change', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledTextField onValue={onValue} />);

    const input = screen.getByLabelText('Workspace name') as HTMLInputElement;
    await user.click(input);
    await user.paste('pasted name');

    expect(input.value).toBe('pasted name');
    expect(onValue.mock.calls).toEqual([['pasted name']]);
  });
});

describe('TextField clear affordance', () => {
  test('the clear button appears only once the field has a value', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledTextField clearable />);

    expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();

    await user.type(screen.getByLabelText('Workspace name'), 'a');
    expect(screen.getByRole('button', { name: /clear/i })).toBeInstanceOf(HTMLElement);
  });

  test('clicking clear empties the field, reports the empty value once and puts focus back in the input', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledTextField clearable onValue={onValue} />);

    const input = screen.getByLabelText('Workspace name') as HTMLInputElement;
    await user.type(input, 'acme');
    onValue.mockClear();

    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(input.value).toBe('');
    expect(onValue.mock.calls).toEqual([['']]);
    expect(document.activeElement).toBe(input);
    expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();
  });

  test('a read-only field offers no clear button even when it holds a value', () => {
    renderApp(<TextField id="f" label="Workspace name" clearable readOnly value="acme" onChange={() => {}} />);

    expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();
  });
});

describe('TextField messaging', () => {
  test('a field that mounts in error shows its message straight away', () => {
    renderApp(<TextField id="f" label="Username" error="Must be at least 4 characters." />);

    expect(isRevealed(screen.getByText('Must be at least 4 characters.'))).toBe(true);
  });

  test('an error replaces the helper text and marks the input invalid', async () => {
    const view = renderApp(<TextField id="f" label="Username" helper="Letters and numbers only." />);
    const input = screen.getByLabelText('Username');
    expect(input.getAttribute('aria-invalid')).toBeNull();

    view.rerender(<TextField id="f" label="Username" helper="Letters and numbers only." error="Too short." />);
    await settle();

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(isRevealed(screen.getByText('Too short.'))).toBe(true);
    expect(screen.queryByText('Letters and numbers only.')).toBeNull();
  });

  test('clearing the error drops aria-invalid and brings the helper back', async () => {
    const view = renderApp(<TextField id="f" label="Username" helper="Letters and numbers only." error="Too short." />);
    view.rerender(<TextField id="f" label="Username" helper="Letters and numbers only." />);
    await settle();

    expect(screen.getByLabelText('Username').getAttribute('aria-invalid')).toBeNull();
    expect(isRevealed(screen.getByText('Letters and numbers only.'))).toBe(true);
    expect(screen.queryByText('Too short.')).toBeNull();
  });

  test('only the highest priority message is shown when several are supplied', async () => {
    const view = renderApp(
      <TextField id="f" label="Username" helper="Helper." success="Saved." warning="Careful." error="Broken." />,
    );
    await settle();
    expect(screen.getByText('Broken.')).toBeInstanceOf(HTMLElement);
    for (const other of ['Careful.', 'Saved.', 'Helper.']) expect(screen.queryByText(other)).toBeNull();

    view.rerender(<TextField id="f" label="Username" helper="Helper." success="Saved." warning="Careful." />);
    await settle();
    expect(screen.getByText('Careful.')).toBeInstanceOf(HTMLElement);
    expect(screen.queryByText('Saved.')).toBeNull();

    view.rerender(<TextField id="f" label="Username" helper="Helper." success="Saved." />);
    await settle();
    expect(screen.getByText('Saved.')).toBeInstanceOf(HTMLElement);
    expect(screen.queryByText('Helper.')).toBeNull();
  });

  test('a message that is taken away is no longer readable on screen', async () => {
    const view = renderApp(<TextField id="f" label="Username" helper="Letters and numbers only." />);
    view.rerender(<TextField id="f" label="Username" />);
    await settle();

    expect(screen.queryByText('Letters and numbers only.')).toBeNull();
  });
});

describe('TextField accessibility', () => {
  test('the label names the input and the required marker stays out of that name', () => {
    renderApp(<TextField id="f" label="Workspace name" required />);

    const input = screen.getByRole('textbox', { name: 'Workspace name' }) as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  test('a disabled field cannot be focused or typed into', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<TextField id="f" label="Workspace name" disabled onChange={onChange} />);

    const input = screen.getByLabelText('Workspace name') as HTMLInputElement;
    await user.click(input);
    await user.keyboard('abc');

    expect(document.activeElement).not.toBe(input);
    expect(input.value).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('a read-only field takes focus but refuses edits', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<TextField id="f" label="Workspace name" readOnly value="acme" onChange={onChange} />);

    const input = screen.getByLabelText('Workspace name') as HTMLInputElement;
    await user.click(input);
    await user.keyboard('x');

    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('acme');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('the input type and attributes handed through htmlProps reach the real input', () => {
    renderApp(
      <TextField
        id="f"
        label="Password"
        type="password"
        htmlProps={{ name: 'password', autoComplete: 'current-password', 'aria-describedby': 'rules' }}
      />,
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');
    expect(input.name).toBe('password');
    expect(input.autocomplete).toBe('current-password');
    expect(input.getAttribute('aria-describedby')).toBe('rules');
  });

  test('an invalid field points assistive technology at the message explaining why', async () => {
    renderApp(<TextField id="f" label="Username" error="Must be at least 4 characters." />);
    await settle();

    const input = screen.getByLabelText('Username');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy, 'aria-invalid is set but nothing describes the input').not.toBeNull();

    const described = describedBy!
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ');
    expect(described).toContain('Must be at least 4 characters.');
  });
});

describe('TextField composition', () => {
  test('a text field inside an open modal takes focus and accepts typing', async () => {
    const user = userEvent.setup();
    renderApp(
      <Modal open>
        <div role="dialog" aria-label="Workspace settings">
          <TextField id="f" label="Workspace name" />
        </div>
      </Modal>,
    );
    await settle();

    const input = screen.getByLabelText('Workspace name') as HTMLInputElement;
    await user.click(input);
    await user.keyboard('acme');

    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('acme');
  });

  test('remounting a field starts it from a clean slate', async () => {
    const user = userEvent.setup();
    const view = renderApp(<TextField key="a" id="f" label="Workspace name" />);
    await user.type(screen.getByLabelText('Workspace name'), 'acme');

    view.rerender(<TextField key="b" id="f" label="Workspace name" />);

    expect((screen.getByLabelText('Workspace name') as HTMLInputElement).value).toBe('');
  });
});
