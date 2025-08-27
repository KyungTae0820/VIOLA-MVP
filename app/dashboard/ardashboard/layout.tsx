import Link from "next/link";

export default function ARDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="text-4xl font-bold hover:opacity-80">VIOLA.</Link>
          </div>
        </div>
      </header>
      <main className="px-6 pt-4 pb-10">{children}</main>
    </>
  );
}