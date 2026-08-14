import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OtpField } from '@zyncat/ui/otp-field';
import { renderApp } from './harness';

function ControlledCode({
  onValue,
  initial = '',
  ...props
}: {
  onValue?: (value: string) => void;
  initial?: string;
  length?: number;
  group?: number;
  error?: boolean;
  disabled?: boolean;
}) {
  const [code, setCode] = useState(initial);
  return (
    <OtpField
      value={code}
      onChange={(next) => {
        setCode(next);
        onValue?.(next);
      }}
      {...props}
    />
  );
}

function cells(): HTMLInputElement[] {
  return screen.getAllByRole('textbox') as HTMLInputElement[];
}

function shown(): string {
  return cells()
    .map((cell) => cell.value || '_')
    .join('');
}

describe('OtpField typing', () => {
  test('a digit fills the cell it was typed in and focus moves to the next one', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode />);

    await user.type(cells()[0], '4');

    expect(shown()).toBe('4_____');
    expect(document.activeElement).toBe(cells()[1]);
  });

  test('typing a whole code fills every cell in order and reports the finished code exactly once', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledCode onValue={onValue} />);

    await user.type(cells()[0], '123456');

    expect(shown()).toBe('123456');
    expect(onValue.mock.calls.map(([value]) => value)).toEqual(['1', '12', '123', '1234', '12345', '123456']);
    expect(onValue.mock.calls.filter(([value]) => value.length === 6)).toEqual([['123456']]);
  });

  test('typing more digits than there are cells leaves the last cell holding the last digit typed', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode length={4} />);

    await user.type(cells()[0], '12345');

    expect(cells()).toHaveLength(4);
    expect(shown()).toBe('1235');
  });

  test('typing over a filled cell replaces that digit', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode initial="123456" />);

    await user.type(cells()[0], '9');

    expect(shown()).toBe('923456');
  });

  test('letters never appear in a cell', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode />);

    await user.type(cells()[0], 'a');

    expect(shown()).toBe('______');
  });

  test('separators between groups do not interrupt the run of cells', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode group={3} />);

    await user.type(cells()[0], '123456');

    expect(shown()).toBe('123456');
  });
});

describe('OtpField editing and movement', () => {
  test('backspace on a filled cell empties it and stays put', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode initial="12" />);

    await user.click(cells()[1]);
    await user.keyboard('{Backspace}');

    expect(shown()).toBe('1_____');
    expect(document.activeElement).toBe(cells()[1]);
  });

  test('backspace on an empty cell clears the previous cell and moves back to it', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode />);

    await user.type(cells()[0], '12');
    expect(document.activeElement).toBe(cells()[2]);

    await user.keyboard('{Backspace}');

    expect(shown()).toBe('1_____');
    expect(document.activeElement).toBe(cells()[1]);
  });

  test('the arrow keys walk between cells without changing the code', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledCode initial="123456" onValue={onValue} />);

    await user.click(cells()[0]);
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(document.activeElement).toBe(cells()[2]);

    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(cells()[1]);

    expect(shown()).toBe('123456');
    expect(onValue).not.toHaveBeenCalled();
  });

  test('clicking a cell moves focus to it', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode />);

    await user.click(cells()[3]);

    expect(document.activeElement).toBe(cells()[3]);
  });
});

describe('OtpField pasting', () => {
  test('pasting a whole code fills every cell and reports it once', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledCode onValue={onValue} />);

    await user.click(cells()[0]);
    await user.paste('123456');

    expect(shown()).toBe('123456');
    expect(onValue.mock.calls).toEqual([['123456']]);
  });

  test('pasting a code with separators keeps only the digits', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode />);

    await user.click(cells()[0]);
    await user.paste('123-456');

    expect(shown()).toBe('123456');
  });

  test('pasting more digits than there are cells keeps only what fits', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledCode onValue={onValue} />);

    await user.click(cells()[0]);
    await user.paste('1234567890');

    expect(shown()).toBe('123456');
    expect(onValue.mock.calls).toEqual([['123456']]);
  });

  test('pasting into a later cell fills from that cell onwards and leaves the earlier ones alone', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode />);

    await user.type(cells()[0], '12');
    await user.paste('34');

    expect(shown()).toBe('1234__');
  });

  test('pasting fewer digits than there are cells fills only as far as they reach', async () => {
    const user = userEvent.setup();
    renderApp(<ControlledCode />);

    await user.click(cells()[0]);
    await user.paste('12');

    expect(shown()).toBe('12____');
  });
});

describe('OtpField state', () => {
  test('a field pinned to one code cannot be changed by typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderApp(<OtpField value="123456" onChange={onChange} />);

    await user.type(cells()[0], '9');

    expect(shown()).toBe('123456');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBe('923456');
  });

  test('every cell of a disabled field refuses input', async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    renderApp(<ControlledCode disabled onValue={onValue} />);

    for (const cell of cells()) expect(cell.disabled).toBe(true);

    await user.click(cells()[0]);
    await user.keyboard('1');

    expect(shown()).toBe('______');
    expect(onValue).not.toHaveBeenCalled();
  });

  test('the error state marks every cell invalid and clears again', async () => {
    const view = renderApp(<OtpField value="12" error onChange={() => {}} />);
    for (const cell of cells()) expect(cell.getAttribute('aria-invalid')).toBe('true');

    view.rerender(<OtpField value="12" onChange={() => {}} />);
    for (const cell of cells()) expect(cell.getAttribute('aria-invalid')).toBeNull();
  });

  test('the number of cells follows the length asked for', () => {
    renderApp(<OtpField length={4} value="" onChange={() => {}} />);

    expect(cells()).toHaveLength(4);
  });

  test('a code longer than the field is cut down to the cells available', () => {
    renderApp(<OtpField length={4} value="123456" onChange={() => {}} />);

    expect(shown()).toBe('1234');
  });
});
