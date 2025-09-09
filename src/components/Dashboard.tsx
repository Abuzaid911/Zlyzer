import { useAuth } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'

export default function App() {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0B0B1E] via-[#0D0D26] to-[#111133] text-white">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="loader" aria-hidden />
          <span className="sr-only">Loading…</span>
          <span>Preparing your session…</span>
        </div>
        <style jsx>{`
          .loader { width: 18px; height: 18px; border-radius: 9999px; border: 3px solid rgba(167,139,250,.25); border-top-color: #A78BFA; animation: spin 0.9s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  if (user) return <Dashboard />

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_800px_at_10%_10%,rgba(167,139,250,.15),transparent),radial-gradient(900px_600px_at_90%_90%,rgba(99,102,241,.12),transparent)] bg-[#0B0B1E] text-white">
      {/* Top nav */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent font-semibold tracking-tight">Zlyzer</span>
            </div>
            <a href="#privacy" className="text-xs text-slate-300 hover:text-violet-300 transition">Privacy</a>
          </div>
        </div>
      </header>

      {/* Auth card */}
      <main className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-white/[0.04]">
          {/* Accent halo */}
          <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/20 p-2 ring-1 ring-inset ring-violet-300/30">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 3v18M3 12h18" stroke="currentColor" className="text-violet-300" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Sign in to Zlyzer</h1>
              <p className="text-sm text-slate-300">One click to your analytics workspace</p>
            </div>
          </div>

          <button
            onClick={signInWithGoogle}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white text-slate-900 px-5 py-3 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 active:scale-[.99] hover:shadow-lg"
            aria-label="Continue with Google"
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
            <span aria-hidden className="ml-auto opacity-0 transition group-hover:opacity-100">→</span>
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-white/10" /><span>or</span><div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Future expansion (email/password). Keep it disabled visually to emphasize google for now) */}
          <fieldset disabled className="grid gap-3 opacity-60">
            <label className="grid gap-1">
              <span className="text-xs text-slate-300">Email</span>
              <input type="email" placeholder="name@company.com" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-400" />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-slate-300">Password</span>
              <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-400" />
            </label>
            <button className="rounded-lg bg-violet-500/80 px-4 py-2 text-sm font-medium text-white/90">Continue</button>
          </fieldset>

          {/* Footnote */}
          <p id="privacy" className="mt-6 text-[11px] leading-5 text-slate-400">
            By continuing, you agree to our <a className="underline decoration-white/20 underline-offset-2 hover:text-violet-300" href="#terms">Terms</a> and <a className="underline decoration-white/20 underline-offset-2 hover:text-violet-300" href="#privacy">Privacy Policy</a>.
          </p>
        </div>

        {/* Subtle bottom notes */}
        <div className="mt-10 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Zlyzer. All rights reserved.</p>
        </div>
      </main>
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div aria-hidden className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M4 12h10l-4 6h10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 533.5 544.3" aria-hidden {...props}>
      <path d="M533.5 278.4c0-18.5-1.7-37-5.2-54.8H272.1v103.8h146.9c-6.3 34.8-25.4 64.3-54.3 84.1v69.7h87.7c51.4-47.3 81.1-117.1 81.1-202.8z" fill="#4285F4"/>
      <path d="M272.1 544.3c73.3 0 134.9-24.2 179.8-65.8l-87.7-69.7c-24.4 16.4-55.7 26.1-92 26.1-70.7 0-130.6-47.6-152-111.6H29.8v70.2c44.3 87.9 135.8 150.8 242.3 150.8z" fill="#34A853"/>
      <path d="M120.1 323.3c-10.7-31.9-10.7-66.5 0-98.4V154.6H29.8c-42.4 84.9-42.4 185.9 0 270.8l90.3-70.2z" fill="#FBBC05"/>
      <path d="M272.1 107.7c39.9-.6 78.3 14.9 107.5 43.6l80.1-80.1C406.5 24.1 342.6-.5 272.1 0 165.6 0 74.1 62.9 29.8 150.8l90.3 70.2c21.3-64 81.3-113.3 152-113.3z" fill="#EA4335"/>
    </svg>
  )
}