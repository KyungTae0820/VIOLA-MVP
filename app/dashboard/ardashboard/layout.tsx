import Link from "next/link";

export default function ARDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-20 border-b bg-white">
        <div className="h-full flex items-center justify-between px-6">
          <Link href="/dashboard" className="text-4xl font-bold hover:opacity-80">
            VIOLA.
          </Link>
        </div>
      </header>

      <main className="fixed inset-x-0 bottom-0 top-20 bg-white overflow-hidden">
          {children}
      </main>
    </>
  );
}
