import { useState, type FormEvent, type Ref } from 'react';
import { BugdumpApiError } from '@bugdump/sdk';
import { bugdump } from './bugdump';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; taskPublicId: number }
  | { kind: 'error'; message: string };

export function ReportDialog({ ref }: { ref: Ref<HTMLDialogElement> }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: 'sending' });

    try {
      const { taskPublicId } = await bugdump.submit({
        description: String(data.get('description')),
        reporterName: String(data.get('name')) || undefined,
        reporterEmail: String(data.get('email')) || undefined,
        priority: String(data.get('priority')) || undefined,
        // An empty file input still submits one nameless, empty File.
        files: data.getAll('files').filter((file): file is File => file instanceof File && file.size > 0),
      });
      setStatus({ kind: 'sent', taskPublicId });
      form.reset();
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof BugdumpApiError
            ? `Bugdump refused the report: ${error.message} (HTTP ${error.statusCode}).`
            : 'Could not reach Bugdump. Check your connection and try again.',
      });
    }
  }

  return (
    <dialog ref={ref} className="report-dialog" onClose={() => setStatus({ kind: 'idle' })}>
      {status.kind === 'sent' ? (
        <div className="report-sent">
          <h2>Thanks, we got it</h2>
          <p>
            Your report is task <strong>#{status.taskPublicId}</strong> in Bugdump.
          </p>
          <form method="dialog">
            <button className="button button-primary">Close</button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Report a problem</h2>

          <label>
            What happened?
            <textarea name="description" required maxLength={10000} rows={5} placeholder="I clicked Pay and nothing happened…" />
          </label>

          <div className="row">
            <label>
              Name
              <input name="name" autoComplete="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" />
            </label>
          </div>

          <label>
            How bad is it?
            {/* The values are Bugdump's default priority labels. If you renamed yours, use your labels: an unknown one is ignored. */}
            <select name="priority" defaultValue="">
              <option value="">Not sure</option>
              <option value="Low">Minor annoyance</option>
              <option value="Medium">Something is off</option>
              <option value="High">I'm blocked</option>
              <option value="Critical">Everything is down</option>
            </select>
          </label>

          <label>
            Attachments
            <input name="files" type="file" multiple />
          </label>

          {status.kind === 'error' && (
            <p className="error" role="alert">
              {status.message}
            </p>
          )}

          <div className="actions">
            <button type="button" className="button" onClick={(e) => e.currentTarget.closest('dialog')?.close()}>
              Cancel
            </button>
            <button type="submit" className="button button-primary" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? 'Sending…' : 'Send report'}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
