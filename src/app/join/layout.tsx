import Image from 'next/image'

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal header for join flow */}
      <header className="p-4 flex justify-center border-b border-text-secondary/10">
        <Image src="/logo.svg" alt="Pollio" width={100} height={34} priority />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  )
}
