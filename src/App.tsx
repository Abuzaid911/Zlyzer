import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ 
          textAlign: 'center', 
          padding: '120px 50px 50px',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'inline-block'
          }}>
            <p style={{ margin: 0, fontSize: '18px' }}>Loading...</p>
          </div>
        </div>
      </>
    )
  }

  if (user) {
    return (
      <>
        <Navbar user={user} onSignOut={signOut} />
        <div style={{ paddingTop: '80px' }}>
          <Dashboard />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar onSignIn={signInWithGoogle} />
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '80px'
      }}>
        <div className="container" style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem',
          color: 'white'
        }}>
          {/* Hero Section */}
          <header style={{ 
            textAlign: 'center', 
            padding: '4rem 0 3rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '3rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '800', 
              margin: '0 0 1rem 0',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              ZLYZER
            </h1>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: '500', 
              margin: '0',
              opacity: '0.9'
            }}>
              AI-Powered TikTok Analytics Tool
            </p>
          </header>

          {/* Main Content */}
          <main>
            <div style={{ 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '3rem 2rem',
              marginBottom: '3rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                margin: '0 0 1rem 0',
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Turn Your TikToks Into Viral Gold
              </h2>
              <p style={{ 
                fontSize: '1.25rem', 
                opacity: '0.9', 
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 2rem'
              }}>
                Stop guessing what works. Our AI analyzes viral patterns and gives you the exact blueprint for TikTok success.
              </p>
              
              {/* Stats */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '2rem', 
                margin: '2rem 0',
                flexWrap: 'wrap'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>500,000+</div>
                  <div style={{ opacity: '0.8' }}>Videos Analyzed</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>95%</div>
                  <div style={{ opacity: '0.8' }}>Accuracy Rate</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>3.2x</div>
                  <div style={{ opacity: '0.8' }}>Average Growth</div>
                </div>
              </div>

              {/* Primary CTA */}
              <button 
                onClick={signInWithGoogle} 
                style={{ 
                  padding: '1rem 2rem', 
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  margin: '1rem 0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)'
                }}
              >
                🚀 Sign in with Google - Start Free Analysis
              </button>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '1rem', 
                marginTop: '1rem',
                fontSize: '0.9rem',
                opacity: '0.8',
                flexWrap: 'wrap'
              }}>
                <span>✓ No Credit Card Required</span>
                <span>✓ Instant Results</span>
                <span>✓ 10 Free Videos</span>
                <span>✓ AI Powered</span>
              </div>
            </div>

            {/* Features */}
            <section>
              <h2 style={{ 
                textAlign: 'center', 
                fontSize: '2.25rem', 
                fontWeight: '700', 
                marginBottom: '3rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Three Ways We Make You Go Viral
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '2rem',
                marginBottom: '3rem'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '2rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: '#fbbf24'
                  }}>
                    🎯 1. Viral Pattern Detection
                  </h3>
                  <p style={{ marginBottom: '1rem', opacity: '0.9' }}>
                    Discover the exact hooks, timing, and content elements that made videos go viral. Copy proven formulas for guaranteed engagement.
                  </p>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#34d399',
                    margin: '0'
                  }}>
                    Result: +300% average engagement boost
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '2rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: '#f87171'
                  }}>
                    🕵️ 2. Competitor Spy Tool
                  </h3>
                  <p style={{ marginBottom: '1rem', opacity: '0.9' }}>
                    See what's working for your competitors before they know it. Get their best-performing content strategies and trending topics.
                  </p>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#34d399',
                    margin: '0'
                  }}>
                    Result: Beat 90% of your competition
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '2rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: '#a78bfa'
                  }}>
                    💡 3. Content Gap Finder
                  </h3>
                  <p style={{ marginBottom: '1rem', opacity: '0.9' }}>
                    Find untapped content opportunities in your niche. Get specific video ideas that your audience wants but nobody's making yet.
                  </p>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#34d399',
                    margin: '0'
                  }}>
                    Result: 10+ viral video ideas daily
                  </p>
                </div>
              </div>
            </section>

            {/* Testimonial */}
            <section style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '3rem 2rem',
              marginBottom: '3rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                What Users Say
              </h2>
              <blockquote style={{ 
                fontSize: '1.25rem',
                fontStyle: 'italic', 
                margin: '0',
                opacity: '0.95',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                "Went from 10K to 150K followers in 3 months using Zlyzer's insights. Complete game changer!"
                <br />
                <cite style={{ 
                  display: 'block',
                  marginTop: '1rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#fbbf24'
                }}>
                  - Sarah M., Content Creator (150K followers)
                </cite>
              </blockquote>
            </section>

            {/* Final CTA */}
            <section style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
            }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Ready to Go Viral?
              </h2>
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                marginBottom: '2rem',
                opacity: '0.95'
              }}>
                Join 50,000+ creators who've already boosted their TikTok engagement by 300%
              </p>
              
              <div style={{ 
                background: 'rgba(251, 191, 36, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(251, 191, 36, 0.4)', 
                padding: '2rem', 
                margin: '2rem 0',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(251, 191, 36, 0.2)'
              }}>
                <p style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '700', 
                  margin: '0 0 0.5rem 0',
                  color: '#fbbf24'
                }}>
                  ⏰ LIMITED TIME OFFER
                </p>
                <p style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '800', 
                  margin: '0 0 0.5rem 0'
                }}>
                  Get 10 Free Analyses
                </p>
                <p style={{ 
                  margin: '0',
                  opacity: '0.8'
                }}>
                  Usually $97/month • No credit card required
                </p>
              </div>

              <button 
                onClick={signInWithGoogle} 
                style={{ 
                  padding: '1.25rem 2.5rem', 
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)',
                  margin: '1rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(251, 191, 36, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4)'
                }}
              >
                🎯 CLAIM YOUR FREE ANALYSIS NOW
              </button>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '1.5rem', 
                marginTop: '1.5rem',
                fontSize: '0.9rem',
                opacity: '0.8',
                flexWrap: 'wrap'
              }}>
                <span>✓ Instant access</span>
                <span>✓ No spam</span>
                <span>✓ Cancel anytime</span>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  )
}

export default App
