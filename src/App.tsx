import Dashboard from './components/Dashboard'
import { useAuth } from './contexts/AuthContext'
import Hero from "@/components/sections/hero/default";

function App() {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (user) {
    return <Dashboard />
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Hero 
        buttons={false}
        mockup={false}
      />
      
      {/* Custom CTA Buttons */}
      <div className="flex justify-center gap-4 mt-8 mb-16">
        <button 
          onClick={signInWithGoogle}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
        >
          Start Free Analysis
        </button>
        <a 
          href="https://github.com/Abuzaid911/Zlyzer"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
        >
          <span className="mr-2">⭐</span>
          View on GitHub
        </a>
      </div>

      {/* Additional Content */}
      <div className="container" style={{ marginTop: '4rem' }}>
        <main>

          {/* Features */}
          <section className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-12">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">🎯 Viral Pattern Detection</h3>
                <p className="text-muted-foreground">Discover the exact hooks, timing, and content elements that made videos go viral.</p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">🔍 Content Analysis</h3>
                <p className="text-muted-foreground">Get detailed insights on engagement patterns, trending topics, and audience behavior.</p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">📈 Performance Metrics</h3>
                <p className="text-muted-foreground">Track your progress with comprehensive analytics and growth recommendations.</p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center mb-16 p-8 bg-secondary/20 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Analyze Your TikTok Content?</h2>
            <p className="text-muted-foreground mb-6">Get instant insights and start optimizing your content strategy today.</p>
            
            <button 
              onClick={signInWithGoogle}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Get Started Now
            </button>
            
            <p className="text-sm text-muted-foreground mt-4">✓ Free to start ✓ No credit card required ✓ Instant results</p>
          </section>

          {/* Footer */}
          <footer className="text-center py-8 border-t">
            <p className="text-sm text-muted-foreground">© 2024 Zlyzer. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
