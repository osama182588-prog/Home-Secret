'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role && ['REVIEWER', 'SENIOR_REVIEWER', 'SUPERVISOR', 'ADMIN'].includes(session.user.role);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--background-secondary)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold gradient-text">Secret CFW</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
              الرئيسية
            </Link>
            <Link href="/rules" className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
              القوانين
            </Link>
            <Link href="/verify" className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
              التحقق
            </Link>
            {isAdmin && (
              <Link href="/dashboard" className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
                لوحة التحكم
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="spinner" />
            ) : session ? (
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-[var(--primary)]"
                  />
                )}
                <span className="text-sm text-[var(--foreground)]">{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="btn btn-secondary text-sm py-2"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('discord')}
                className="btn btn-primary flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                </svg>
                تسجيل بواسطة Discord
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--foreground-muted)] hover:text-[var(--primary)]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                الرئيسية
              </Link>
              <Link href="/rules" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                القوانين
              </Link>
              <Link href="/verify" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                التحقق
              </Link>
              {isAdmin && (
                <Link href="/dashboard" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                  لوحة التحكم
                </Link>
              )}
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="btn btn-secondary w-full"
                >
                  تسجيل الخروج
                </button>
              ) : (
                <button
                  onClick={() => signIn('discord')}
                  className="btn btn-primary w-full"
                >
                  تسجيل بواسطة Discord
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
