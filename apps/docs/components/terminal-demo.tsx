'use client';

import { useState } from 'react';

const PM_VERSIONS: Record<string, string> = { pnpm: '11.13', npm: '11.14', yarn: '4.12', bun: '1.3' };

export function TerminalDemo({ pm, command }: { pm: string; command: string }) {
  const [run, setRun] = useState(0);
  const pnpm = pm === 'pnpm';

  return (
    <figure className="termo">
      <div className="termo__chrome">
        <span className="termo__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="termo__title">~/my-app</span>
        <button type="button" className="termo__replay" onClick={() => setRun((n) => n + 1)}>
          replay
        </button>
      </div>
      <div className={`termo__screen${pnpm ? '' : ' termo__screen--plain'}`} aria-hidden key={`${command}-${run}`}>
        <p className="termo__line termo__prompt">
          <span className="termo__chevron">❯</span>
          <span className="termo__cmd">{command}</span>
          <span className="termo__caret" />
        </p>
        <p className="termo__line termo__pop">
          <span className="termo__rail">┌</span>
          <span className="termo__brand">zyncat</span> <strong>ui</strong> <span className="termo__dim">v0.11.0</span>
        </p>
        <p className="termo__line termo__pop">
          <span className="termo__rail">│</span>
        </p>
        <p className="termo__line termo__pop">
          <span className="termo__rail">│</span>
          <span className="termo__dim">
            my-app · {pm} {PM_VERSIONS[pm] ?? ''}
          </span>
        </p>
        <p className="termo__line termo__pop">
          <span className="termo__rail">│</span>
        </p>
        <div className="termo__line termo__phase">
          <p className="termo__resolve">
            <span className="termo__spin" />
            <span className="termo__think">{pnpm ? 'Resolving dependencies' : `Installing with ${pm}`}</span>
            <span className="termo__dim"> [1s]</span>
          </p>
          {pnpm && (
            <p className="termo__fetch">
              <span className="termo__spin" />
              <span className="termo__think">Fetching packages</span>{' '}
              <span className="termo__track">
                <span className="termo__trackrest">──────────────────────</span>
                <span className="termo__trackfill">
                  <span>━━━━━━━━━━━━━━━━━━━━━━</span>
                </span>
              </span>{' '}
              <span className="termo__counts">
                <span>14/61</span>
                <span>37/61</span>
                <span>58/61</span>
              </span>
              <span className="termo__dim"> · @zyncat/ui 363 kB [3s]</span>
            </p>
          )}
          <p className="termo__done">
            <span className="termo__check">✓</span>
            <strong>@zyncat/ui</strong>
            <span className="termo__dim"> 0.11.0 · 61 packages · {pnpm ? '4.8s' : '6.2s'}</span>
          </p>
        </div>
        <p className="termo__line termo__pop termo__late">
          <span className="termo__rail">│</span>
        </p>
        <p className="termo__line termo__wire">
          <span className="termo__check">✓</span>
          <span className="termo__label">Agent skill</span>
          <span className="termo__dim">.claude/skills/zyncat-ui · installed</span>
        </p>
        <p className="termo__line termo__wire">
          <span className="termo__check">✓</span>
          <span className="termo__label">MCP server</span>
          <span className="termo__dim">.mcp.json → zyncat-ui</span>
        </p>
        <p className="termo__line termo__wire">
          <span className="termo__check">✓</span>
          <span className="termo__label">Stylesheet</span>
          <span className="termo__dim">app/layout.tsx · import added</span>
        </p>
        <p className="termo__line termo__end">
          <span className="termo__rail">│</span>
        </p>
        <p className="termo__line termo__end">
          <span className="termo__rail">│</span>
          <span className="termo__dim">Docs</span> <span className="termo__link">https://ui.zyncat.app</span>
        </p>
        <p className="termo__line termo__end">
          <span className="termo__rail">│</span>
        </p>
        <p className="termo__line termo__end">
          <span className="termo__rail">└</span>
          <strong>Ready in 5.4s.</strong>
          <span className="termo__dim"> Restart your agent session to load the skill.</span>
        </p>
      </div>
      <figcaption className="visually-hidden">
        Demo of the zyncat-ui init terminal output: the package installs with a progress bar, then the agent skill, MCP
        server and stylesheet are wired up.
      </figcaption>
    </figure>
  );
}
