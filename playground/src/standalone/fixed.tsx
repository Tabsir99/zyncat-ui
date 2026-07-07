import 'premium-ds/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
/* The heal: this page ALSO uses the components that own the vocabularies
   Table/Toast render (.cbx / .btn / .odo). Their CSS rides along, so the
   table's checkboxes, bulk buttons and odometer style themselves again. */
import { Checkbox } from 'premium-ds/checkbox';
import { Button } from 'premium-ds/button';
import { Badge } from 'premium-ds/badge';
import { StandaloneDemo } from './demo';

const extras = (
  <p
    style={{
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      padding: '12px 16px',
      border: '1px dashed var(--border-default, #ccc)',
      borderRadius: 8,
      margin: '0 0 24px',
    }}
  >
    <span style={{ color: 'var(--text-subtle, #999)' }}>the accidental healers:</span>
    <Checkbox label="Checkbox" defaultChecked />
    <Button size="sm" variant="secondary">
      Button
    </Button>
    <Badge tone="success" dot>
      Badge
    </Badge>
  </p>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StandaloneDemo healed extras={extras} />
  </StrictMode>,
);
