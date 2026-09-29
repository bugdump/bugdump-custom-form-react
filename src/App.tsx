import { useRef } from 'react';
import { apiKey } from './bugdump';
import { ReportDialog } from './ReportDialog';

// A failed call and a console error, so the next report has something to show.
function triggerError() {
  fetch('/api/orders/42/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: 42 }),
  }).catch(() => {});
  console.error('Payment failed: card_declined');
}

export default function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <main>
      <h1>Your own bug report form</h1>
      <p>
        This page files reports to Bugdump from a form it renders itself. The widget's floating button is hidden, and
        the dialog below calls <code>bugdump.submit()</code> with whatever the form collected.
      </p>
      <p>
        The SDK still attaches what the widget would: console logs, network requests, recent clicks, the page URL,
        browser and viewport, and a session replay when your plan includes one. Trigger an error first, then send a
        report and open it in Bugdump to see it.
      </p>

      {!apiKey && (
        <p className="error" role="alert">
          Set <code>VITE_BUGDUMP_API_KEY</code> in <code>.env</code> and restart the dev server.
        </p>
      )}

      <div className="actions">
        <button className="button" onClick={triggerError}>
          Trigger an error
        </button>
        <button className="button button-primary" onClick={() => dialogRef.current?.showModal()}>
          Report a problem
        </button>
      </div>

      <ReportDialog ref={dialogRef} />
    </main>
  );
}
