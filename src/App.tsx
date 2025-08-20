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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          paddingTop: '70px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e2e8f0',
              borderTop: '3px solid #10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Loading...</p>
          </div>
        </div>
      </>
    )
  }

  if (user) {
    return (
      <>
        <Navbar user={user} onSignOut={signOut} />
        <div style={{ paddingTop: '70px' }}>
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
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        paddingTop: '70px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Hero Section */}
          <section style={{
            textAlign: 'center',
            padding: '4rem 0 6rem',
            background: 'white',
            borderRadius: '24px',
            margin: '2rem 0 4rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              zIndex: 1
            }}></div>
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '900',
                margin: '0 0 1.5rem 0',
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-2px',
                lineHeight: '1.1'
              }}>
                Unlock TikTok<br />
                Insights with AI
              </h1>
              
              <div style={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                margin: '2rem auto',
                borderRadius: '2px'
              }}></div>

              <p style={{
                fontSize: '1.25rem',
                color: '#6b7280',
                margin: '0 auto 2rem',
                maxWidth: '600px',
                lineHeight: '1.6',
                fontWeight: '400'
              }}>
                Transform your TikTok strategy with AI-powered analytics.<br />
                Discover what makes videos go viral and replicate success instantly.
              </p>

              {/* CTA Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '3rem 0 2rem',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={signInWithGoogle}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '1rem 2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  Try free trial
                </button>
                
                <button style={{
                  background: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '1rem',
                  padding: '1rem 2rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  ▶ View Demo
                </button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            margin: '0 0 4rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: '0 0 1rem',
              fontWeight: '500'
            }}>
              Advanced machine learning algorithms analyze millions of TikToks to identify 
              the exact patterns, hooks, and elements that drive engagement and views.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '2rem',
              margin: '2rem 0'
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>500,000+</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Videos Analyzed</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>95%</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Accuracy Rate</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>3.2x</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Average Growth</div>
              </div>
            </div>
            <button
              onClick={signInWithGoogle}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.875rem',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Get Started
            </button>
          </section>

          {/* Features Section */}
          <section style={{ margin: '4rem 0' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '4rem'
            }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#1f2937',
                margin: '0 0 1rem 0',
                letterSpacing: '-1px'
              }}>
                Our Features<br />
                you can get
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '3rem',
              margin: '3rem 0'
            }}>
              {/* Content Optimization */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                  borderRadius: '20px',
                  margin: '0 auto 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  📊
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: '0 0 1rem 0'
                }}>
                  Content Optimization
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: '0 0 1.5rem'
                }}>
                  Get specific recommendations for hashtags, captions, posting times, and even
                  video editing suggestions to maximize your reach and engagement.
                </p>
              </div>

              {/* Audience Intelligence */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  borderRadius: '20px',
                  margin: '0 auto 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  🎯
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: '0 0 1rem 0'
                }}>
                  Audience Intelligence
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: '0 0 1.5rem'
                }}>
                  Understand exactly who your audience is, when they're most active, and what
                  content they engage with most. Target your ideal viewers with precision.
                </p>
              </div>

              {/* Daily Analytics */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  borderRadius: '20px',
                  margin: '0 auto 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  📈
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: '0 0 1rem 0'
                }}>
                  Daily Analytics
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: '0 0 1.5rem'
                }}>
                  Get detailed insights into your video performance with comprehensive analytics
                  covering engagement rates, audience demographics, and optimal posting times.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section style={{
            background: 'white',
            borderRadius: '24px',
            padding: '4rem 2rem',
            margin: '4rem 0',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'center',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              <div>
                <h2 style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#1f2937',
                  margin: '0 0 2rem 0',
                  letterSpacing: '-1px',
                  lineHeight: '1.2'
                }}>
                  What Benefit Will<br />
                  You Get
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    'Free Consulting With Expert Saving Money',
                    'Free analysis',
                    'Content Report For Every Month',
                    'Saving Money For The Future',
                    'Discover Trends Before Others'
                  ].map((benefit, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        flexShrink: 0
                      }}>
                        ✓
                      </div>
                      <span style={{
                        fontSize: '1.1rem',
                        color: '#1f2937',
                        fontWeight: '500'
                      }}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '4rem',
                  margin: '2rem 0'
                }}>💻</div>
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  fontSize: '0.875rem',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Total Views</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>10m</div>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '100px',
                  right: '80px',
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                }}>
                  Go Viral Every Time
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section style={{
            background: 'white',
            borderRadius: '24px',
            padding: '4rem 2rem',
            margin: '4rem 0',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#1f2937',
              margin: '0 0 1rem 0',
              letterSpacing: '-1px'
            }}>
              Ready to Go Viral?
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              margin: '0 auto 3rem',
              maxWidth: '600px'
            }}>
              Join 50,000+ creators who've already boosted their TikTok engagement by 300%
            </p>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
              margin: '2rem auto 3rem',
              maxWidth: '500px'
            }}>
              <p style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                margin: '0 0 0.5rem',
                color: '#1f2937'
              }}>
                ⏰ LIMITED TIME OFFER
              </p>
              <p style={{
                fontSize: '2rem',
                fontWeight: '800',
                margin: '0 0 0.5rem',
                color: '#1f2937'
              }}>
                Get 10 Free Analyses
              </p>
              <p style={{
                margin: '0',
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Usually $97/month • No credit card required
              </p>
            </div>

            <button
              onClick={signInWithGoogle}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.1rem',
                padding: '1.25rem 2.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                margin: '0 0 2rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)'
              }}
            >
              🎯 CLAIM YOUR FREE ANALYSIS NOW
            </button>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              fontSize: '0.875rem',
              color: '#6b7280',
              flexWrap: 'wrap'
            }}>
              <span>✓ Instant access</span>
              <span>✓ No spam</span>
              <span>✓ Cancel anytime</span>
            </div>
          </section>

          {/* Footer */}
          <footer style={{
            textAlign: 'center',
            padding: '2rem 0',
            color: '#9ca3af',
            fontSize: '0.875rem'
          }}>
            <p style={{ margin: '0 0 1rem' }}>© 2024 Zlyzer. All rights reserved.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>About</a>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Privacy</a>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Terms</a>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Contact</a>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}

export default App
