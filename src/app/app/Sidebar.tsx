'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface SidebarProps {
  userEmail: string
  userName: string | null
}

export function Sidebar({ userEmail, userName }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/app', label: 'Home', exact: true },
    { href: '/app/presentations', label: 'My presentations', exact: false },
  ]

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-background border-r border-text-secondary/10 min-h-screen p-4 hidden md:flex md:flex-col">
      <Link href="/app" className="mb-8 block">
        <Image src="/logo.svg" alt="Pollio" width={100} height={34} priority />
      </Link>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2.5 rounded-lg transition-colors ${
              isActive(item.href, item.exact)
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-text-secondary hover:bg-surface hover:text-text-primary'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-text-secondary/10 pt-4 mt-4">
        <div className="px-4 mb-3">
          <div className="text-sm font-medium text-text-primary truncate">
            {userName || 'User'}
          </div>
          <div className="text-xs text-text-secondary truncate">
            {userEmail}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-surface hover:text-text-primary rounded-lg transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
