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
        background: 'radial-gradient(circle at center, #2a0a4a 0%, #1a0033 40%, #0a001a 100%)',
        paddingTop: '70px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {/* AI Hero Section */}
          <section style={{
            background: 'radial-gradient(circle at center, #2a0a4a 0%, #1a0033 40%, #0a001a 100%)',
            minHeight: '100vh',
            padding: '0',
            margin: '0 -2rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            color: '#ffffff'
          }}>
            {/* Starry Background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(2px 2px at 20px 30px, #ffffff, transparent),
                               radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                               radial-gradient(1px 1px at 90px 40px, #ffffff, transparent),
                               radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
                               radial-gradient(2px 2px at 160px 30px, #ffffff, transparent)`,
              backgroundRepeat: 'repeat',
              backgroundSize: '200px 100px',
              opacity: 0.4
            }}></div>

            {/* Navigation */}
            <nav style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#ffffff',
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
              AI DATA PROCESSING
            </nav>

            {/* Main Content */}
            <div style={{
              textAlign: 'center',
              maxWidth: '800px',
              padding: '0 2rem',
              zIndex: 10
            }}>
              <h1 style={{
                fontSize: 'clamp(32px, 6vw, 80px)',
                fontWeight: '800',
                lineHeight: '1.1',
                margin: '0 0 30px 0',
                color: '#ffffff',
                letterSpacing: '-1px',
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                Championing AI for Data<br />
                Processing Excellence
              </h1>

              <p style={{
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                lineHeight: '1.5',
                margin: '0 0 40px 0',
                color: '#ffffff',
                opacity: 0.9,
                fontWeight: '400',
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                Experience the pinnacle of efficiency in data processing with AI at the helm, driving excellence in every operation.
              </p>

              {/* CTA Buttons */}
              <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={signInWithGoogle}
                  style={{
                    background: '#6a00ff',
                    border: 'none',
                    borderRadius: '24px',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '16px',
                    padding: '16px 24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8b00ff'
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 0, 255, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#6a00ff'
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Contact Us
                </button>
                
                <button style={{
                  background: '#6a00ff',
                  border: 'none',
                  borderRadius: '24px',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '16px',
                  padding: '16px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8b00ff'
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 0, 255, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#6a00ff'
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'
                }}>
                  Our Services
                </button>
              </div>
            </div>

            {/* Left Decorative Blob */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '5%',
              width: '25vw',
              height: '30vh',
              background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #330066 100%)',
              borderRadius: '50% 30% 70% 40%',
              transform: 'rotate(15deg)',
              opacity: 0.8,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 50px rgba(106, 0, 255, 0.4), inset 0 0 50px rgba(255, 0, 255, 0.2)',
              animation: 'float 6s ease-in-out infinite',
              zIndex: 1
            }}></div>

            {/* Right Decorative Blob */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '5%',
              width: '25vw',
              height: '30vh',
              background: 'linear-gradient(225deg, #6a00ff 0%, #ff00ff 50%, #330066 100%)',
              borderRadius: '40% 70% 30% 50%',
              transform: 'rotate(-15deg)',
              opacity: 0.8,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 50px rgba(106, 0, 255, 0.4), inset 0 0 50px rgba(255, 0, 255, 0.2)',
              animation: 'float 6s ease-in-out infinite reverse',
              zIndex: 1
            }}></div>
          </section>

          {/* AI Stats Section */}
          <section style={{
            background: 'rgba(106, 0, 255, 0.1)',
            borderRadius: '24px',
            padding: '3rem 2rem',
            margin: '0 0 4rem',
            boxShadow: '0 0 50px rgba(106, 0, 255, 0.2), inset 0 0 50px rgba(255, 0, 255, 0.1)',
            border: '1px solid rgba(106, 0, 255, 0.3)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Subtle starry background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(1px 1px at 30px 40px, rgba(255,255,255,0.3), transparent),
                               radial-gradient(1px 1px at 80px 20px, rgba(255,255,255,0.2), transparent),
                               radial-gradient(1px 1px at 120px 60px, rgba(255,255,255,0.3), transparent)`,
              backgroundRepeat: 'repeat',
              backgroundSize: '150px 80px',
              opacity: 0.4
            }}></div>

            <p style={{
              fontSize: '1.1rem',
              color: '#ffffff',
              margin: '0 0 2rem',
              fontWeight: '400',
              opacity: 0.9,
              position: 'relative',
              zIndex: 2,
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
              Advanced quantum neural networks process millions of data points to identify 
              the exact patterns, algorithms, and AI elements that drive exponential results.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '2rem',
              margin: '3rem 0',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                padding: '1.5rem',
                background: 'rgba(26, 0, 51, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(106, 0, 255, 0.4)',
                boxShadow: '0 0 20px rgba(106, 0, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(106, 0, 255, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(106, 0, 255, 0.3)'
              }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #8b00ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>500M+</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem', opacity: 0.9, fontFamily: 'Nunito Sans, sans-serif' }}>Neural Processes</div>
              </div>
              <div style={{
                padding: '1.5rem',
                background: 'rgba(26, 0, 51, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(106, 0, 255, 0.4)',
                boxShadow: '0 0 20px rgba(106, 0, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(106, 0, 255, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(106, 0, 255, 0.3)'
              }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #8b00ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>99.9%</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem', opacity: 0.9, fontFamily: 'Nunito Sans, sans-serif' }}>AI Precision</div>
              </div>
              <div style={{
                padding: '1.5rem',
                background: 'rgba(26, 0, 51, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(106, 0, 255, 0.4)',
                boxShadow: '0 0 20px rgba(106, 0, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(106, 0, 255, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(106, 0, 255, 0.3)'
              }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #8b00ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>10x</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem', opacity: 0.9, fontFamily: 'Nunito Sans, sans-serif' }}>Performance Boost</div>
              </div>
            </div>
            <button
              onClick={signInWithGoogle}
              style={{
                background: '#6a00ff',
                border: 'none',
                borderRadius: '24px',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '1rem',
                padding: '1rem 2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                zIndex: 2,
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8b00ff'
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 0, 255, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#6a00ff'
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              Initialize AI Processing
            </button>
          </section>

          {/* AI Features Section */}
          <section style={{ margin: '4rem 0' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '4rem'
            }}>
              <h2 style={{
                fontSize: '3rem',
                fontWeight: '800',
                color: '#ffffff',
                margin: '0 0 1rem 0',
                letterSpacing: '-1px',
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                Advanced AI Capabilities<br />
                <span style={{ 
                  background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #8b00ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>You Can Harness</span>
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '3rem',
              margin: '3rem 0'
            }}>
              {/* Neural Content Optimization */}
              <div style={{
                background: 'rgba(26, 0, 51, 0.8)',
                borderRadius: '24px',
                padding: '3rem',
                boxShadow: '0 0 50px rgba(106, 0, 255, 0.3), inset 0 0 50px rgba(255, 0, 255, 0.1)',
                border: '1px solid rgba(106, 0, 255, 0.4)',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)'
                e.currentTarget.style.boxShadow = '0 0 60px rgba(106, 0, 255, 0.5), inset 0 0 60px rgba(255, 0, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 50px rgba(106, 0, 255, 0.3), inset 0 0 50px rgba(255, 0, 255, 0.1)'
              }}>
                {/* Subtle background glow */}
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: '20%',
                  width: '60%',
                  height: '60%',
                  background: 'radial-gradient(circle, rgba(106, 0, 255, 0.2) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(20px)'
                }}></div>
                
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #8b00ff 100%)',
                  borderRadius: '24px',
                  margin: '0 auto 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  boxShadow: '0 0 30px rgba(106, 0, 255, 0.6)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  🧠
                </div>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: '0 0 1.5rem 0',
                  fontFamily: 'Nunito Sans, sans-serif',
                  position: 'relative',
                  zIndex: 2
                }}>
                  Neural Content Optimization
                </h3>
                <p style={{
                  color: '#ffffff',
                  lineHeight: '1.7',
                  margin: '0',
                  opacity: 0.9,
                  fontSize: '1.1rem',
                  fontFamily: 'Nunito Sans, sans-serif',
                  position: 'relative',
                  zIndex: 2
                }}>
                  Advanced quantum algorithms analyze neural pathways and emotional responses 
                  to generate precise content recommendations, hashtag optimization, and 
                  timing strategies for maximum viral potential.
                </p>
              </div>

              {/* Quantum Audience Intelligence */}
              <div style={{
                background: 'rgba(26, 0, 51, 0.8)',
                borderRadius: '24px',
                padding: '3rem',
                boxShadow: '0 0 50px rgba(106, 0, 255, 0.3), inset 0 0 50px rgba(255, 0, 255, 0.1)',
                border: '1px solid rgba(106, 0, 255, 0.4)',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)'
                e.currentTarget.style.boxShadow = '0 0 60px rgba(106, 0, 255, 0.5), inset 0 0 60px rgba(255, 0, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 50px rgba(106, 0, 255, 0.3), inset 0 0 50px rgba(255, 0, 255, 0.1)'
              }}>
                {/* Subtle background glow */}
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  right: '20%',
                  width: '60%',
                  height: '60%',
                  background: 'radial-gradient(circle, rgba(255, 0, 255, 0.2) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(20px)'
                }}></div>
                
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #ff00ff 0%, #6a00ff 50%, #8b00ff 100%)',
                  borderRadius: '24px',
                  margin: '0 auto 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  boxShadow: '0 0 30px rgba(255, 0, 255, 0.6)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  🎯
                </div>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: '0 0 1.5rem 0',
                  fontFamily: 'Nunito Sans, sans-serif',
                  position: 'relative',
                  zIndex: 2
                }}>
                  Quantum Audience Intelligence
                </h3>
                <p style={{
                  color: '#ffffff',
                  lineHeight: '1.7',
                  margin: '0',
                  opacity: 0.9,
                  fontSize: '1.1rem',
                  fontFamily: 'Nunito Sans, sans-serif',
                  position: 'relative',
                  zIndex: 2
                }}>
                  Deep-learning neural networks map audience DNA, predicting behavioral patterns, 
                  emotional triggers, and engagement probabilities with quantum-level precision 
                  for targeted content delivery.
                </p>
              </div>

              {/* Predictive Analytics Engine */}
              <div style={{
                background: 'rgba(26, 0, 51, 0.8)',
                borderRadius: '24px',
                padding: '3rem',
                boxShadow: '0 0 50px rgba(106, 0, 255, 0.3), inset 0 0 50px rgba(255, 0, 255, 0.1)',
                border: '1px solid rgba(106, 0, 255, 0.4)',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)'
                e.currentTarget.style.boxShadow = '0 0 60px rgba(106, 0, 255, 0.5), inset 0 0 60px rgba(255, 0, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 50px rgba(106, 0, 255, 0.3), inset 0 0 50px rgba(255, 0, 255, 0.1)'
              }}>
                {/* Subtle background glow */}
                <div style={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '30%',
                  width: '60%',
                  height: '60%',
                  background: 'radial-gradient(circle, rgba(139, 0, 255, 0.2) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(20px)'
                }}></div>
                
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #8b00ff 0%, #6a00ff 50%, #ff00ff 100%)',
                  borderRadius: '24px',
                  margin: '0 auto 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  boxShadow: '0 0 30px rgba(139, 0, 255, 0.6)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  📊
                </div>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: '0 0 1.5rem 0',
                  fontFamily: 'Nunito Sans, sans-serif',
                  position: 'relative',
                  zIndex: 2
                }}>
                  Predictive Analytics Engine
                </h3>
                <p style={{
                  color: '#ffffff',
                  lineHeight: '1.7',
                  margin: '0',
                  opacity: 0.9,
                  fontSize: '1.1rem',
                  fontFamily: 'Nunito Sans, sans-serif',
                  position: 'relative',
                  zIndex: 2
                }}>
                  Multi-dimensional AI algorithms forecast viral probability, engagement peaks, 
                  and audience growth patterns before content goes live, enabling strategic 
                  optimization for maximum impact.
                </p>
              </div>
            </div>
          </section>

          {/* AI Benefits Section */}
          <section style={{
            background: 'rgba(106, 0, 255, 0.1)',
            borderRadius: '24px',
            padding: '4rem 2rem',
            margin: '4rem 0',
            boxShadow: '0 0 50px rgba(106, 0, 255, 0.2), inset 0 0 50px rgba(255, 0, 255, 0.1)',
            border: '1px solid rgba(106, 0, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ambient background pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(1px 1px at 50px 100px, rgba(255,255,255,0.2), transparent),
                               radial-gradient(1px 1px at 200px 50px, rgba(255,255,255,0.15), transparent),
                               radial-gradient(1px 1px at 350px 200px, rgba(255,255,255,0.2), transparent)`,
              backgroundRepeat: 'repeat',
              backgroundSize: '400px 250px',
              opacity: 0.6
            }}></div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '5rem',
              alignItems: 'center',
              maxWidth: '1100px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 2
            }}>
              <div>
                <h2 style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: '0 0 2rem 0',
                  letterSpacing: '-1px',
                  lineHeight: '1.2',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>
                  Quantum Benefits You'll<br />
                  <span style={{ 
                    background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #8b00ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Experience</span>
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {[
                    'AI-Powered Neural Content Optimization',
                    'Quantum Analytics & Predictive Modeling',
                    'Real-Time Viral Probability Calculations',
                    'Advanced Audience DNA Mapping',
                    'Future Trend Prediction Algorithms'
                  ].map((benefit, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      padding: '1rem',
                      background: 'rgba(26, 0, 51, 0.6)',
                      borderRadius: '12px',
                      border: '1px solid rgba(106, 0, 255, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(26, 0, 51, 0.8)'
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(106, 0, 255, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(26, 0, 51, 0.6)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #8b00ff 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '700',
                        flexShrink: 0,
                        boxShadow: '0 0 15px rgba(106, 0, 255, 0.5)'
                      }}>
                        ✓
                      </div>
                      <span style={{
                        fontSize: '1.2rem',
                        color: '#ffffff',
                        fontWeight: '600',
                        fontFamily: 'Nunito Sans, sans-serif'
                      }}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{
                background: 'rgba(26, 0, 51, 0.8)',
                borderRadius: '24px',
                padding: '3rem',
                textAlign: 'center',
                position: 'relative',
                border: '1px solid rgba(106, 0, 255, 0.4)',
                boxShadow: '0 0 40px rgba(106, 0, 255, 0.3)'
              }}>
                {/* Central AI brain icon */}
                <div style={{
                  fontSize: '5rem',
                  margin: '2rem 0',
                  filter: 'drop-shadow(0 0 20px rgba(106, 0, 255, 0.6))'
                }}>🧠</div>
                
                {/* Floating metrics */}
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  right: '30px',
                  background: 'rgba(106, 0, 255, 0.8)',
                  borderRadius: '16px',
                  padding: '1rem 1.5rem',
                  boxShadow: '0 0 25px rgba(106, 0, 255, 0.4)',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255, 0, 255, 0.3)'
                }}>
                  <div style={{ color: '#ffffff', marginBottom: '0.5rem', opacity: 0.8 }}>Neural Processes</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>500M+</div>
                </div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '120px',
                  left: '20px',
                  background: 'linear-gradient(135deg, #ff00ff 0%, #6a00ff 100%)',
                  borderRadius: '16px',
                  padding: '1rem 1.5rem',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  boxShadow: '0 0 25px rgba(255, 0, 255, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  Quantum Accuracy: 99.9%
                </div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '30px',
                  right: '30px',
                  background: 'rgba(139, 0, 255, 0.8)',
                  borderRadius: '16px',
                  padding: '1rem 1.5rem',
                  boxShadow: '0 0 25px rgba(139, 0, 255, 0.4)',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255, 0, 255, 0.3)'
                }}>
                  <div style={{ color: '#ffffff', marginBottom: '0.5rem', opacity: 0.8 }}>Performance Boost</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>10,000x</div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Final CTA */}
          <section style={{
            background: 'rgba(26, 0, 51, 0.9)',
            borderRadius: '24px',
            padding: '5rem 2rem',
            margin: '4rem 0',
            boxShadow: '0 0 60px rgba(106, 0, 255, 0.4), inset 0 0 60px rgba(255, 0, 255, 0.1)',
            border: '1px solid rgba(106, 0, 255, 0.4)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated background pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(2px 2px at 100px 50px, rgba(106, 0, 255, 0.3), transparent),
                               radial-gradient(1px 1px at 300px 100px, rgba(255, 0, 255, 0.4), transparent),
                               radial-gradient(1px 1px at 500px 150px, rgba(139, 0, 255, 0.3), transparent)`,
              backgroundRepeat: 'repeat',
              backgroundSize: '600px 200px',
              opacity: 0.7,
              animation: 'float 8s ease-in-out infinite'
            }}></div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: '800',
                color: '#ffffff',
                margin: '0 0 1.5rem 0',
                letterSpacing: '-1px',
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                Ready to Harness<br />
                <span style={{ 
                  background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #8b00ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Quantum AI Power?</span>
              </h2>
              <p style={{
                fontSize: '1.3rem',
                color: '#ffffff',
                margin: '0 auto 3rem',
                maxWidth: '700px',
                opacity: 0.9,
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                Join 500,000+ AI pioneers who've achieved 10,000x performance boost through 
                quantum neural network optimization
              </p>
              
              <div style={{
                background: 'rgba(106, 0, 255, 0.2)',
                border: '2px solid rgba(106, 0, 255, 0.5)',
                borderRadius: '20px',
                padding: '2.5rem',
                margin: '3rem auto',
                maxWidth: '600px',
                boxShadow: '0 0 40px rgba(106, 0, 255, 0.3)'
              }}>
                <p style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  margin: '0 0 1rem',
                  color: '#ffffff',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>
                  ⚡ QUANTUM ACCESS PROTOCOL
                </p>
                <p style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  margin: '0 0 1rem',
                  background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #8b00ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>
                  Unlimited Neural Processing
                </p>
                <p style={{
                  margin: '0',
                  color: '#ffffff',
                  fontSize: '1rem',
                  opacity: 0.8,
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>
                  Usually $997/month • Zero quantum computing required
                </p>
              </div>

              <button
                onClick={signInWithGoogle}
                style={{
                  background: 'linear-gradient(135deg, #6a00ff 0%, #ff00ff 50%, #8b00ff 100%)',
                  border: 'none',
                  borderRadius: '24px',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  padding: '1.5rem 3rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 30px rgba(106, 0, 255, 0.5)',
                  margin: '0 0 3rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: 'Nunito Sans, sans-serif',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 0 50px rgba(106, 0, 255, 0.8)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(106, 0, 255, 0.5)'
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>
                  🧠 INITIALIZE QUANTUM AI NOW
                </span>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.5s ease',
                  pointerEvents: 'none'
                }}></div>
              </button>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '3rem',
                fontSize: '1rem',
                color: '#ffffff',
                flexWrap: 'wrap',
                opacity: 0.9,
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                <span>✓ Instant quantum access</span>
                <span>✓ Zero learning curve</span>
                <span>✓ Infinite scalability</span>
              </div>
            </div>
          </section>

          {/* AI Footer */}
          <footer style={{
            textAlign: 'center',
            padding: '3rem 0',
            background: 'rgba(26, 0, 51, 0.6)',
            borderRadius: '24px 24px 0 0',
            border: '1px solid rgba(106, 0, 255, 0.3)',
            boxShadow: '0 -10px 40px rgba(106, 0, 255, 0.2)',
            margin: '4rem -2rem 0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Subtle footer background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(1px 1px at 100px 30px, rgba(106, 0, 255, 0.2), transparent),
                               radial-gradient(1px 1px at 400px 80px, rgba(255, 0, 255, 0.15), transparent)`,
              backgroundRepeat: 'repeat',
              backgroundSize: '500px 100px',
              opacity: 0.5
            }}></div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '400',
                color: '#ffffff',
                fontFamily: 'Galindo, cursive',
                marginBottom: '1rem',
                textShadow: '0 0 20px rgba(106, 0, 255, 0.5)'
              }}>
                Zlyzer
              </div>
              <p style={{ 
                margin: '0 0 2rem',
                color: '#ffffff',
                opacity: 0.8,
                fontSize: '1rem',
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                © 2024 Zlyzer • Quantum AI Data Processing • All rights reserved.
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '3rem', 
                flexWrap: 'wrap',
                marginBottom: '2rem'
              }}>
                {['About', 'Privacy', 'Terms', 'Contact'].map((link, index) => (
                  <a key={index} href="#" style={{ 
                    color: '#ffffff', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontFamily: 'Nunito Sans, sans-serif',
                    opacity: 0.8,
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(106, 0, 255, 0.3)'
                    e.currentTarget.style.opacity = '1'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(106, 0, 255, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.opacity = '0.8'
                    e.currentTarget.style.boxShadow = 'none'
                  }}>
                    {link}
                  </a>
                ))}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#ffffff',
                opacity: 0.6,
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                Powered by Quantum Neural Networks • Built for the Future
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}

export default App
