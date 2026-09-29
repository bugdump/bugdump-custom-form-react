# Bugdump: your own bug report form (React)

A Vite + React app that sends bug reports to [Bugdump](https://bugdump.com) from its own form, in its own dialog, using `bugdump.submit()` from [`@bugdump/sdk`](https://www.npmjs.com/package/@bugdump/sdk). The Bugdump widget's floating button and panel never appear.

The SDK still attaches everything the widget would: console logs, network requests, recent clicks, the page URL, browser and viewport, your `setContext()` data, and a session replay when your plan includes one.

## Run it

1. In Bugdump, open your project's **Widget** page and create or copy a widget key.
2. If the project restricts **Allowed origins**, add `http://localhost:5173`.
3. Clone, configure and start:

   ```bash
   git clone https://github.com/bugdump/bugdump-custom-form-react.git
   cd bugdump-custom-form-react
   cp .env.example .env.local   # then paste your widget key into it
   npm install
   npm run dev
   ```

4. Open http://localhost:5173, click **Trigger an error**, then **Report a problem** and send the form. Open the new task in Bugdump: the console error and the failed request are on the report.

## The code

- [`src/bugdump.ts`](src/bugdump.ts) calls `Bugdump.init({ apiKey, hideButton: true })` once, before the app renders, so capture covers the whole session.
- [`src/ReportDialog.tsx`](src/ReportDialog.tsx) is the form. On submit it calls:

  ```ts
  const { taskPublicId } = await bugdump.submit({
    description,
    reporterName,
    reporterEmail,
    priority,
    files,
  });
  ```

Only `description` is required. `priority` must be one of your project's priority labels; `Low`, `Medium`, `High` and `Critical` are the defaults. `submit()` rejects with a `BugdumpApiError` when Bugdump refuses the report, for example over a rate limit.

The same call works in Angular, Vue or plain JavaScript. See [Sending reports from your own form](https://bugdump.com/help/widget-and-sdk/sending-reports-from-your-own-form) in the Bugdump help center.

## License

MIT
