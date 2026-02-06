'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { UpgradeModal } from '@/components/UpgradeModal'
import { useLanguage } from '@/lib/i18n'

interface SidebarProps {
  userEmail: string
  userName: string | null
  isPro: boolean
}

export function Sidebar({ userEmail, userName, isPro }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { t } = useLanguage()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/app', label: t.app.sidebar.home, exact: true },
    { href: '/app/presentations', label: t.app.sidebar.myPresentations, exact: false },
  ]

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    if (href === '/app/presentations') {
      return pathname.startsWith('/app/presentations')
    }
    return pathname === href
  }

  return (
    <aside className="w-64 bg-background border-r border-text-secondary/10 h-screen p-4 hidden md:flex md:flex-col sticky top-0">
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

        {/* Settings link - above the divider */}
        <Link
          href="/app/settings"
          className={`block px-4 py-2.5 rounded-lg transition-colors ${
            pathname === '/app/settings'
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-text-secondary hover:bg-surface hover:text-text-primary'
          }`}
        >
          {t.app.sidebar.settings}
        </Link>
      </nav>

      <div className="border-t border-text-secondary/10 pt-4 mt-4">
        {/* Upgrade button for free users */}
        {!isPro && (
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full mb-3 bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-lg font-medium transition-colors text-sm"
          >
            {t.app.sidebar.upgradeToPro}
          </button>
        )}

        <div className="px-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-text-primary truncate">
              {userName || 'User'}
            </div>
            {isPro ? (
              <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                {t.app.sidebar.pro}
              </span>
            ) : (
              <span className="bg-text-secondary/10 text-text-secondary text-xs font-medium px-2 py-0.5 rounded-full">
                {t.app.sidebar.free}
              </span>
            )}
          </div>
          <div className="text-xs text-text-secondary truncate">
            {userEmail}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-surface hover:text-text-primary rounded-lg transition-colors"
        >
          {t.app.sidebar.logout}
        </button>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </aside>
  )
}
