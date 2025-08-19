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
    <div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
      {/* Classic HTML Header */}
      <div className="container">
        <header className="center">
          <h1>ZLYZER</h1>
          <hr />
          <p><strong>AI-Powered TikTok Analytics Tool</strong></p>
        </header>

        {/* Main Content */}
        <main>
          <div className="center">
            <h2>Turn Your TikToks Into Viral Gold</h2>
            <p>Stop guessing what works. Our AI analyzes viral patterns and gives you the exact blueprint for TikTok success.</p>
            
            {/* Stats */}
            <p>
              <strong>500,000+</strong> Videos Analyzed | 
              <strong> 95%</strong> Accuracy Rate | 
              <strong> 3.2x</strong> Average Growth
            </p>

            {/* Primary CTA */}
            <p>
              <button onClick={signInWithGoogle} style={{ 
                padding: '10px 20px', 
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                Sign in with Google - Start Free Analysis
              </button>
            </p>

            <p><small>✓ No Credit Card Required ✓ Instant Results ✓ 10 Free Videos ✓ AI Powered</small></p>
          </div>

          <hr />

          {/* Features */}
          <section>
            <h2 className="center">Three Ways We Make You Go Viral</h2>
            
            <h3>1. Viral Pattern Detection</h3>
            <p>Discover the exact hooks, timing, and content elements that made videos go viral. Copy proven formulas for guaranteed engagement.</p>
            <p><strong>Result:</strong> +300% average engagement boost</p>

            <h3>2. Competitor Spy Tool</h3>
            <p>See what's working for your competitors before they know it. Get their best-performing content strategies and trending topics.</p>
            <p><strong>Result:</strong> Beat 90% of your competition</p>

            <h3>3. Content Gap Finder</h3>
            <p>Find untapped content opportunities in your niche. Get specific video ideas that your audience wants but nobody's making yet.</p>
            <p><strong>Result:</strong> 10+ viral video ideas daily</p>
          </section>

          <hr />

          {/* Testimonial */}
          <section>
            <h2 className="center">What Users Say</h2>
            <blockquote style={{ 
              fontStyle: 'italic', 
              textAlign: 'center', 
              margin: '2em 0',
              padding: '1em',
              border: '1px solid black'
            }}>
              "Went from 10K to 150K followers in 3 months using Zlyzer's insights. Complete game changer!"
              <br />
              <cite>- Sarah M., Content Creator (150K followers)</cite>
            </blockquote>
          </section>

          <hr />

          {/* Final CTA */}
          <section className="center">
            <h2>Ready to Go Viral?</h2>
            <p><strong>Join 50,000+ creators who've already boosted their TikTok engagement by 300%</strong></p>
            
            <div style={{ 
              border: '2px solid black', 
              padding: '20px', 
              margin: '20px 0',
              backgroundColor: '#f9f9f9'
            }}>
              <p><strong>⏰ LIMITED TIME OFFER</strong></p>
              <p style={{ fontSize: '1.2em' }}><strong>Get 10 Free Analyses</strong></p>
              <p><small>Usually $97/month • No credit card required</small></p>
            </div>

            <p>
              <button onClick={signInWithGoogle} style={{ 
                padding: '15px 30px', 
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                CLAIM YOUR FREE ANALYSIS NOW
              </button>
            </p>
            
            <p><small>✓ Instant access ✓ No spam ✓ Cancel anytime</small></p>
          </section>

          <hr />

          {/* Footer */}
          <footer className="center">
            <p><small>© 2024 Zlyzer. All rights reserved.</small></p>
            <p>
              <a href="#about">About</a> | 
              <a href="#privacy">Privacy</a> | 
              <a href="#terms">Terms</a> | 
              <a href="#contact">Contact</a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
