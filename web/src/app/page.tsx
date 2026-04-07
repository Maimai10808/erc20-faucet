export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
          Web3 DApp Scaffold
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
          Next.js frontend is ready.
        </h1>
        <p className="max-w-2xl text-base text-zinc-600">
          This page is intentionally minimal. Add your wallet UI, routes, and
          feature modules from here.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Suggested dirs</h2>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-zinc-600">
{`src/
  app/
  components/
  hooks/
  lib/
  contracts/`}
          </pre>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Installed base</h2>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-zinc-600">
{`next
react
wagmi
viem
@tanstack/react-query`}
          </pre>
        </div>
      </section>
    </main>
  );
}
