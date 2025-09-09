import { useAuth } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'

export default function App() {
  const { user, loading, signInWithGoogle } = useAuth()

  // --- Loading State -------------------------------------------------------
  if (loading) {
    return (
      <div style={styles.shell}>
        <div style={styles.centerCol}>
          <div style={styles.logoRow}>
            <div style={styles.logoDot} />
            <span style={styles.brand}>ZLYZER</span>
          </div>
          <div style={styles.loader} />
          <p style={styles.muted}>Booting up…</p>
        </div>
      </div>
    )
  }

  // --- Signed-in - Show Dashboard ----------------------------------
  if (user) {
    return <Dashboard />
  }

  // --- Login-Only Screen ---------------------------------------------------
  return (
    <div style={styles.shell}>
      {/* Ambient gradient glows */}
      <div style={styles.glowA} aria-hidden />
      <div style={styles.glowB} aria-hidden />

      <main style={styles.card} role="main" aria-labelledby="signin-title">
        <div style={styles.logoRow}>
          <div style={styles.logoDot} />
          <span style={styles.brand}>ZLYZER</span>
        </div>

        <h1 id="signin-title" style={styles.h1}>Sign in to Zlyzer</h1>
        <p style={styles.subtitle}>Analyze every frame. Understand every detail.</p>

        <button
          onClick={signInWithGoogle}
          style={styles.googleBtn}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false" style={{ marginRight: 10 }}>
            <path d="M23.49 12.27c0-.82-.07-1.64-.22-2.44H12v4.62h6.46c-.28 1.5-1.15 2.85-2.45 3.72v3.08h3.96c2.32-2.14 3.65-5.29 3.65-9-.01 0-.01 0 0 0z" fill="#4285F4"/>
            <path d="M12 24c3.3 0 6.07-1.09 8.09-2.97l-3.96-3.08c-1.1.74-2.51 1.17-4.13 1.17-3.17 0-5.86-2.14-6.82-5.02H1.08v3.16C3.17 21.66 7.25 24 12 24z" fill="#34A853"/>
            <path d="M5.18 14.1c-.25-.75-.39-1.55-.39-2.37s.14-1.62.38-2.37V6.2H1.08A11.98 11.98 0 0 0 0 11.73c0 1.95.47 3.79 1.08 5.53l4.1-3.16z" fill="#FBBC05"/>
            <path d="M12 4.76c1.79 0 3.39.62 4.66 1.84l3.49-3.49C18.05 1.14 15.3 0 12 0 7.25 0 3.17 2.34 1.08 6.2l4.1 3.16c.96-2.88 3.65-4.6 6.82-4.6z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p style={styles.legal}>By continuing, you agree to our <a href="#" style={styles.link}>Terms</a> and <a href="#" style={styles.link}>Privacy</a>.</p>
      </main>

      <footer style={styles.footer}>
        <span style={styles.muted}>© {new Date().getFullYear()} Zlyzer</span>
      </footer>

      <style>{baseAnimations}</style>
    </div>
  )
}

// --- Styles ---------------------------------------------------------------
const styles = {
  shell: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: 'radial-gradient(1200px 800px at 70% 10%, rgba(139,92,246,0.12), transparent 60%), #0A0A1F',
    color: '#fff',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    position: 'relative',
    overflow: 'hidden',
    padding: '24px'
  } as React.CSSProperties,
  centerCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 16
  } as React.CSSProperties,
  card: {
    width: '100%',
    maxWidth: 440,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    backdropFilter: 'blur(16px)',
    padding: '32px 28px',
    boxShadow: '0 20px 80px rgba(0,0,0,0.35)'
  } as React.CSSProperties,
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  } as React.CSSProperties,
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    background: 'linear-gradient(135deg,#8B5CF6,#C084FC)',
    boxShadow: '0 0 24px rgba(192,132,252,0.7)'
  } as React.CSSProperties,
  brand: {
    fontWeight: 700,
    letterSpacing: '0.12em',
    fontSize: 12,
    color: '#C4B5FD'
  } as React.CSSProperties,
  h1: {
    margin: '12px 0 6px',
    fontSize: 28,
    lineHeight: 1.25,
    fontWeight: 700,
    letterSpacing: '-0.01em'
  } as React.CSSProperties,
  subtitle: {
    margin: '0 0 24px',
    color: '#C9CCE1',
    fontSize: 14
  } as React.CSSProperties,
  googleBtn: {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '14px 18px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.10)',
    background: '#fff',
    color: '#111827',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 180ms ease, box-shadow 180ms ease',
    boxShadow: '0 10px 24px rgba(255,255,255,0.06)'
  } as React.CSSProperties,
  legal: {
    marginTop: 16,
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center'
  } as React.CSSProperties,
  link: {
    color: '#C4B5FD',
    textDecoration: 'none'
  } as React.CSSProperties,
  footer: {
    position: 'fixed',
    bottom: 12,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center'
  } as React.CSSProperties,
  muted: {
    color: '#9CA3AF'
  } as React.CSSProperties,
  loader: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '3px solid rgba(196,181,253,0.25)',
    borderTop: '3px solid #C4B5FD',
    animation: 'spin 1s linear infinite'
  } as React.CSSProperties,
  glowA: {
    position: 'absolute',
    width: 300,
    height: 300,
    right: -120,
    top: -80,
    background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.35), transparent 65%)',
    filter: 'blur(40px)'
  } as React.CSSProperties,
  glowB: {
    position: 'absolute',
    width: 320,
    height: 320,
    left: -140,
    bottom: -100,
    background: 'radial-gradient(circle at 70% 70%, rgba(192,132,252,0.30), transparent 65%)',
    filter: 'blur(50px)'
  } as React.CSSProperties
}

const baseAnimations = `
@keyframes spin { 0% { transform: rotate(0) } 100% { transform: rotate(360deg) } }
`;
